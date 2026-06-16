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
  - "[[griefing]]"
  - "[[temporary]]"
  - "[[access-roles]]"
---
# (s *DispersalServer) validateBlobRequest contains externally triggerable data race

- id: 61698
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


The report identifies a critical risk bug in the disperser's server code. The issue is in the `validateBlobRequest` function, where multiple reads of the `quorumCount` variable are made without a lock. This could lead to a data race and potentially bring down the disperser. The solution suggested is to either move the locks up into the function or use a thread-unsafe version of the `updateQuorumCount` function.

## Details

## Severity: Critical Risk

## Context 
`disperser/apiserver/server.go#L181`

## Description 
In `(s *DispersalServer) validateBlobRequest` there are multiple reads of `s.quorumCount` without a lock. This is externally reachable via the DispersalServer API, so a data race could bring down the disperser. 

`s.quorumCount` is guarded by a mutex inside `s.updateQuorumCount()` which is called between these reads. Due to this, the locks cannot be wrapped around this function without causing a deadlock. Either those locks should be moved up into this function to broaden the critical section, or a thread-unsafe version of `s.updateQuorumCount()` needs to be used here.

## Recommendation 
Refactor this function to lock on the reads and releases in question (before calling `s.updateQuorumCount()`) or make some other variation of this that guards the `s.quorumCount` shared data appropriately.
