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
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Contract owner has the ability to transfer all ETH & tokens to itself.

- id: 55772
- impact: HIGH
- protocol: [[Sheesha]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2021-03-24-Sheesha.md

## Summary


The bug report suggests adding new features to a contract to pause all operations and refund any ETH that has been supplied, instead of transferring it to the contract owner's address.

## Details

**Recommendation**:
Add methods to pause all contract operations & to refund supplied ETH instead of
transferring everything to the Contract owner address.
