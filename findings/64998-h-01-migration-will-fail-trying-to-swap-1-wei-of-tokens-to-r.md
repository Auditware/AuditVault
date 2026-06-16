---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[g8keep]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/g8keep-security-review_2024-12-12.md"
genome:
  - "[[missing-check]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# [H-01] Migration will fail trying to swap 1 wei of tokens to reach the target price

- id: 64998
- impact: HIGH
- protocol: _2024-12-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/g8keep-security-review_2024-12-12.md

## Summary


The code is trying to migrate tokens to a Uniswap V3 pool by changing the pool's price through temporary liquidity and a swap. However, if the pool's price does not reach the target price, the migration fails because the code is using only 1 wei of ETH in the swap. This is not enough to reach the target price and results in the migration being reverted. To fix this, the code should calculate the exact amount needed to reach the target price and allow for a margin of error when checking the pool's price.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When the code wants to migrate tokens to Uniswap V3 pool, first it tries to change the pool's price by adding temporary liquidity and performing a swap in `_adjustPoolPrice()`:

```solidity
       uint256 tmpLPTokenId =
            _addTemporaryLiquidity(ethAmount / 100, tokenAmount / 100, constainedTickLower, constrainedTickUpper);

        if (sqrtPriceX96Start > sqrtPriceX96) {
            IUniswapV3Pool(poolAddress).swap(address(this), true, int256(uint256(tokenAmount)), sqrtPriceX96, "");
        } else {
            IUniswapV3Pool(poolAddress).swap(address(this), false, int256(uint256(1)), sqrtPriceX96, "");
        }
----snip
        (uint160 sqrtPriceX96New,,,,,,) = IUniswapV3Pool(poolAddress).slot0();
        adjustFailed = sqrtPriceX96 != sqrtPriceX96New;
```

And if the pool's price doesn't reach the target price then the code doesn't migrate. The issue is that the code tries to swap with 1 wei of ETH and it won't be enough to reach the target price the price would only reach the `constrainedTickUpper` and as a result the `adjustFailed ` would be true and migration can't be completed and it would revert always.

## Recommendations

Calculate the exact amount required to reach that target price level and use it in the swap and also allows for some percentage of error when checking the pool's price and target price.
