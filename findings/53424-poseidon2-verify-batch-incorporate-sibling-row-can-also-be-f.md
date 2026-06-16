---
tags:
  - severity/high
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - cergyk
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[novel]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Poseidon2 verify batch: Incorporate sibling row can also be ﬁrst of top level phase, skipping row incorporation 

- id: 53424
- impact: HIGH
- protocol: OpenVM
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This bug report is about a problem in an air.rs file. The report specifies that there is an issue with the verify batch instruction, which is used to check if a batch of data is valid. The bug is that the instruction is not starting correctly, leading to an incorrect verification process. This is because the instruction is not following the expected constraints, which require the instruction to start with a specific type of row. As a result, a malicious user can provide incorrect data without being detected. To fix this issue, the report recommends enforcing the correct constraints by adding a new line of code. This fix has been implemented and verified. 

## Details

## Context: air.rs#L109-L112

## Description
The verify batch instruction should always start with a row that is of type `incorporate_row` and `start_top_level`, as hinted by the constraint:

- **poseidon2/air.rs#L109-L112:**
  
  ```rust
  let end = end_inside_row + end_top_level + simple + (AB::Expr::ONE - enabled.clone());
  builder
      .when(end.clone())
      .when(next.incorporate_row)
      .assert_one(next.start_top_level);
  ```

However, only the following implication is constrained by these conditions:
If the first row is an `incorporate_row`, then `start_top_level` must be true. This means that all of the constraints on the actual opened values, enforced by the internal bus interactions, will be skipped if the first row is `incorporate_sibling` instead (please note that it does not need to be `start_top_level`):

- **poseidon2/air.rs#L465-L476:**
  
  ```rust
  self.internal_bus.interact(
      builder,
      true,
      incorporate_row,
      timestamp_after_initial_reads.clone(),
      end_timestamp - AB::F::TWO,
      opened_base_pointer,
      opened_element_size_inv,
      initial_opened_index,
      final_opened_index,
      row_hash,
  );
  ```

And a malicious prover would be able to provide top-level hashes directly without proving that the row hashed correctly into the leaf provided to the proof.

## Recommendation
Enforce that:
1. After `end`, if `incorporate_row` is true, `start_top_level` is true (already enforced).
2. After `end`, it is not possible to provide `incorporate_sibling` directly:

- **poseidon2/air.rs#L109-L112:**

  ```rust
  let end = end_inside_row + end_top_level + simple + (AB::Expr::ONE - enabled.clone());
  builder
      .when(end.clone())
      .when(next.incorporate_row)
      .assert_one(next.start_top_level);
  + builder.when(end.clone()).assert_zero(next.incorporate_sibling);
  ```

## OpenVM
Fixed in commit `7468e84a`, the fix adds the constraint `builder.when(end.clone()).assert_zero(next.incorporate_sibling)`. This ensures that a row with `end = 1` can only be followed by either an `Inside Row` row or an `Incorporate Sibling` row. The existing constraint `builder.when(end.clone()).when(next.incorporate_row).assert_one(next.start_top_level)` then ensures that when it is an `Incorporate Row` row, we enforce `start_top_level = 1.

## Cantina Managed
Fix verified.
