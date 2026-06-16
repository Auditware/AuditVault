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
  - "[[dos-resistance]]"
  - "[[dos/griefing]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Unimplemented allocate_constant Causes Panic in fq2.rs

- id: 55330
- impact: HIGH
- protocol: ZKsync Crypto Precompile Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-crypto-precompile-audit

## Summary


The `allocate_constant` function in the `CSAllocatable` trait is not working properly, causing a panic when used to allocate constants for `fq2`. This means that proof generation cannot be completed. To fix this, the function needs to be implemented or overridden in `fq2.rs`. This bug has been resolved in a recent update.

## Details

The function [`allocate_constant`](https://github.com/matter-labs/zksync-crypto/blob/ccf5fa30ee2c94b594126d7b4b75770cafbbab21/crates/boojum/src/gadgets/traits/allocatable.rs#L14) in the `CSAllocatable` trait is unimplemented.

This results in a panic when `allocate_constant` is called to allocate constants for [`fq2`](https://github.com/matter-labs/zksync-crypto/blob/ccf5fa30ee2c94b594126d7b4b75770cafbbab21/crates/boojum/src/gadgets/tower_extension/fq2.rs#L342), and the proof generation won't complete.

Consider overriding `allocate_constant` in `fq2.rs` by wrapping inner constant allocations appropriately, or implementing this function.

***Update:** Resolved in [pull request #88](https://github.com/matter-labs/zksync-crypto/pull/88) at commit [09cbca4](https://github.com/matter-labs/zksync-crypto/commit/09cbca4a2626039d2a63f968bf2e0290455da076).*
