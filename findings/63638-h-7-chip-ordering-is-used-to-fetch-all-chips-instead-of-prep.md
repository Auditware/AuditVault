---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/zk
auditors:
  - "[[1AutumnLeaf777]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
protocol: "[[Brevis]]"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[circuit-constraint-completeness]]"
  - "[[zk-soundness-bigint]]"
---
# H-7: Chip ordering is used to fetch all chips instead of preprocessed ones

- id: 63638
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: 1AutumnLeaf777 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by user 1AutumnLeaf777, where the prover provided `chip_ordering` allows for a prover to only provide specific chips to be opened, rather than providing the opening values for every chip. This can lead to invalid proofs being accepted by the verifier. The root cause of this issue is that the chips used in the `verify_shard` function are entirely controlled by the prover. This can be exploited by an attacker by specifying the chip ordering for only one specific chip and manipulating the opened values and traces accordingly. The impact of this bug is that invalid proofs of execution can be accepted by the verifier. The protocol team has fixed this issue in the following PRs/commits: https://github.com/brevis-network/pico/pull/61.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/204 

## Found by 
1AutumnLeaf777

### Summary

The prover provided `chip_ordering` allows for a prover to only provide chips that they would like opened rather than the opening values for every chip. 

### Root Cause

We can see that the chips that will be used in the `verify_shard` function are created here:
https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/machine/verifier.rs#L77
This is entirely prover controlled and thus similar to the previous issue #4 we can see that the prover can selectively provide openings for some chips and not for the entire execution.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Attacker specifies the chip ordering to be only for one specific chip
2. They manipulate the opened values and traces accordingly like in issue #4

### Impact

Invalid proofs of execution are accepted by the verifier

### PoC

_No response_

### Mitigation

Ensure that the chip ordering is used only to validate against preprocessed chips

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
