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
# Insufficiently random challenge in UniversalVerify

- id: 61705
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report is about a high risk issue in the code for encoding/kzg/verifier/multiframe.go. The problem is that when generating `randomFr`, the code only hashes the sample commitments, but it should also include other factors that can be influenced by the prover, such as chunk length, sample data, commitments, proofs, and indices. The recommendation is to use `crypto/rand` instead of Fiat-Shamir for randomness.

## Details

## High Risk Report

## Severity
**High Risk**

## Context
`encoding/kzg/verifier/multiframe.go#L36-L48`

## Description
When generating `randomFr`, it is not enough to only hash the sample commitments. You must include everything that the verifier uses and the prover can influence. This includes the chunk length, sample data, commitments, proofs, indices, etc.

## Recommendation
Use `crypto/rand` for randomness instead of Fiat-Shamir.
