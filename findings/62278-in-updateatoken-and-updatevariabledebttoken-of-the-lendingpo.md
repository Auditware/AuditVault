---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
  - sector/staking-pool
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# In updateAToken and updateVariableDebtToken of the LendingPoolConfigurator encodedCallis con-

- id: 62278
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report is about a high-risk vulnerability found in the `LendingPoolConfigurator` contract. The vulnerability is located in the `updateAToken` and `updateVariableDebtToken` functions, specifically in the construction of the `encodedCall` variable. This variable is used to update certain parameters in the proxy contracts, but it is missing the `reserveType` parameter. This results in incorrect data being set for `RESERVE_TYPE`, `name`, `symbol`, and `params` in the proxy contracts, which can cause incorrect data to be queried or updated in the lending pool. The recommendation is to add the missing `reserveType` parameter and use `abi.encodeCall` instead of `abi.encodeWithSelector` to avoid potential future mistakes. The bug has been fixed by Astera and verified by Spearbit.

## Details

## Vulnerability Report

## Severity
**High Risk**

## Context
- `LendingPoolConfigurator.sol#L173-L183`
- `LendingPoolConfigurator.sol#L206-L215`

## Description
In `updateAToken` and `updateVariableDebtToken` of the `LendingPoolConfigurator`, `encodedCall` is constructed incorrectly:

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

As a result, `RESERVE_TYPE`, `name`, `symbol`, and `params` will be set incorrectly in the proxy contracts. This will cause all subsequent calls to query or update data for an incorrect reserve in the lending pool:

```solidity
pool.function(_underlyingAsset, RESERVE_TYPE, /*...*/ )
```

## Recommendation
Add the missing `reserveType` parameter and also ensure that instead of using `abi.encodeWithSelector`, `abi.encodeCall` is used to avoid potential future mistakes regarding typos and incorrect parameter types.

## Audit Reports
- **Astera:** Fixed in commit 8bc4648c.
- **Spearbit:** Fix verified.
