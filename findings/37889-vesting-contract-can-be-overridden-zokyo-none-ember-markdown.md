---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/streaming
protocol: "[[Ember]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-10-20-Ember.md"
genome:
  - "[[missing-owner-check]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# Vesting Contract Can Be Overridden

- id: 37889
- impact: HIGH
- protocol: [[Ember]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-10-20-Ember.md

## Summary


The bug report states that there is a high severity bug in the contract EsEMBR.sol. The function addVester() can cause a catastrophic failure of users' funds if a contract is added with the same timeframe. This means that all of the funds calculated in the previous contract will be permanently lost, as there is no way to track them in the new contract. To prevent this, it is recommended to add a validation check when adding a Vester contract to ensure that it cannot override an existing contract while assets are being vested. The bug has been fixed in the commit c1e1fba2e1958f6a41d9b573ec6133a684260892. 

## Details

**Severity**: High

**Status**: Resolved

**Description**

In the contract EsEMBR.sol, the function addVester() can cause catastrophic failure of users' funds. If a contract is added with the same timeframe, then all of the users funds being calculated in the previous contract will be permanently lost as there is no way to track the funds on the new Vester contract.

**Recommendation**: 

It is recommended that there be a check when adding a Vester contract a validation check is done to ensure that a vesting contract cannot be overridden while assets are being vested.

**Comment**: 

The client fixed the issue in commit: c1e1fba2e1958f6a41d9b573ec6133a684260892
