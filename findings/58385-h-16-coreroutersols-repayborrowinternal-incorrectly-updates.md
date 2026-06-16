---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - patitonar
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# H-16: `CoreRouter.sol`’s `repayBorrowInternal` incorrectly updates `same chain` borrow balances on `cross chain` repayments

- id: 58385
- impact: HIGH
- protocol: LEND
- reporter: patitonar (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the code of the Lend protocol. The bug was discovered by a group of individuals and can potentially cause direct loss of funds for lenders on the protocol. 

The root cause of the bug is that when a user repays a cross-chain debt, the function `CoreRouter.repayBorrowInternal` still executes the block labeled `// Update same-chain borrow balances.` This can result in the deletion or reduction of the user's same-chain `borrowBalance` even though only a cross-chain loan was repaid. This can lead to the loss of legitimate same-chain debt and cause direct loss to lenders on that chain.

The bug occurs because the code always executes the `// Update same-chain borrow balances` block, regardless of whether the `_isSameChain` variable is true or false. This means that a cross-chain repayment can delete or reduce the same-chain borrow record for the token, even if the user still owes a large same-chain loan.

The vulnerability path to trigger this bug involves a user opening a same-chain loan on one chain and a separate cross-chain loan on another chain. When the user repays the cross-chain loan, the bug is triggered and the same-chain loan is wiped out.

The impact of this bug is that a single repayment of a cross-chain loan can fully erase or reduce a larger same-chain debt, resulting in a direct loss of funds for lenders. A proof of concept for this bug can be seen in the vulnerability path described above.

To mitigate this issue, the code should only update same-chain borrow records if the `_isSameChain` variable is true. This ensures that repaying a cross-chain debt does not affect the same-chain `borrowBalance`.

In summary, this bug can cause direct loss of funds for lenders on the Lend protocol and can be triggered by repaying a cross-chain loan. To fix this issue, the code should only update same-chain borrow records if the `_isSameChain` variable is true. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/782 

## Found by 
0xbakeng, Kirkeelee, Waydou, dimah7, future, mahdifa, patitonar, t.aksoy

### Summary

When a user repays a cross-chain debt (`_isSameChain == false`), `CoreRouter.repayBorrowInternal` still executes the block labeled `// Update same-chain borrow balances.` As a result, the function wipes out or reduces the user’s same-chain `borrowBalance` even though only a cross chain loan was repaid. This can erase legitimate same chain debt and cause direct loss to lenders on that chain.

### Root Cause

In [`CoreRouter.sol:459`](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L459-L504) within `repayBorrowInternal()`:

1. If `_isSameChain` is `true`, `borrowedAmount` is derived from `lendStorage.borrowWithInterestSame()`, and updating `borrowBalance` is correct.

2. If `_isSameChain` is `false` (repaying a cross-chain debt on Chain B), `borrowedAmount` is computed via `lendStorage.borrowWithInterest()` (from cross-chain records). The subsequent call to `LErc20Interface(_lToken).repayBorrow()` correctly reduces on chain debt.

3. However, immediately afterwards the code does:

```solidity
// Update same-chain borrow balances
if (repayAmountFinal == borrowedAmount) {
    lendStorage.removeBorrowBalance(borrower, _lToken);
    lendStorage.removeUserBorrowedAsset(borrower, _lToken);
} else {
    lendStorage.updateBorrowBalance(
        borrower, _lToken,
        borrowedAmount - repayAmountFinal,
        LTokenInterface(_lToken).borrowIndex()
    );
}
```
This block always executes, regardless of `_isSameChain`. Therefore, a cross chain repayment can delete or reduce the same chain borrow record for `_lToken`, even if the user still owes a large same chain loan.

Worth noting: removing `userBorrowedAsset()` when `repayAmountFinal == borrowedAmount` is intended to clear any zero balance loan of that token. But because `removeBorrowBalance` already deleted the wrong same chain debt, the set cleanup compounds the error.

### Internal Pre-conditions

1. The user must have a nonzero `same chain` borrow of `_lToken` recorded in `lendStorage.borrowBalance[borrower][_lToken]`.

2. The user (or a liquidator) is repaying a cross-chain loan for the same `_lToken` on Chain B (so `_isSameChain == false`).

2. `lendStorage.borrowWithInterest()` returns a positive borrowedAmount for the cross-chain entry.

### External Pre-conditions

N/A

### Vulnerability Path

1. Alice opens a same chain loan on Chain B.
- She calls CoreRouter.borrow() with _isSameChain = true.
- Internally, lendStorage.borrowWithInterestSame() returns 0 initially (new borrow), so it passes the collateral check.
- The borrow succeeds, and after:

- Alice now owes tokens on Chain B.

2. Alice previously opened a separate cross chain loan, collateralized by assets on `Chain A`.

- On Chain A, Alice posted collateral and called CrossChainRouter.borrowCrossChain().

- That message eventually delivered to Chain B’s router, which executed _handleBorrowCrossChainRequest and then CoreRouter.borrowForCrossChain().

- Alice now owes tokens via cross chain, in addition to the tokens on the same chain loan. The two debts live in separate storage slots.

3. Alice (or a liquidator) repays exactly the tokens toward her cross chain debt.

- They call `CoreRouter.repayBorrow()` with `_isSameChain = false`.

- That successfully repays the cross chain debt. At this point, the cross chain entry in `LendStorage` is removed. But the same-chain `borrowBalance[Alice]` is untouched so far.

4. The bug: immediately after repaying `cross chain`, code still runs the `//Update same-chain borrow balances` block.

Right after the `repayBorrow()` call, the code does:

```solidity
// <<< BUG: This runs even though _isSameChain == false >>>
// Update same chain borrow balances
if (repayAmountFinal == borrowedAmount) {
    // repayAmountFinal == borrowedAmount
    lendStorage.removeBorrowBalance();
    lendStorage.removeUserBorrowedAsset();
} else {
    lendStorage.updateBorrowBalance();
}
```

- Because `repayAmountFinal == borrowedAmount`, the removeBorrowBalance() call executes, deleting the same-chain debt.

- Then removeUserBorrowedAsset() fires (removing `lToken` from userBorrowedAssets). At this point, Alice’s only remaining borrow record on Chain B is the (just-repaid) cross chain entry, which higher-level logic may also clear now or shortly after. The same chain borrowed tokens record is gone.

5. Outcome: Alice’s same chain loan of has been wiped out by a repayment of the cross chain debt.

The protocol is left holding a “zero” borrow record, while in fact same chain token should still be owed.

### Impact

A single repayment of a cross chain loan fully erases/reduces a larger same chain debt. Lenders who funded lose their money. This is a direct loss of user (lender) funds without external constraint.

### PoC

See Vulnerability Path

### Mitigation

Only update same-chain borrow records if `_isSameChain == true`

```diff
-   // Update same-chain borrow balances
-   if (repayAmountFinal == borrowedAmount) {
-       lendStorage.removeBorrowBalance(borrower, _lToken);
-       lendStorage.removeUserBorrowedAsset(borrower, _lToken);
-   } else {
-       lendStorage.updateBorrowBalance(
-           borrower, _lToken,
-           borrowedAmount - repayAmountFinal,
-           LTokenInterface(_lToken).borrowIndex()
-       );
-   }
-   // Clean up userBorrowedAssets unconditionally if all debt cleared
-   if (repayAmountFinal == borrowedAmount) {
-       lendStorage.removeUserBorrowedAsset(borrower, _lToken);
-   }
+   if (_isSameChain) {
+       // Update same-chain borrow balances only for same-chain loans
+       if (repayAmountFinal == borrowedAmount) {
+           lendStorage.removeBorrowBalance(borrower, _lToken);
+           lendStorage.removeUserBorrowedAsset(borrower, _lToken);
+       } else {
+           lendStorage.updateBorrowBalance(
+               borrower, _lToken,
+               borrowedAmount - repayAmountFinal,
+               LTokenInterface(_lToken).borrowIndex()
+           );
+       }
+   }
+   // If the user no longer owes any lToken on this chain (same-chain or cross-chain), 
+   // it is still valid to remove from userBorrowedAssets.
+   if (repayAmountFinal == borrowedAmount) {
+       lendStorage.removeUserBorrowedAsset(borrower, _lToken);
+   }
```

This ensures that repaying a cross chain debt never touches the same chain `borrowBalance`.
