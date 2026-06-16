---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/staking
  - sector/governance
  - platform/sherlock
  - lang/solidity
  - lang/rust
protocol: "[[SEDA Protocol]]"
auditors:
  - HarryBarz
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[proposal-cancellation-abuse]]"
  - "[[dos-resistance]]"
  - "[[governance/proposal-manipulation]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[governance-vote]]"
  - "[[add-check]]"
  - "[[precondition/governance-quorum-reachable]]"
  - "[[blast-radius/protocol-wide]]"
---
# H-18: ASA-2025-003: Groups module can halt chain when handling a malicious proposal

- id: 55245
- impact: HIGH
- protocol: SEDA Protocol
- reporter: HarryBarz (Sherlock)
- source: N/A

## Summary


The issue reported is a bug in the Groups module of the Cosmos SDK, which can cause the chain to halt when handling a malicious proposal. The bug was found by four individuals and has been classified as medium severity. It affects versions 0.47.15 and 0.50.11 and can impact validators, full nodes, and users on chains that use the Groups module. The bug has been fixed in the latest release of the Cosmos SDK, and there are no known workarounds. The bug was reported to the Cosmos Bug Bounty Program and was triaged and validated by the Core team. The fix was made available on February 20, 2025, and more information can be found on the Cosmos SDK repository.

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/271 

## Found by 
4n0nx, Boy2000, HarryBarz, x0lohaclohell

### Summary

## cosmos sdk recently publish a bug (https://github.com/cosmos/cosmos-sdk/security/advisories/GHSA-x5vx-95h7-rv4p) and its mandatory for protocols to update
**As its already has been published by the cosmos group but the protocol didnt update I consider it as a medium not high**

Name: ASA-2025-003: Groups module can halt chain when handling a malicious proposal
Component: CosmosSDK
Criticality: High (Considerable Impact; Likely Likelihood per [ACMv1.2](https://github.com/interchainio/security/blob/main/resources/CLASSIFICATION_MATRIX.md))
Affected versions: <= v0.47.15, <= 0.50.11
Affected users: Validators, Full nodes, Users on chains that utilize the groups module
Description

An issue was discovered in the groups module where a malicious proposal would result in a division by zero, and subsequently halt a chain due to the resulting error. Any user that can interact with the groups module can introduce this state.
Patches

The new Cosmos SDK release [v0.50.12](https://github.com/cosmos/cosmos-sdk/releases/tag/v0.50.12) and [v0.47.16](https://github.com/cosmos/cosmos-sdk/releases/tag/v0.47.16) fix this issue.
Workarounds

There are no known workarounds for this issue. It is advised that chains apply the update.
Timeline

    February 9, 2025, 5:18pm PST: Issue reported to the Cosmos Bug Bounty program
    February 9, 2025, 8:12am PST: Issue triaged by Amulet on-call, and distributed to Core team
    February 9, 2025, 12:25pm PST: Core team completes validation of issue
    February 18, 2025, 8:00am PST / 17:00 CET: Pre-notification delivered
    February 20, 2025, 8:00am PST / 17:00 CET: Patch made available

This issue was reported to the Cosmos Bug Bounty Program by [dongsam](https://github.com/dongsam) on HackerOne on February 9, 2025. If you believe you have found a bug in the Interchain Stack or would like to contribute to the program by reporting a bug, please see https://hackerone.com/cosmos.

If you have questions about Interchain security efforts, please reach out to our official communication channel at [security@interchain.io](mailto:security@interchain.io). For more information about the Interchain Foundation’s engagement with Amulet, and to sign up for security notification emails, please see https://github.com/interchainio/security.

A Github Security Advisory for this issue is available in the Cosmos SDK [repository](https://github.com/cosmos/cosmos-sdk/security/advisories/GHSA-x5vx-95h7-rv4p).

### Root Cause

.

### Internal Pre-conditions

.

### External Pre-conditions

.

### Attack Path

.

### Impact

.

### PoC

_No response_

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain/pull/517
