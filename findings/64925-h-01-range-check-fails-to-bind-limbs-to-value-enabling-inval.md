---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/zk
protocol: "[[Succinct]]"
auditors:
  - "[[Cryptor]]"
report: "https://code4rena.com/reports/2025-09-succinct"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[access-roles]]"
  - "[[circuit-constraint-completeness]]"
  - "[[circuit-input-range-check]]"
---
# [H-01] Range check fails to bind limbs to value, enabling invalid witnesses

- id: 64925
- impact: HIGH
- protocol: [[Succinct]]
- reporter: Cryptor (Code4rena)
- source: https://code4rena.com/reports/2025-09-succinct

## Summary


The bug report is about a helper function called `KoalaBearRangeCheck()` in a specific file, `koalabear.go`, which is used to split an input value into two parts and check their bit lengths. The function does not include a constraint that ties the two parts back to the original value, meaning that a malicious user could supply arbitrary values that pass the checks but may not be valid. This could lead to accepting out-of-range or inconsistent inputs, breaking the soundness of the program. The report recommends adding a constraint to bind the two parts to the original value, and provides a fix and regression tests for the issue.

## Details



`crates/recursion/gnark-ffi/go/sp1/koalabear/koalabear.go` [# L79-L97](https://github.com/code-423n4/2025-09-succinct/blob/main/crates/recursion/gnark-ffi/go/sp1/koalabear/koalabear.go# L79-L97)

In @crates/recursion/gnark-ffi/go/sp1/koalabear/koalabear.go, the helper `KoalaBearRangeCheck()` splits an input `value` into two hinted parts, a 24-bit `lowLimb` and a 7-bit `highLimb`, and then only enforces per-limb bitlength constraints (via `RangeChecker.Check` or `ToBinary`, depending on `GROTH16`). It also adds a guard that when `highLimb` equals the maximal 7-bit value, `lowLimb` must be zero. Critically, the function never introduces a constraint that ties the hinted limbs back to the original variable; i.e., it does not assert `value == highLimb * 2^24 + lowLimb`. Without this recomposition equation, the limb checks do not constrain `value` at all.

Key nuance: gnark hints do not constrain the circuit by themselves. They are advice values. Any relation between a hint’s inputs and outputs must be enforced with explicit constraints. Here, `SplitLimbsHint` computes limbs from `value` and even returns an error if `value >= modulus`, but this check exists only inside the hint function. Since `KoalaBearRangeCheck()` never asserts that the limbs recombine to `value`, a malicious prover could supply arbitrary limb values that merely satisfy bitlength checks, and the circuit would accept them. Consequently, `KoalaBearRangeCheck()` is insufficient as a standalone field-membership or range proof.

Contrast with the correct pattern already present in the code: in `reduceWithMaxBits()` (same file), after calling `SplitLimbsHint` on `remainder`, the code asserts `remainder == highLimb * 2^24 + lowLimb` before applying the bit checks and boundary guard. That recomposition constraint is exactly what’s missing from `KoalaBearRangeCheck()` and should be replicated there.

This helper is invoked broadly in @crates/recursion/gnark-ffi/go/sp1/sp1.go over all scalar witness elements and each component of extension-field witnesses. Any path that relies on `KoalaBearRangeCheck()` to enforce validity-without subsequently reducing and asserting equalities involving the original `value`-is vulnerable to accepting out-of-range or inconsistent witnesses.

### Exploitation sketch

* Pick any witness `value` that benefits later constraints (e.g., zeroing a product or aligning a digest preimage).
* Choose `highLimb`/`lowLimb` within their bit bounds, avoiding the boundary case `highLimb == 127` to bypass the conditional zero check.
* Since `KoalaBearRangeCheck()` lacks `value` recomposition, the check passes regardless of any relation between `value` and the limbs.
* Downstream gadgets then treat `value` as valid; if no subsequent reduction/equality ties `value` to canonical field form, this permits out-of-range or inconsistent inputs to drive logic and commitments, breaking soundness.

### Recommendation

Augment `KoalaBearRangeCheck()` to add the missing recomposition constraint that binds the hinted limbs to the original variable for both proving systems. A minimal, local fix is to assert `value == highLimb * 2^24 + lowLimb` immediately after obtaining the hint, then keep the existing limb range checks and the boundary guard. Prefer integer shifts for powers of two (e.g., `1 << 24`, `1 << 7`) instead of `math.Pow` to avoid float conversions.

Add regression tests:

* A minimal circuit that only calls `KoalaBearRangeCheck(x)` should currently accept arbitrary `x`; after the fix, it must accept only when `x` equals the recomposed limbs.
* A negative test where `value` and `(highLimb, lowLimb)` disagree must be rejected.
```

--- a/crates/recursion/gnark-ffi/go/sp1/koalabear/koalabear.go
+++ b/crates/recursion/gnark-ffi/go/sp1/koalabear/koalabear.go
@@ func (p *Chip) KoalaBearRangeCheck(value frontend.Variable) {
-    lowLimb := new_result[0]
-    highLimb := new_result[1]
+    lowLimb := new_result[0]
+    highLimb := new_result[1]
+
+    // Bind limbs to the source variable.
+    p.api.AssertIsEqual(
+        p.api.Add(
+            p.api.Mul(highLimb, frontend.Variable(uint64(1<<24))),
+            lowLimb,
+        ),
+        value,
+    )
@@
-    shouldCheck := p.api.IsZero(p.api.Sub(highLimb, uint64(math.Pow(2, 7))-1))
+    // Optional: prefer shifts for 2^k constants.
+    shouldCheck := p.api.IsZero(p.api.Sub(highLimb, uint64((1<<7)-1)))
     p.api.AssertIsEqual(
         p.api.Mul(
             shouldCheck,
             lowLimb,
         ),
         frontend.Variable(0),
     )
```

---
