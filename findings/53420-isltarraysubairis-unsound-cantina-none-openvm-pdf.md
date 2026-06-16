---
tags:
  - severity/high
  - has/poc
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - ed255
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[logic/wrong-condition]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# IsLtArraySubAiris unsound 

- id: 53420
- impact: HIGH
- protocol: OpenVM
- reporter: ed255 (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


This bug report is about an issue in the `IsLtArraySubAir` circuit, which is used in the `VolatileBoundaryChip`. The problem occurs when the circuit selects the first element in an array, even if it doesn't differ from the rest. This allows for cases where `x < y`, but instead of constraining `out = true`, it can be constrained to `out = false`. This issue could have a medium to high impact and is likely to occur. A proof of concept is provided to demonstrate the issue, and a recommendation is made to add a constraint to ensure the marker is set correctly. The bug has been fixed in the latest version of the software. 

## Details

## Context
`mod.rs#L93`

## Summary
IsLtArraySubAir can be assigned `out = false` in cases where `x < y`.

## Finding Description
The `IsLtArraySubAir` circuit keeps a `diff_marker` that is supposed to select the first element in the array that differs. However, if it picks the first element of the array, even if it doesn't differ, the constraints pass. This can lead to situations where `x < y`, but instead of constraining `out = true`, we can constrain `out = false`.

## Example Inputs
- `x = [0, 0]`
- `y = [0, 1]`

The expected valid witness is:
- `diff_marker = [0, 1]`
- `diff_val = 1`
- `out = 1`

But the following witness also passes the constraints:
- `diff_marker = [1, 0]`
- `diff_val = 0`
- `out = 0`

## Impact Explanation
`IsLtArraySubAir` is used in `VolatileBoundaryChip`. I don't yet know how this chip is used to assess the impact, so I'll categorize it as Medium, but it could be High.

## Likelihood Explanation
The case where `x < y` and `x[0] = y[0]` (which are the conditions to exploit this) can easily happen.

## Proof of Concept
This proof of concept shows the issue for inputs like `x = [0, 0]`, `y = [0, 1]`:

```diff
--- a/crates/circuits/primitives/src/is_less_than_array/mod.rs
+++ b/crates/circuits/primitives/src/is_less_than_array/mod.rs
@@ -220,16 +220,25 @@ impl<F: PrimeField32, const NUM: usize> TraceSubRowGenerator<F> for IsLtArraySub
 (aux, out): (IsLtArrayAuxColsMut<'a, F>, &'a mut F),
 ) {
 tracing::trace!("IsLtArraySubAir::generate_subrow x={:?}, y={:?}", x, y);
- let mut is_eq = true;
- *aux.diff_val = F::ZERO;
- for (x_i, y_i, diff_marker) in izip!(x, y, aux.diff_marker.iter_mut()) {
- if x_i != y_i && is_eq {
- is_eq = false;
- *diff_marker = F::ONE;
- *aux.diff_val = *y_i - *x_i;
- } else {
- *diff_marker = F::ZERO;
+ let original = false;
+ if original {
+ let mut is_eq = true;
+ *aux.diff_val = F::ZERO;
+ for (x_i, y_i, diff_marker) in izip!(x, y, aux.diff_marker.iter_mut()) {
+ if x_i != y_i && is_eq {
+ is_eq = false;
+ *diff_marker = F::ONE;
+ *aux.diff_val = *y_i - *x_i;
+ } else {
+ *diff_marker = F::ZERO;
+ }
 }
+ } else {
+ // Overwrite
+ *aux.diff_val = F::ZERO;
+ aux.diff_marker[0] = F::ONE;
+ aux.diff_marker[1] = F::ZERO;
+ // *out = F::ZERO;
 }
 // diff_val can be "negative" but shifted_diff is in [0, 2^{max_bits+1})
 let shifted_diff =
@@ -237,6 +246,12 @@ impl<F: PrimeField32, const NUM: usize> TraceSubRowGenerator<F> for IsLtArraySub
 let lower_u32 = shifted_diff & ((1 << self.max_bits()) - 1);
 *out = F::from_bool(shifted_diff != lower_u32);
+ println!(
+ "dbg diff_marker={:?}, diff_val={:?}",
+ aux.diff_marker, aux.diff_val
+ );
+ println!("dbg x={:?} < y={:?} out={}", x, y, *out == F::ONE);
+ // decompose lower_u32 into limbs and range check
 range_checker.decompose(lower_u32, self.max_bits(), aux.lt_decomp);
 }
```

## Recommendation
Add a constraint to ensure we can't set the marker earlier than the first diff. For instance, constrain that if `diff_value = 0`, then `diff_marker[last] = 1` (the only condition for `diff_value = 0` is that all values are the same, which is guaranteed if `diff_marker` has `1` at the last position and `diff_value = 0`).

## OpenVM
Fixed in commit `4f33e83a`. The fix addresses the unsoundness in `IsLtArraySubAir` by adding `diff_inv` along with a constraint `diff * diff_inv = 1`. This guarantees that whenever a marker is set, the difference `x - y` at that position is non-zero. Previously, we did not enforce that if a marker is set, then `x` and `y` must differ at that position, allowing a malicious prover to place the marker incorrectly. We no longer need a column for `diff` because we can retrieve `diff` as the sum of `marker * (y - x)`, with only `diff_inv` being necessary.

## Cantina Managed
Fix verified.
