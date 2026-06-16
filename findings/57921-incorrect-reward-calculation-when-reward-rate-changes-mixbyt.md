---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#4-incorrect-reward-calculation-when-reward-rate-changes"
genome:
  - "[[reward-accounting]]"
  - "[[precision-loss]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Incorrect Reward Calculation When Reward Rate Changes

- id: 57921
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#4-incorrect-reward-calculation-when-reward-rate-changes

## Summary


The report discusses a bug in the `getRewardForStakingStore` function of the `DIAWhitelistedStaking` contract. Currently, rewards are calculated using the current `rewardRatePerDay` regardless of any changes in the rate between the staking start time and the present moment. This can result in different rewards being given to identical stakes, leading to unfairness and potentially damaging trust in the staking system. The report recommends implementing an accumulator that tracks the total rewards accrued per unit of stake and updating it during relevant operations. However, this solution may introduce a new issue, which is described in Critical #3.

## Details

##### Description
This issue has been identified within the `getRewardForStakingStore` function of the `DIAWhitelistedStaking` contract.
Currently, rewards are calculated using the current `rewardRatePerDay`, regardless of whether the rate has changed between `currentStore.stakingStartTime` and the present moment. As a result, two identical stakes may receive different rewards depending on when they call `unstake()`.
The issue is classified as **High** severity because it can lead to unfair or inconsistent reward distribution among stakers, potentially undermining trust in the staking mechanism.
<br/>
##### Recommendation
We recommend implementing an accumulator that tracks the total rewards accrued per unit of stake. This accumulator should be updated during any relevant operation. As an example - global index implementation in [Comptroller.sol](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Comptroller.sol) by Compound Protocol.

There may be introduced the following logic:

```
unclaimed += currentStore.principal * (globalIndex - userIndex);
```

where `globalIndex` is updated before each change made to the rewards rate or other parameters affecting the rewards accrual by users. It may be done in such way:

```
timeElapsed = block.timestamp - lastUpdateTime;

// We don't take into account potential precision loss
// here due to the division by SECONDS_PER_DAY
rewardAccrued = rewardRatePerDay * timeElapsed / SECONDS_PER_DAY;

indexDelta = rewardAccrued * 1e18 / totalStaked;
globalIndex += indexDelta;
lastUpdateTime = block.timestamp;
```

And then user rewards can be calculated as follows:

```
userDelta = globalIndex - userIndex[user];
reward = currentStore.principal * userDelta / 1e18;
userUnclaimed[user] += reward;
userIndex[user] = globalIndex;
```

That approach will ensure that the correct rewards rate is applied during the appropriate staking period and won't lead to distributing more or less rewards than it was expected by the protocol users.

> **Client's Commentary:**
> Client: We've introduced a `rewardAccumulator` global variable that tracks the cumulative sum of daily reward rates over time for all stakes, reflecting the total rewards accrued per stake. `rewardLastUpdateTime` is another global variable that records the timestamp of the last update to the `rewardAccumulator` variable, ensuring that whenever it is updated, the calculation starts from the last update time.
> `rewardAccumulator` is updated with every unstake, claim, and updateRewardRatePerDay function call within DIAWhitelistedStaking.sol & DIARewardsDistribution.sol contracts.
> MixBytes: There is a new issue introduced. It is related to the `rewardAccumulator` variable logic. This issue is described in the Critical #3.
> Client: We've introduced a rewardAccumulator global variable that tracks the cumulative sum of daily reward rates over time for all stakes, reflecting the total rewards accrued per stake. rewardLastUpdateTime is another global variable that records the timestamp of the last update to the rewardAccumulator variable, ensuring that whenever it is updated, the calculation starts from the last update time.
> rewardAccumulator is updated with every unstake, claim, and updateRewardRatePerDay function call within DIAWhitelistedStaking.sol & DIARewardsDistribution.sol.
