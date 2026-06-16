---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[variant]]"
---
# [H-01] Incorrect Withdrawal State Update Causes Partial Withdrawals to Fail

- id: 57886
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary


This bug report describes a problem with the `FundContract` code that allows users to partially withdraw their shares. When they do so, the contract incorrectly resets a variable called `isAcquired` to false, preventing them from completing the withdrawal. This bug can be found in the `vaults/hyperliquid/fundContract.sol` file and it affects the functionality of the contract, making it a high-risk issue. The recommendation is to only set `isAcquired` to false if the user has fully withdrawn their shares, otherwise it should remain true. The team has responded that they have fixed the issue.

## Details

## Severity

High Risk

## Description

The `FundContract` allows users to initiate withdrawals, which locks their shares and sets withdrawal data in storage. When the `acquireWithdrawalFunds()` function is called by the `balanceContract`, it marks the withdrawal as ready by setting `isAcquired = true` for the user. However, when a user partially withdraws their shares via the `withdraw()` function, the contract incorrectly resets `isAcquired` to false even if the user still has remaining shares to withdraw.

The issue arises in `_updateUserWithdrawal()`, which unconditionally sets `isAcquired = false` after a withdrawal, regardless of whether the user still has pending shares. Consequently, if a user attempts to withdraw their remaining shares, the check in `_canCompleteWithdraw()` will fail, preventing them from completing the withdrawal.

## Location of Affected Code

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function _updateUserWithdrawal(
    address user,
    UserWithdraw.WithdrawData memory userWithdraw,
    uint256 _shares,
    uint256 withdrawAmount
) internal {
    userWithdraw.withdrawAmount -= withdrawAmount;
    userWithdraw.shares -= _shares;
    // @audit partial withdrawal would fail
    userWithdraw.isAcquired = false;

    WithdrawStore.set(
        fundStorage,
        WithdrawStore.getWithdrawKey(address(this), user),
        userWithdraw
    );
}
```

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function _canCompleteWithdraw(address user) private view returns (bool) {
    UserWithdraw.WithdrawData memory userWithdraw = _getUserWithdraw(user);
    return userWithdraw.isAcquired;
}
```

## Impact

Users who perform partial withdrawals will be unable to withdraw their remaining shares due to the incorrect state update. This constitutes a denial of service, as legitimate withdrawals are blocked.

## Recommendation

The `_updateUserWithdrawal()` function should only set `isAcquired = false` if the user has fully withdrawn all their shares (i.e., when `userWithdraw.shares` equals zero). Otherwise, `isAcquired` should remain true to allow subsequent withdrawals.

## Team Response

Fixed.
