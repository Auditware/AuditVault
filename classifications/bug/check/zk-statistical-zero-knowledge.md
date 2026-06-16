---
tags:
  - check/zk-statistical-zero-knowledge
  - sector/zk
  - lang/rust
---
Are all polynomial shards and openings individually blinded as required by the ZK scheme specification? Verify quotient polynomial shards (e.g., h1, h2, h3 in Plonk) are each blinded with fresh randomness - unblinded shards leak information about the witness and violate the statistical zero-knowledge property.
