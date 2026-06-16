---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# [H-01] Missing transfer of tokens before island.mint()

- id: 55212
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Burve]]-security-review_2025-01-29.md

## Summary


The Burve contract has a bug that prevents users from successfully providing liquidity to the island pool through the contract. This happens because the contract does not transfer the necessary tokens before calling `Burve.mint()`, resulting in a failed transaction. To fix this, the contract should be updated to transfer and approve the required tokens before calling `island.mint()`. This bug has a medium impact and a high likelihood of occurring.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The Burve contract allows users to provide liquidity to both the island pool and Uniswap V3 pools. When adding liquidity to the island pool, it will transfer tokens in from the sender (which is the Burve contract itself) before providing liquidity to Uniswap.

```solidity
    function mint(address recipient, uint128 liq) external {
        for (uint256 i = 0; i < distX96.length; ++i) {
            uint128 liqAmount = uint128(shift96(liq * distX96[i], true));
            mintRange(ranges[i], recipient, liqAmount);
        }

        _mint(recipient, liq);
    }
```

However, when users call `Burve.mint()`, it does not transfer the necessary tokens beforehand. This results in a failed transaction, preventing users from successfully providing liquidity to the island pool through the Burve contract.

## Recommendations

Ensure the required tokens are transferred and approved before calling `island.mint()`.
