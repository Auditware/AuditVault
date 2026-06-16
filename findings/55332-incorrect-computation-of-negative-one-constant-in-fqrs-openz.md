---
tags:
  - severity/high
  - has/github
  - lang/rust
  - sector/infra
protocol: "[[ZKsync Crypto Precompile]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/zksync-crypto-precompile-audit"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect Computation of NEGATIVE_ONE Constant in fq.rs

- id: 55332
- impact: HIGH
- protocol: ZKsync Crypto Precompile Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-crypto-precompile-audit

## Summary


The `NEGATIVE_ONE` constant in the `fq.rs` file is incorrect and may cause errors in field extension and arithmetic operations. It should be corrected to its correct value of `['0x68c3488912edefaa', '0x8d087f6872aabf4f', '0x51e1a24709081231', '0x2259d6b14729c0fa']`. This issue has been resolved in a recent pull request.

## Details

In the `fq.rs` file, the constant [`NEGATIVE_ONE`](https://github.com/matter-labs/zksync-crypto/blob/3b518637a3a36a0e9e7a294e308b5675f85b15cd/crates/pairing/src/bn256/fq.rs#L200), which is supposed to represent (−((2256)mod  q)mod  q)(-((2^{256}) \mod q) \mod q)(−((2256)modq)modq), is incorrectly computed.

This constant is used in the field extension definitions and may cause errors in field extension and arithmetic operations involving it, leading to incorrect results.

Consider correcting `NEGATIVE_ONE` to its correct value: `['0x68c3488912edefaa', '0x8d087f6872aabf4f', '0x51e1a24709081231', '0x2259d6b14729c0fa']`.

***Update:** Resolved in [pull request #90](https://github.com/matter-labs/zksync-crypto/pull/90) at commit [729cf0a](https://github.com/matter-labs/zksync-crypto/commit/729cf0a95fbfa935006e13d475cc186a973e44d2).*
