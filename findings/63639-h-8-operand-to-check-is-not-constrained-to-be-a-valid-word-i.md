---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/infra
  - sector/zk
protocol: "[[Brevis]]"
auditors:
  - "[[1AutumnLeaf777]]"
report: "https://github.com/sherlock-audit/2025-08-pico-judging"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[circuit-constraint-completeness]]"
  - "[[circuit-input-range-check]]"
---
# H-8: `operand_to_check` is not constrained to be a valid word in `eval_ecall`

- id: 63639
- impact: HIGH
- protocol: [[Brevis]] Pico ZKVM
- reporter: 1AutumnLeaf777 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `FieldWordRangeChecker` in the `pico` virtual machine. The report explains that the checker assumes the argument to be a valid word, but there are no constraints in place to ensure this. This allows a malicious user to provide invalid limbs and bypass the range check. The root cause of this issue is identified as the lack of constraints in the `eval_ecall` function. The report also mentions that there are no internal or external pre-conditions for this bug. The attack path is described as the prover providing an invalid word for the `operand_to_check` which can affect the behavior of ecalls and break soundness guarantees. A proof of concept was not provided by the team. To mitigate this issue, it is recommended to ensure that each limb in `operand_to_check` is a valid `u8`.

## Details


Source: https://github.com/sherlock-audit/2025-08-pico-judging/issues/221 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
1AutumnLeaf777

### Summary

The `FieldWordRangeChecker` assumes that the argument to check will be a valid word, however there is nothing constraining `operand_to_check` to abide by this inside `eval_ecall`. A malicious prover can thus provide invalid limbs as the witness to the range checker which allows a prover to violate the range check.

### Root Cause

https://github.com/sherlock-audit/2025-08-pico/blob/main/pico/vm/src/chips/chips/riscv_cpu/ecall/constraints.rs#L103-L110 as we can see there are no constraints that the `operand_to_check` is a valid word, however this is a requirement  for the `FieldWordRangeChecker`, as there are no constraints that the word passed in is actually valid. Every other chip that invokes the word range check also invokes the ALU via the lookup argument, which thus implicitly constrains the argument as the ALU range checks its operands. However no call is present for `operand_to_check`.


### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. The prover provides an invalid word for the `operand_to_check` as long as the top limb is an actual byte equal to `cols.most_sig_byte_decomp` and that the sum of each limb is equal to zero. This lets invalid words be passed in for any ecall invocation that isn't halt or commit.

### Impact

Ecalls do not have to take in valid words, which can arbitrarily effect their behavior especially if host programs use ecall to call SP1 precompiles. This breaks soundness guarantees.

### PoC

_No response_

### Mitigation

Ensure that each of the limbs in `operand_to_check` is a valid `u8`
