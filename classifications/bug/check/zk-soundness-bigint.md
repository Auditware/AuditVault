---
tags:
  - check/zk-soundness-bigint
  - sector/zk
  - lang/circom
---
Are BigInt witness values constrained to canonical (reduced) form before use in EC or field operations? Verify that any multi-limb integer passed as a private witness is constrained to be less than the field modulus p - non-reduced values (e.g., p+1) may yield incorrect sign/parity checks, allowing malicious provers to forge proofs or lock funds.
