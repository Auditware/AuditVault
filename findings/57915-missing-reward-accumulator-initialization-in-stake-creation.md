---
tags:
  - sector/staking
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#3-missing-reward-accumulator-initialization-in-stake-creation"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[precondition/uninitialized]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# Missing Reward Accumulator Initialization in Stake Creation

- id: 57915
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#3-missing-reward-accumulator-initialization-in-stake-creation

## Summary


The bug report identifies an issue with the `_internalStakeForAddress` function in the `DIAStakingCommons` contract. The reward accumulator is not properly initialized when a new stake is created, which allows stakers to claim all rewards, regardless of when they started staking. This could potentially lead to incorrect reward distribution and loss of funds. The report recommends adding initialization of the reward accumulator value during stake creation and changing the reward calculation in the `_getTotalRewards` function to account for stored values. The client also suggests using the `_updateRewardAccumulator` function to ensure accurate reward calculations from the start of staking. 

## Details

##### Description
This issue has been identified within the `_internalStakeForAddress` function of the `DIAStakingCommons` contract.
The reward accumulator (`rewardAccumulator`) is not initialized when a new stake is created. This oversight allows stakers to claim all rewards that have ever been accumulated by the contract, regardless of when they started staking, because of the following line: `stakerDelta = rewardAccumulator - currentStore.rewardAccumulator`. As the `currentStore.rewardAccumulator` wasn't initialized, `stakerDelta` would be equal to the value of the global `rewardAccumulator`. A similar issue exists in the `DIAWhitelistedStaking._getTotalRewards()` function, where `rewards` variable is calculated using only the `rewardAccumulator` without subtracting the `currentStore.rewardAccumulator`.
The issue is classified as **Critical** severity because it could lead to incorrect reward distribution and potential loss of funds through unauthorized reward claims.
<br/>
##### Recommendation
We recommend adding the initialization of the `rewardAccumulator` value during stake creation in the `_internalStakeForAddress` function to ensure proper reward tracking from the moment of staking. Also, `reward` calculation in the `_getTotalRewards` should be changed to properly account for the stored `currentStore.rewardAccumulator`.

> **Client's Commentary:**
> Both stake() and stakeForAddress() invoke _updateRewardAccumulator() and pass the most recent rewardAccumlator to the _internalStakeForAddress() function. This value is then used to initialize the newStore.rewardAccumulator, & newStore.initialRewardAccumulator variables. The former will continue to increment and track reward progression over time, while the latter remains constant to offset any accumulated rewards prior to the stake's startTime, ensuring accurate reward calculations from the moment staking begins.
