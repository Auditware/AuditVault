---
tags:
  - blockchain/evm
  - lang/solidity
  - platform/pashov
  - severity/high
  - sector/bridge
protocol: "[[LayerZero]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-auth]]"
  - "[[direct-drain]]"
  - "[[token-decimal-normalization]]"
---
[C-01]
Mint decimal manipulation through MintCloseAuthority
leads to inflation of ld2sd_rate
Critical
Fixed
