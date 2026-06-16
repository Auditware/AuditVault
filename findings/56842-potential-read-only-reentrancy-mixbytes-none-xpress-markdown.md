---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#3-potential-read-only-reentrancy"
genome:
  - "[[view-reentrancy]]"
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[external-call-is-safe]]"
---
# Potential Read-Only Reentrancy

- id: 56842
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#3-potential-read-only-reentrancy

## Summary


The `getTraderBalance` function in the Hanji contract is vulnerable to a type of attack called read-only reentrancy. This can happen when using a certain type of token called ERC-777. This is a high severity issue because it can cause problems with the balance and lead to other issues in the project. To fix this, the balance should be updated before transferring external tokens.

## Details

##### Description
The [`getTraderBalance`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L154) function is vulnerable to read-only reentrancy attacks, especially with ERC-777 tokens. This vulnerability arises because the trader's balance updates in storage occur after token transfers, potentially allowing a reentrancy exploit.

The issue is classified as **high** severity because it causes discrepancies between the actual balance and the returned value from the view function, which could lead to critical issues and vulnerabilities in the project's integrations.

##### Recommendation
We recommend updating the trader's balance prior to transferring the external tokens to mitigate the read-only reentrancy risk.
