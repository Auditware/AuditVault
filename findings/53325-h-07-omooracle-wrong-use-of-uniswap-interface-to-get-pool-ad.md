---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[oracle/wrong-feed]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[misassumption/oracle-is-reliable]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-07] OmoOracle wrong use of Uniswap interface to get pool address

- id: 53325
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report highlights a problem in the function `getLiquidityAmounts()` which incorrectly uses the Uniswap interface to obtain the pool address. This can cause high impact and has a medium likelihood of occurring. The recommended solution is to use the correct interface to get the pool address by catching the `token0`, `token1` and `fee` from a specific call and using it in the code. This will resolve the issue.

## Details

## **Severity**

**Impact:** High

**Likelihood:** Medium

## **Description**

The function `getLiquidityAmounts()` incorrectly uses the Uniswap interface to obtain the pool address:

```solidity
    function getLiquidityAmounts(
        address positionManager,
        uint256 tokenId,
        uint128 liquidity
    ) internal view returns (uint256 amount0, uint256 amount1) {
        if (liquidity == 0) return (0, 0); // Handle zero liquidity case
        INonfungiblePositionManager nftManager = INonfungiblePositionManager(positionManager);

        --snip--

        IUniswapV3Pool pool = IUniswapV3Pool(nftManager.factory()); //Wrong pool address
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

Use correct interface to get pool address

To resolve this, get the pool that belongs to `tokenId`, you need to catch the `token0`, `token1` and `fee` from this call `nftManager.positions(tokenId);`
and use it like this

```diff
File: OmoOracle.sol#getLiquidityAmounts()

         INonfungiblePositionManager nftManager = INonfungiblePositionManager(positionManager);
         /*code*/

-        IUniswapV3Pool pool = IUniswapV3Pool(nftManager.factory());
+        address poolAddress = IUniswapV3Factory(nftManager.factory()).getPool(token0, token1, fee);
+        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
        (uint160 sqrtPriceX96,,,,,,) = pool.slot0();
```
