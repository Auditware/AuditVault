---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/oracle
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[ParaSpace]]"
auditors:
  - "[[Trust]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[token-decimal-normalization]]"
---
# [H-09] UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations

- id: 15982
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: Trust (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report is about an issue with UniswapV3OracleWrapper, which is responsible for price feed of UniswapV3 NFT tokens. The issue is that the calculation for the price of the NFT token could be 0, although the price is not. This is due to a difference in decimals between two tokens. As a result, the liquidity calculator will assume all holdings are amount0, while in reality they could be all amount1, or a combination of the two. This will lead to incorrect valuations of UniswapV3 tokens of certain pairs, which will ultimately cause liquidation of the holding even if it is healthy. The recommended mitigation step is to multiply by 2\*\*96 before the division operation in sqrtPriceX96 calculation.

## Details


<https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L245>

UniswapV3OracleWrapper is responsible for price feed of UniswapV3 NFT tokens. Its getTokenPrice() is used by the health check calculation in GenericLogic.

getTokenPrice gets price from the oracle and then uses it to calculate value of its liquidity.

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        UinswapV3PositionData memory positionData = getOnchainPositionData(
            tokenId
        );
        PairOracleData memory oracleData = _getOracleData(positionData);
        (uint256 liquidityAmount0, uint256 liquidityAmount1) = LiquidityAmounts
            .getAmountsForLiquidity(
                oracleData.sqrtPriceX96,
                TickMath.getSqrtRatioAtTick(positionData.tickLower),
                TickMath.getSqrtRatioAtTick(positionData.tickUpper),
                positionData.liquidity
            );
        (
            uint256 feeAmount0,
            uint256 feeAmount1
        ) = getLpFeeAmountFromPositionData(positionData);
        return
            (((liquidityAmount0 + feeAmount0) * oracleData.token0Price) /
                10**oracleData.token0Decimal) +
            (((liquidityAmount1 + feeAmount1) * oracleData.token1Price) /
                10**oracleData.token1Decimal);
    }

In `_getOracleData`,  sqrtPriceX96 of the holding is calculated, using square root of token0Price and token1Price, corrected for difference in decimals. In case they have same decimals, this is the calculation:

    if (oracleData.token1Decimal == oracleData.token0Decimal) {
        // multiply by 10^18 then divide by 10^9 to preserve price in wei
        oracleData.sqrtPriceX96 = uint160(
            (SqrtLib.sqrt(
                ((oracleData.token0Price * (10**18)) /
                    (oracleData.token1Price))
            ) * 2**96) / 1E9
        );

The issue is that the inner calculation, could be 0, making the whole expression zero, although price is not.

    ((oracleData.token0Price * (10**18)) /
                            (oracleData.token1Price))

This expression will be 0 if `oracleData.token1Price > token0Price * 10**18`. This is not far fetched, as there is massive difference in prices of different ERC20 tokens due to tokenomic models. For example, WETH (18 decimals) is `$1300`, while BTT (18 decimals) is `$0.00000068`.

The price is represented using X96 type, so there is plenty of room to fit the price between two tokens of different values. It is just that the number is multiplied by 2&ast;&ast;96 too late in the calculation, after the division result is zero.

Back in getTokenPrice, the sqrtPriceX96 parameter which can be zero, is passed to `LiquidityAmounts.getAmountsForLiquidity()` to get liquidity values. In case price is zero, the liquidity calculator will assume all holdings are amount0, while in reality they could be all amount1, or a combination of the two.

    function getAmountsForLiquidity(
        uint160 sqrtRatioX96,
        uint160 sqrtRatioAX96,
        uint160 sqrtRatioBX96,
        uint128 liquidity
    ) internal pure returns (uint256 amount0, uint256 amount1) {
        if (sqrtRatioAX96 > sqrtRatioBX96)
            (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);
        if (sqrtRatioX96 <= sqrtRatioAX96) { <- Always drop here when 0
            amount0 = getAmount0ForLiquidity(
                sqrtRatioAX96,
                sqrtRatioBX96,
                liquidity
            );
        } else if (sqrtRatioX96 < sqrtRatioBX96) {
            amount0 = getAmount0ForLiquidity(
                sqrtRatioX96,
                sqrtRatioBX96,
                liquidity
            );
            amount1 = getAmount1ForLiquidity(
                sqrtRatioAX96,
                sqrtRatioX96,
                liquidity
            );
        } else {
            amount1 = getAmount1ForLiquidity(
                sqrtRatioAX96,
                sqrtRatioBX96,
                liquidity
            );
        }
    }

Since amount0 is the lower value between the two, it is easy to see that the calculated liquidity value will be much smaller than it should be, and as a result the entire Uniswapv3 holding is valuated much lower than it should. Ultimately, it will cause liquidation the moment the ratio between some uniswap pair goes over 10&ast;&ast;18.

For the sake of completeness, healthFactor is calculated by  `calculateUserAccountData`, which calls `_getUserBalanceForUniswapV3`, which queries the oracle with `_getTokenPrice`.

### Impact

UniswapV3 tokens of certain pairs will be wrongly valued, leading to liquidations.

### Proof of Concept

1.  Alice deposits a uniswap v3 liquidity token as collateral in ParaSpace (Pair A/B)
2.  Value of B rises in comparison to A. Now PriceB = PriceA &ast; 10&ast;&ast;18
3.  sqrtPrice resolves to 0, and entire liquidity is taken as A liquidity. In reality, price is between tickUpper and tickLower of the uniswap token. B tokens are not taken into consideration.
4.  Liquidator Luke initiates liquidation of Alice. Alice may lose her NFT collateral although she has kept her position healthy.

### Recommended Mitigation Steps

Multiply by 2&ast;&ast;96 before the division operation in sqrtPriceX96 calculation.



***
