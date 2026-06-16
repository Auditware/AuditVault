---
tags:
  - lang/solidity
  - sector/staking
  - sector/vault
  - platform/kann
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
  - trigger/first-deposit
protocol: "[[ManifestFinance]]"
auditors:
  - "[[Kann]]"
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/ManifestFinance-security-review_2025-08-26.md"
genome:
  - "[[arithmetic/rounding]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[first-deposit]]"
  - "[[reward-accounting]]"
---
# [C-01] First Deposit Can Result in Zero Shares Due to Direct Token Transfer

- id: 62715
- impact: HIGH
- protocol: [[ManifestFinance]]-security-review_2025-08-26
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/ManifestFinance-security-review_2025-08-26.md

## Summary


The StakedUSH vault has a critical bug that allows for zero share deposits when USH tokens are sent directly to the contract. This is because the vault calculates shares based on totalSupply and totalAssets, which can be manipulated when tokens are sent directly to the contract. This can result in legitimate depositors receiving 0 shares and potentially losing their funds. The root cause of this bug is the way the vault calculates shares using a formula that does not account for direct token transfers. The team has fixed this bug.

## Details


## Severity

Critical

## Description

The StakedUSH vault is vulnerable to zero share deposits when USH tokens are sent directly to the contract.
Because the vault calculates shares based on totalSupply and totalAssets, a direct token transfer increases totalAssets without increasing totalSupply.
As a result, legitimate depositor will receive 0 shares for a positive deposit, breaking fair share distribution and potentially locking user funds.

Root Cause:
The sUSH vault calculates shares using the formula:

shares = (assets * (totalSupply + decimalsOffset)) / (totalAssets + 1)

If a user directly transfers USH to the vault contract (bypassing deposit()), the vault’s totalAssets increases while totalSupply remains 0.

When the next user calls deposit(), the formula becomes:

(assets * (0 + 0)) / (totalAssets + 1) = 0

Thus, the user receives 0 shares (REVERTS), even though they tried depositing a positive amount of assets.

## Team Response

Fixed.
