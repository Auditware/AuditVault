---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/bridge
protocol: "[[Stargate]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-31-Stargate.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[bridge-message-validation]]"
---
# Incorrect assignment of a value to the variable

- id: 56307
- impact: HIGH
- protocol: [[Stargate]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-12-31-Stargate.md

## Summary

The bug report describes an issue with the LPStaking contract constructor where the variable stargatePerBlock is not being assigned the correct value. The recommendation is to check the assignment in the constructor and use the correct name when assigning the value. The issue has been fixed and the contract should be re-audited to ensure the bug has been resolved.

## Details

**Description**

Incorrect assignment of a value to the stargatePerBlock variable in the LPStaking contract
constructor. Among the constructor parameters is the variable _stargatePerBlock. In its
implementation, its value should be assigned to the public variable stargatePerBlock. However,
an error in the name was made during the assignment.

**Recommendation**:

Check the assignment in the constructor and use the correct name when assigning a value to
the stargatePerBlock variable. Example: stargatePerBlock = stargatePerBlock;.

**Re-audit**:
Fixed.
