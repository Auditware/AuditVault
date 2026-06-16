---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/infra
  - sector/restaking
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[boundary]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Possible index out of range in GetBlobMessages

- id: 61702
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report is about an issue in a code file called `utils.go` in a program called `node`. The problem is that if there are more Bundles (a type of data) than QuorumHeaders (another type of data), the program will crash with an error message. This is considered a high risk because it could cause the program to stop working. The recommendation is to add a check to make sure the length of these two fields is the same before the program tries to use them.

## Details

## Severity: High Risk

## Context
`node/grpc/utils.go#L44`

## Description
If there are more Bundles than QuorumHeaders, this will panic with an index out of range error. This is only a high because it's part of the node, not the disperser.

## Recommendation
Check that the length of these fields are equal before the loop.
