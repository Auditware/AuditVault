---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/oracle
protocol: "[[Trzn Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Function `RM_UpdateReward` in `VaultETH_V2` has no access control

- id: 37230
- impact: HIGH
- protocol: [[Trzn Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md

## Summary


The RM_UpdateReward function has a security issue where it can be accessed by any user, even though it is meant to only be used by risk managers. This could potentially lead to unauthorized changes being made to the system. To fix this, checks should be implemented to prevent the function from being called by unexpected users. This issue has been resolved.

## Details

**Severity**: High

**Status**: Resolved 

**Description**

Function `RM_UpdateReward` has no access control and therefore  can be called by any user even though the function seems to have to be called by risk managers.

**Recommendations**:

Mitigate these issues by performing checks to ensure that function is not called by unexpected addresses
