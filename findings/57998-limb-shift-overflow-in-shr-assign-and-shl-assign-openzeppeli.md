---
tags:
  - lang/rust
  - has/github
  - severity/high
  - sector/infra
protocol: "[[Stylus Contracts Library]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/stylus-contracts-library-v0.2.0-audit"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# Limb Shift Overflow in shr_assign and shl_assign

- id: 57998
- impact: HIGH
- protocol: Stylus Contracts Library v0.2.0 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/stylus-contracts-library-v0.2.0-audit

## Summary


The `shr_assign` and `shl_assign` functions in the `Uint<N>` type, which is a multi-limb unsigned integer, have a bug that causes a shift overflow when the `limb_shift` value is zero. This results in a runtime panic in debug mode and incorrect results in release mode. The bug has been fixed in a recent code update, using `checked_shl` to prevent overflow situations.

## Details

The [`shr_assign`](https://github.com/OpenZeppelin/rust-contracts-stylus/blob/2350766c0c03527aedea04e2bffb8f1eb2d01aeb/lib/crypto/src/arithmetic/uint.rs#L655) and [`shl_assign`](https://github.com/OpenZeppelin/rust-contracts-stylus/blob/2350766c0c03527aedea04e2bffb8f1eb2d01aeb/lib/crypto/src/arithmetic/uint.rs#L696) functions implement the shift-and-assign operators (`<<=` and `>>=`) for the `Uint<N>` type, which represents a multi-limb unsigned integer with `N` limbs. However, a shift overflow occurs [[1]](https://github.com/OpenZeppelin/rust-contracts-stylus/blob/2350766c0c03527aedea04e2bffb8f1eb2d01aeb/lib/crypto/src/arithmetic/uint.rs#L675) [[2]](https://github.com/OpenZeppelin/rust-contracts-stylus/blob/2350766c0c03527aedea04e2bffb8f1eb2d01aeb/lib/crypto/src/arithmetic/uint.rs#L721) when the `limb_shift` value is zero. In debug mode, this results in a runtime panic with the error message `attempt to shift left with overflow`. In release mode, the shift value is masked, producing incorrect results. Consider revising the code to address this issue before the overflow occurs.

***Update:** Resolved in [pull #658](https://github.com/OpenZeppelin/rust-contracts-stylus/pull/658) at commit [c38b883](https://github.com/OpenZeppelin/rust-contracts-stylus/commit/c38b883d9a3b34890e560806e3d06e458f6501a1). The team uses `checked_shl` to mitigate overflow situations.*
