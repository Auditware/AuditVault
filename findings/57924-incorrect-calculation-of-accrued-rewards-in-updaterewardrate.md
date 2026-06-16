---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#7-incorrect-calculation-of-accrued-rewards-in-updaterewardrateperday"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Incorrect Calculation of Accrued Rewards in `updateRewardRatePerDay`

- id: 57924
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#7-incorrect-calculation-of-accrued-rewards-in-updaterewardrateperday

## Summary


The `DIARewardsDistribution` contract has a bug in the `updateRewardRatePerDay` function. This bug causes incorrect distribution of rewards due to two issues. Firstly, the function uses the wrong variable when calculating rewards for the elapsed time period. Secondly, the function divides the value by 10000, which results in lost rewards for users. This bug is classified as high severity as it can cause financial losses for users. The recommended solution is to use the correct variable and remove the division by 10000. The client has made the recommended changes to fix the bug.

## Details

##### Description
This issue has been identified within the `updateRewardRatePerDay` function of the `DIARewardsDistribution` contract.
The calculation of the `rewardsAccrued` variable contains two problems that lead to incorrect reward distribution:
1. The function incorrectly uses `rewardRatePerDay` (which has already been updated to the new rate) instead of `oldRewardRate` when calculating rewards accrued between `rewardLastUpdateTime` and `block.timestamp`. This means rewards for the elapsed period are calculated using the new rate instead of the rate that was actually in effect during that period.
2. The function divides the value by 10000, resulting in lost rewards, because it is then added to the `rewardAccumulator` variable, which is then used in `_getRewardForStakingStore` function to calculate `stakerDelta`. This `stakerDelta` variable is multiplied by `currentStore.principal` and is divided by `10000`, which is the second division by this value. This leads to the less rewards assigned to the user.

The issue is classified as **High** severity because it directly impacts the core functionality of reward distribution, potentially causing significant financial losses for users due to incorrect reward calculations.
<br/>
##### Recommendation
We recommend implementing the following changes to the `rewardsAccrued` calculation:
1. Use `oldRewardRate` instead of `rewardRatePerDay` when calculating rewards accrued between the last update and the current timestamp.
2. Remove the division by 10000 from the accumulator update step.

> **Client's Commentary:**
> changes done as per recommendation

---
