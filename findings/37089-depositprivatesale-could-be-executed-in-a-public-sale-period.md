---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/token
protocol: "[[Eclipsefi]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-12-14-EclipseFi.md"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[timestamp-dependence]]"
---
# `DepositPrivateSale` could be executed in a Public Sale period

- id: 37089
- impact: HIGH
- protocol: [[Eclipsefi]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-12-14-EclipseFi.md

## Summary


The bug report describes a problem with a function called `execute_deposit_private_sale` in a software program. The severity of the bug is high and it has been resolved. The function has a check that makes sure it is not called before a certain time, but there is nothing in place to prevent it from being called after a specific event. The recommendation is to add an if-statement to check if the current time is after the private sale period.

## Details

**Severity**: High

**Status**: Resolved

**Function**: execute_deposit_private_sale

**Line**: 327

**Description**:

Function `execute_deposit_private_sale` has a check that validates that it called not before the `private_start_time`, but there's nothing that ensures the function is not called after the private sale event

**Recommendation**: 

Add the if-case to check if the current time is past the private sale period.
