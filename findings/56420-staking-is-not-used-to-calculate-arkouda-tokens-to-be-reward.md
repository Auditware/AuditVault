---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Cwbc]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Staking is not used to calculate Arkouda tokens to be rewarded for owners, but number of days held.

- id: 56420
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report suggests adding a Staking Smart contract to a repository and re-implementing the logic for minting Arkouda tokens. This will help improve the functionality of the project.

## Details

**Recommendation**:
Add Staking Smart contract to repo and reimplement logic of Arkouda tokens minting.
