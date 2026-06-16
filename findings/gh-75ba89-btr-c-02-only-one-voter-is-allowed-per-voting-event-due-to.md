---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - platform/pashov
  - severity/high
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - fix/add-check
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-seeds-check]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[pda-derivation]]"
---
[C-02]
Only one voter is allowed per voting event due to
incorrect PDA seeds
Critical
Resolved
