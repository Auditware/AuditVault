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
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#3-creditmanager-isnt-checked"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# `creditManager` isn't checked

- id: 30776
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#3-creditmanager-isnt-checked

## Summary


The bug report discusses an issue with a contract that allows for unlimited approval. The report suggests adding a check to ensure that the creditManager is a system contract.

## Details

##### Description
It is possible to give unlimited approve to poisoned contract:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/LeverageActions.sol#L222
##### Recommendation
We recommend adding a check that `creditManager` is a system contract.
