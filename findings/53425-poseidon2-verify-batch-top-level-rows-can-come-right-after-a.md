---
tags:
  - lang/rust
  - platform/cantina
  - severity/high
  - sector/infra
protocol: "[[OpenVM]]"
auditors:
  - cergyk
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[variant]]"
---
# Poseidon2 verify batch: top-level rows can come right after an inside_row but before in- side_rowend 

- id: 53425
- impact: HIGH
- protocol: OpenVM
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The report describes a bug in a code section related to data ingestion. When using a certain type of instruction, the actual row hashing is delayed, which can cause incorrect data processing. To fix this, it is recommended to ensure that only a specific type of row is used until the end of the instruction. The bug has been fixed in a recent update.

## Details

## Context

Refer to `air.rs#L155-L172` for details.

## Description

When using an `incorporate_row` type during a verify batch instruction, execution of the actual ingestion of the row is "deferred" using the internal bus:

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

This means that the actual row hashing is constrained by a series of `inside_row` rows, which will emit the associated receive event once finished:

```rust
// end
self.internal_bus.interact(
    builder,
    false,
    end_inside_row,
    very_first_timestamp,
    start_timestamp + AB::F::from_canonical_usize(2 * CHUNK),
    opened_base_pointer,
    opened_element_size_inv,
    initial_opened_index,
    cells[CHUNK - 1].opened_index,
    left_output,
);
```

To ensure the row is hashed correctly, a series of state transition rules is enforced between consecutive `inside_row` rows:

```rust
// things that stay the same (roughly)
builder.when(inside_row - end_inside_row).assert_eq(
    next.start_timestamp,
    start_timestamp + AB::F::from_canonical_usize(2 * CHUNK),
);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.opened_base_pointer, opened_base_pointer);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.opened_element_size_inv, opened_element_size_inv);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.initial_opened_index, initial_opened_index);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.very_first_timestamp, very_first_timestamp);
```

Unfortunately, it is not enforced that until the end of inside rows (`end_inside_row`) all rows are of type `inside_row`, and rows of type `incorporate_sibling` can be appended after a series of `inside_row` to bypass the initialization checks of the "top-level" phase (indeed, initialization checks are carried only if the previous row was an end one).

## Recommendation

Ensure that until `end_inside_row` only `inside_row` type rows are used:

```rust
// things that stay the same (roughly)
builder.when(inside_row - end_inside_row).assert_eq(
    next.start_timestamp,
    start_timestamp + AB::F::from_canonical_usize(2 * CHUNK),
);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.opened_base_pointer, opened_base_pointer);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.opened_element_size_inv, opened_element_size_inv);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.initial_opened_index, initial_opened_index);
builder
    .when(inside_row - end_inside_row)
    .assert_eq(next.very_first_timestamp, very_first_timestamp);
+ builder
+     .when(inside_row - end_inside_row)
+     .assert_eq(next.inside_row, inside_row);
```

## OpenVM

Fixed in commit `2fe9ad79`, the fix adds the constraint `builder.when(inside_row).when(AB::Expr::ONE - end_inside_row).assert_one(next.inside_row)`. This ensures that an Inside Row row that is not the last one in its block is followed by another Inside Row row, fixing the issue that Top Level rows could be interspersed inside Inside Row rows. While this differs slightly from the fix suggested in the finding, this constraint more clearly expresses the intent.

## Cantina Managed

Fix verified.
