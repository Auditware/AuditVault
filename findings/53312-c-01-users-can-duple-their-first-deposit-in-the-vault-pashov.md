---
tags:
  - lang/solidity
  - sector/dex
  - sector/vault
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[frontrun-exposure]]"
  - "[[first-deposit]]"
---
# [C-01] Users can duple their first deposit in the vault

- id: 53312
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report discusses a high severity issue in the `OmoVault.sol` contract, which is responsible for implementing some aspects of the ERC7540 standard. The problem is that users are able to withdraw funds directly using a different contract, `ERC4626.sol`, instead of going through the designated process. Additionally, there is a vulnerability in the `_validateSignature()` function in the `DynamicAccount.sol` contract, where a user can gain the same privileges as the agent by using their wallet as a signer through the Entry Point. This allows malicious users to withdraw funds from the vault and transfer them to their Dynamic Account, effectively doubling their initial deposit. 

To fix this issue, the report recommends overriding the `withdraw()` function in `OmoVault.sol` to make it revert and checking the signer's privileges in the `_validateSignature()` function. This will prevent users from withdrawing funds directly and mitigate the risk of malicious users gaining unauthorized access to the vault's funds.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `OmoVault.sol` contract implements some principles of the ERC7540 standard, Asynchronous redeem shares for assets.
However, users are still able to withdraw directly using `ERC4626.sol#withdraw()`

Also, `_validateSignature()` function in `DynamicAccount.sol` contract accepts the user wallet as a signer, through the Entry Point.
So, the user has the same privileges as the agent.

Malicious users can call `withdraw()` from the vault directly to receive their funds.
Next, he will transfer all the funds and the UniswapV3 positions out of their Dynamic Account

As a result, he will duple his first deposit in the vault.

## Recommendations

1- Override `withdraw()` function in `OmoVault.sol` and make it revert.
2- In `_validateSignature()` you need to check what function can be called if the signer is the owner
