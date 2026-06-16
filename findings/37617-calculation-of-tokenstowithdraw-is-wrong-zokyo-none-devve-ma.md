---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Calculation of `tokensToWithdraw` is wrong.

- id: 37617
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


This bug report is about a problem in two functions called `withdrawAirdropTokens()` and `getCurrentAirdropBalance()`. These functions are used to calculate the amount of airdrop tokens that a user can withdraw. However, the calculation is incorrect because it is based on the number of minutes passed instead of the number of days. This can lead to users receiving more airdrop tokens than they should. The recommendation is to fix the calculation by multiplying the correct number of elapsed days by the `airdropTokensPerDay` value. The bug has been resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

In the `withdrawAirdropTokens()` and `getCurrentAirdropBalance()` functions, `tokensToWithdraw` is assumed to be calculated by multiplying `airdropTokenPerDay` by the number of days passed since the last withdrawal. But it's calculated by multiplying `airdropTokenPerDay` by the number of minutes passed.
It can result in larger airdrops than expected.

**Recommendation**: 

Calculate the correct number of elapsed days and multiply it by `airdropTokensPerDay` to calculate the `tokensToWithdraw`.
