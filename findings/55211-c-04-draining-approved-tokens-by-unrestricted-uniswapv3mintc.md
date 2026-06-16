---
tags:
  - lang/solidity
  - sector/dex
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Burve]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [C-04] Draining approved tokens by unrestricted `uniswapV3MintCallback()`

- id: 55211
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Burve]]-security-review_2025-01-29.md

## Summary


The bug report states that there is a high severity and likelihood bug in the `Burve` smart contract. The contract has an external function called `uniswapV3MintCallback` which does not have any access control. This function takes in three parameters and decodes the `data` parameter to get an address. It then transfers tokens from that address to the liquidity pool. This means that an attacker can see which addresses have approved the `Burve` contract and can transfer tokens from those addresses to the pool. This can result in a direct loss of funds for the users. The recommendation is to restrict this function so that only the pool can call it.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

`Burve::uniswapV3MintCallback` is an external function with no access control. This function takes three parameters: `amount0Owed`, `amount1Owed`, and `data`. It then decodes `data` to get an address and transfers tokens from that address to the liquidity pool (lp). An attacker could see which addresses have approved to `Burve.sol` and transfer tokens from those addresses to the pool.

```solidity
  function uniswapV3MintCallback(uint256 amount0Owed, uint256 amount1Owed, bytes calldata data) external {
        address source = abi.decode(data, (address));
        TransferHelper.safeTransferFrom(token0, source, address(pool), amount0Owed);
        TransferHelper.safeTransferFrom(token1, source, address(pool), amount1Owed);
    }
```

1. Provide `data` which decodes to a user address with a hanging approval to `Burve` and amounts equal to the approved amounts
2. As the function has no access control, the funds will be transferred into the pool
3. This causes a direct loss of funds for the users

## Recommendations

Restrict this function so that only the pool can call it.
