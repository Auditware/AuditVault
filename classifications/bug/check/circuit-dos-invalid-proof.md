---
tags:
  - check/circuit-dos-invalid-proof
  - sector/zk
  - check/dos-resistance
---
Can a malicious prover submit invalid proofs that consume significant verifier CPU without paying a fee? Verify that every proof submission path requires a fee commitment or staking cost proportional to verification work - fee-free proof types (e.g., split transactions) that accept unauthenticated proofs enable cheap DoS against provers and block producers.
