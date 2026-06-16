---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/vault
protocol: "[[Sheesha]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-03-24-Sheesha.md"
genome:
  - "[[missing-modifier]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Method transferVaultRewards & transferVaultLPewards from contract [[Sheesha]] lets contract owner transfer rewards supply to vault multiple times.

- id: 55771
- impact: HIGH
- protocol: Sheesha
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-03-24-Sheesha.md

## Summary


The bug report suggests that a certain method should not be executed multiple times if it has already been run. This is to avoid any unnecessary or repetitive actions.

## Details

**Recommendation**:
Decline method invocations if they already distribute executed.
