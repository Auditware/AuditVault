---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Gearbox]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#2-incorrect-change-of-state"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Incorrect change of state

- id: 30775
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#2-incorrect-change-of-state

## Summary


The bug report states that there is an issue with changing the state to true in the `CreditFilter.sol` contract. The report suggests that this change should only be allowed to false.

## Details

##### Description
Changing state to true is incorrect and must be done via `allowToken()`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L398
##### Recommendation
We recommend allowing changing state only to false.
