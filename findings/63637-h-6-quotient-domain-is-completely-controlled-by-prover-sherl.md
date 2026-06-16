---
tags:
  - lang/rust
  - sector/zk
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Brevis]]"
auditors:
  - "[[1AutumnLeaf777]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[missing-check]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
# H-6: Quotient domain is completely controlled by prover

- id: 63637
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: 1AutumnLeaf777 (Sherlock)
- source: N/A

## Summary


The bug report discusses a problem with a program called Pico. The issue was found by a user named AutumnLeaf777 and it allows the prover to choose the size of the quotient domains instead of having them be taken from the trace size of each chip. This can lead to invalid statements being accepted by the verifier, which violates the soundness of the program. The root cause of the issue is that the `quotient_degree` variable is controlled entirely by the prover, unlike in a similar program called SP1. This allows the prover to set the quotient domain to be arbitrarily sized, making it easier for them to bypass certain checks. The impact of this bug is that it can compromise the security of the program. The discussion section mentions that the protocol team has fixed this issue in a recent update. 

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/199 

## Found by 
1AutumnLeaf777

### Summary

The prover is allowed to choose the size of the quotient domains instead of having them be taken from the trace size of each chip

### Root Cause

We can see the `quotient_degree` variable https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/machine/verifier.rs#L72 is controlled entirely by the prover as opposed to the trace size like in SP1:
https://github.com/succinctlabs/sp1/blob/28ee277e048e49ebdc608f63a1f6b77240e0668f/crates/stark/src/verifier.rs#L32-L59
This lets the prover set the quotient domain to be arbitrarily sized, which breaks the underlying soundness of the FRI PCS.

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Prover sets the log_quotient_degrees to 0
2. Prover modifies the evaluations of the polynomial, which are easily computable as they are on a much smaller domain, which allows him to easily bypass the colinearity check


### Impact

Invalid statements can be accepted by the verifier violating soundness

### PoC

_No response_

### Mitigation

Ensure that the quotient degrees are taken from the length of the chips and not supplied as a prover trusted input 

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
