---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Spool]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# Wrong variable passed.

- id: 56557
- impact: HIGH
- protocol: [[Spool]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md

## Summary


The bug report describes an issue with a variable being passed in a function. The variable 'strategies' is being used instead of the intended variable '_strategies', which can cause problems with the code. The recommendation is to pass in the correct variable to prevent any errors.

## Details

**Description**

Line 725. Instead of a local variable ‘_strategies’, a storage variable ‘strategies’ is passed in
Hash.sameStrategies(), which means that ‘require’ won’t revert.

**Recommendation**:

Pass the local variable ‘_strategies’ instead.
