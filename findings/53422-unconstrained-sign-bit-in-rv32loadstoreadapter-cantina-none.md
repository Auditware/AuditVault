---
tags:
  - severity/high
  - has/poc
  - lang/solidity
  - lang/rust
  - sector/zk
  - sector/options
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - georg
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
# Unconstrained sign bit in Rv32LoadStoreAdapter 

- id: 53422
- impact: HIGH
- protocol: OpenVM
- reporter: georg (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This report discusses a vulnerability in the `Rv32LoadStoreAdapterChip` that allows a malicious prover to change the immediate values in load and store instructions. This can result in the prover accessing different memory cells and altering the results of program execution. The bug can be demonstrated by applying a specific diff and running the Fibonacci Example with a certain input. The report recommends adding constraints to relate the `imm_sign` column to the actual sign of the immediate. The bug has been fixed in the OpenVM and verified in Cantina Managed.

## Details

## Load and Store Operation Vulnerability

## Context
**File:** `loadstore.rs#L230`

## Summary
In a load or store operation, the instruction's immediate value is added to the value of `RS1`. This allows the prover to flip the higher limb of the immediate value (which can be either `0x0` or `0xffff`). As a result, a malicious prover can access a different memory cell.

## Finding Description
The `Rv32LoadStoreAdapterChip` is responsible for managing interactions with memory during load or store operations. It adds the instruction's immediate value to the value of `RS1`, using 16-bit limb addition. The constraints related to the higher limb are defined as follows:

```rust
builder
    .when(is_valid.clone())
    .assert_bool(local_cols.imm_sign);
let imm_extend_limb =
    local_cols.imm_sign * AB::F::from_canonical_u32((1 << (RV32_CELL_BITS * 2)) - 1);
let carry = (limbs_23 + imm_extend_limb + carry - local_cols.mem_ptr_limbs[1]) * inv;
builder.when(is_valid.clone()).assert_bool(carry.clone());
```

The `imm_sign` cell is not referenced in other constraints, allowing the prover the option of choosing either `0` or `1`.

## Impact Explanation
This bug permits the prover to effectively change the immediate values in load and store instructions, which can lead to loading different memory content or storing to different memory cells. This manipulation can significantly alter program execution outcomes and the branches taken during execution, enabling the prover to "prove" false statements.

## Likelihood Explanation
It's important to note that the prover can only select one of two possible values (with one being the correct value). Some selections may violate other zkVM constraints, such as if the resulting pointer cannot be represented with 29 bits. However, this vulnerability poses substantial risks for most programs. For instance, if the sign limb of a store is flipped, it likely directs to an otherwise unused address. This allows a malicious prover to bypass writes they want to omit, such as skipping an account balance update in a smart contract execution.

## Proof of Concept
The bug can be illustrated by applying the following diff and executing the Fibonacci Example with input `0x1000000000000000`:

```diff
diff --git a/extensions/rv32im/circuit/src/adapters/loadstore.rs b/extensions/rv32im/circuit/src/adapters/loadstore.rs
index 9b3f7126b..8071e16e7 100644
--- a/extensions/rv32im/circuit/src/adapters/loadstore.rs
+++ b/extensions/rv32im/circuit/src/adapters/loadstore.rs
@@ -363,10 +363,25 @@ impl<F: PrimeField32> VmAdapterChip<F> for Rv32LoadStoreAdapterChip<F> {
    let rs1_val = compose(rs1_record.1);
    let imm = c.as_canonical_u32();
-   let imm_sign = (imm & 0x8000) >> 15;
+   let mut imm_sign = (imm & 0x8000) >> 15;

+   let do_exploit = rs1_val == 0x20b2f0 && imm == 0x1c && opcode.as_usize() == 531;
+   if do_exploit {
+       println!("Flipping immediate sign bit!");
+       imm_sign = 1 - imm_sign;
+   }

    let imm_extended = imm + imm_sign * 0xffff0000;
- 
+
    let ptr_val = rs1_val.wrapping_add(imm_extended);
+
+   if do_exploit {
+       println!("Imm: 0x{:x}", imm);
+       println!("Imm Extended: 0x{:x}", imm_extended);
+       println!("RS1 Val: 0x{:x}", rs1_val);
+       println!("Ptr Val: 0x{:x}", ptr_val);
+   }

    let shift_amount = ptr_val % 4;
    assert!(
        ptr_val < (1 << self.air.pointer_max_bits),
```

Output:
```
Flipping immediate sign bit!
Imm: 0x1c
Imm Extended: 0xffff001c
RS1 Val: 0x20b2f0
Ptr Val: 0x1fb30c
```

In this instance, the store should have directed to location `0x20b2f0 + 0x1c = 0x20b30c`, but the prover was capable of routing it to `0x1fb30c` instead.

## Recommendation
Constraints should be implemented to correlate the `imm_sign` column with the actual sign of the immediate value. One approach could be to retrieve both limbs from the execution bus.

## OpenVM
Fixed in commit `9b9ee67e`, where the fix constrains the sign bit of the immediate through the field `g`. It is assumed that the transpiler’s operations are correct and that `imm_sign` is accurately constrained against the instruction field.

## Cantina Managed
Fix verified.
