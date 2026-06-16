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
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# Loop may not reach the required array element.

- id: 56558
- impact: HIGH
- protocol: [[Spool]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-03-30-Spool.md

## Summary


The report describes a bug in a loop where the last element with a value greater than 0 is not being processed. This is because the condition to exit the loop is 'i < lastDepositIndex', which prevents the last element from being processed. The recommendation is to change the condition to 'i <= lastDepositIndex' in order to ensure all required array elements are processed.

## Details

**Description**

Line 178. Loop will never reach the last element with value greater than 0, since the condition
to leave the loop is ‘i < lastDepositIndex’.
For example, ‘lastDepositIndex’ is equal to 0, and ‘depositProportionsArray’ is greater than and
should be processed in the loop, however, it won’t happen.

**Recommendation**:

In order to iterate through all required array elements, use a condition ‘i <= lastDepositIndex’
instead.
