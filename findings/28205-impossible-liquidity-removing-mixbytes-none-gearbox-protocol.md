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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#12-impossible-liquidity-removing"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Impossible liquidity removing

- id: 28205
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#12-impossible-liquidity-removing

## Summary


This bug report is about an issue with the Gearbox Protocol's PoolService.sol contract. When a user has borrowed a large part of the funds, they are unable to return their assets due to the code on line 182 of the contract. The recommendation is to add a function to the contract which would allow users to close their accounts and return funds to liquidity providers.

## Details

##### Description
In case all funds were borrowed (big part of funds), users can't return their assets (`amountSent > balanceOf(address(this))`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L182
##### Recommendation
We recommend adding a function for closing some account to return funds to LP.
