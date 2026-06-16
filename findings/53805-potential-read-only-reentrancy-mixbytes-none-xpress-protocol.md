---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#3-potential-read-only-reentrancy"
genome:
  - "[[view-reentrancy]]"
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[external-call-is-safe]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-callback]]"
---
# Potential Read-Only Reentrancy

- id: 53805
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#3-potential-read-only-reentrancy

## Summary


The report discusses a vulnerability in a function called `getTraderBalance` in a code repository. This function is used to retrieve a trader's balance, but it is susceptible to a type of attack called read-only reentrancy. This means that an attacker could potentially manipulate the balance of the trader and cause discrepancies between the actual balance and the value returned by the function. This is a serious issue that could lead to critical problems in the project. The report recommends updating the code to fix this vulnerability.

## Details

##### Description
The [`getTraderBalance`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L154) function is vulnerable to read-only reentrancy attacks, especially with ERC-777 tokens. This vulnerability arises because the trader's balance updates in storage occur after token transfers, potentially allowing a reentrancy exploit.

The issue is classified as **high** severity because it causes discrepancies between the actual balance and the returned value from the view function, which could lead to critical issues and vulnerabilities in the project's integrations.

##### Recommendation
We recommend updating the trader's balance prior to transferring the external tokens to mitigate the read-only reentrancy risk.
