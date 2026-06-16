---
tags:
  - lang/solidity
  - sector/account
  - platform/cantina
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Enable mode can be frontrun to add policies for a different permissionId 

- id: 42062
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The SmartSession contract has a feature called "enable mode" which allows a smart account to enable policies within the same call as the related actions. However, there is a bug where the permissionID, which is used to validate the call, is not included in the signature digest and is not checked against the session information. This means that a malicious user can change the permissionID in the signature and successfully execute the call, stealing policies intended for a different user. This exploit requires the permissionID of the malicious user to be installed in some way, the same signerNonce for both permissionIDs, and potentially depends on the sessionvalidator implementation. The recommendation is to add the permissionID to the getAndVerifyDigest() function and move a check to ensure that the permissionID is always associated with the enableData. The bug has been fixed in a pull request and has been verified by Cantina Managed.

## Details

## SmartSession Vulnerability Overview

## Context
SmartSession.sol#L139-L213

## Description
SmartSession offers an enable mode for when a smart account wants to enable policies within the same call when the related actions get executed. In this case, it first enables the required policies during the validation phase and enforces them as well to allow desired actions during the execution phase of the same call.

`SmartSession::_enablePolicies()` handles this flow. This logic uses a separate enable-signature to validate that the call was authorized from the `userOp.sender`. The `permissionID` is first parsed from `userOp.signature` in `validateUserOp()`, and then it is further decoded inside `_enablePolicies()` to get `enableData` which has all the info about the session to be enabled.

The problem is that this `permissionID` is not included in the signature digest. Moreover, it is not checked to be equivalent to the `enableData` session information. Even if the `permissionID` encoded into `userOp.signature` is changed, the operation will go on smoothly.

As a result, when a smart account wants to add policies to a session X, they sign a call and send it. A bundler/malicious user sees the call and frontruns it to replace `permissionID` in the packed `userOp.signature`. Since `userOp.signature` is not a part of the `userOphash`, nothing changes for the signature validation process.

Hence, the operation goes through, and the policies that were intended for permission X go through and get installed on `permissionID` Y of the caller's choice.

### Exploit Requirements
This exploit has three requirements:
1. The `permissionID` of the malicious caller also needs to be installed in some way for the smart account.
2. The `$signerNonce` for `permissionID` Y is the same as the original `permissionID` X.
3. Depends on the `sessionValidator` implementation. If both are using the same, this exploit can work.

This problem could allow someone who is involved in a less-privileged `permissionID` to frontrun and steal policies that were intended to be given to a more privileged `permissionID`.

## Recommendation
Add `permissionID` into the `getAndVerifyDigest()` function so that it is always verified. Furthermore, move the check at Line 183 out of the if clause so that `permissionID` is always guaranteed to be associated with the `enableData` (which is validated as it is part of the signature).

## Rhinestone
Fixed in PR 80.

## Cantina Managed
Verified.
