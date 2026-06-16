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
report: "https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#13-calculation-can-be-incorrect"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Calculation can be incorrect

- id: 28206
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/GearBox%20Protocol/README.md#13-calculation-can-be-incorrect

## Summary


This bug report is about the `expectedLiquidity` in the Gearbox Protocol's Pool Service contract. The `expectedLiquidity` contains a real balance plus pseudo balance from borrowers' interest. The bug report recommends adding a function for forcing closing some accounts to pay all balance for Liquidity Providers (LPs). This would ensure that LPs are able to receive their full balance.

## Details

##### Description
`expectedLiquidity` contains real balance + pseudo balance from borrowers interest:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/pool/PoolService.sol#L396
##### Recommendation
We recommend adding a function for forcing closing some accounts to pay all balance for LP.
