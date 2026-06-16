---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#6-reward-accumulation-manipulation-through-frequent-claims"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Reward Accumulation Manipulation Through Frequent Claims

- id: 57923
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#6-reward-accumulation-manipulation-through-frequent-claims

## Summary


Bug Summary:
The `claim` function in the `DIAWhitelistedStaking` contract allows a malicious user to deprive other stakers of rewards by calling it multiple times per day. This is because the reward accumulator is not updated properly, resulting in no rewards being distributed. The bug is classified as high severity as it can have a significant financial impact. The recommended solution is to add a constant multiplier to increase precision in reward calculations and to change how the `daysElapsed` variable is calculated.

## Details

##### Description
This issue has been identified within the `claim` function of the `DIAWhitelistedStaking` contract.
Any user can deprive other stakers of rewards by calling the `claim` function multiple times per day. The reward accumulator is updated on each `claim()` call for any user. Consequently, a malicious user can stake the minimum amount and repeatedly call `claim()` throughout the day. Since `daysElapsed` will be rounded down to 0 each time, the `rewardAccumulator` will remain unchanged despite updating `rewardLastUpdateTime`. This results in no rewards being distributed to other stakers.
The issue is classified as **High** severity because it allows a malicious actor to effectively freeze reward distribution for all other stakers in the system, potentially causing significant financial impact.
<br/>
##### Recommendation
We recommend adding a constant multiplier to increase precision when calculating the time interval since the last update (currently `daysElapsed`). This could be implemented as follows:

```solidity
uint256 constant PRECISION = 1e18;

// ...

uint256 timeElapsed = (block.timestamp - rewardLastUpdateTime) * PRECISION / SECONDS_IN_A_DAY;
uint256 rewardsAccrued = rewardRatePerDay * timeElapsed;
rewardAccumulator += rewardsAccrued;
rewardLastUpdateTime = block.timestamp;
```

When calculating rewards for a specific user, the same constant should be used as a divisor:

```solidity
stakerDelta = rewardAccumulator - currentStore.rewardAccumulator;
currentStore.rewardAccumulator = rewardAccumulator;
stakerReward = (stakerDelta * currentStore.principal) / PRECISION / 10000;
```

This will solve all precision issues in reward calculations.

We recommend changing all the places where the `daysElapsed` variable is calculated to prevent cases when the division rounds down to zero.

> **Client's Commentary:**
> Client: Rewards will continue to be distributed in full-day increments, as previously outlined. To address the potential claim spam, the rewardAccumulator is now only updated when a full day has elapsed. This safeguard is implemented within the \_updateRewardAccumulator() function.
> MixBytes: There is still a possibility of griefing. A malicious user can call `claim()` every 1.999 days, resulting in up to half of the rewards being lost for all users. If it's important not to accrue rewards for partial days, there is another solution. The accrual of rewards for partial days can be postponed to a later time by updating `rewardLastUpdateTime` to the nearest past moment when a full day has passed. For this, in `DIAWhitelistedStaking._updateRewardAccumulator()`, [this line](https://github.com/diadata-org/lumina-staking/blob/a29131c47dbe17dfd3a04f1b9bc5b6ad8e65ed26/contracts/DIAWhitelistedStaking.sol#L367) should be replaced with:
>
> ```solidity
> rewardLastUpdateTime += SECONDS_IN_A_DAY * daysElapsed;
> ```
>
> The same should be done in `DIARewardsDistribution.updateRewardRatePerDay()`.
