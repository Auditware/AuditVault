---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/vault
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Funnel]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Funnel-security-review_2025-08-27.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-01] `FunnelVaultUpgradeable` cannot send transactions to HyperCore

- id: 62620
- impact: HIGH
- protocol: Funnel_2025-08-27
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Funnel]]-security-review_2025-08-27.md

## Summary


This report discusses a bug in the `sendNativeTokenToLayer1()` function that transfers funds from HyperEVM to HyperCore. The bug prevents the funds from being credited to the correct contract address in HyperCore, resulting in them being locked until the contract is upgraded to include the necessary logic. The report recommends implementing the logic outlined in the Hyperliquid documentation to resolve the issue.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

`sendNativeTokenToLayer1()` bridges `HYPE` from HyperEVM to HyperCore. These funds are credited to the vault contract address in HyperCore, so it is required that the contract implements the logic to send transactions from the HyperEVM to HyperCore.

As `FunnelVaultUpgradeable` does not implement a mechanism to send transactions to HyperCore, the funds will be locked in HyperCore until the contract is upgraded, adding the required logic.

## Recommendations

Implement the logic to send transactions from the HyperEVM to HyperCore following the [Hyperliquid documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm/interacting-with-hypercore#corewriter-contract).
