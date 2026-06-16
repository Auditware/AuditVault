---
tags:
  - severity/high
  - has/poc
  - lang/rust
  - sector/zk
  - platform/cantina
protocol: "[[OpenVM]]"
auditors:
  - georg
report: "https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf"
genome:
  - "[[circuit-constraint-completeness]]"
  - "[[integer-bounds]]"
  - "[[arithmetic/overflow]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Overﬂow possible in bus argument 

- id: 53415
- impact: HIGH
- protocol: OpenVM
- reporter: georg (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The report discusses a bug in the OpenVM framework that allows a malicious prover to provide false proofs. This is due to a flaw in the LogUp-style bus argument, which does not guarantee that the number of bus sends is not larger than the characteristic of the field. This allows the prover to interfere with the connection between chips and "prove" wrong results, making it possible to "prove" arbitrary statements. The likelihood of this attack is possible but challenging for the attacker, as it requires sending the same tuple to the bus multiple times. The report provides a proof of concept and recommends implementing carefully calculated limits on chip sizes to prevent this attack. The fix for this bug has been implemented in both the stark-backend and OpenVM code. 

## Details

## Context
(No context files were provided by the reviewer)

## Summary
The LogUp-style bus argument only holds if the number of bus sends (with multiplicity 1) is not larger than the characteristic of the field (in the case of BabyBear: \( 2^{31} - 2^{27} + 1 \)); see Lemma 5 in the LogUp paper (Habock, 2023). This is not guaranteed by the OpenVM framework. As a result, a malicious prover can provide a "proof" of a false claim that passes the verifier checks.

## Finding Description
In OpenVM, chips within a segment are connected via a "bus": A chip can "send" tuples of field elements to the bus or can "receive" tuples from the bus. At the end of the computation, the received tuples and sent tuples must cancel out, i.e., they must be equal as multi-sets. Interacting with the bus amounts to adding a term \(\frac{m}{\alpha + t}\) to an accumulator, where:
- **m** is the multiplicity. For bus sends it should always be 0 or 1; for receives, it could be 0 or a negative number (sometimes unconstrained, sometimes constrained to be 0 or -1).
- **α** is an extension field element, sampled by the verifier.
- **t** is a compressed version of the tuple being sent (also fingerprinted via a random extension field element, which we omit here).

Clearly, if the same tuple is sent \( p \) times (where \( p \) is the characteristic of the field), it is the same as sending it 0 times. This allows a malicious prover to make false claims.

For example, XOR computations on bytes are checked by sending to the `SharedBitwiseOperationLookupChip`, which receives all possible input/output pairs with some multiplicity. If a claimed output is wrong, normally the bus argument would not succeed. But if the wrong input/output pair is sent \( p \) times, the checks pass.

## Impact Explanation
If the prover were able to launch such an attack, the connection between chips could be interfered with arbitrarily, "proving" wrong results of any step of the computation, allowing the prover to "prove" arbitrary statements.

## Likelihood Explanation
In order to launch this attack, the prover needs to be able to send the same tuple to the bus \( p \) times. This is expensive but feasible: \( p \) is around \( 2^{31} \) (for BabyBear and Mersenne-31), and many chips do several bus sends per computational step (most notably range-checks).

A few challenges met by the attacker:
- The sent tuple needs to be exactly the same \( p \) times. Because the sent tuples might be constrained in other ways, it might be tricky to find a satisfying witness for some programs.
- Since \( p \) is quite large, this would not work for very small programs, as small programs simply would not have enough bus sends to reach \( p \).
- The largest multiplicative subgroup in the BabyBear field is of size \( 2^{27} \). Depending on FRI parameters and the constraint degrees, this sets a maximum number of rows any chip trace can have. For OpenVM's default trace, this limit appears to be \( 2^{25} \). However, the limit would be higher for other fields (e.g., Mersenne-31). Also, the limit is per chip and many chips do multiple sends.
- Computing such a large proof is computationally expensive. However, it would be feasible and still accepted by the verifier.

## Proof of Concept
Because of the computational and time cost, we present here a small PoC that validates that overflow does indeed happen by adding this patch to `BaseAluCoreAir::eval`:

```rust
let p_minus_one = (1 << 31) - (1 << 27);
let x = AB::F::from_canonical_u8(0x12);
self.bus
    // Wrong XOR input/output pair.
    .send_xor(x, x, x)
    // Send with multiplicity p - 1.
    .eval(builder, AB::F::from_canonical_u32(p_minus_one));
self.bus
    // Send same tuple again.
    .send_xor(x, x, x)
    // Send with multiplicity 1.
    .eval(builder, AB::F::from_canonical_u32(1));
```

This modified circuit sends a wrong XOR input/output pair to the bus \( p \) times in each row of the ALU core chip. Obviously, in practice, the attacker would not be able to modify the circuit ALU but would need to:
- Provide wrong witnesses to existing bus sends and make sure that this happens often enough to reach \( p \), or...
- Design a malicious OpenVM extension, e.g., one with many sends that the prover can easily control. Note that doing so could break the results of other extensions.

We validated that chips of size \( 2^{25} \) are accepted by the verifier. To compute such proofs, one simply has to modify the `should_segment` function. Beyond that, we ran into a Plonky3 error because the requested domain was larger than the 2-addicity of BabyBear, as mentioned above.

## Update: Missing Verifier Check on Number of Bus Sends
To validate that OpenVM does not already implement the check suggested below, we applied this diff:

```diff
diff --git a/extensions/rv32im/circuit/src/base_alu/core.rs b/extensions/rv32im/circuit/src/base_alu/core.rs
index ea91e865f..b209bb3ed 100644
--- a/extensions/rv32im/circuit/src/base_alu/core.rs
+++ b/extensions/rv32im/circuit/src/base_alu/core.rs
@@ -138,6 +138,13 @@ where
    .eval(builder, is_valid.clone());
}
+ let zero = AB::F::from_canonical_u8(0);
+ for _ in 0..2028 {
+     self.bus
+         .send_xor(zero, zero, zero)
+         .eval(builder, is_valid.clone());
+ }
+
let expected_opcode = VmCoreAir::<AB, I>::expr_to_global_expr(
    self,
    flags.iter().zip(BaseAluOpcode::iter()).fold(
@@ -228,6 +235,10 @@ where
writes: [a.map(F::from_canonical_u32)].into(),
};
+ for _ in 0..2048 {
+     self.bitwise_lookup_chip.request_xor(0, 0);
+ }
+
if local_opcode == BaseAluOpcode::ADD || local_opcode == BaseAluOpcode::SUB {
    for a_val in a {
        self.bitwise_lookup_chip.request_xor(a_val, a_val);
```

Running the Fibonacci example on input `0xFFFF300000000000` leads to a `BaseAluCoreAir` of size \( 2^{22} \) of which we assume at least half (\( 2^{21} \)) are used (i.e., is_valid is 1). Because the updated chip performs \( 2^{11} \) send operations per row, it amounts to \( 2^{32} \) sends to the bus, which is not rejected by the verifier.

## Recommendation
There should be carefully calculated limits on what chip sizes the verifier accepts. These would depend on the number of bus sends (on the same bus) in each Chip. To make these limits less tight, one could introduce new copies of the same machine (with a different bus ID).

## OpenVM
This fix required changes in `stark-backend` as well as `openvm`, see the following commits:
- 2649571c.
- c662bccd (spec updates explaining fix in interactions.md).
- 0c26106f (openvm changes for interface and recursive verifier).

## Description of Fix
- Use the new bus types from `stark-backend` to set vkey constraints on trace heights.
- The recursive verifier checks the inequalities imposed, as explained in the new Interactions spec and PDF with soundness proofs.
- The recursive verifier checks the LogUp proof-of-work witness.

## Cantina Managed
Fix verified.
