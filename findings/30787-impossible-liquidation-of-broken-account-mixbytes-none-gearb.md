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
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#14-impossible-liquidation-of-broken-account"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Impossible liquidation of broken account

- id: 30787
- impact: HIGH
- protocol: [[Gearbox Protocol]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#14-impossible-liquidation-of-broken-account

## Summary


The bug report mentions an issue with a specific token not being accounted for as collateral if a transfer is reverted. It also mentions that the liquidator should not have to pay a fee for this token. The recommendation is to not accumulate certain values if a transfer is reverted.

## Details

##### Description
In case transfer was reverted, then specific token can't be accounted as collateral, and also liquidator must not pay the fee for this token:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L593-L594
##### Recommendation
We recommend not to accumulate `tv` and `tvw` in case transfer was reverted.
