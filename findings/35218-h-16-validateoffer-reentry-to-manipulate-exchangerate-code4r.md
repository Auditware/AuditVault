---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Gondi]]"
auditors:
  - "[[bin2chen]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# [H-16] `validateOffer()` reentry to manipulate `exchangeRate`

- id: 35218
- impact: HIGH
- protocol: [[Gondi]]
- reporter: bin2chen (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The report highlights a bug in the `validateOffer()` method of a contract. When this method is called, the `_outstandingValues` increases, but the `assets.balanceOf(address(this))` does not decrease immediately. This leads to an increase in the `totalAssets()` and `exchangeRate`, which can be exploited to redeem additional assets. To mitigate this, the `offer.validators` should be restricted to an empty array. The issue has been confirmed and mitigated by the developers.

## Details


The current mechanism of `validateOffer()` is to first book `_outstandingValues` to increase, but `assets.balanceOf(address(this))` doesn't decrease immediately.

```solidity
    function validateOffer(bytes calldata _offer, uint256 _protocolFee) external override onlyAcceptedCallers {
..

        /// @dev Since the balance of the pool includes capital that is waiting to be claimed by the queues,
        ///      we need to check if the pool has enough capital to fund the loan.
        ///      If that's not the case, and the principal is larger than the currentBalance, then we need to reallocate
        ///      part of it.
        if (principalAmount > undeployedAssets) {
            revert InsufficientAssetsError();
        } else if (principalAmount > currentBalance) {
            IBaseInterestAllocator(getBaseInterestAllocator).reallocate(
                currentBalance, principalAmount - currentBalance, true
            );
        }
@>      /// @dev If the txn doesn't revert, we can assume the loan was executed.
@>      _outstandingValues = _getNewLoanAccounting(principalAmount, _netApr(apr, _protocolFee));
    }
```

I.e.: After this method is called, `_getUndeployedAssets()` is unchanged, but `_getTotalOutstandingValue()` is increased, so `totalAssets()` is increased, but `totalSupply` is unchanged, so `exchangeRate` is get bigger.

Originally, it was expected that after that, the Pool balance would be transferred at `MultiSourceLoan`, so `_getUndeployedAssets()` becomes smaller and `exchangeRate` returns to normal. But if it's possible to do callback malicious logic before `MultiSourceLoan` transfers away the Pool balance, it's possible to take advantage of this `exchangeRate` that becomes larger.

Example:
Suppose `_getUndeployedAssets()` = 1000, `_getTotalOutstandingValue()` = 1000 and `totalSupply` = 2000.

So:

`totalAssets() =  2000`
`exchangeRate = 1:1`

1. Alice calls `MultiSourceLoan.emitLoan()`.
    - `offer.lender = pool`.
    - `offer.principalAmount` = 500.
    - `offer.validators = CustomContract` -> for callback.
2. `emitLoan() -> Pool.validateOffer()`.
    - `_getUndeployedAssets()` = 1000 (no change).
    - `_getTotalOutstandingValue()` = 1000 + 500 = 1500 (more 500).
    - `totalAssets()` =  2500.
    - `exchangeRate` = 1.25 : 1.
3. `emitLoan()` -> `_checkValidators()` -> `CustomContract.validateOffer()`
    - In `CustomContract.validateOffer()` call `pool.redeem` (shares) use `exchangeRate = 1.25 : 1` to get more assets.
4. `emitLoan()` -> `asset.safeTransferFrom` (pool, receiver, 500).
    - `_getUndeployedAssets()` = 500.
    - `exchangeRate` Expect to return to normal.

### Impact

Manipulating the `exchangeRate` to redeem additional assets.

### Recommended Mitigation

In `validateOffer()`, restrict `offer.validators` to be an empty array to avoid callbacks.

### Assessed type

Context

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/24#event-12545610279)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> `validateOffer` changed to view so validators cannot change state.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/94), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/64) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/17).

***
