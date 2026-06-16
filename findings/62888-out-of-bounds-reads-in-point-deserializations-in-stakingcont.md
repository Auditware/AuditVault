---
tags:
  - lang/solidity
  - sector/infra
  - sector/oracle
  - sector/staking
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[overflow]]"
  - "[[indirect-loss]]"
  - "[[known-pattern]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
---
# Out-of-bounds reads in point deserializations in StakingContract::precompile_add_validator

- id: 62888
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report describes a high-risk issue found in a specific version of a program. The issue is related to a function that interprets 48 bytes of input as a BLS public key. If a user manipulates the input, it can cause the program to read more bytes than it should, which can lead to a memory exfiltration attack. This means that the attacker can access unrelated memory and potentially gather sensitive information. However, the bug only occurs if the manipulated bytes represent a specific coordinate on the curve used by the program. The bug has been fixed in a recent version of the program.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
(Issue found in commit hash `4cbb1742cd31ee30a0d2c6edb698400d9d70f9d8`).

`StakingContract::precompile_add_validator` interprets 48 bytes of input as `bls_pubkey_serialized`:
```cpp
auto const bls_pubkey_serialized = unaligned_load<byte_string_fixed<48>>(consume_bytes(reader, 48).data());
```
It deserializes this into a `Bls_Pubkey`:
```cpp
Bls_Pubkey bls_pubkey(bls_pubkey_serialized);
Bls_Pubkey(byte_string_fixed<48> const &serialized) {
    parse_result_ = blst_p1_deserialize(&pubkey_, serialized.data());
}
```
`blst_p1_deserialize` calls `POINTonE1_Deserialize_Z`, which, based on bit flags in the first byte of the input, decides whether to interpret it as an uncompressed (calls `POINTonE1_Deserialize_BE`, which reads 96 bytes) or compressed (calls `POINTonE1_Uncompress_Z`, which reads 48 bytes) point:
```cpp
unsigned char in0 = in[0];
if ((in0 & 0xe0) == 0)
    return POINTonE1_Deserialize_BE(out, in);
if (in0 & 0x80) /* compressed bit */
    return POINTonE1_Uncompress_Z(out, in);
```
(See `e1.c#L331-L337`).

If a user manipulates the first byte of `bls_pubkey_serialized` so that `blst` interprets it as an uncompressed key, `blst` will overread `bls_pubkey_serialized` by 48 bytes. By the same token, a crafted `bls_signature_serialized` can cause a 96-byte overread in equivalent logic in `blst_p2_deserialize`. 

### Minimal Proof of Concept
```bash
$ cat x.cpp && $CXX $CFLAGS -I bindings/ x.cpp libblst.a && ./a.out
```
```cpp
#include <blst.h>
#include <array>
#include <cstdint>

int main(void) {
    std::array<uint8_t, 48> bls_pubkey_serialized = {};
    blst_p1_affine p;
    blst_p1_deserialize(&p, bls_pubkey_serialized.data());
    return 0;
}
```

```
=================================================================
==2365033==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7ba040ede050 at pc 0x5632af688f52 bp 0x7ffe10f28f50 sp 0x7ffe10f28f48
READ of size 1 at 0x7ba040ede050 thread T0
## 0 0x5632af688f51 in limbs_from_be_bytes /home/jhg/staking-blst-bug/blst/./src/bytes.h:24:17
## 1 0x5632af688f51 in POINTonE1_Deserialize_BE /home/jhg/staking-blst-bug/blst/./src/e1.c:303:5
## 2 0x5632af688f51 in POINTonE1_Deserialize_Z /home/jhg/staking-blst-bug/blst/./src/e1.c:334:16
## 3 0x5632af683cef in main /home/jhg/staking-blst-bug/blst/x.cpp:8:5
```

