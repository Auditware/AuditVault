---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - severity/high
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-underwater]]"
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-25: Incorrect `destEid` Value in `_handleLiquidationSuccess` Prevents Liquidation Completion

- id: 58394
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by multiple people in the code for a lending protocol. The problem is caused by a function that is trying to find a specific record in the code, but it always fails because of a mistake in how the function is called. This can lead to problems with the protocol, such as not being able to complete a liquidation process or allowing users to withdraw more collateral than they should. This could potentially harm the protocol's solvency.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/979 

## Found by 
0xc0ffEE, Fade, Kirkeelee, Tychai0s, Waydou, Z3R0, aman, h2134, jokr, mahdifa, moray5554, newspacexyz, onthehunt, rudhra1749, xiaoming90

## Summary:

The [_handleLiquidationSuccess](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CrossChainRouter.sol#L443) function in `CrossChainRouter.sol` attempts to locate a cross-chain collateral record using the `findCrossChainCollateral` function in `LendStorage.sol`. However, it incorrectly sets the `destEid` parameter to 0, causing the lookup to always fail. This prevents the liquidation process from completing successfully, leading to debt accumulation and potential losses for the protocol.

## Root Cause:

The `_handleLiquidationSuccess` function, which is called on Chain A after a cross-chain liquidation is executed, uses `lendStorage.findCrossChainCollateral` to find the relevant collateral record. The `destEid` parameter passed to this function is hardcoded to `0`.

```solidity
// filepath: src/LayerZero/CrossChainRouter.sol
(bool found, uint256 index) = lendStorage.findCrossChainCollateral(
    payload.sender,
    underlying,
    srcEid,
    0, // Incorrect destEid
    payload.destlToken,
    payload.srcToken
);
```

## Internal Pre-conditions:

*   The `crossChainCollaterals` mapping contains at least one record for the given user and underlying asset.
*   The function is called with specific values for `srcEid`, `destEid`, `borrowedlToken`, and `srcToken`.

## External Pre-conditions:

*   None.

## Attack Path:

1.  A user initiates a cross-chain borrow, which results in a `Borrow` struct being stored in the `crossChainCollaterals` mapping.
2.  Later, the protocol needs to retrieve this `Borrow` struct using the `findCrossChainCollateral` function.
3.  The function is called with specific values for `srcEid`, `destEid`, `borrowedlToken`, and `srcToken`.
4.  If any of these values do not exactly match the corresponding values stored in the `Borrow` struct, the function will return `false` and `0`, even if a matching record exists.
5.  This can lead to incorrect behavior in the protocol, such as failing to liquidate a user's position or allowing a user to withdraw more collateral than they are entitled to.

## Impact:

*   The protocol may fail to locate valid collateral records, leading to incorrect behavior.
*   Users may be able to exploit this issue to withdraw more collateral than they are entitled to.
*   The protocol's solvency may be threatened due to the potential for uncollateralized positions.
