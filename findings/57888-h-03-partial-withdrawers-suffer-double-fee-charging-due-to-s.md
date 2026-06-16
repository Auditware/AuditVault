---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - platform/shieldify
  - sector/bridge
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Partial Withdrawers Suffer Double Fee Charging Due to State Mismanagement

- id: 57888
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary


This bug report highlights a vulnerability in the `initiateWithdrawal()` and `redeem()` functions of the `fundContract.sol` file in the `hyperliquid` vault. The bug causes an accounting mismatch where fees are not properly deducted from partial withdrawals, resulting in users being charged multiple times for the same fees. This can lead to financial losses for users who make multiple partial withdrawals. The recommendation is to update the code to properly account for partial withdrawals and adjust all relevant values accordingly. The team has fixed the issue.

## Details

## Severity

High Risk

## Description

The vulnerability manifests in the interaction between `initiateWithdrawal()` and subsequent partial withdrawals via `redeem()`. When a user initiates withdrawal, the contract stores cumulative fee amounts in `userWithdraw.managementFee`. During partial withdrawals, while `_shares` and `userWithdraw.withdrawAmount` are properly reduced in `_updateUserWithdrawal()`, the critical `userWithdraw.managementFee` remains unchanged.

This creates an accounting mismatch where each partial withdrawal recalculates fees using the original full fee amount (`sharesManagementFee = (_shares * userWithdraw.managementFee) / userWithdraw.shares`), despite having already charged portions of these fees in previous withdrawals. The unmodified `managementFee` state causes the protocol to repeatedly deduct fees from the same original allocation.

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
    userWithdraw.isAcquired = false;

    WithdrawStore.set(
        fundStorage,
        WithdrawStore.getWithdrawKey(address(this), user),
        userWithdraw
    );
}
```

## Impact

Users performing multiple partial withdrawals suffer progressive financial losses as fees are compounded with each transaction.

## Recommendation

The remediation requires modifying the state management logic to properly account for partial withdrawals and ensure proportional fee deductions. The core fix involves updating `_updateUserWithdrawal()` to adjust all stored values - including shares, withdrawal amounts, and fees - based on the proportion of shares being redeemed.

## Team Response

Fixed.
