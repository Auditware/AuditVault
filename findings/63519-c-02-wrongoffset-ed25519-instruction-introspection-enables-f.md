---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/access-control/missing-signer
  - novelty/variant
  - misassumption/admin-is-honest
  - lang/anchor
protocol: "[[Enclave]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Enclave-security-review_2025-10-25.md"
genome:
  - "[[missing-signer]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
---
# [C-02] Wrong‑Offset Ed25519 instruction introspection enables forged approvals

- id: 63519
- impact: HIGH
- protocol: Enclave_2025-10-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Enclave]]-security-review_2025-10-25.md

## Summary


The report discusses a bug found in a program that accepts off-chain approvals by verifying an Ed25519 signature. The current verifier does not perform essential validations, allowing attackers to craft preceding instructions that cause the program to accept invalid signatures. This can result in unauthorized borrows from the pool and block legitimate users from redeeming their approvals. The recommendation is to harden the verification process by checking the previous instruction's program ID, only allowing one signature and no auxiliary accounts, using inline mode, and checking for matching public key, message, and signature.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

The program accepts off‑chain approvals by “verifying” an Ed25519 signature via the instruction sysvar: `borrow` expects the previous instruction in the same transaction to be a native Ed25519 verification and then inspects that instruction’s raw data to decide whether the signature is valid.

However, the current verifier does not perform the essential validations that make this pattern sound:

* It does not assert that the previous instruction’s `program_id` is the native Ed25519 program.
* It does not enforce “inline mode” by requiring the three `*_instruction_index` fields in `Ed25519SignatureOffsets` to be `0xFFFF` (meaning use data from this very Ed25519 instruction).
* It relies on reading specific byte ranges inside the Ed25519 instruction data, but does not validate that the supplied offsets and sizes actually point to those ranges.

On Solana, the Ed25519 verifier is flexible: the instruction can specify offsets and instruction indexes for where to read the signature, public key, and message. If a contract does not validate those fields, an attacker can craft a preceding instruction that causes the Ed25519 program to verify a signature over attacker‑controlled data, while placing benign‑looking bytes (the expected signer pubkey, message hash, signature) at the locations your program later checks. Your verifier will then return success even though no signature from an authorized signer was actually validated.

As a result, any caller can submit a transaction that includes a maliciously constructed “verification” instruction immediately before `borrow` and have the program accept it as valid. That enables unauthorized borrows from the pool and increments the user’s nonce, potentially blocking the legitimate user from later redeeming a genuine approval.

## Recommendations

Harden the Ed25519 verification to treat the previous instruction as valid evidence only if all of the following are true:

* The previous instruction’s `program_id` is the native Ed25519 program.
* The instruction encodes exactly one signature and carries no auxiliary accounts.
* All three `*_instruction_index` fields in `Ed25519SignatureOffsets` are `0xFFFF` (inline mode), so the signature, public key, and message are taken from the same Ed25519 instruction.
* All offsets and sizes are bounds‑checked against the instruction data length before slicing.
* The inline public key, message, and signature bytes exactly match the expected authorized signer and message.
* If `borrow` is the first instruction, reject (there is no “previous” verification to inspect).
