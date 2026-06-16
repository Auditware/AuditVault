---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Graviton Zero]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Logic issue.

- id: 56364
- impact: HIGH
- protocol: [[Graviton Zero]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md

## Summary


This bug report states that there is an issue with the code in line 512 of the StakingB_1.sol file. The problem is that the "lastRewardBlock" must be initialized when the pool is set, otherwise the first reward will be counted incorrectly. The recommendation is to fix this by initializing the lastRewardBlock in the pool setting.

## Details

**Description**

StakingB_1.sol Line 512
“lastRewardBlock” must be initialized when the pool is set. In other case first reward will be
counted as a reward in range [0; last block number] that is a numerous amount.

**Recommendation**:

Initialize lastRewardBlock in pool setting.
