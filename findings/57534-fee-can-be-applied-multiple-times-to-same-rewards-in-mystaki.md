---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Magic Yearn]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md"
genome:
  - "[[reward-calculation]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# Fee can be applied multiple times to same rewards in MyStaking.

- id: 57534
- impact: HIGH
- protocol: [[Magic Yearn]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-17-Magic Yearn.md

## Summary


The bug report is about a function called claimableAmount() in a file called MyStaking.sol. This function calculates the rewards for users and subtracts fees. However, there is an issue where the fee is being applied more than once, causing users to lose funds. The recommendation is to only apply the fee to rewards that do not include the unclaimed amount. This issue has been verified and the client has confirmed that the unclaimed amount is already stored without fees.

## Details

**Description**

MyStaking.sol: function claimableAmount(). The function calculates user's rewards and subtracts fees. However, the claimable amount is firstly calculated with the unclaimed amount and then a fee is applied to it. Since an unclaimed amount is stored with an already subtracted fee, the commission can be applied to user's rewards more than once, causing users to lose funds.

**Recommendation**

Apply the fee only to rewards that don't include unclaimed amount.

**Re-audit comment**

Verified.

From the client:

The amount without fees is already stored to unclaimed amount so that fees are applied only one time during claiming.
