---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
  - sector/liquid-staking
protocol: "[[Lido]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Lido/Deposit%20Security%20Module/README.md#2-fix-gas-cost-eth-transfer"
genome:
  - "[[unchecked-return-value]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Fix gas cost ETH transfer

- id: 28140
- impact: HIGH
- protocol: [[Lido]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Lido/Deposit%20Security%20Module/README.md#2-fix-gas-cost-eth-transfer

## Summary


This bug report is about the ETH sending process at a certain line of code in the Lido.sol file. The current gas amount used is 2300, but due to the varying gas price, it is possible that it may exceed the gas limit in the future. The recommendation is to send ETH via call instead.

## Details

##### Description
ETH sending at this line 
https://github.com/lidofinance/lido-dao/blob/5b449b740cddfbef5c107505677e6a576e2c2b69/contracts/0.4.24/Lido.sol#L301 
uses 2300 gas amount, but gas price can be vary and it is possible that in future it may exceed gas limit.
##### Recommendation
We recommend sending ETH via call.
