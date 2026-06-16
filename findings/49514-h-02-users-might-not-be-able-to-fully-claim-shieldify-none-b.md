---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Beraji Ko]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-02] Users Might Not Be Able To Fully Claim

- id: 49514
- impact: HIGH
- protocol: Beraji Ko
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md

## Summary


The bug report discusses a high-risk issue found in the `fullyClaimReward()` function in the StakingKo.sol file. This function has a loop that goes through all reward tokens and locks for a pool, which can result in a large number of loops. The issue is that the `_claimReward()` function has a modifier called `updateReward()` which also has a loop, making the total number of loops exponential. This can lead to the function reaching the block gas limit and preventing users from successfully calling `fullyClaimReward()`. The recommended solution is to remove the `updateReward()` modifier from the `_claimReward()` function, which has already been fixed by the team.

## Details

## Severity

High Risk

## Description

The `fullyClaimReward()` function loops through all locks and all rewards for a pool. Let's say we have 10 reward tokens and 5 locks.

This is 10 reward tokens \* 5 locks = 50 loops.

In the `updateReward()` modifier we do the same 50 more loops.

It looks like `_claimReward()` incorrectly has the `updateReward` modifier which makes the looping exponential:

1. 50 loops in `updateReward()` before the execution of `fullyClaimReward()`.
2. 50 loops of `_claimReward()` _ 50 loops for each `_claimReward()` due to `updateReward()` modifier: 50 _ 50 = 2500 loops
3. 50 + 2500 = 2550 loops for calling `fullyClaimReward()` once.

This at some point could reach the block gas limit and prevent the user from calling `fullyClaimReward()` successfully.

## Location of Affected Code

File: [contracts/StakingKo.sol](https://github.com/Beraji-Labs/staking-ko/blob/290103f27365cc419fe0a934feaf5f18e6e12d3a/contracts/StakingKo.sol)

```solidity
function _claimReward(
    uint256 _poolId,
    uint256 _lockId,
    uint256 _rewardId
)
    internal
    validPool(_poolId)
    validPoolLock(_poolId, _lockId)
    validReward(_poolId, _rewardId)
@>  updateReward(_poolId, msg.sender)
{
    uint256 rwAmount = userRewards[_poolId][_lockId][_rewardId][msg.sender];
    PoolReward storage rw = mapPoolRewards[_poolId][_rewardId];

    if (rwAmount != 0) {
        userRewards[_poolId][_lockId][_rewardId][msg.sender] = 0;
        rw.rewardToken.safeTransfer(msg.sender, rwAmount);
        rw.balance -= rwAmount;
        emit RewardClaimed(msg.sender, _poolId, _lockId, _rewardId, rwAmount);
    }
}
```

## Impact

The `fullyClaimReward()` function can get DOSed or very expensive gas-wise.

## Recommendation

Remove `updateReward()` modifier from `_claimReward()`.

## Team Response

Fixed.
