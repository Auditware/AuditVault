---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - platform/pashov
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/pda/missing-seeds-check
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - fix/add-check
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[missing-seeds-check]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[pda-derivation]]"
---
[C-01] Funds permanently locked in treasury account with no withdrawal mechanism
......................
[C-02] Only one voter is allowed per voting event due to incorrect PDA seeds
................................
