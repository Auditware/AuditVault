---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
protocol: "[[Gearbox]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#1-incorrect-calculation-of-borrowed-amount"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Incorrect calculation of borrowed amount

- id: 30773
- impact: HIGH
- protocol: [[Gearbox]] Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Gearbox%20Protocol/Gearbox%20Protocol%20v.1/README.md#1-incorrect-calculation-of-borrowed-amount

## Summary


In the code for Gearbox protocol, there is a bug where the total borrowed amount for credit accounts is not being calculated correctly. This means that the total amount of borrowed money on credit accounts is less than what is being shown on the PoolService, leading to incorrect calculations for the LP (liquidity pool) of the PoolService. To fix this, it is recommended to change the calculation method for borrowed amounts on credit accounts.

## Details

##### Description
Total borrowed amount increases unequally, so total borrowed amount on credit accounts would be less than `totalBorrowed` on a `PoolService` which would lead to incorrect calcultaions for LP of a `PoolService`:
https://github.com/Gearbox-protocol/gearbox-contracts/blob/0ac33ba87212ce056ac6b6357ad74161d417158a/contracts/credit/CreditManager.sol#L661
##### Recommendation
We recommend to change calculation of borrowed amount for credit accounts.
