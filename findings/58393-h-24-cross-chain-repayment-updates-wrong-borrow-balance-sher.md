---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-24: Cross chain repayment updates wrong borrow balance

- id: 58393
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found in the function `CoreRouter::repayBorrowInternal()` which only updates the user's `borrowBalance` for the same chain, but not for cross chain repayments. This can lead to incorrect borrow balance updates and potential problems with repaying and liquidating cross chain borrow. The root cause of this issue is the function `_repayCrossChainBorrowInternal()` calling `CoreRouter::repayCrossChainLiquidation()` which then calls `repayBorrowInternal()` without updating the cross chain borrow information. The impact of this bug includes potential inability to repay and liquidate cross chain borrow, as well as incorrect accounting for same chain borrow balances. The report suggests not updating the borrow balance in `repayBorrowInternal()` when `_isSameChain == false` as a potential mitigation.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/964 

## Found by 
0xEkko, 0xc0ffEE, 0xgee, Kvar, SarveshLimaye, Z3R0, benjamin\_0923, dmdg321, ggg\_ttt\_hhh, h2134, jokr, mussucal, newspacexyz, oxelmiguel, patitonar, rudhra1749, sil3th, wickie, xiaoming90

### Summary

The function `CoreRouter::repayBorrowInternal()` only updates user's `borrowBalance` (which is the borrow balance same-chain). This can cause cross chain repayment to update wrong borrow balance

### Root Cause

The function [`_repayCrossChainBorrowInternal()`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L368) is used within the flow of function [`repayCrossChainBorrow()`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L161) and [`_handleLiquidationSuccess()`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L464). The function `_repayCrossChainBorrowInternal()` calls internal function `_handleRepayment()`, which will external call to `CoreRouter::repayCrossChainLiquidation()`. The function `CoreRouter::repayCrossChainLiquidation()` calls internal function `repayBorrowInternal()`. Here exists problem that the cross chain borrow information is not updated, but the same-chain borrow balance.
Indeed, on the dest chain, the borrow information `crossChainCollateral` should be updated.
```solidity
    function repayBorrowInternal(
        address borrower,
        address liquidator,
        uint256 _amount,
        address _lToken,
        bool _isSameChain
    ) internal {
        address _token = lendStorage.lTokenToUnderlying(_lToken);

        LTokenInterface(_lToken).accrueInterest();

        uint256 borrowedAmount;

        if (_isSameChain) {
            borrowedAmount = lendStorage.borrowWithInterestSame(borrower, _lToken);
        } else {
            borrowedAmount = lendStorage.borrowWithInterest(borrower, _lToken);
        }

        require(borrowedAmount > 0, "Borrowed amount is 0");

        uint256 repayAmountFinal = _amount == type(uint256).max ? borrowedAmount : _amount;

        // Transfer tokens from the liquidator to the contract
        IERC20(_token).safeTransferFrom(liquidator, address(this), repayAmountFinal);

        _approveToken(_token, _lToken, repayAmountFinal);

        lendStorage.distributeBorrowerLend(_lToken, borrower);

        // Repay borrowed tokens
        require(LErc20Interface(_lToken).repayBorrow(repayAmountFinal) == 0, "Repay failed");

        // Update same-chain borrow balances
        if (repayAmountFinal == borrowedAmount) {
@>            lendStorage.removeBorrowBalance(borrower, _lToken);
@>            lendStorage.removeUserBorrowedAsset(borrower, _lToken);
        } else {
@>            lendStorage.updateBorrowBalance(
                borrower, _lToken, borrowedAmount - repayAmountFinal, LTokenInterface(_lToken).borrowIndex()
            );
        }

        // Emit RepaySuccess event
        emit RepaySuccess(borrower, _lToken, repayAmountFinal);
    }
```

### Internal Pre-conditions

NA

### External Pre-conditions

NA

### Attack Path

NA

### Impact

- Potential unable to repay cross chain borrow and liquidate cross chain borrow
- If the function `repayBorrowInternal()` successfully executed, then the same chain borrow balance is also updated, which is incorrectly accounting

### PoC

_No response_

### Mitigation

Since the function `_updateRepaymentState()` is executed later to update cross chain borrow information, then the function `repayBorrowInternal()` should consider not update borrow balance when `_isSameChain == false`
