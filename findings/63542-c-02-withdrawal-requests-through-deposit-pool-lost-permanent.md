---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Elytra]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Elytra-security-review_2025-07-10.md"
genome:
  - "[[state-update]]"
  - "[[permanent]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [C-02] Withdrawal requests through deposit pool lost permanently

- id: 63542
- impact: HIGH
- protocol: Elytra_2025-07-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elytra]]-security-review_2025-07-10.md

## Summary


The bug report is about a function called `requestWithdrawal()` in a contract called `ElytraDepositPoolV1`. This function creates withdrawal requests that are lost due to incorrect tracking of user addresses. When a user calls this function, their tokens are transferred to the contract and the function calls another function in a different contract. However, the second contract records the wrong address as the request owner, causing the transaction to fail when the user tries to complete the withdrawal. The report suggests creating a new function in the second contract that can only be called by the first contract and records the correct user address as the request owner.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `requestWithdrawal()` function in `ElytraDepositPoolV1` creates withdrawal requests that will be permanently lost due to incorrect user address tracking. When a user calls `requestWithdrawal()`, the deposit pool transfers the user's elyAsset tokens to itself and then calls the unstaking vault's `requestWithdrawal()` function:

```solidity
    function requestWithdrawal(
        address asset,
        uint256 elyAssetAmount
    )
        external
        nonReentrant
        whenNotPaused
        onlySupportedAsset(asset)
        returns (uint256 requestId)
    {
        address unstakingVault = elytraConfig.getContract(ElytraConstants.ELYTRA_UNSTAKING_VAULT);

        // Transfer elyAsset tokens to this contract for burning
        address elyAssetToken = elytraConfig.getElyAsset();
        IERC20(elyAssetToken).safeTransferFrom(msg.sender, address(this), elyAssetAmount);

        // Approve unstaking vault to burn tokens
        IERC20(elyAssetToken).approve(unstakingVault, elyAssetAmount);

        // Request withdrawal through unstaking vault
        requestId = IElytraUnstakingVault(unstakingVault).requestWithdrawal(asset, elyAssetAmount);
    }
```

However, the unstaking vault records the `msg.sender` (which is the deposit pool) as the request owner instead of the original user.

```solidity
        withdrawalRequests[requestId] = WithdrawalRequest({
            user: msg.sender,
            asset: asset,
            elyAssetAmount: elyAssetAmount,
            assetAmount: assetAmount,
            requestTime: block.timestamp,
            completed: false
        });
```

This creates an issue where:

1. User calls `ElytraDepositPoolV1.requestWithdrawal()` with their elyAsset tokens.
2. Deposit pool transfers tokens to itself and calls `UnstakingVault.requestWithdrawal()`.
3. Unstaking vault records the deposit pool address as the request owner.
4. User attempts to complete their withdrawal via `UnstakingVault.completeWithdrawal()`.
5. Transaction reverts because `msg.sender` (user) != `request.user` (deposit pool address).

The user's tokens are effectively burned during the request creation, but they can never claim their assets because the withdrawal request is owned by the deposit pool contract rather than the user.

## Recommendations

Create a separate `requestWithdrawalForUser()` function in the unstaking vault that:
- It is only callable by the deposit pool.
- Takes an additional `user` parameter to specify the actual request owner.
- Records the provided user address as the request owner instead of `msg.sender`.
