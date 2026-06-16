---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Daoventures]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-DAOventures.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Unlimit mint in DVGToken.sol

- id: 55858
- impact: HIGH
- protocol: [[Daoventures]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-05-21-DAOventures.md

## Summary


The bug report states that the owner of the contract has the ability to create tokens and give them to any address without any limitations. The recommendation is to either add restrictions to prevent this from happening or to add a comment explaining how users are protected from this unexpected minting.

## Details

**Description**

The contract owner can mint unconditionally tokens to any address.

**Recommendation**:

Add restrictions, if possible. If not, add a comment that briefly explains how users are
protected from unexpected minting.
