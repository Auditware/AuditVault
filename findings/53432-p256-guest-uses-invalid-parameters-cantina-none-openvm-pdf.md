---
tags:
  - lang/rust
  - sector/zk
  - platform/cantina
  - severity/high
protocol: "[[OpenVM]]"
auditors:
  - zigtur
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[variant]]"
---
# P256 guest uses invalid parameters 

- id: 53432
- impact: HIGH
- protocol: OpenVM
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This bug report discusses an issue with the `GENERATOR` and `NEG_GENERATOR` constants for the P256 curve. These constants are used to encode parameters for the curve, but they are not valid. The report suggests that the parameters are encoded in the wrong order, and recommends that they be reversed. The bug has been fixed in a recent commit, and has also been verified by Cantina Managed.

## Details

## Context
`p256.rs#L60-L77`

## Description
The `GENERATOR` and `NEG_GENERATOR` constants for the P256 curve are not valid. As we can see in the following snippet, the parameters are encoded in big endian to match the generator parameters of the curve (see neuromancer.sk reference on secp256r1).

```rust
impl CyclicGroup for P256Point {
    const GENERATOR: Self = P256Point {
        x: P256Coord::from_const_bytes(hex!(
            // @POC: higher bits lower bits
            "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"
            // ...
        ));
    }
}
```

When we compare to the parameters for SECP256k1, we can see that the parameters are encoded in the opposite order (see neuromancer.sk reference on secp256r1).

```rust
impl CyclicGroup for Secp256k1Point {
    const GENERATOR: Self = Secp256k1Point {
        x: Secp256k1Coord::from_const_bytes(hex!(
            // @POC: lower bits higher bits
            "9817F8165B81F259D928CE2DDBFC9B02070B87CE9562A055ACBBDCF97E66BE79"
            //...
        ));
    }
}
```

There is a discrepancy. While they are using the same functions, these two curve parameters are not encoded in the same way. This issue is due to `P256Point` parameters being incorrectly encoded.

## Recommendation
The `P256Point` parameters should be encoded in the opposite way (lower bits first).

## OpenVM
Fixed in commit `76a8c98f`, the fix corrects the `GENERATOR` and `NEG_GENERATOR` constants for the P256 curve and adds tests to verify that these points lie on the curve. Additionally, the fix updates double-`impl` for the non-zkvm environment to take account of `curve_a` when computing lambda in point doubling. This fix was made before the same finding was made by Cantina.

## Cantina Managed
Fix verified.
