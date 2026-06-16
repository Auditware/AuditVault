---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - sector/staking
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
# Value of BASE_REWARD state variable is incorrect.

- id: 56421
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report states that there is an issue with the value of BASE_REWARD in the Arkouda.sol file. While the requirements state that the minimum tier should equal 3 Arkouda tokens per day (or 0.00208333 tokens per second), the current value of BASE_REWARD is 10 tokens. The recommendation is to correct the value of BASE_REWARD to align with the requirements.

## Details

**Description**

Arkouda.sol, BASE_REWARD
BASE_REWARD equals 10 Arkouda tokens, but according to requirements the minimum tier
equals 3ARK/day (0.00208333/second).

**Recommendation**:
Apply the correct value to BASE_REWARD.
