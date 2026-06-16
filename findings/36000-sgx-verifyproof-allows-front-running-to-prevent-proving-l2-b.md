---
tags:
  - lang/solidity
  - sector/zk
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/mev/frontrun
  - precondition/insider
  - fix/add-access-control
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[insider]]"
  - "[[add-access-control]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[circuit-dos-invalid-proof]]"
---
# SGX verifyProof() Allows Front-running To Prevent Proving L2 Blocks

- id: 36000
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary


Summary:

The function verifyProof() in the smart contract TaikoL1 can be accessed by any user, instead of just the intended caller. This can lead to delays in block proving and potential DoS attacks. It is recommended to add access control to the function, but this may be complicated due to the use of SGX instances. The issue has been resolved by restricting access to TaikoL1 and higher tier proofs. 

## Details

## Description

The function `verifyProof()` is front-runnable by arbitrary users to prevent proving of a block. There is no access control on the function `verifyProof()`. The intended caller is the smart contract `TaikoL1`, however, it is possible for any user to mimic the call from `TaikoL1`.

`verifyProof()` is a stateful function which will modify the address of an instance via `_replaceInstance(id, oldInstance, newInstance)`. As a result, if a malicious user calls `verifyProof()` before `TaikoL1` calls `verifyProof()`, the call from `TaikoL1` will revert due to an invalid instance address.

The impact of calling `verifyProof()` is that the prover’s call to `TaikoL1.proveBlock()` will fail. While it is difficult to maintain a DoS attack involving front-running for an extended period of time, this may cause delays to block proving, potentially preventing assigned provers or contesters from proving blocks within the assigned windows.

## Recommendations

It is recommended to add access control such that `verifyProof()` can only be called via `TaikoL1` or as part of other verifiers in the tiered proving hierarchy. However, it is important to note that an SGX instance may clear its private key after signing. If this is the case, an instance will require an alternate method of updating their key to account for the case where another user has already verified the block. That is because it is not possible to call `proveBlock()` twice at the same block height without contesting or increasing the proof tier.

## Resolution

Access control of the function `verifyProof()` has been restricted to `TaikoL1` and higher tier proofs in PR #15514.
