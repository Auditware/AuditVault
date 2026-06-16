---
tags:
  - sector/staking
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#1-rewards-are-lost-if-user-requests-unstake-in-less-than-one-day"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# Rewards are lost if user requests unstake in less than one day

- id: 57918
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#1-rewards-are-lost-if-user-requests-unstake-in-less-than-one-day

## Summary


This bug report describes a potential issue in the `DIAWhitelistedStaking` contract's `getRewardForStakingStore` function. If a user requests to unstake in less than one day, the reward calculation may be incorrect and the user could lose out on rewards for that period of time. The report recommends adding a check for `passedDays` to be greater than 0 or implementing a different logic for the reward calculation. The client has stated that this is intentional, but there is a related issue that could allow anyone to manipulate the `rewardAccumulator` state variable.

## Details

##### Description
In the `DIAWhitelistedStaking` contract's `getRewardForStakingStore` function, there is a potential loss in rewards calculation if a user requests unstake in less than one day. The function uses the formula:
```solidity
passedDays = passedSeconds / (24 * 60 * 60);
```
If the user requests unstake in less than one day, then `passedDays` will be 0, and the reward calculation will be incorrect, leading to rewards for that period of time being lost.
<br/>
##### Recommendation
We recommend adding a check for `passedDays` to be greater than 0 in the `getRewardForStakingStore` function or implementing a different logic for the reward calculation, which will account not only for the whole day, but also for the seconds passed since the start of the staking. Also, we recommend making it impossible to call `requestUnstake` in less than one day in case if the logic with the `passedDays` is left unchanged.

> **Client's Commentary:**
> Client: This is intentional, rewards are only paid out after full days
> MixBytes: There is a related issue present in the `dfd0bb6dc60735ed6983ee2aa4b10c7fac875ff6` commit, allowing anyone to manipulate `rewardAccumulator` state variable updates using the described rounding issue. This issue is described in the High #6.
