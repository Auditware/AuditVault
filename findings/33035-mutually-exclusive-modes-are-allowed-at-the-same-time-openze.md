---
tags:
  - platform/openzeppelin
  - has/github
  - lang/solidity
  - severity/high
  - sector/infra
protocol: "[[SphereX]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/spherex-audit"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
---
# Mutually Exclusive Modes are Allowed at the Same Time

- id: 33035
- impact: HIGH
- protocol: [[SphereX]] Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/spherex-audit

## Summary


The bug report discusses an issue where two operational modes can be activated at the same time, causing conflicts. These modes have different resetting logics and are meant to operate separately, but the current implementation allows them to be activated together. The report suggests using an Enum implementation or adding input validation to prevent this issue. The bug has been resolved in a recent pull request.

## Details

Both operational modes can be activated simultaneously, which leads to a conflict as their resetting logics are mutually exclusive. Specifically, one mode resets with each new transaction, while the other resets at each external call. The existing documentation further indicates that these modes are intended to operate individually rather than concurrently.


Consider adopting an Enum implementation for the modes to enforce exclusivity. Alternatively, input validation can be added on mode setters to prevent invalid configurations.


***Update**: Resolved in [pull request #10](https://github.com/spherex-collab/spherex-protect/pull/10) at commit [d221420](https://github.com/spherex-collab/spherex-protect/pull/10/commits/d221420d094bcebd323ce2f93a778fafb70a95db).*
