---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/dex
protocol: "[[Eqifi]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md"
genome:
  - "[[uninitialized-owner]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# If in the init function msg.sender is not equal to owner, then there will be an error in line #50, because the sender of the transaction will not have the right to add an operator.

- id: 55868
- impact: HIGH
- protocol: [[Eqifi]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md

## Summary


The bug report advises beginners to be cautious when deploying contracts, as it can potentially cause issues.

## Details

**Recommendation**:
When deploying contracts, you need to be very careful with this point.
