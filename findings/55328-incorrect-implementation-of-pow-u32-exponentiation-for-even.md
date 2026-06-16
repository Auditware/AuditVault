---
tags:
  - severity/high
  - has/github
  - lang/rust
  - sector/zk
  - sector/infra
protocol: "[[ZKsync Crypto Precompile]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/zksync-crypto-precompile-audit"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[ec-point-doubling]]"
  - "[[arithmetic/overflow]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect Implementation of pow_u32 Exponentiation for Even Exponent

- id: 55328
- impact: HIGH
- protocol: ZKsync Crypto Precompile Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-crypto-precompile-audit

## Summary


The bug report discusses an issue in the `pow_u32` function in the `algebraic_torus.rs` file of the `zksync-crypto` repository. The function outputs incorrect values when the input is a power of 2, which can lead to incorrect pairing evaluations and false zk-proofs. The report suggests precomputing using the first bit and updating the `base` in each iteration as a potential solution. The bug has been resolved in a recent commit.

## Details

In [`algebraic_torus.rs`](https://github.com/matter-labs/zksync-crypto/blob/feature/ec_precompiles/crates/boojum/src/gadgets/tower_extension/algebraic_torus.rs#L187), the `pow_u32<CS, S: AsRef<[u64]>>(&mut self, cs: &mut CS, exponent: S)` function, when S=2kS = 2^kS=2k, outputs γg\frac{\gamma}{g}gγ​ incorrectly for all kkk as a result of starting with `Self::zero` and a static `base`. This error persists in all the cases where $S$ is even, breaking the exponentiation in those instances. If used in pairing computations, this could lead to incorrect pairing evaluations, potentially allowing false zk-proofs.

Consider precomputing using the first bit, and then starting from the second bit, updating `base` in each iteration.

***Update:** Resolved in [PR #87](https://github.com/matter-labs/zksync-crypto/pull/87) at commit [65c890d](https://github.com/matter-labs/zksync-crypto/commit/65c890d3d1b8a90242822757484c8511ab9427a0).*
