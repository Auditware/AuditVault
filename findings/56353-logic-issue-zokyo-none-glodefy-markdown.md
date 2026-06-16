---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - precondition/uninitialized
protocol: "[[Glodefy]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md"
genome:
  - "[[reward-calculation]]"
  - "[[data/uninitialized]]"
  - "[[reward-theft]]"
  - "[[initializer-auth]]"
  - "[[reward-accounting]]"
---
# Logic issue.

- id: 56353
- impact: HIGH
- protocol: [[Glodefy]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md

## Summary


This bug report is about an issue in a code called StakingB_1.sol. The bug is located on line 512 and it has to do with the "lastRewardBlock" not being initialized when the pool is set. This can cause the first reward to be counted incorrectly, leading to a large amount of rewards. The recommendation is to initialize the lastRewardBlock when setting up the pool to avoid this issue.

## Details

**Description**

StakingB_1.sol Line 512
“lastRewardBlock” must be initialized when the pool is set. In other case first reward will be
counted as a reward in range [0; last block number] that is a numerous amount.

**Recommendation**:

Initialize lastRewardBlock in pool setting.
