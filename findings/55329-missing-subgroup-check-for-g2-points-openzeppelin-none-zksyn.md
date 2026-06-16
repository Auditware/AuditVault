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
  - "[[ec-point-doubling]]"
  - "[[input-validation/missing]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Missing Subgroup Check for G2 Points

- id: 55329
- impact: HIGH
- protocol: ZKsync Crypto Precompile Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-crypto-precompile-audit

## Summary


The bug report addresses an issue in the `pairing_certificate.rs` file of the `zksync-crypto` repository. It mentions that points in G2 are used in pairing operations without verifying if they belong to the correct prime-order subgroup. This can lead to incorrect results and compromise the validity of proofs. The report suggests implementing a subgroup validation check to ensure that [r]P=O, where (r) is the prime order of the subgroup and (O) is the identity element. A faster way to do this is by following the conditions outlined in a specific paper. However, the bug has been resolved as the Matter Labs team clarified that subgroup checks are already enforced at the circuit level and the code in question is only used for witness generation, which does not require subgroup checks.

## Details

In [`pairing_certificate.rs`](https://github.com/matter-labs/zksync-crypto/blob/feature/ec_precompiles/crates/pairing/src/bn256/pairing_certificate.rs), points in G2 are used in pairing operations without explicit verification that they belong to the correct prime-order subgroup. If a point (x,y)(x, y)(x,y) does not lie in this subgroup, the pairing computation may yield incorrect results, potentially compromising the validity of proofs.

Consider implementing a subgroup validation check by ensuring that [r]P=O[r]P = O[r]P=O, where ( r ) is the prime order of the subgroup and ( O ) is the identity element. A faster way to enforce this is to check the conditions of Proposition 3 in [this](https://eprint.iacr.org/2022/352.pdf) paper.

***Update:** Resolved. This is not an issue. The Matter Labs team clarified that subgroup checks are enforced on the circuit level and since this code is only used for witness generation, the witness generation process itself does not enforce subgroup checks.*
