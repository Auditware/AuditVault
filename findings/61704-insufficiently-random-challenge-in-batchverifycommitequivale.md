---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/restaking
  - sector/zk
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[weak-randomness]]"
---
# Insufficiently random challenge in BatchVerifyCommitEquivalence

- id: 61704
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report is about a high-risk issue in a code file called `batch_commit_equivalence.go`. The problem is that when generating a value called `randomFr`, the code only uses a part of the necessary information, which can be influenced by the person running the code. The recommendation is to use a different method for generating randomness to avoid this issue.

## Details

## Severity: High Risk

**Context:** `encoding/kzg/verifier/batch_commit_equivalence.go#L28-L47`

**Description:** When generating `randomFr`, it is not enough to only hash the commitments. You must include everything that the verifier uses and the prover can influence.

**Recommendation:** Use `crypto/rand` for randomness instead of Fiat-Shamir.
