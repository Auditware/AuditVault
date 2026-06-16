---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/lending
protocol: "[[Eqifi]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# After calling the function to remove the provider liquidation, only the value is removed, not the array element. Because of this, the size of the array will constantly increase, and all functions may not fit into the gas block, since they have unlimited cycles.

- id: 55867
- impact: HIGH
- protocol: [[Eqifi]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md

## Summary


The bug report suggests using the EnumerableSet from openzeppelin instead of the current method. This will allow for constant functions and the ability to iterate.

## Details

**Recommendation**:

use the EnumerableSet from openzeppelin. There, all functions are performed as a constant
and there is a possibility of iteration.
