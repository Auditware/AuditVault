---
tags:
  - lang/solidity
  - sector/dex
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Hanji]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#3-potential-read-only-reentrancy"
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# Potential Read-Only Reentrancy

- id: 55173
- impact: HIGH
- protocol: [[Hanji]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#3-potential-read-only-reentrancy

## Summary


The `getTraderBalance` function in the OnchainLOB.sol file is vulnerable to a type of attack called read-only reentrancy, which can be especially harmful when using ERC-777 tokens. This happens because the function updates the trader's balance after transferring tokens, which can allow an attacker to exploit the vulnerability. This is considered a major issue because it can cause discrepancies between the actual balance and the value returned by the function, which could lead to serious problems in the project's integrations. To fix this issue, it is recommended to update the trader's balance before transferring any external tokens to prevent the risk of read-only reentrancy.

## Details

##### Description
The [`getTraderBalance`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L154) function is vulnerable to read-only reentrancy attacks, especially with ERC-777 tokens. This vulnerability arises because the trader's balance updates in storage occur after token transfers, potentially allowing a reentrancy exploit.

The issue is classified as **high** severity because it causes discrepancies between the actual balance and the returned value from the view function, which could lead to critical issues and vulnerabilities in the project's integrations.

##### Recommendation
We recommend updating the trader's balance prior to transferring the external tokens to mitigate the read-only reentrancy risk.
