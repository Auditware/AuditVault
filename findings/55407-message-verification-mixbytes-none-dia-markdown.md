---
tags:
  - lang/solidity
  - sector/oracle
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#2-message-verification"
genome:
  - "[[bridge-message-validation]]"
  - "[[cross-protocol]]"
---
# Message Verification

- id: 55407
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#2-message-verification

## Summary


The report describes a serious problem with the `ISM` contract, specifically with the `verify` function. This vulnerability could allow untrusted addresses to manipulate data processed by the `Mailbox` `process` function. There is also a dangerous parameter called `allowAll` which, if enabled, could allow malicious users to submit oracle data. This issue is considered critical because it could result in disruptions or losses for the protocols using the `ISM` contract. The report recommends adding caller verification for the `Mailbox` contract in the `verify` function and removing the `allowAll` logic to improve security.

## Details

##### Description
A critical security vulnerability has been identified within the `verify` function of the `ISM` (Interchain Security Module) contract. The ISM doesn't verify the caller of the `Mailbox` `process` function, which could allow untrusted addresses to pass an arbitrary message to the `Mailbox`, ultimately leading to potential manipulation of the data that will be processed.
There is also a dangerous parameter `allowAll`, which may lead to anyone malicious submitting oracle data if enabled.
This issue is classified as **Critical** because it could lead to manipulation of critical data processed by the `process` function, which could result in unpredictable disruptions or severe losses in the integrated protocols.

##### Recommendation
We recommend adding caller verification of the `Mailbox` contract within the `verify` function. It should ensure that the caller is indeed a trusted address. We also recommend removing the logic related to the `allowAll` flag as it may affect the protocol security badly.
