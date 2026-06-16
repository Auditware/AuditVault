---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Cwbc]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Rewards calculation is done by counting number of days since last transfer instead of counting number of seconds since last transfer.

- id: 56425
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report is about an issue with the calculation of a function called "getPendingReward" in the "Arkouda.sol" file. The recommendation is to change the calculation from being based on days to being based on seconds.

## Details

**Description**

Arkouda.sol, getPendingReward

**Recommendation**:

Change calculation to be seconds based instead of days.
