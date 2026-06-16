---
tags:
  - lang/solidity
  - sector/dex
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-12] `getPositionValue()` does not consider accumulated fees

- id: 53330
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This report is about a bug in the `getPositionValue()` function, which has a high impact on the system and a medium likelihood of occurring. This function is used to retrieve the value of a position in a liquidity pool on Uniswap V3. However, it does not take into account the accumulated fees earned by the position over time. This means that the value returned by the function is not accurate. To fix this bug, the report recommends including the accumulated fees in the calculation of the position's value. This can be done by using the `tokensOwed0` and `tokensOwed1` variables in the response of the `positions(tokenId)` function. Additionally, the report suggests using the `collect` function to collect fees for a specific position, as outlined in the Uniswap documentation. 

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The function `getPositionValue()` only retrieves the liquidity token amounts using `getLiquidityAmounts()` and converts them into the quote token value. But it does not account for accumulated fees.

```solidity

    function getPositionValue(
        address positionManager,
        uint256 tokenId,
        address quoteToken
    ) external view override returns (uint256) {
        // Get position details
        (,, address token0, address token1,,,, uint128 liquidity,,,,) = INonfungiblePositionManager(positionManager).positions(tokenId);

        // Get amounts
        (uint256 amount0, uint256 amount1) = getLiquidityAmounts(positionManager, tokenId, liquidity);

        // Convert to quote token value
        uint256 value0 = convertTokenValue(token0, amount0, quoteToken);
        uint256 value1 = convertTokenValue(token1, amount1, quoteToken);

        return value0 + value1;
    }
```

**Note**: Uniswap V3 positions earn fees over time, and these are claimable but not included in the liquidity calculation.

## Recommendations

- Include Accumulated Fees in Position Value Calculation
  - You can use `tokensOwed0` and `tokensOwed1` in response of `positions(tokenId)` to calculate how many uncollected tokens are owed to the position, as of the last computation
- Use `collect` function to collect fees for a specific position [Uniswap Doc](https://docs.uniswap.org/contracts/v3/reference/periphery/NonfungiblePositionManager#collect)
