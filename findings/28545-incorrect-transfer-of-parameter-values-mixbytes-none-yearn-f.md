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
report: "https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Stablecoins%203pool/README.md#2-incorrect-transfer-of-parameter-values"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# Incorrect transfer of parameter values

- id: 28545
- impact: HIGH
- protocol: [[Yearn Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Yearn%20Finance/Stablecoins%203pool/README.md#2-incorrect-transfer-of-parameter-values

## Summary


A bug has been reported in the code for the stablecoins-3pool project on GitHub. The bug is at lines 222 and 224 of the StrategyUSDC.sol and StrategyUSDT.sol files respectively. The parameters are not being passed correctly, causing an issue. It is recommended to fix the bug as soon as possible.

## Details

##### Description
At the lines:
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDC.sol#L222
- https://github.com/orbxball/stablecoins-3pool/blob/adeb776933c6cb3b8306239cc3357d4c6239a88d/contracts/StrategyUSDT.sol#L224
the parameters are not passed correctly.


##### Recommendation
It is recommended to fixed it.
