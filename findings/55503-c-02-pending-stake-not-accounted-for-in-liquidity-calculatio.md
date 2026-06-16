---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking
  - sector/staking-pool
  - sector/token
  - has/github
  - severity/high
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-19.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
---
# [C-02] Pending stake not accounted for in liquidity calculations

- id: 55503
- impact: HIGH
- protocol: Coinflip_2025-02-19
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-19.md

## Summary


The bug report describes an issue with the `Staking` contract where tokens are transferred to the contract immediately when requesting a stake, without tracking the pending stake. This leads to incorrect token balance usage for calculations and validation, resulting in potential loss of funds for pending stakers. The report recommends tracking pending stakes and updating them when finalized to ensure accurate liquidity calculations. 

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `Staking` contract uses `IERC20(token).balanceOf(address(this))` to determine total balance for share calculations and liquidity validation. However, in `Staking.requestStake()`, tokens are transferred to the contract immediately when requesting a stake without tracking the pending stake. This is included in the liquidity in many crucial processes, such as share calculation, liquidity locked validation, and amount owed calculation.

```solidity
function requestStake(address token, uint256 amount) external nonReentrant {
    --- SNIPPED 
---

    // Transfer the tokens from the user to this contract
@>  IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

    --- SNIPPED 
---
}
```

This is prone to incorrect token balance usage for calculation and validation, leading to pending stakers' loss of funds.

Consider the example following possible scenario below:

0. Assume there is one existing staker in the pool with 100 shares and pool balance is 100 tokens (this user owns 100% of the liquidity).

1. The previous staker decided to request unstake and they already pass the cooldown periods.

2. Alice requests to stake 100 tokens, the token transfer to the staking contract and also the share calculation uses the token contract balance in calculation without considering the requested amount that should allocate for Alice when finalizing the stake is available for her.

3. The previous staker finalize the unstake request and takes 200 tokens back (100 + 100(Alice)).

```solidity
function finalizeUnstake(address token) external nonReentrant {
    --- SNIPEPD 
---

@>  uint256 totalBalance = IERC20(token).balanceOf(address(this));
    // The user’s pro-rata portion of the underlying tokens
@>  uint256 amountOwed = (sharesToRedeem * totalBalance) / totalShares;

    --- SNIPEPD 
---
@>  IERC20(token).safeTransfer(msg.sender, amountOwed);

    emit Unstaked(msg.sender, token, amountOwed);
}
```

4. Alice will finalize with 100 shares but 0 tokens back.

There are also further cases from the functions that use the overestimation of the token balance in the staking pool: `finalizeStake()`, `finalizeUnstake()`, `totalOwed()`, and `lockLiquidity()`

## Recommendation

Track pending stakes and exclude them from being treated as available liquidity. Furthermore, the pending stakes should be updated whenever the stake is finalized, to include them in the liquidity pool and remove them from being pending.
