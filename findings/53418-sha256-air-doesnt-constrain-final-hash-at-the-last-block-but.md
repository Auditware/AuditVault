---
tags:
  - severity/high
  - has/poc
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - ed255
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[data/uninitialized]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# sha256-air doesn't constrain final_hash at the last block, but this value is read by sha256_- chip 

- id: 53418
- impact: HIGH
- protocol: OpenVM
- reporter: ed255 (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The sha256 chip extension has a security flaw where the final hash result is unconstrained, allowing a malicious prover to prove any sha256 hash result. This can be fixed by constraining the final hash result to equal the previous hash result plus the work variables. This fix has been implemented in the code.

## Details

## Context
**File:** air.rs  
**Line Range:** 173-190

## Summary
The `sha256` chip extension utilizes the `final_hash` from the `sha256-air` at a row where the value is unconstrained.

## Finding Description
The `sha256-air` verifies the SHA256 hash function block by block. Long inputs span several blocks, and only the last one contains the final hash result. The circuit binds a column named `final_hash` to the current hash state in each block except for the last one. The `sha256` chip extension picks the final hash result from this column.

- `sha256-air` constrains the `final_hash` of each block except on the `final_block` (air.rs#L172-L190).
- `sha256-air` witness generation assigns the `final_hash` value, which is unconstrained on `final_block` (trace.rs#L238-L240).
- The extension `sha256` chip picks up the unconstrained `final_hash` value as a hash result (air.rs#L508-L512).

## Impact Explanation
A malicious prover can easily prove any SHA256 hash result.

## Likelihood Explanation
A malicious prover can easily prove any SHA256 hash result.

## Proof of Concept
As a proof of concept, I modified the code as follows:

- **File:** trace.rs  
  **Line:** 237  
  ```rust
  if is_last_block { modify final_hash }
  ```
- **File:** mod.rs  
  **Line:** 171  
  ```rust
  Modify the output of hasher.finalize() the same way as the previous modification.
  ```
- Run `sha256_chip::tests::rand_sha256_test` and observe that the verification passes (by skipping the assert on tests.rs#L61-L64).

```diff
diff --git a/crates/circuits/sha256-air/src/trace.rs b/crates/circuits/sha256-air/src/trace.rs
index 734f724ec..f77c9c18e 100644
--- a/crates/circuits/sha256-air/src/trace.rs
+++ b/crates/circuits/sha256-air/src/trace.rs
@@ -233,15 +234,20 @@ impl Sha256Air {
 cols.flags.global_block_idx = F::from_canonical_u32(global_block_idx);
 cols.flags.local_block_idx = F::from_canonical_u32(local_block_idx);
- let final_hash: [u32; SHA256_HASH_WORDS] =
+ let mut final_hash: [u32; SHA256_HASH_WORDS] =
 array::from_fn(|i| work_vars[i].wrapping_add(prev_hash[i]));
+ if is_last_block {
+ final_hash[0] = 0;
+ }
 cols.final_hash = array::from_fn(|i| {
 u32_into_limbs::<SHA256_WORD_U8S>(final_hash[i]).map(F::from_canonical_u32)
 });
diff --git a/extensions/sha256/circuit/src/sha256_chip/mod.rs b/extensions/sha256/circuit/src/sha256_chip/mod.rs
index bd6ea9207..5a4f19319 100644
--- a/extensions/sha256/circuit/src/sha256_chip/mod.rs
+++ b/extensions/sha256/circuit/src/sha256_chip/mod.rs
@@ -168,7 +168,12 @@ impl<F: PrimeField32> InstructionExecutor<F> for Sha256VmChip<F> {
 }
 let mut digest = [0u8; SHA256_WRITE_SIZE];
- digest.copy_from_slice(hasher.finalize().as_ref());
+ let mut hash = hasher.finalize();
+ hash[0] = 0;
+ hash[1] = 0;
+ hash[2] = 0;
+ hash[3] = 0;
+ digest.copy_from_slice(hash.as_ref());
 let (digest_write, _) = memory.write(
 e,
 F::from_canonical_u32(dst),
diff --git a/extensions/sha256/circuit/src/sha256_chip/tests.rs
b/extensions/sha256/circuit/src/sha256_chip/tests.rs
index f319ace8f..f56b42d74 100644
--- a/extensions/sha256/circuit/src/sha256_chip/tests.rs
+++ b/extensions/sha256/circuit/src/sha256_chip/tests.rs
@@ -58,10 +58,10 @@ fn set_and_execute(
 );
 let output = sha256_solve(message);
- assert_eq!(
- output.map(F::from_canonical_u8),
- tester.read::<32>(2, dst_ptr as usize)
- );
+ // assert_eq!(
+ // output.map(F::from_canonical_u8),
+ // tester.read::<32>(2, dst_ptr as usize)
+ // );
}
///////////////////////////////////////////////////////////////////////////////////////
```

## Recommendation
I haven't yet understood all details of the `sha256-air` circuit, but the hash result at the end block should be constrained to be equal to the value that the `sha256` chip uses for the result. Areas of uncertainty include:

- How are blocks of the same input chained together? So that a block starts with the internal state of the previous block.
- In SHA256, the last step of a block is this one, but I haven't found it in the constraints:
  ```plaintext
  h0 := h0 + a
  h1 := h1 + b
  h2 := h2 + c
  h3 := h3 + d
  h4 := h4 + e
  h5 := h5 + f
  h6 := h6 + g
  h7 := h7 + h
  ```
- How is the `SHA256_H` initial state constrained for the first block of the Air trace?

## OpenVM
Fixed in commit 346c0a91.  
The value of `final_hash` was unconstrained (by mistake) in the air. This allowed a malicious prover to prove that `sha256(x) = y` for any `x, y`. The fix constrains `final_hash[i]` to equal `prev_hash[i] + work_vars[i]`.

**Relevant changes:**

Previously, `eval_digest_row` in `air.rs` took a single row as a parameter (named `local`) and it added constraints on this row. Now, it takes two rows, `local` and `next`, and adds the original constraints on `next`. This change was made because new constraints were introduced which require variables from the previous row. Since `eval_digest_row` only adds constraints on the digest row (when `next.is_digest_row == true`), the previous row is always the last round row in the block and wrap-around issues are avoided.

The addition in `previous_hash + work_vars = final_hash` is constrained via 16-bit limbs and is performed modulo `2^32`. This is achieved by using two carries (one for each limb). No new columns were added. The limbs of the `final_hash` were constrained to bytes using one range check interaction. The `work_var` limbs are implicitly constrained since they are built from bits. The `prev_hash` limbs are indirectly constrained to bytes since they derive from the previous block's `final_hash`.

## Cantina Managed
Fix verified.
