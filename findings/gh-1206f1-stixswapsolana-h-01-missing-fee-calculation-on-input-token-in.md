---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/dex
protocol: "[[Stixswapsolana]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
[H-01] Missing fee calculation on input token in
take_offer
[H-02] Lack of mint validation in create_offer allows
arbitrary tokens
