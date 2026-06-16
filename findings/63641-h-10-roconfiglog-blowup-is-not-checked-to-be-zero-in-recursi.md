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
  - "[[wrong-state]]"
  - "[[access-roles]]"
---
# H-10: ro[config.log_blowup] is not checked to be zero in recursive verifier

- id: 63641
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: 1AutumnLeaf777 (Sherlock)
- source: N/A

## Summary


The bug report is about a missing check in the recursive verifier, which is used to ensure the validity of reduced openings in a cryptographic protocol. The root cause of the bug is a missed check in the code, which allows a malicious user to construct domains of size 1 and bypass the verification process. This can lead to a compromise of the security guarantees of the protocol. The bug has been fixed by the protocol team in a recent update.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/228 

## Found by 
1AutumnLeaf777

### Summary

The recursive verifier is missing a check that asserts the validity of the reduced openings 

### Root Cause

https://github.com/succinctlabs/sp1/blob/28ee277e048e49ebdc608f63a1f6b77240e0668f/crates/recursion/circuit/src/fri.rs#L219 as we can see there is a final check that ro[config.log_blowup] is equal to zero in the extension field however this check is missed here:
https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/compiler/recursion/circuit/fri.rs#L212-L231
This allows a malicious prover to construct domains of size 1 and provide reduced openings on that domain, which allow them to bypass FRI verification

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

The prover can set the values of each domain to have size 1 meaning that queries on them yield the same point, which allows him to bypass the query verification logic

### Impact

The recursive verifier does not have soundness guarantees especially with respect to the simulation of the PCS

### PoC

_No response_

### Mitigation

Add the check that the ro[config.log_blowup] is 0 to ensure domains of size 1 cannot be created 

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/brevis-network/pico/pull/61
