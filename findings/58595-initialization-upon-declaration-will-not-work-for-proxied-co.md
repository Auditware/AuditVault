---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/oracle
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
protocol: "[[Kinetiq LST]]"
auditors:
  - Rvierdiiev
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[proxy-initialization]]"
  - "[[proxy-storage-collision]]"
  - "[[precondition/uninitialized]]"
  - "[[variant]]"
  - "[[proxy-is-initialized]]"
  - "[[upgrade-dependency]]"
---
# Initialization upon declaration will not work for " proxied" contracts

- id: 58595
- impact: HIGH
- protocol: Kinetiq LST
- reporter: Rvierdiiev (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Kinetiq-Spearbit-Security-Review-March-2025.pdf

## Summary


The report discusses a bug found in the OracleManager and StakingManager contracts. These contracts are designed to operate behind a delegation proxy, but due to a coding error, their storage variables are being written to the implementation contract's storage instead of the proxy's. This results in uninitialized variables and can cause issues with the unstake fee not being applied. The recommendation is to initialize these variables properly using the `initialize()` function and to use a plugin for safe upgrades in the future. The bug has been fixed in the code.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
OracleManager and StakingManager are designed to operate behind a delegation proxy, meaning their code will be executed, but their storage will not be directly used. However, both contracts declare and initialize storage variables upon declaration, causing these values to be written to the implementation contract's storage instead of the proxy's. As a result, these variables will remain uninitialized in the proxy storage, defaulting to 0. A critical consequence is that the unstake fee will not be applied.

```solidity
// OracleManager.sol
uint256 public MIN_UPDATE_INTERVAL = 1 hours; // Minimum time between updates
...
uint256 public MAX_ORACLE_STALENESS = 1 hours;
```

```solidity
// StakingManager.sol
uint256 public unstakeFeeRate = 10;
```

## Recommendation
Initialize these variables inside the `initialize()` function to ensure they are properly set in the proxy's storage. For the long term, consider using a plugin for safe upgrades as well as use capital case letters only for constant/immutable variables.

## Kinetiq
Fixed in e2bac5c.

## Cantina Managed
Fixed in e2bac5c by implementing the reviewer's recommendation.
