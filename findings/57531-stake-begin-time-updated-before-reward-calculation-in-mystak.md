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
# Stake begin time updated before reward calculation in MyStaking.

- id: 57531
- impact: HIGH
- protocol: [[Magic Yearn]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md

## Summary


The bug report describes an issue with a function called "stake" in a file called "MyStaking.sol". This function uses another function called "getDivisorByTime" to calculate the amount that can be claimed. However, there is a problem with the variable "stakeBegin" which is used in this calculation. The function "setTimer" is called before the rewards are calculated, which means that "stakeBegin" will be the same for everyone and the commission for users will always be calculated with the maximum fee. 

The recommendation is to update the variable "stakeBegin" after the rewards are calculated. This will ensure that the commission is calculated correctly for each user. The re-audit comment confirms that this issue has been verified. The client also notes that the rewards are saved in a variable called "unclaimedAmount" without the fee subtracted, so users will not lose any funds but they will receive a higher fee than intended.

## Details

**Description**

MyStaking.sol: function_stake(). "stakeBegin" is used within the function getDivisorByTime() during the calculation of the claimable amount. Since_setTimer() is called before rewards are calculated (Lines 243-244), "stakeBegin" will be equal for msg.sender and the commission for the user will always be calculated with maximum fee.

**Recommendation**

Update "stakeBegin" after rewards are calculated.

**Re-audit comment**

Verified.

From the client:

The calculated rewards in_stake() are saved in userInfo[msg.sender].unclaimedAmount without the fee subtracted, so the user does not lose funds but the "fee-advantage".
