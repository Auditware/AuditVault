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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#14-impossible-liquidation-of-broken-account"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Impossible liquidation of broken account

- id: 28207
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#14-impossible-liquidation-of-broken-account

## Summary


This bug report focuses on a specific issue with the Gearbox Protocol. If a transfer is reverted, the token cannot be accounted for as collateral, and the liquidator should not pay the fee for this token. This issue was found in the Credit Manager contract, specifically on lines 593 and 594. To avoid this issue, the recommendation is not to accumulate the tokens `tv` and `tvw` in the case of a reverted transfer.

## Details

##### Description
In case transfer was reverted, then specific token can't be accounted as collateral, and also liquidator must not pay the fee for this token:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L593-L594
##### Recommendation
We recommend not to accumulate `tv` and `tvw` in case transfer was reverted.
