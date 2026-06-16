---
tags:
  - lang/rust
  - platform/cantina
  - severity/high
  - sector/zk
protocol: "[[OpenVM]]"
auditors:
  - "[[cergyk]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[circuit-constraint-completeness]]"
---
# Poseidon2 verify_batch: start_top_levelis not constrained to happen only once during top level 

- id: 53434
- impact: HIGH
- protocol: [[OpenVM]]
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The bug report discusses an issue with the `start_top_level` function in the `air.rs` file. This function is supposed to only occur once during top-level processing and be true during the first row incorporation. However, the code does not enforce this constraint, which means that setting `start_top_level` in the middle of the top-level process can affect the expected value of `row_hash`. This could potentially allow a malicious user to manipulate the value of the incorporated row. To fix this issue, the report recommends adding additional checks and constraints to properly enforce the `start_top_level` function. This bug has been fixed in the OpenVM commit `d9f525b1` and has been verified by Cantina Managed.

## Details

## Context

**File:** `air.rs#L476-L480`

## Description

The variable `start_top_level` is supposed to be true only once during top-level processing, specifically during the first row incorporation. However, the current implementation in the code does not enforce these constraints. Setting `start_top_level` in the middle of the top-level process can influence the value expected as a result of the `row_hash`:

```rust
let row_hash = from_fn(|i| {
    (start_top_level * left_output[i])
    + ((AB::Expr::ONE - start_top_level) * right_input[i])
});
```

This means that a malicious prover could set the value of the incorporated row to the preimage of `left_output[i]` (which should be `left_input[i] || right_input[i]`), provided that the length (`opened_len`) to ingest matches as well.

It is worth noting that depending on the previous row's `root_is_on_right` value, either `right_input` or `left_input` is completely unconstrained and can be supplied arbitrarily by the prover.

## Recommendation

Apply the following additional checks:

- The first row of the top level is `incorporate_row`.
- If `local.start_top_level = 1`, then `next.start_top_level = 0`.
- If `local.start_top_level = 0`, then `next.start_top_level = 0`.

## OpenVM

This issue has been fixed in commit `d9f525b1`. The fix changes the existing constraint to properly enforce that `start_top_level = 1` if and only if it's the beginning of a top-level process (meaning the previous row is `end` and the current row is `incorporate_row`). Previously, the only constraint was that the top-level had `start_top_level = 1`, but there was no enforcement that it must equal `0` on non-top levels.

## Cantina Managed

Fix verified.
