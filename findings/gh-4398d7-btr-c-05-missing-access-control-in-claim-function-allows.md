---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - vuln/access-control/missing-modifier
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
  - sector/dex
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
[C-05]
Missing access control in claim  function allows
unauthorized token claims
Critical
Resolved