## Memory Exfiltration
Because the bug provides a read primitive, it seems reasonable to use this as a memory exfiltration mechanism, where unrelated process memory is reflected back to the attacker. `unaligned_load<byte_string_fixed<48>` causes the program to make a copy of the input data on the local stack, so any bytes adjacent to may be unrelated or uninitialized data.

However, no memory contents are reflected back directly. The deserialization functions will only succeed if the out-of-bounds bytes represent an Y coordinate corresponding to the attacker-specified X coordinate. `precompile_add_validator` reverting or not is observable to the attacker. If the attacker specifies a sets of inputs that would normally make `precompile_add_validator` succeed, they can adjust that input so that the first byte of the bls public key causes an overread. `precompile_add_validator` will then succeed if and only if the 48 bytes adjacent to `bls_pubkey_serialized` constitute a valid Y coordinate. This setup can act as a binary oracle which divulges whether or not the out-of-bounds bytes have some specific value.

The attacker would hypothesize that the out-of-bounds memory region comprises a specific set of 48 bytes. In order to make the oracle work, they'd have to find the X coordinate that matches this Y coordinate. They would then invoke the oracle which confirms or rejects the hypothesis.

With many cryptographic elliptic curves, it is infeasible to compute the affine X coordinate from a given affine Y coordinate, such that the point (X,Y) is on the curve. However, this is possible with BLS12-381:
```python
p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab
Fp = GF(p)
def deduce_x(y):
    y = Fp(y)
    k = y**2 - 4
    if k == 0:
        return [Fp(0)]
    else:
        return k.nth_root(3, all=True)
```

However, the code requires that public keys (and signatures) are not only on the curve, but they are also in the prime-order subgroup:
```cpp
class Bls_Pubkey {
    // ...
    bool is_valid() const noexcept {
        // NOTE: deserializing already checks the point is on the curve
        return parse_result_ == BLST_SUCCESS &&
               blst_p1_affine_in_g1(&pubkey_) &&
               !blst_p1_affine_is_inf(&pubkey_);
    }
};
class Bls_Signature {
    // ....
    bool is_valid() const noexcept {
        // NOTE: deserializing already checks the point is on the curve
        return parse_result_ == BLST_SUCCESS &&
               blst_p2_affine_in_g2(&sig_) &&
               !blst_p2_affine_is_inf(&sig_);
    }
};
```

Prime-order subgroup points are a very sparse subset of curve points; only about 1 in 2^127 arbitrary Y coordinates will have subgroup membership. Without this constraint, it might have been feasible to leverage the oracle to divulge memory layout details that could be meaningful for exploiting write primitives. The subgroup requirement significantly limits any exfiltration opportunities.

## Stability
Small buffer overreads like these usually do not cause crashes, but it may happen with aggressive compiler optimization.

## Consensus
It may be possible to groom the process stack contents such that a call to `precompile_add_validator` with a specific input and `msg_value` reverts sometimes, but not always. This would entail a consensus failure as nodes diverge in their chain state.

An attacker may compute the Y coordinate of a BLS public key that would ordinarily make the call to `precompile_add_validator` succeed. Instead of sending the public key in compressed form, they first make one or more calls to `precompile_add_validator` with the 48-byte Y coordinate stored somewhere in the input.

Then, they'd call `precompile_add_validator` as one ordinarily would (with a valid BLS public key and other variables), except that they clear the compressed bit. 

`blst_p1_uncompress` will now read both the X and Y coordinate, overreading the 48 bytes adjacent to the X coordinate. With some non-zero probability, the 48 bytes of out-of-bounds bytes equal the valid Y coordinate, and the call succeeds.

Ordinarily, the odds of interpreting a Y coordinate from unrelated stack memory would be minuscule, but grooming techniques could make this feasible.

## Recommendation
Either reject uncompressed points immediately by testing the first byte of their serialized representation, or call compressed-only deserialization functions that will fail for any uncompressed representations.

## Category
Labs: Fixed in commit `bf3f59e1`.

## Spearbit
Fix verified.
