---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - sector/dex
  - check/pool-direct-transfer-dos
protocol: "[[Dub]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[pool-direct-transfer-dos]]"
---
C-01
Sending PC tokens directly to pool_pc_token  account leads to DoS
M-01
Lack of trading pause after migration
M-02
Pool balance manipulation before migration
M-03
Migration to Raydium fails for pools with tokens having freeze authority enabled
M-04
Freeze authority on base mint in deploy_bonding_mint
M-05
Premature token releases in Lock program
M-06
State inconsistency due to Solana rollback
M-07
DoS for legitimate AMM creators is possible
