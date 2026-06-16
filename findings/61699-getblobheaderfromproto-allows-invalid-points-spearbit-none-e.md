---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/restaking
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[circuit-input-range-check]]"
---
# GetBlobHeaderFromProto allows invalid points

- id: 61699
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This report highlights a high risk vulnerability in the `utils.go` file of the `node/grpc` module. The vulnerability is caused by manually setting the components/limbs of certain points without checking if they are valid. This can potentially impact pairing checks and may lead to security issues. The report recommends either casting the values to `bn254.G*Affine` and performing checks, or using compressed serialization and `bn254.G*Affine#SetBytes` to address this issue. 

## Details

## High Risk Vulnerability Report

## Severity
**High Risk**

## Context
- `node/grpc/utils.go#L65-L66`
- `node/grpc/utils.go#L73-L76`
- `node/grpc/utils.go#L79-L82`

## Description
In `GetBlobHeaderFromProto`, the components/limbs (X, Y) of the points (Commitment, LengthCommitment, and LengthProof) are manually set. Doing it this way will not check if the point is valid (on the curve, in the right subgroup, etc). This may actually impact pairing checks. Eventually, this point is casted to `abn254.G1Affine` which won't check if the point is valid either.

Also, just a little nit, `h.GetLengthCommitment() != nil` and `h.GetLengthProof() != nil` checks are unnecessary as protobuf getter functions are guaranteed not to return nil.

## Recommendation
Either of the following:
1. In `GetBlobHeaderFromProto`, cast the values to `bn254.G*Affine` and call `p.IsOnCurve()` and `p.IsInSubGroup()`.
2. Use compressed serialization and `bn254.G*Affine#SetBytes` which performs these checks.
