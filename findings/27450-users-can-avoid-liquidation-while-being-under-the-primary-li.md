---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - severity/high
  - sector/lending
protocol: "[[DittoETH]]"
auditors:
  - "[[0xf]]"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# Users can avoid liquidation while being under the primary liquidation ratio if on the last short record

- id: 27450
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: 0xf (Codehawks)
- source: N/A

## Summary


This bug report is about a vulnerability in the protocol that allows users to avoid liquidation while being under the primary liquidation ratio if on the last short record. This is possible due to the dependency of liquidation times on the `updatedAt` value of shorts. For the last short record, the appending of any new orders provides an alternative pathway for updating the `updatedAt` value of shorts, enabling users to circumvent liquidation by submitting minimal shorts to block liquidation by adjusting the time difference, thus avoiding liquidation even when they do not meet the collateral requirements for a healthy state.

The vulnerability is due to the code in the `fillShortRecord` function which combines new matched shorts with the existing one, invoking the `merge` function, which updates the `updatedAt` value to the current time. This means that even if the position was flagged and is still under the `primaryLiquidationCR`, it cannot be liquidated as the `updatedAt` timestamp has been updated, making the time difference not big enough.

The impact of this vulnerability is that it allows a user with a position under the `primaryLiquidationCR` to avoid primary liquidation even if the short is in the valid time ranges for liquidation.

The tools used to identify this vulnerability were manual analysis and Foundry.

The recommendation to mitigate this vulnerability is to impose stricter conditions for updating the last short record when the position is flagged and remains under the `primaryLiquidationCR` post-merge, similar to how the `combineShorts` function works.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L153">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibShortRecord.sol#L153</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L43">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L43</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L89">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L89</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L351">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L351</a>


## Summary
The protocol permits users to maintain up to 254 concurrent short records. When this limit is reached, any additional orders are appended to the final position, rather than creating a new one. A short record is subject to flagging if it breaches the primary liquidation ratio set by the protocol, leading to potential liquidation if it remains below the threshold for a predefined period.

The vulnerability emerges from the dependency of liquidation times on the **`updatedAt`** value of shorts. For the last short record, the appending of any new orders provides an alternative pathway for updating the **`updatedAt`** value of shorts, enabling users to circumvent liquidation by submitting minimal shorts to block liquidation by adjusting the time difference, thus avoiding liquidation even when they do not meet the collateral requirements for a healthy state.

## Vulnerability Details
lets take a look at the code to see how this works.
1. **Flagging of Short Record:**
    - The **`flagShort`** function allows a short to be flagged if it's under **`primaryLiquidationCR`**, subsequently invoking **`setFlagger`** which updates the short's **`updatedAt`** timestamp to the current time.

```solidity
function flagShort(address asset, address shorter, uint8 id, uint16 flaggerHint)
        external
        isNotFrozen(asset)
        nonReentrant
        onlyValidShortRecord(asset, shorter, id)
    {
        // initial code

        short.setFlagger(cusd, flaggerHint);
        emit Events.FlagShort(asset, shorter, id, msg.sender, adjustedTimestamp);
    }
```

1. **Liquidation Eligibility Check:**
    - The **`_canLiquidate`** function assesses whether the flagged short is still under **`primaryLiquidationCR`** after a certain period and if it's eligible for liquidation, depending on the **`updatedAt`** timestamp and various liquidation time frames.

```solidity
function _canLiquidate(MTypes.MarginCallPrimary memory m)
        private
        view
        returns (bool)
    {
       // Initial code

        uint256 timeDiff = LibOrders.getOffsetTimeHours() - m.short.updatedAt;
        uint256 resetLiquidationTime = LibAsset.resetLiquidationTime(m.asset);

        if (timeDiff >= resetLiquidationTime) {
            return false;
        } else {
            uint256 secondLiquidationTime = LibAsset.secondLiquidationTime(m.asset);
            bool isBetweenFirstAndSecondLiquidationTime = timeDiff
                > LibAsset.firstLiquidationTime(m.asset) && timeDiff <= secondLiquidationTime
                && s.flagMapping[m.short.flaggerId] == msg.sender;
            bool isBetweenSecondAndResetLiquidationTime =
                timeDiff > secondLiquidationTime && timeDiff <= resetLiquidationTime;
            if (
                !(
                    (isBetweenFirstAndSecondLiquidationTime)
                        || (isBetweenSecondAndResetLiquidationTime)
                )
            ) {
                revert Errors.MarginCallIneligibleWindow();
            }

            return true;
        }
    }
}
```

1. **Short Record Merging:**
    - For the last short record, the **`fillShortRecord`** function combines new matched shorts with the existing one, invoking the **`merge`** function, which updates the **`updatedAt`** value to the current time.

