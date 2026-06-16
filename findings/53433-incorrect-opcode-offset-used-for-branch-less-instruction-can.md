---
tags:
  - lang/rust
  - platform/cantina
  - has/poc
  - severity/high
  - sector/governance
  - sector/zk
protocol: "[[OpenVM]]"
auditors:
  - "[[Rhaydden]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
  - "[[ec-point-doubling]]"
---
# Incorrect opcode offset used for Branch Less instruction 

- id: 53433
- impact: HIGH
- protocol: [[OpenVM]]
- reporter: Rhaydden (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This bug report is about a coding issue in the `Rv32BranchLessThan256Chip` that affects the execution of branch less than instructions. The chip uses the wrong opcode offset, causing the instructions to be decoded and executed incorrectly. This can lead to incorrect branch condition evaluation and potentially cause the program to continue execution at the wrong address. The report provides a proof of concept and explains why the mismatch between the chip's implementation and the opcode offset causes this issue. The recommendation is to use the correct opcode offset, `Rv32BranchLessThan256Opcode::CLASS_OFFSET`, to fix the bug. The fix has been verified and implemented in the code.

## Details

## Issue Description

## Context
(No context files were provided by the reviewer)

## Description
The `Rv32BranchLessThan256Chip` uses the wrong opcode offset when creating its internal `BranchLessThanCoreChip`. It uses `Rv32LessThan256Opcode::CLASS_OFFSET` instead of `Rv32BranchLessThan256Opcode::CLASS_OFFSET`. This will cause the branch less than instruction to be decoded and executed incorrectly. This affects all 256-bit branch-less-than operations (`BLT`, `BGE`, `BLTU`, `BGEU`), leading to incorrect branch condition evaluation.

## Proof of Concept
This part of the code from the `Int256::build` method shows the issue:

```rust
• extension.rs#L184-L196:
184: let branch_less_than_chip = Rv32BranchLessThan256Chip::new(
185:     Rv32HeapBranchAdapterChip::new(
186:         execution_bus,
187:         program_bus,
188:         memory_bridge,
189:         address_bits,
190:         bitwise_lu_chip.clone(),
191:     ),
192:     BranchLessThanCoreChip::new(
193:         bitwise_lu_chip.clone(),
194:         Rv32LessThan256Opcode::CLASS_OFFSET,
195:     ),
196:     offline_memory.clone(),
```

This code will cause branch instructions to be decoded as regular less-than operations which will bypass control flow checks. Also, this isn’t consistent with other patterns seen in other chip implementations where each chip uses its corresponding opcode's `CLASS_OFFSET`. For example:

- `BaseAluCoreChip` uses `Rv32BaseAlu256Opcode::CLASS_OFFSET`.
- `BranchEqualCoreChip` uses `Rv32BranchEqual256Opcode::CLASS_OFFSET`.

If we take a look at the `core.rs` file, we can also see that:

1. The `BranchLessThanCoreChip` is built to handle branch comparison operations with dedicated logic for:

   - Branch-specific opcode flags:
     ```rust
     37: pub opcode_blt_flag: T,
     38: pub opcode_bltu_flag: T,
     39: pub opcode_bge_flag: T,
     40: pub opcode_bgeu_flag: T,
     ```

   - Branch-specific comparison logic that takes care of both signed and unsigned comparisons:
     ```rust
     104: let lt = cols.opcode_blt_flag + cols.opcode_bltu_flag;
     105: let ge = cols.opcode_bge_flag + cols.opcode_bgeu_flag;
     106: let signed = cols.opcode_blt_flag + cols.opcode_bge_flag;
     ```

   - Program counters are updated based on comparison results:
     ```rust
     159: let to_pc = from_pc
     160:     + cols.cmp_result * cols.imm
     161:     + not(cols.cmp_result) * AB::Expr::from_canonical_u32(DEFAULT_PC_STEP);
     ```

Using `Rv32LessThan256Opcode::CLASS_OFFSET` instead of `Rv32BranchLessThan256Opcode::CLASS_OFFSET` means:

- The opcode validation in `core.rs` will fail to match the actual instruction opcode.
- The branch-specific flags won't be set correctly.
- The PC updates will be incorrect, potentially causing the program to continue execution at the wrong address.
- The signed vs unsigned comparison handling will be broken.

The mismatch between the core chip's implementation and the opcode offset used to create it explains why branch conditions would be evaluated incorrectly.

Also, look at this `execute_instruction` function:

```rust
217: impl<F: PrimeField32, I: VmAdapterInterface<F>, const NUM_LIMBS: usize, const LIMB_BITS: usize>
218:     VmCoreChip<F, I> for BranchLessThanCoreChip<NUM_LIMBS, LIMB_BITS>
219: where
220:     I::Reads: Into<[[F; NUM_LIMBS]; 2]>,
221:     I::Writes: Default,
222: {
223:     type Record = BranchLessThanCoreRecord<F, NUM_LIMBS, LIMB_BITS>;
224:     type Air = BranchLessThanCoreAir<NUM_LIMBS, LIMB_BITS>;
225:
226:     #[allow(clippy::type_complexity)]
227:     fn execute_instruction(
228:         &self,
229:         instruction: &Instruction<F>,
230:         from_pc: u32,
231:         reads: I::Reads,
232:     ) -> Result<(AdapterRuntimeContext<F, I>, Self::Record)> {
233:         let Instruction { opcode, c: imm, .. } = *instruction;
234:         let blt_opcode = BranchLessThanOpcode::from_usize(opcode.local_opcode_idx(self.air.offset));
```

The chip converts the opcode using `local_opcode_idx(self.air.offset)` to get the appropriate branch operation. Using the wrong offset means branch operations will be incorrectly indexed, executing the wrong comparison type. The control flow logic in `execute_instruction` that handles PC updates based on comparison results will operate on incorrect opcodes.

To demonstrate this, add this import to `Cargo.toml` on line 19:
```toml
openvm-bigint-transpiler = { workspace = true }
```

Add this import to `tests.rs` on line 15:
```rust
use openvm_bigint_transpiler::Rv32LessThan256Opcode;
```

Then paste this in the same `tests.rs` file:

### Test Case
```rust
#[test]
#[should_panic(expected = "attempt to subtract with overflow")]
fn rv32_branch_lt_wrong_offset_test() {
    let bitwise_bus = BitwiseOperationLookupBus::new(BITWISE_OP_LOOKUP_BUS);
    let bitwise_chip = SharedBitwiseOperationLookupChip::<RV32_CELL_BITS>::new(bitwise_bus);
    let mut tester = VmChipTestBuilder::default();

    // Create chip with wrong offset (using LessThan256 instead of BranchLessThan256)
    let mut chip_wrong_offset = Rv32BranchLessThanChip::<F>::new(
        Rv32BranchAdapterChip::new(
            tester.execution_bus(),
            tester.program_bus(),
            tester.memory_bridge(),
        ),
        BranchLessThanCoreChip::new(bitwise_chip.clone(), Rv32LessThan256Opcode::CLASS_OFFSET),
        tester.offline_memory_mutex_arc(),
    );

    let mut rng = create_seeded_rng();
    // Test with values that should trigger a branch
    let a = [10, 0, 0, 0]; // Smaller value
    let b = [20, 0, 0, 0]; // Larger value
    let imm: i32 = 16; // Branch offset
    let rs1 = gen_pointer(&mut rng, 4);
    let rs2 = gen_pointer(&mut rng, 4);
    tester.write::<RV32_REGISTER_NUM_LIMBS>(1, rs1, a.map(F::from_canonical_u32));
    tester.write::<RV32_REGISTER_NUM_LIMBS>(1, rs2, b.map(F::from_canonical_u32));

    // This should fail due to incorrect opcode offset causing overflow
    let from_pc = rng.gen_range(imm.unsigned_abs()..(1 << (PC_BITS - 1)));
    tester.execute_with_pc(
        &mut chip_wrong_offset,
        &Instruction::from_isize(
            BranchLessThanOpcode::BLT.global_opcode(),
            rs1 as isize,
            rs2 as isize,
            imm as isize,
            1,
            1,
        ),
        from_pc,
    );

    // We shouldn't reach this point
    panic!("Test should have failed with overflow error");
}
```

## Logs
```
Blocking waiting for file lock on build directory
Compiling openvm-rv32im-circuit v1.0.0-rc.1 (/Users/rhaydden/openvm/extensions/rv32im/circuit)
Finished `test` profile [optimized + debuginfo] target(s) in 15.75s
Running unittests src/lib.rs (target/debug/deps/openvm_rv32im_circuit-9408da59e6f0f62e)
running 1 test
thread 'branch_lt::tests::rv32_branch_lt_wrong_offset_test' panicked at crates/toolchain/instructions/src/lib.rs:38:9:
    attempt to subtract with overflow
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
test branch_lt::tests::rv32_branch_lt_wrong_offset_test - should panic ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 173 filtered out; finished in 0.07s
```

Test logs actually show that when `BranchLessThanOpcode::BLT.global_opcode()` is used in the instruction:
- This gives us a global opcode for the `BLT` operation.
- The chip tries to map this global opcode to a local opcode using `opcode.local_opcode_idx(self.air.offset)`.
- But we provided `Rv32LessThan256Opcode::CLASS_OFFSET` instead of `Rv32BranchLessThan256Opcode::CLASS_OFFSET`.

The overflow happens because:
- The global opcode for `BLT` is in the branch instruction range.
- When we subtract the wrong offset (`Rv32LessThan256Opcode::CLASS_OFFSET`), which is in a different range.
- We get an invalid result that causes arithmetic overflow.

## Recommendation
The `BranchLessThanCoreChip` within the `Rv32BranchLessThan256Chip` should make use of the opcode offset specifically for the branch less than instruction, which is `Rv32BranchLessThan256Opcode::CLASS_OFFSET`. Using the less than opcode offset will result in incorrect behavior.

```rust
BranchLessThanCoreChip::new(
    bitwise_lu_chip.clone(),
    - Rv32LessThan256Opcode::CLASS_OFFSET,
    + Rv32BranchLessThan256Opcode::CLASS_OFFSET,
),
offline_memory.clone(),
```

## OpenVM 
Fixed in commit `76a8c98f`, the fix corrects the `GENERATOR` and `NEG_GENERATOR` constants for the P256 curve and adds tests to verify that these points lie on the curve. Additionally, the fix updates `double_impl` for the non-zkvm environment to take account of `curve_a` when computing lambda in point doubling.

## Cantina Managed
Fix verified.

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
