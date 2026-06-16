---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/uncollat-lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-underwater]]"
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-22: The liquidation validation logic is wrong

- id: 58391
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by multiple users in a project called Sherlock Audit. The bug relates to a liquidation check on Chain A, where the system incorrectly treats `payload.amount` as an additional borrow amount instead of the number of collateral tokens to seize. This can result in healthy positions being marked as liquidatable and potentially allowing valid accounts to be liquidated. The root cause of the issue is traced back to a miscalculation in the `_executeLiquidationCore` function, where the `payload.amount` is passed as the `borrowAmount` parameter on Chain A. The impact of this bug is significant as it can result in the loss of funds for users. A mitigation solution has been proposed to fix the `_checkLiquidationValid` function by using the correct parameters. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/930 

## Found by 
0xgee, 4n0nx, Aenovir, Falendar, HeckerTrieuTien, Kvar, Rorschach, Waydou, Ziusz, durov, dystopia, future, ggg\_ttt\_hhh, harry, hgrano, jokr, m3dython, newspacexyz, oxelmiguel, patitonar, rudhra1749, t.aksoy, wickie, xiaoming90, zraxx

### Summary

On Chain A (the collateral chain), the [liquidation check](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CrossChainRouter.sol#L431-L436) treats `payload.amount` as if it were an additional borrow amount, but `payload.amount` is the number of collateral tokens to seize.

### Root Cause

On Chain B, during a cross‐chain liquidation, `_executeLiquidationCore` calculates how many collateral tokens to seize:

```solidity
(uint256 amountSeizeError, uint256 seizeTokens) = LendtrollerInterfaceV2(lendtroller)
    .liquidateCalculateSeizeTokens(borrowedlToken, params.lTokenToSeize, params.repayAmount);
```

Then sends `seizeTokens` (`payload.amount`) to Chain A:

```solidity
_send(
    params.srcEid,
    seizeTokens, // this becomes payload.amount
    params.storedBorrowIndex,
    0,
    params.borrower,
    lendStorage.crossChainLTokenMap(params.lTokenToSeize, params.srcEid),
    msg.sender,
    params.borrowedAsset,
    ContractType.CrossChainLiquidationExecute
);
```

The `payload.amount` represents the seize amount (collateral to take), not the borrow amount. But it is being passed as the `borrowAmount` parameter on Chain A:

```solidity
function _checkLiquidationValid(LZPayload memory payload) private view returns (bool) {
    (uint256 borrowed, uint256 collateral) = lendStorage.getHypotheticalAccountLiquidityCollateral(
>       payload.sender, LToken(payable(payload.destlToken)), 0, payload.amount
    );
    return borrowed > collateral;
}
```

```solidity
function getHypotheticalAccountLiquidityCollateral(
    address account,
    LToken lTokenModify,
    uint256 redeemTokens,
    uint256 borrowAmount
)
```

In other words, it asks “If this user were to borrow `payload.amount` more, would they be undercollateralized?” But `payload.amount` is not a proposed additional borrow, it is the number of tokens that will be seized. That means a healthy position could be marked liquidatable just because “borrowing that many more” would tip them over the edge, even if no actual borrow ever happens.

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

N/A

### Impact

Healthy positions can be mistakenly flagged as liquidatable, allowing valid accounts to be liquidated.

### PoC

_No response_

### Mitigation

Fix `_checkLiquidationValid` to use the correct parameters:

```diff
    function _checkLiquidationValid(LZPayload memory payload) private view returns (bool) {
        (uint256 borrowed, uint256 collateral) = lendStorage.getHypotheticalAccountLiquidityCollateral(
-           payload.sender, LToken(payable(payload.destlToken)), 0, payload.amount
+           payload.sender, LToken(payable(payload.destlToken)), 0, 0
        );
        return borrowed > collateral;
    }
```
