---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/governance
  - sector/lending
  - sector/staking
  - sector/staking-pool
protocol: "[[Linkpool]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/linkpool/linkpool-2/review.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Staker Potentially Missing Out on Rewards or Losses

- id: 19489
- impact: HIGH
- protocol: [[Linkpool]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/linkpool/linkpool-2/review.pdf

## Summary


The StakingPool contract is used to receive staked tokens from stakers and distribute them to strategies. When the strategies earn profits or suffer losses, the stakes of the stakers are affected. This means that the stakers receive profits or losses from the strategies depending on how much tokens they staked. However, if the function updateStrategyRewards() is not called before calling the function withdraw() (for stake withdrawal), the stakers’ withdrawn amounts will not reflect the profits or losses. 

In addition, a user may take advantage of the situation and take profits without staking for a considerable amount of time. To avoid this, the testing team recommends adding a snapshot to distribute profits and losses more evenly. 

The development team has added the contract SlashingKeeper to update the strategy rewards if any losses have been incurred. However, there is no change in the case of profit, and the users can still not get their rewards if the function updateStrategyRewards() is not called when necessary.

## Details

## Description

The `StakingPool` contract receives staked tokens from stakers (through `PoolRouter` or `LendingPool`) and distributes the tokens to strategies. When the strategies earn profits (or suffer losses), the stakes are affected. This means the stakers receive profits or losses from the strategies depending on how much tokens they staked (called `shares` in `StakingRewardsPool.sol`).

The profits and losses will be reflected in the stakers’ shares only when the function `updateStrategyRewards()` is called to update strategies that have earned profits or losses. If this function is not called before calling function `withdraw()` (for stake withdrawal), the stakers’ withdrawn amounts will not reflect the profits or losses.

This is because the function `StakingRewardsPool.balanceOf()` takes into account `totalShares` and `totalStaked`. A user’s balance is calculated in `StakingRewardsPool.getStakeByShares()` as:

```solidity
return (_amount * _totalStaked()) / totalShares;
```

where `_totalStaked()` is `totalStaked` or the total staked amount of all stakers adjusted with `totalRewards` (on line [287] of `StakingPool.sol`). This essential adjustment only occurs when `updateStrategyRewards()` is called, and the related strategies submit their changed deposits (on line [271]).

## Consider the following scenario:

Alice stakes 100 tokens to a `StakingPool`, which then distributes the staked tokens to Strategy S. Alice’s stake is 10% of all stakes in the pool. After a while, Strategy S earns 10 tokens. For simplicity, all rewards are transferred to the users proportionally to their staked token percentage. In this case, Alice is supposed to receive 101 tokens upon stake withdrawal.

However, if Alice (or another user) calls function `withdraw()` before calling function `updateStrategyRewards()`, then Alice will receive only 100 tokens, which is the exact same amount as her initial stake.

In a similar fashion, if Strategy S loses 10 tokens, then Alice is supposed to withdraw 99 tokens. However, since the `StakingPool` has not updated the strategy rewards, Alice receives 100 tokens after calling function `withdraw()`, assuming that the total balance of the `StakingPool` is sufficient for Alice’s withdrawal and `updateStrategyRewards()` has not been called. In this case, the other users will suffer more losses (Alice’s and their own portion of losses).

Furthermore, a user may take profits and avoid losses by observing and taking the appropriate action accordingly. For example, Carol observes that Strategy S with strategy index of 0 has earned 10 tokens in a `StakingPool`. She then stakes as many tokens as possible to `StakingPool`, such that her share becomes significantly higher than other stakers. She then calls function `updateStrategyRewards([0])` and function `withdraw()` sequentially to withdraw the staked tokens and receive most of the profits.

The user’s ability to update only the strategies that gain profits enables them to maximize the profits and avoid losses. Furthermore, the contract does not limit how many tokens a user can stake such that the shares portion can greatly change instantly.

Note that calling function `StakingPool.withdraw()` must be done from `PoolRouter`. However, this does not change the behavior of the `StakingPool` contract.

## Recommendations

The testing team recommends calling function `updateStrategyRewards()` on all strategies before calling function `withdraw()` (for stake withdrawal).

To avoid a user snatching profits without staking for a considerable amount of time, the testing team recommends adding a snapshot to distribute profits and losses more evenly.

## Resolution

The development team has added the contract `SlashingKeeper`. This contract will update the strategy rewards if any losses have been incurred. However, there are no changes in the case of profit, and the users can still not get their rewards if the function `updateStrategyRewards()` is not called when necessary.
