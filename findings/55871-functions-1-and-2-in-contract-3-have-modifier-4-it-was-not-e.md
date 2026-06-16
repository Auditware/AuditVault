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
  - "[[init-constraint]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# Functions 1 and 2 in contract 3 have modifier 4. It was not evident from the code that the SwapProtocol contract was made somewhere by the operator. Because of this, the swapERC20 and redeemSwap functions will not work.

- id: 55871
- impact: HIGH
- protocol: [[Eqifi]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-EqiFi.md

## Summary


This bug report is recommending that a specific point in the code for migrations be fixed.

## Details

**Recommendation**:
Fix this point in the code of migrations.
