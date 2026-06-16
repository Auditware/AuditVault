---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Vetenet]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [H-01] Changing the reward rate results in non-claimable yield

- id: 34033
- impact: HIGH
- protocol: [[Vetenet]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md

## Summary


This bug report discusses a problem where rewards are not being distributed correctly to validators. This issue occurs when a specific method is called in a certain order, causing the rewards to not be properly calculated. The bug is considered to have a high impact because it results in validators losing out on their accrued rewards. To fix this, the report recommends calling a different method before updating a specific variable. This should only be done when the variable has already been set.

## Details

**Severity**

**Impact:**
High, as accrued rewards won't be distributed to validators

**Likelihood:**
Medium, as it requires method to be called in a specific order

**Description**

The `setDailyRewardRate` in `RewardVault` resets the `lastReward` storage variable to the current day. This means that now when `RewardVault::distributeRewards` is called, only the duration since the latest `setDailyRewardRate` call and the current moment will be used to calculate the accrued rewards. The problem with this approach is if that before calling `setDailyRewardRate` there were accrued but unclaimed rewards, those rewards will not be claimable anymore and the validators will lose on them.

**Recommendations**

Call `distributeRewards` before you update `lastReward` in `setDailyRewardRate`. This should only be done when `lastReward` has already been set.
