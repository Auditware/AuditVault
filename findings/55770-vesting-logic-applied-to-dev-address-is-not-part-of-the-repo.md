---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - platform/zokyo
  - sector/streaming
  - sector/vault
protocol: "[[Sheesha]]"
auditors:
  - "[[Zokyo]]"
report: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-03-24-Sheesha.md
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Vesting logic applied to dev address is not part of the repository.

- id: 55770
- impact: HIGH
- protocol: [[Sheesha]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-03-24-Sheesha.md

## Summary


This bug report suggests that in the SHEESHA contract constructor, a new vesting contract should be deployed and the allocated development funds should be passed to it. This will help improve the functionality of the contract.

## Details

**Recommendation**:
In the scope of SHEESHA contract constructor execution, deploy new vesting contract and
pass allocated dev funds to it.
