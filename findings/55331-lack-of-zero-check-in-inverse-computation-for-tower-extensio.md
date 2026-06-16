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
  - "[[integer-bounds]]"
  - "[[arithmetic/overflow]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[precondition/specific-contract-state]]"
  - "[[blast-radius/protocol-wide]]"
---
# Lack of Zero Check in Inverse Computation for Tower Extensions

- id: 55331
- impact: HIGH
- protocol: ZKsync Crypto Precompile Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-crypto-precompile-audit

## Summary


The bug report states that the inverse functions in three files (fq2.rs, fq6.rs, and fq12.rs) do not check if the element is zero before computing the inverse. This can cause problems when trying to invert a zero element. The report suggests adding a check for a zero element and handling the error appropriately. The issue has been resolved in a recent pull request.

## Details

The inverse functions in [fq2.rs](https://github.com/matter-labs/zksync-crypto/blob/ccf5fa30ee2c94b594126d7b4b75770cafbbab21/crates/boojum/src/gadgets/tower_extension/fq2.rs#L203), [fq6.rs](https://github.com/matter-labs/zksync-crypto/blob/ccf5fa30ee2c94b594126d7b4b75770cafbbab21/crates/boojum/src/gadgets/tower_extension/fq6.rs#L376), and [fq12.rs](https://github.com/matter-labs/zksync-crypto/blob/ccf5fa30ee2c94b594126d7b4b75770cafbbab21/crates/boojum/src/gadgets/tower_extension/fq12.rs#L372) do not currently verify whether the element is zero before computing the inverse.

This may lead to undefined behaviour when attempting to invert a zero element.

Consider adding a check for a zero element in the respective field and include error management to return an error when the element is zero.

***Update:** Resolved in [pull request #89](https://github.com/matter-labs/zksync-crypto/pull/89) at commit [15b2ca0](https://github.com/matter-labs/zksync-crypto/commit/15b2ca0dfffce2f32957b907e86323ae179a0a73).*
