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
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#1-possible-remove-of-necessary-adapter"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Possible remove of necessary adapter

- id: 30774
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#1-possible-remove-of-necessary-adapter

## Summary


This bug report states that if one adapter is used for multiple contracts, then certain lines of code will cause those contracts to stop working. The recommendation is to add a check to make sure that the removed adapter is not being used in other contracts.

## Details

##### Description
In case 1 adapter is used for several contracts, then   next lines will break work of these contracts:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L190
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditFilter.sol#L217
##### Recommendation
We recommend adding a check, that removed adapter is not used in other contracts.
