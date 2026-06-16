---
tags:
  - lang/move
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Global Interlink]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md"
genome:
  - "[[wrong-condition]]"
  - "[[integer-bounds]]"
  - "[[permanent]]"
---
# Incorrect balance check

- id: 44580
- impact: HIGH
- protocol: [[Global Interlink]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md

## Summary


This bug report is about an issue in the contract utility.move. The bug causes an assertion to fail in the function `merge_and_split` at line 31. This assertion is meant to check if there are enough remaining funds in the base coin balance. However, there is a case where the base coin balance is equal to the amount parameter, which should not happen. The recommendation is to change the assertion from greater than to greater than or equal to fix this issue. The bug has been resolved and the status of the report is now "resolved". 

## Details

**Severity**: High

**Status**: Resolved

**Description**

In contract utility.move, in function `merge_and_split` at line 31 there’s an assertion between the base coin value and amount parameter. This is meant to ensure that there are enough remaining funds in the base coin balance, however there can be a case when the base coin remaining balance is equal to the amount parameter, so the assertion fails. This should not happen if the two values are equal.

**Recommendation**: 

Change the assertion from greater than to greater than or equal
