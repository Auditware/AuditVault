---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#4-potential-dos-of-messages-in-the-postdispatch-function"
genome:
  - "[[dos-resistance]]"
  - "[[add-access-control]]"
---
# Potential DoS of messages in the `postDispatch` function

- id: 55411
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#4-potential-dos-of-messages-in-the-postdispatch-function

## Summary


The report states that there is a bug in the `postDispatch()` function of the `ProtocolFeeHook` contract. This function is used to update a mapping and prevent double-processing of a `messageId`. However, the function does not have any checks for the caller's address, which means that anyone can call it and provide a `messageId` before it is processed by the protocol. This can cause the original message to not be accepted when it arrives. The bug is classified as high severity because it can lead to a denial of service for message delivery. The recommendation is to add an access control check to the function to ensure that it can only be called by the trusted `Mailbox`.

## Details

##### Description
The `postDispatch()` function of the `ProtocolFeeHook` contract lacks access control check.

The function updates the `messageValidated` mapping and marks `messageId` as validated to prevent double-processing. But that function is defined as `external` without any checks for the caller address, so that anyone can call it and provide an actual `messageId` before its processing by the protocol, what will lead to not-accepting the original message when it is arrived.

The issue is classified as **High** severity, because it may lead to messages delivery DoS.

##### Recommendation
We recommend adding the access control check to the `postDispatch` function to ensure that it may be called only by the trusted `Mailbox`.