```solidity
function fillShortRecord(
        address asset,
        address shorter,
        uint8 shortId,
        SR status,
        uint88 collateral,
        uint88 ercAmount,
        uint256 ercDebtRate,
        uint256 zethYieldRate
    ) internal {
        AppStorage storage s = appStorage();

        uint256 ercDebtSocialized = ercAmount.mul(ercDebtRate);
        uint256 yield = collateral.mul(zethYieldRate);

        STypes.ShortRecord storage short = s.shortRecords[asset][shorter][shortId];
        if (short.status == SR.Cancelled) {
            short.ercDebt = short.collateral = 0;
        }

        short.status = status;
        LibShortRecord.merge(
            short,
            ercAmount,
            ercDebtSocialized,
            collateral,
            yield,
            LibOrders.getOffsetTimeHours()
        );
    }
```

- In the merge function we see that we update the updatedAt value to creationTime which is  LibOrders.getOffsetTimeHours().

```solidity
function merge(
        STypes.ShortRecord storage short,
        uint88 ercDebt,
        uint256 ercDebtSocialized,
        uint88 collateral,
        uint256 yield,
        uint24 creationTime
    ) internal {
        // Resolve ercDebt
        ercDebtSocialized += short.ercDebt.mul(short.ercDebtRate);
        short.ercDebt += ercDebt;
        short.ercDebtRate = ercDebtSocialized.divU64(short.ercDebt);
        // Resolve zethCollateral
        yield += short.collateral.mul(short.zethYieldRate);
        short.collateral += collateral;
        short.zethYieldRate = yield.divU80(short.collateral);
        // Assign updatedAt
        short.updatedAt = creationTime;
    }
```

- This means that even if the position was flagged and is still under the **`primaryLiquidationCR`**, it cannot be liquidated as the **`updatedAt`** timestamp has been updated, making the time difference not big enough.

<details>
  <summary><b>Click to expand Proof of Concept</b></summary>

  ```solidity
    function testShortAvoidLiquidation() public {
        // fill  shorts (up to 254)
        for (uint i; i < 253; i++) {
            fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT * 5, sender);
            fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT * 5, receiver);
        } 
        
        // check users last shortrecord
        assertTrue(getShortRecord(sender, 254).status == SR.FullyFilled);

        // price drop
        skipTimeAndSetEth(1 hours, 2000 ether);

        // flag short
        vm.prank(receiver);
        diamond.flagShort(asset, sender, 254, Constants.HEAD);

        // check flag
        assertTrue(getShortRecord(sender, 254).flaggerId == 1);

        // skip time to primary liquidation time
        skipTimeAndSetEth(11 hours, 2000 ether);

        // User matches new min short (added to last spot)
        fundLimitShortOpt(DEFAULT_PRICE * 2, DEFAULT_AMOUNT  , sender);
        fundLimitBidOpt(DEFAULT_PRICE * 2, DEFAULT_AMOUNT  , receiver);

        // flagger tries to liquidate short in eligible window
        fundLimitAskOpt(DEFAULT_PRICE, DEFAULT_AMOUNT * 6, extra);
        vm.startPrank(receiver);
        vm.expectRevert(Errors.MarginCallIneligibleWindow.selector);
        diamond.liquidate(
            asset, sender, 254, shortHintArrayStorage
        );
        vm.stopPrank();
    }
```
</details>

## Impact
This allows a user with a position under the primaryLiquidationCR to avoid primary liquidation even if the short is in the valid time ranges for liquidation.

## Tools Used
- Manual analysis
- Foundry

## Recommendations
Impose stricter conditions for updating the last short record when the position is flagged and remains under the **`primaryLiquidationCR`** post-merge, similar to how the **`combineShorts`** function works.

```solidity
function createShortRecord(
        address asset,
        address shorter,
        SR status,
        uint88 collateral,
        uint88 ercAmount,
        uint64 ercDebtRate,
        uint80 zethYieldRate,
        uint40 tokenId
    ) internal returns (uint8 id) {
        AppStorage storage s = appStorage();

        // Initial code

        } else {
            // All shortRecordIds used, combine into max shortRecordId
            id = Constants.SHORT_MAX_ID;
            fillShortRecord(
                asset,
                shorter,
                id,
                status,
                collateral,
                ercAmount,
                ercDebtRate,
                zethYieldRate
            );

				// If the short was flagged, ensure resulting c-ratio > primaryLiquidationCR
		        if (Constants.SHORT_MAX_ID.shortFlagExists) {
	                if (
	                    Constants.SHORT_MAX_ID.getCollateralRatioSpotPrice(
	                        LibOracle.getSavedOrSpotOraclePrice(_asset)
	                    ) < LibAsset.primaryLiquidationCR(_asset)
	                ) revert Errors.InsufficientCollateral();
	                // Resulting combined short has sufficient c-ratio to remove flag
	                Constants.SHORT_MAX_ID.resetFlag();
		        }
            }
    }
```
