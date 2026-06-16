---
tags:
  - lang/solidity
  - sector/staking
  - sector/vault
  - sector/yield-aggregator
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Magic Yearn]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# User funds lock in MyStaking due to stakerCount manipulation.

- id: 57533
- impact: HIGH
- protocol: [[Magic Yearn]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md

## Summary


The bug report is about a function in a code called MyStaking.sol. When a user stakes, the counter 'stakerCount' increases on line 227. However, when the user redeems their funds, the counter is subtracted on line 319 without checking if the user is actually a staker. This allows the user to call the redeem function multiple times, resetting the counter and preventing other users from withdrawing their funds. The recommendation is to add a validation that the user's share is greater than 0 to ensure they are a staker before allowing them to redeem. This issue has been resolved.

## Details

**Description**

MyStaking.sol: function_withdraw(). When the user stakes, there is the increase of the counter 'stakerCount on line 227. After that, when the user redeems their funds, there is the subtraction of the counter in the function_withdraw() on line 319. However, there is no check that the user is a staker. Due to this, the user can call redeem() as many times as they like, thereby resetting the counter stakerCount` and blocking withdrawals for all users.

**Recommendation**

Add the validation that user's share is greater than 0, thus, verifying that the user is actually a staker.

**Re-audit comment**

Resolved
