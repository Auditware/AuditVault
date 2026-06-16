---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Elytra]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Elytra-security-review_2025-07-10.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# [C-01] `receiveFromDepositPool()` does not track assets transferred

- id: 63541
- impact: HIGH
- protocol: Elytra_2025-07-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elytra]]-security-review_2025-07-10.md

## Summary


The bug report discusses an issue with the `receiveFromDepositPool()` function in the `ElytraUnstakingVaultV1` contract. This function has a flaw where it calculates the received assets incorrectly, resulting in a value of 0. This is because the function compares the balance before and after a transfer, but the values are always the same. This means that users are unable to claim their withdrawals, causing a high impact and likelihood of the bug. The recommendation is to modify the function to accept an explicit `amount` parameter from the deposit pool to bypass the unreliable balance comparison method.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `receiveFromDepositPool()` function in `ElytraUnstakingVaultV1` contains a flaw where it attempts to calculate received assets by comparing the vault's balance before and after a transfer operation. However, this approach fails completely for all tokens because the balance comparison will always result in identical values, causing the function to calculate a received amount of 0.

```solidity
    function receiveFromDepositPool(address asset) external onlyDepositPool {
        // All assets are now ERC20 tokens (including WHYPE)
        uint256 balanceBefore = IERC20(asset).balanceOf(address(this));
        // Assets should be transferred before calling this function
        uint256 balanceAfter = IERC20(asset).balanceOf(address(this));
        uint256 received = balanceAfter - balanceBefore;
        claimableAssets[asset] += received;
        emit AssetsReceivedFromDepositPool(asset, received);
    }
```

The issue occurs because the balance is checked in the same transaction, both values are identical. The calculation `received = balanceAfter - balanceBefore` always results in 0.

This creates a problem where:

1. Users request withdrawals through the deposit pool.
2. Assets are transferred to the unstaking vault via `transferAssetToUnstakingVault()`.
3. The vault calls `receiveFromDepositPool()` to track the received assets.
4. The function calculates 0 received assets due to the flawed balance comparison.
5. Users cannot claim their withdrawals because `claimableAssets` remains unchanged.

## Recommendations

Modify the `receiveFromDepositPool()` function to accept an explicit `amount` parameter from the deposit pool, then directly add this amount to `claimableAssets`. This bypasses the unreliable balance comparison method entirely.

```solidity
function receiveFromDepositPool(address asset, uint256 amount) external onlyDepositPool {
    claimableAssets[asset] += amount;
}
```
