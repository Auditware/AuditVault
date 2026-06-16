---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - patitonar
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-13: Incorrect Debt Tracking in `_updateRepaymentState`

- id: 58382
- impact: HIGH
- protocol: LEND
- reporter: patitonar (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found in the `CrossChainRouter.sol` file of the `Lend-V2` project. The function `_updateRepaymentState` incorrectly checks the length of `userCrossChainCollaterals` after removing a token from `crossChainCollaterals`, which can lead to incorrect debt tracking and potential unauthorized collateral withdrawals or liquidation errors. The root cause of the issue is that the length of `userCrossChainCollaterals` is checked after the removal, which reduces the array length and can result in incorrect removal of tokens from `userBorrowedAssets`. The report also provides information about the pre-conditions, attack path, impact, and mitigation of the bug. To fix the issue, the report suggests checking the length of `userCrossChainCollaterals` before removing a token from `crossChainCollaterals`.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/672 

## Found by 
37H3RN17Y2, Brene, DharkArtz, PNS, Tigerfrake, Waydou, future, h2134, hgrano, jokr, mahdifa, patitonar, rudhra1749, t.aksoy

## Summary
In `CrossChainRouter.sol`, the [_updateRepaymentState](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/713372a1ccd8090ead836ca6b1acf92e97de4679/Lend-V2/src/LayerZero/CrossChainRouter.sol#L505) function incorrectly checks `userCrossChainCollaterals.length == 1` after calling `removeCrossChainCollateral`. This leads to two issues: (1) if `crossChainCollaterals` has one element, the token is not removed from `userBorrowedAssets` despite no remaining debt, and (2) if it has two elements, the token is erroneously removed while a debt remains. This disrupts debt tracking, potentially enabling unauthorized collateral withdrawal or liquidation errors.

## Root Cause
In `_updateRepaymentState`:
```solidity
if (repayAmountFinal == borrowedAmount) {
    lendStorage.removeCrossChainCollateral(borrower, _token, index);
    if (userCrossChainCollaterals.length == 1) {
        lendStorage.removeUserBorrowedAsset(borrower, _lToken);
    }
}
```
The `userCrossChainCollaterals.length` is checked after `removeCrossChainCollateral`, which reduces the array length. If `length` was 1 before removal, it becomes 0, so `removeUserBorrowedAsset` is not called, leaving the token in `userBorrowedAssets`. If `length` was 2, it becomes 1, triggering `removeUserBorrowedAsset` incorrectly while a debt remains.

## Internal Pre-conditions
1. The protocol tracks cross-chain debts in `lendStorage.crossChainCollaterals`.
2. `_updateRepaymentState` manages debt updates during cross-chain repayments.
3. `userBorrowedAssets` tracks tokens with active debts.

## External Pre-conditions
1. A user has a cross-chain borrow (e.g., 100 USDC) on chain B with collateral in chain A.
2. The user or a liquidator calls `repayCrossChainBorrow` with `_amount = type(uint256).max` to fully repay the borrow.

## Attack Path
1. **Single Debt Case**:
   - User has one cross-chain borrow; repayment removes it but leaves `_lToken` in `userBorrowedAssets`.
   - User may withdraw collateral without proper debt validation.
2. **Multiple Debt Case**:
   - User has two cross-chain borrows; repaying one removes `_lToken` from `userBorrowedAssets` despite a remaining debt.
   - This may prevent liquidation or allow incorrect collateral calculations.

## Impact
- **Broken Functionality**: Incorrect debt tracking disrupts collateral and liquidation calculations, breaking core protocol functionality (Sherlock Section V).
- **Relevant Loss**: Potential unauthorized collateral withdrawal or liquidation failures could cause losses (>0.01% and >$10) under specific conditions (Section V).
- **Sherlock Criteria**: The issue requires specific debt scenarios (one or two cross-chain borrows), aligning with Medium severity.

## Mitigation
Check `userCrossChainCollaterals.length` before calling `removeCrossChainCollateral`. Update the code as follows:
```solidity
if (repayAmountFinal == borrowedAmount) {
    bool isLastCollateral = userCrossChainCollaterals.length == 1;
    lendStorage.removeCrossChainCollateral(borrower, _token, index);
    if (isLastCollateral) {
        lendStorage.removeUserBorrowedAsset(borrower, _lToken);
    }
}
```
This ensures `_lToken` is removed from `userBorrowedAssets` only when the last debt is repaid.
