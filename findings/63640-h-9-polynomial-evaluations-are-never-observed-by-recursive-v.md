---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[1AutumnLeaf777]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# H-9: Polynomial evaluations are never observed by recursive verifier

- id: 63640
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: 1AutumnLeaf777 (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found by user 1AutumnLeaf777 on the pico-judging project. The bug allows a malicious prover to forge a proof by manipulating opening arguments in the recursive verifier. This is due to incorrect fiat-shamir observations in the recursive verifier, which allows the prover to spoof openings during batch checks. The impact of this bug is that the soundness of the recursive verifier is completely bypassed. The protocol team has fixed the issue in the project's code.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/226 

## Found by 
1AutumnLeaf777

### Summary

Incorrect fiat-shamir observations in the recursive verifier allow a malicious prover to forge a proof 

### Root Cause

https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/compiler/recursion/circuit/fri.rs#L84-L87
We can see we immediately observe the extension field element from the challenger without observing each of the round constants like in SP1:
https://github.com/succinctlabs/sp1/blob/28ee277e048e49ebdc608f63a1f6b77240e0668f/crates/recursion/circuit/src/fri.rs#L82-L94
This incorrect fiat shamir ordering allows a malicious prover to forge proofs by spoofing openings during the batch check. https://github.com/succinctlabs/sp1/security/advisories/GHSA-c873-wfhp-wx5m

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Prover can forge malicious proofs in the recursive verifier by manipulating opening arguments to cancel out  (this is extremely technical and I do not pretend to understand the exact mathematics involved but based on the above linked GHSA I am sure it is possible)

### Impact

Soundness of the recursive verifier is completely bypassed

### PoC

_No response_

### Mitigation

Observe each of the evaluations into the challenger

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
