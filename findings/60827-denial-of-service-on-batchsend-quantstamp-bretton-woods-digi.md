---
tags:
  - lang/solidity
  - sector/rwa
  - platform/quantstamp
  - severity/high
  - vuln/reentrancy/single-function
  - precondition/specific-token-type
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Bretton Woods]]"
auditors:
  - "[[Guillermo Escobero]]"
report: "https://certificate.quantstamp.com/full/bretton-woods-digital-gold/6a607c09-57af-4640-97bd-ee122e1ed0a6/index.html"
genome:
  - "[[single-function]]"
  - "[[temporary]]"
  - "[[specific-token-type]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# Denial of Service on `batchSend()`

- id: 60827
- impact: HIGH
- protocol: [[Bretton Woods]] Digital Gold
- reporter: Guillermo Escobero (Quantstamp)
- source: https://certificate.quantstamp.com/full/bretton-woods-digital-gold/6a607c09-57af-4640-97bd-ee122e1ed0a6/index.html

## Summary


The recent update of the BWGToken contract has caused a problem with ERC-777 hooks being disabled. This means that the functions related to these hooks from OpenZeppelin's ERC-777 implementation are not working properly. The documentation also needs to be updated to inform users that these hooks are disabled, as it can be a dangerous assumption for them. This issue specifically affects the `StorageOperator.sol` file, where if a contract with a sending hook is added to the `costableList`, it can cause the `StorageOperator.batchSend()` function to fail. This can happen if someone acquires BWG tokens from an exchange, as it triggers the `_beforeTokenTransfer()` hook and adds the recipient to the list. To address this issue, it is recommended to modify the ERC-777 implementation so that the sending and receiving hooks are not executed, to prevent potential security risks.

## Details

**Update**
The team addressed the issue in: `0d17ed08569a14ff5dfd1df8066968a165b29578`. ERC-777 hooks were disabled overriding the related functions from OpenZeppelin's ERC-777 implementation. Documentation should be added that clearly states to end users that while this is an ERC-777 contract, sending and receiving hooks are disabled. However, currently, the documentation still states that the BWGToken implements the ERC-777 contract in a way that it implements _"send/receive hooks to offer token holders more control over their tokens."_, which can be a very dangerous assumption for end users. The removal of these hooks should be documented for the end user.

**File(s) affected:**`StorageOperator.sol`

**Description:** In ERC-777, contracts are required to implement sending and receiving hooks to send or receive the ERC-777 token. Suppose a contract `A` implements the sending hook as a reverting function. If `A` is added to the `BWGToken.costableList`, it will cause `StorageOperator.batchSend()` to revert when processing the batch that includes the wallet. This is easy to accomplish since an arbitrary address can get added to the `costableList` simply by acquiring some `BWG` token (e.g. from an exchange), as it will trigger the `_beforeTokenTransfer()` hook, which then adds the recipient to the list.

A sending hook that reverts will avoid the operator to collect fees on that user.

**Recommendation:** To keep the current functionality, a possible approach is to modify the implementation of ERC-777 so that it does not execute the sending and receiving hooks. This would avoid possible reentrancy issues and denial-of-service attacks.
