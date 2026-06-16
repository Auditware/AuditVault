---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#1-paidoutreward-subtraction-may-lead-to-unstake-and-unstakeprincipal-functions-reverting"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# `paidOutReward` subtraction may lead to `unstake` and `unstakePrincipal` functions reverting

- id: 57913
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#1-paidoutreward-subtraction-may-lead-to-unstake-and-unstakeprincipal-functions-reverting

## Summary


The `DIAWhitelistedStaking` contract has a bug where users may not be able to unstake their principal and rewards. This happens when a user claims rewards for the first time, then initiates an unstaking request and the unstaking period elapses. The bug is caused by a miscalculation of the `rewardToSend` variable. To fix this issue, it is recommended to remove the internal accounting for certain variables and instead use the `getRewardForStakingStore` function to calculate rewards. The bug has been fixed in a recent commit and is no longer a major issue.

## Details

##### Description
In the `DIAWhitelistedStaking` contract, when a user claims rewards for the first time, the `currentStore.reward` value is zeroed out after the rewards are paid out. If the user then initiates an unstaking request and the unstaking period elapses, the `unstake` function may revert when calculating `rewardToSend = currentStore.reward - currentStore.paidOutReward` because there may be not enough time passed since the beginning of staking, so that `currentStore.reward` is less than `currentStore.paidOutReward`.

This will lead to `unstake` and `unstakePrincipal` functions reverting, making it impossible for user to unstake their principal and rewards. It is important to note that the user won't be able to wait for more rewards as they will not be able to request unstaking for the second time if the first request wasn't fullfilled yet.
<br/>
##### Recommendation
We recommend removing the internal accounting for the `currentStore.reward` and `currentStore.paidOutReward` variables. `rewardToSend` variable, which is used inside `unstake` and `unstakePrincipal` functions, should be calculated based on the value returned from the `getRewardForStakingStore` function. `currentStore.paidOutReward` can be kept just as a accumulator. It will be enough to have only the `getRewardForStakingStore` to calculate the rewards as the staking start time is updated every time the rewards are paid out.

> **Client's Commentary:**
> The issue has been fixed in commit https://github.com/diadata-org/lumina-staking/commit/d151d961f34392c32817dff9f29b570a03b6116b
> Also, the re-working of the payment logic (Medium-5) has lead to the problem becoming largely obsolete.
