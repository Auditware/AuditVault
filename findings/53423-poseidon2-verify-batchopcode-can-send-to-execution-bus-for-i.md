---
tags:
  - severity/high
  - lang/rust
  - platform/cantina
  - sector/infra
protocol: "[[OpenVM]]"
auditors:
  - cergyk
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[vuln/input-validation/missing]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[novel]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Poseidon2 verify_batchopcode can send to execution bus for invalid row 

- id: 53423
- impact: HIGH
- protocol: OpenVM
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The bug report is about a problem in the code that handles interactions with the Poseidon2 chip. The issue is that the `enabled` variable, which determines which interactions are emitted, is not properly constrained. This means that the `VERIFY_BATCH` opcode can be manipulated, making it vulnerable to attacks. The recommendation is to add a constraint to the code to fix this issue. The bug has been fixed in a recent update.

## Details

## Context: air.rs#L612-L628

## Description

Most chips' AIRs define an `enabled` or `is_valid` boolean variable based on which interactions are emitted. In the case of the Poseidon2 AIR, multiple opcodes (`VERIFY_BATCH`, `PERM_POS2`, `COMP_POS2`) are handled, and `enabled` is defined as below:

- **poseidon2/air.rs#L102-L103:**

    ```rust
    let enabled = incorporate_row + incorporate_sibling + inside_row + simple;
    builder.assert_bool(enabled.clone());
    ```

The execution interaction of the `VERIFY_BATCH` opcode is emitted when `end_top_level` is `1`, but `end_top_level` is not constrained to be true only when `enabled`.

- **poseidon2/air.rs#L106:**

    ```rust
    builder.assert_bool(end_top_level);
    ```

- **poseidon2/air.rs#L340-L359:**

    ```rust
    builder
        .when(end.clone())
        .when(next.incorporate_row)
        .assert_eq(next.initial_opened_index, AB::F::ZERO);

    self.execution_bridge.execute_and_increment_pc(
        AB::Expr::from_canonical_usize(VERIFY_BATCH.global_opcode().as_usize()),
        [
            dim_register,
            opened_register,
            opened_length_register,
            sibling_register,
            index_register,
            commit_register,
            opened_element_size_inv,
        ],
        ExecutionState::new(pc, very_first_timestamp),
        end_timestamp - very_first_timestamp,
    )
    .eval(builder, end_top_level);
    ```

This means that all of the constraints pertaining to `incorporate_row`, `incorporate_sibling` types of rows can be bypassed, but the execution interaction will still be emitted, effectively making the `VERIFY_BATCH` opcode malleable.

Note that it would also be possible for a row to be simultaneously `simple` and `end_top_level` because even though they both emit execution events, `simple` emits at `start_timestamp` when `end_top_level` emits execution at `very_first_timestamp`, so the two executions could belong to actual different opcode executions in the main chip.

## Recommendation

Please consider constraining `poseidon2/air.rs#L106`:

```rust
builder.assert_bool(end_top_level);
+ builder.when(end_top_level)
+ .assert_one(incorporate_row + incorporate_sibling);
```

## OpenVM

Fixed in commit `6b1d8f14`, the fix constrains `end_top_level` to be true only when `enabled` is true and it is a top-level row.

## Cantina Managed

Fix verified.
