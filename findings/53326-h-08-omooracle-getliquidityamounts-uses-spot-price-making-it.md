---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-twap]]"
  - "[[known-pattern]]"
  - "[[oracle-is-reliable]]"
  - "[[price-cannot-be-manipulated]]"
---
# [H-08] OmoOracle `getLiquidityAmounts()` uses spot price making it manipulatable

- id: 53326
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The bug report describes a potential issue in the `getPositionValue()` and `getLiquidityAmounts()` functions in the `OmoOracle` contract. These functions rely on the spot price on Uniswap to calculate token amounts in a position, which makes the system vulnerable to price manipulation. The severity of this bug is classified as high, with a medium likelihood of occurring. The report recommends using a Time-Weighted Average Price (TWAP) instead of relying on the spot price to mitigate this vulnerability.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`getPositionValue()` / `getLiquidityAmounts()` in `OmoOracle` rely on the spot price on Uniswap to calculate token amounts in a position. It makes the system vulnerable to **price manipulation**.

```solidity
    function getLiquidityAmounts(
        address positionManager,
        uint256 tokenId,
        uint128 liquidity
    ) internal view returns (uint256 amount0, uint256 amount1) {

--snip--

        IUniswapV3Pool pool = IUniswapV3Pool(nftManager.factory());
        (uint160 sqrtPriceX96,,,,,,) = pool.slot0();

        // Calculate amounts using UniswapV3 math
        (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtPriceX96,
            TickMath.getSqrtRatioAtTick(tickLower),
            TickMath.getSqrtRatioAtTick(tickUpper),
            liquidity
        );
    }
```

## Recommendations

Use Time-Weighted Average Price (TWAP) Instead
