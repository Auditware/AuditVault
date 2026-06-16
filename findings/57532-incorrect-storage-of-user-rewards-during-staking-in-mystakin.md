---
tags:
  - lang/solidity
  - sector/staking
  - sector/vault
  - sector/yield-aggregator
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Magic Yearn]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Incorrect storage of user rewards during staking in MyStaking.

- id: 57532
- impact: HIGH
- protocol: [[Magic Yearn]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md

## Summary


The bug report is about a function in a smart contract called MyStaking.sol that calculates rewards during staking. There is a problem where the rewards are being calculated incorrectly, allowing malicious users to increase their rewards unfairly. The recommendation is to fix the code so that rewards are stored correctly and there are no extra rewards given during staking. The issue has been resolved after a re-audit.

## Details

**Description**

MyStaking.sol: function_stake(). During staking, the rewards are calculated with function claimableAmount(). This function calculates current accrued rewards and adds "userInfo[user].unclaimedAmount" to the claimable amount. After claimable rewards are calculated, they are added to "userInfo[msg.sender].unclaimedAmount" (Line 245), though unclaimed amount is already calculated. This way, malicious users can illegally increase their rewards.

**Recommendation**

Store rewards correctly so that there can't be any extra rewards during staking.

**Re-audit comment**

Resolved
