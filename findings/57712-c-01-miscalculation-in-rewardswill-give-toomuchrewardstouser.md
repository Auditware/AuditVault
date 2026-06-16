---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Mystic Finance]]"
auditors:
  - Kann
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [C-01] Miscalculation in rewardswill give toomuchrewardstousers

- id: 57712
- impact: HIGH
- protocol: Mystic Finance
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Mystic Finance.md

## Summary


The report states that there is a critical bug in the rewards system of syncRewards. The issue is that the rewards are being calculated incorrectly, which leads to an inflation of rewards over time. This means that the first users to withdraw will receive more rewards than they should, at the expense of other users. The team has acknowledged and fixed the issue.

## Details

## Severity

Critical

## Description

In syncRewards, the rewards are calculated by subtracting the last rewards to the total
yield. This is inaccurate because total yield keeps increasing, and last rewards are just the last amount
rewarded.
This means that over time, rewards will become much more inflated than their actual values, giving
away too many yield to the users. The first users to withdraw will effectively steal from others.

Proof of Concept:
Let’s assume that we get 10 ether of rewards per cycle, for simplicity.
The key parts of function syncRewards work as follow:

Cycle 1:
yieldEth has increased to 10 ether. lastRewardAmount is 0 (first run).
uint256 nextRewards = yieldEth - lastRewardAmount
uint256 nextRewards = 10 ether - 0 = 10 ether
lastRewardAmount is set to nextRewards, 10 ether.

Cycle 2:
yieldEth has increased to 20 ether. lastRewardAmount is 10.
uint256 nextRewards = 20 ether - 10 ether = 10 ether
lastRewardAmount is set to nextRewards, 10 ether.

Cycle 3, where things start to break:
yieldEth has increased to 30 ether. lastRewardAmount is 10.
uint256 nextRewards = 30 ether - 10 ether = 20 ether
Next rewards are calculated as twice the normal amount.

## Team Response

Fixed.
