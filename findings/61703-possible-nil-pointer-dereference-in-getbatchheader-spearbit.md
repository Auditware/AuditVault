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
  - "[[missing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Possible nil pointer dereference in GetBatchHeader

- id: 61703
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


The bug report explains that there is a high risk bug in the code at line 24 in the file "utils.go". The issue occurs when a certain function called "GetBatchHeader" is used and the variable "BatchHeader" is accessed, which could potentially be empty. To fix this issue, it is recommended to use a specific type of function called "protobuf getter functions" instead.

## Details

## Severity: High Risk

## Context
`node/grpc/utils.go#L24`

## Description
In `GetBatchHeader`, when `in.BatchHeader.ReferenceBlockNumber` is accessed, `BatchHeader` could be nil.

## Recommendation
Use protobuf getter functions, like `in.GetBatchHeader().GetReferenceBlockNumber()`.
