---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
  - sector/staking-pool
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# In updateAToken and updateVariableDebtToken of the LendingPoolConfigurator encodedCallis con-

- id: 49177
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


The bug report is about a high-risk issue in the LendingPoolConfigurator code. The problem is with the updateAToken and updateVariableDebtToken functions, where the encodedCall is not constructed correctly. This means that the parameters RESERVE_TYPE, name, symbol, and params will be set incorrectly in the proxy contracts. This can cause all future calls to query or update data for the wrong reserve in the lending pool. The recommendation is to add the missing reserveType parameter and use abi.encodeCall instead of abi.encodeWithSelector to avoid potential mistakes in the future. The bug has been fixed in commit 8bc4648c and has been verified by Spearbit.

## Details

## Issue Summary

## Severity
**High Risk**

## Context
- **Files:** `LendingPoolConfigurator.sol`
- **Lines:** `173-183`, `206-215`

## Description
In the functions `updateAToken` and `updateVariableDebtToken` of the `LendingPoolConfigurator`, the `encodedCall` is constructed incorrectly:

```solidity
bytes memory encodedCall = abi.encodeWithSelector(
    /*...*/ selector,
    cachedPool,
    // ...
    input.asset,
    input.incentivesController,
    decimals, // <--- `reserveType` is missing after here
    input.name,
    input.symbol,
    input.params
);
```

Due to this oversight, `RESERVE_TYPE`, `name`, `symbol`, and `params` will be set incorrectly in the proxy contracts. This will lead to all subsequent calls querying or updating data for the wrong reserve in the lending pool:

```solidity
pool.function(_underlyingAsset, RESERVE_TYPE, /*...*/ )
```

## Recommendation
Add the missing `reserveType` parameter. Additionally, instead of using `abi.encodeWithSelector`, consider using `abi.encodeCall` to avoid potential future mistakes related to typos and incorrect parameter types.

## Cod3x
Fixed in commit **8bc4648c**.

## Spearbit
Fix verified.
