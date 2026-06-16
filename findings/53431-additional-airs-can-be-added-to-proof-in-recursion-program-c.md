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
  - "[[proof-input-validation]]"
  - "[[circuit-constraint-completeness]]"
  - "[[input-validation/missing]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Additional airs can be added to proof in recursion program 

- id: 53431
- impact: HIGH
- protocol: OpenVM
- reporter: cergyk (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_openvm_january2025.pdf

## Summary


The bug report describes an issue in the code related to dynamic configuration. When using this feature, an arbitrary number of proofs can be provided, but the code is not properly checking the number of proofs against the number of chips used during key generation. This can result in an out-of-bounds access error, which may not fail but can cause other issues. The report suggests adding a constraint to prevent the prover from providing more proofs than AIRs. This issue has been fixed in a recent commit and has been verified by Cantina Managed.

## Details

## Context
`mod.rs#L281-L291`

## Description
When using dynamic configuration (`builder.flags.static_only == false`), an arbitrary number of proofs per_air can be provided (independently of the number of chips used during key generation). However, as the chips used during keygen are matched to these proofs by index, the access made to match the additional chip is made out-of-bounds:

### Code Snippet
```rust
// Build domains
let domains = builder.array(num_airs);
let quotient_domains = builder.array(num_airs);
let trace_points_per_domain = builder.array(num_airs);
let quotient_chunk_domains = builder.array(num_airs);
let num_quotient_mats: Usize<_> = builder.eval(RVar::zero());
//@audit num_airs is the number of airs provided in the proof
builder.range(0, num_airs).for_each(|i_vec, builder| {
    let i = i_vec[0];
    //@audit get the air proof by index
    let air_proof = builder.get(air_proofs, i);
    let log_degree: RVar<_> = air_proof.log_degree.clone().into();
    //@audit get the verifier data by index, but in this case, `m_advice_var.per_air` is shorter than `air_proofs`,→
    //@audit last access is undefined (but does not fail)
    let advice = builder.get(&m_advice_var.per_air, i);
});
```

Please note that due to the complex nature of the recursion DSL, we have only been able to verify some hypotheses. For example, that the additional out-of-bound access does not fail in the recursion program. It should be possible to influence the cumulative sum and add a term which cancels it:

### Code Snippet
```rust
fn assert_cumulative_sums<C: Config>(
    builder: &mut Builder<C>,
    air_proofs: &Array<C, AirProofDataVariable<C>>,
    num_challenges_to_sample: &Array<C, Usize<C::N>>,
) {
    let num_phase = num_challenges_to_sample.len();
    // Currently only support 0 or 1 phase is supported.
    builder.if_eq(num_phase, RVar::one()).then(|builder| {
        let cumulative_sum: Ext<C::F, C::EF> = builder.eval(C::F::ZERO);
        builder
            //@audit the range is based on proof length
            .range(0, air_proofs.len()) // <<<
            .for_each(|i_vec, builder| {
                let i = i_vec[0];
                let air_proof_input = builder.get(air_proofs, i);
                //@audit the additional exposed value will be added to cumulative_sum
                let exposed_values = air_proof_input.exposed_values_after_challenge;
                // ... cumulative sum logic
            })
            // ... cumulative sum logic
    });
}
```

Whereas the associated verification of exposed values will only be observed by challenger if there is an exposed value on the verification key:

### Code Snippet
```rust
builder.if_eq(num_phases, RVar::one()).then(|builder| {
    let phase_idx = RVar::zero();
    let num_to_sample = RVar::from(2);
    let provided_num_to_sample = builder.get(&num_challenges_to_sample, phase_idx);
    builder.assert_usize_eq(provided_num_to_sample, num_to_sample);
    let challenges: Array<C, Ext<C::F, C::EF>> = builder.array(num_to_sample);
    // Sample challenges needed in this phase.
    builder.range(0, num_to_sample).for_each(|i_vec, builder| {
        let challenge = challenger.sample_ext(builder);
        builder.set_value(&challenges, i_vec[0], challenge);
    });
    builder.set_value(&challenges_per_phase, phase_idx, challenges);
    //@audit iterate over the number of airs provided in the proof
    builder.range(0, num_airs).for_each(|j_vec, builder| {
        let j = j_vec[0];
        //@audit get air_advice by index (last one does not exist)
        let air_advice = builder.get(&m_advice_var.per_air, j);
        builder
            .if_ne(
                //@audit if the last index does has num_exposed_values_after_challenge == 0, the proof
                // value will not be observed,→
                air_advice.num_exposed_values_after_challenge.len(), // <<<
                RVar::zero(), // <<< 
            )
            .then(|builder| {
                ... //@audit challenger observe exposed value after challenge
            });
    });
    // Observe single commitment to all trace matrices in this phase.
    let commit = builder.get(after_challenge_commits, phase_idx);
    challenger.observe_digest(builder, commit);
});
```

This would allow for manipulating the cumulative sum, and help pass the sum check even if interactions do not cancel out.

## Recommendation
The number of airs provided in the proof should be checked against the advice per_air length.

## OpenVM
Fixed in commit `a801e40f`, the fix adds a constraint to enforce that `m_advice_var.per_air.len() <= m_advice.per_air.len()`, preventing the prover from providing more proofs than AIRs.

## Cantina Managed
Fix verified.
