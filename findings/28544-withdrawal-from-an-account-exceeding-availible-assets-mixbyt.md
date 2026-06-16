---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/stable
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Yearn Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Stablecoins%203pool/README.md#1-withdrawal-from-an-account-exceeding-availible-assets"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[extcall-return-validation]]"
---
# Withdrawal from an account exceeding availible assets

- id: 28544
- impact: HIGH
- protocol: [[Yearn Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Stablecoins%203pool/README.md#1-withdrawal-from-an-account-exceeding-availible-assets

## Summary


This bug report is about a piece of code that is potentially vulnerable to contract failure due to a throw from another contract. The contractor has identified the code and the throw in the URLs provided in the report. It is recommended to add validation to the code, similar to the one used in the other contract mentioned in the report. This validation should help to reduce the risk of contract failure.

## Details

##### Description
The contractor discovered a code that is potentially susceptible to contract failure due to throw from another contract.
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyDAI.sol#L164
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L164

##### Recommendation
It is recommended to add validation which was done in the contract:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L163
