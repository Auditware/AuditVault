---
tags:
  - lang/solidity
  - platform/codehawks
  - has/github
  - severity/high
  - sector/lending
  - sector/oracle
protocol: "[[DittoETH]]"
auditors:
  - "[[Cosine]]"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[initializer-auth]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# Margin callers can drain the TAPP during liquidation by willingly increase gas costs with the shortHintArray

- id: 27473
- impact: HIGH
- protocol: [[DittoETH]]
- reporter: Cosine (Codehawks)
- source: N/A

## Summary



A bug was found in the MarginCallPrimaryFacet.sol contract, which could lead to a high risk security vulnerability. The bug is related to the liquidation process of shortRecords. The liquidate function takes a parameter called shortHintArray, which should contain id hints where the protocol should look for shorts in the order book. If the array contains wrong hints, the gas costs could increase to an amount that would fully drain the TAPP (Treasury Asset Protection Pool). This could lead to a shutdown of the market and a big loss of user funds.

To avoid this issue, it is recommended to check the length of the shortHintArray. Manual review was used to find this bug.

## Details

### Relevant GitHub Links
<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L93">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L93</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L239-L241">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L239-L241</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibOrders.sol#L827-L841">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/libraries/LibOrders.sol#L827-L841</a>

<a data-meta="codehawks-github-link" href="https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L267">https://github.com/Cyfrin/2023-09-ditto/blob/a93b4276420a092913f43169a353a6198d3c21b9/contracts/facets/MarginCallPrimaryFacet.sol#L267</a>


## Summary

During primary liquidation the TAPP (Treasury Asset Protection Pool) pays the gas costs of force bids, so that margin callers are even motivated to liquidate shorters, if gas costs are high. To liquidate a shortRecord margin, callers must provide a parameter called shortHintArray to the function call. The purpose of this array is to save gas, it should contain id hints where the protocol should look for shorts in the order book which are currently above the oracle price, since users can’t match against shorts under the oracle price. As the protocol loops through this shortHintArray, an array with wrong hints could increase gas and as the length of the array is never checked, it could even increase the gas costs to an amount that would fully drain the TAPP. As the TAPP is an important security mechanism of the protocol, draining the funds of it could lead to a shutdown of the market and therefore to a big loss of user funds.

## Vulnerability Details

The liquidate function takes the shortHintArray as parameter:

```solidity
function liquidate(
    address asset,
    address shorter,
    uint8 id,
    uint16[] memory shortHintArray
)
    external
    isNotFrozen(asset)
    nonReentrant
    onlyValidShortRecord(asset, shorter, id)
    returns (uint88, uint88)
{
...
}
```

This array is then used to create a forceBid:

```solidity
(m.ethFilled, ercAmountLeft) = IDiamond(payable(address(this))).createForcedBid(
    address(this), m.asset, _bidPrice, m.short.ercDebt, shortHintArray
);
```

And during these process, the protocol loops over this array:

```solidity
function _updateOracleAndStartingShort(address asset, uint16[] memory shortHintArray)
    private
{
  ...
  uint16 shortHintId;
  for (uint256 i = 0; i < shortHintArray.length;) {
    shortHintId = shortHintArray[i];
    unchecked {
        ++i;
    }

    {
        O shortOrderType = s.shorts[asset][shortHintId].orderType;
        if (
            shortOrderType == O.Cancelled || shortOrderType == O.Matched
                || shortOrderType == O.Uninitialized
        ) {
            continue;
        }
    }
		...
}
```

In the end, the TAPP pays for the gas costs in the _marginFeeHandler function:

```solidity
function _marginFeeHandler(MTypes.MarginCallPrimary memory m) private {
    STypes.VaultUser storage VaultUser = s.vaultUser[m.vault][msg.sender];
    STypes.VaultUser storage TAPP = s.vaultUser[m.vault][address(this)];
    // distribute fees to TAPP and caller
    uint88 tappFee = m.ethFilled.mulU88(m.tappFeePct);
    uint88 callerFee = m.ethFilled.mulU88(m.callerFeePct) + m.gasFee;

    m.totalFee += tappFee + callerFee;
    //@dev TAPP already received the gasFee for being the forcedBid caller. tappFee nets out.
    if (TAPP.ethEscrowed >= callerFee) {
        TAPP.ethEscrowed -= callerFee;
        VaultUser.ethEscrowed += callerFee;
    } else {
        // Give caller (portion of?) tappFee instead of gasFee
        VaultUser.ethEscrowed += callerFee - m.gasFee + tappFee;
        m.totalFee -= m.gasFee;
        TAPP.ethEscrowed -= m.totalFee;
    }
}
```

Therefore, if the user provides a big shortHintArray with wrong hints the gas costs will drastically increase to a point which drains the funds of the TAPP.

## Impact

As the TAPP does no longer has enough funds to pay for liquidation, if shortRecords are under collateralized. A lot of problems like the increment of the ercDebtRate and the shutdown of the market can occur. This leads to a big loss of user funds.

## Tools Used

Manual Review

## Recommendations

Check the length of the shortHintArray.
