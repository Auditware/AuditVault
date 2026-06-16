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
  - "[[missing]]"
  - "[[temporary]]"
  - "[[quorum-supply-drift]]"
---
# validateChurnRequest allows limitless, duplicate QuorumIds

- id: 61701
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


A function in the code is not properly limiting the length of a certain type of data and is allowing duplicates. This can lead to a large amount of memory and disk space being used, potentially causing issues. It is recommended to check the length and for duplicates to prevent this from happening.

## Details

## Severity: High Risk

## Context
`operators/churner/server.go#L147-L162`

## Description
This function does not enforce a length limit and seems to allow duplicates, as long as they are valid. When logged in `server.go#L69`, it is possible to log ~300 MiB (the message size limit) worth of `uint32` values to the file/console. As a string, this could be very large and use up a lot of memory & disk space.

## Recommendation
Check if the length of `QuorumIds` is greater than the max quorum count and check for duplicates.
