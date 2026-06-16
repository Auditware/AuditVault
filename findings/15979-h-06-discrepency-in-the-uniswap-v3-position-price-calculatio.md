---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
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
  - "[[__141345__  poirots]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[token-decimal-normalization]]"
---
# [H-06] Discrepency in the Uniswap V3 position price calculation because of decimals

- id: 15979
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: __141345__  poirots (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report concerns a vulnerability in the Uniswap V3 Oracle Wrapper contract on the Paraspace platform. The vulnerability occurs when the squared root of the Uniswap V3 position is calculated from the _getOracleData() function. The price may return a very high number if the token1 decimals are strictly superior to the token0 decimals. This is because the 1E9 (10**9) value is hard-coded, but should take into account the delta between both decimals. As a result, the getAmountsForLiquidity() is going to return a huge value for the amount of token0 and token1 as the user position liquidity. The getTokenPrice(), using this amount of liquidity to calculate the token price, is as its turn going to return a huge value.

The Proof of Concept demonstrates in which case the returned squared root price of the position is over inflated. Recommended mitigation steps include changing the code to take into account the delta between both decimals, as demonstrated in the code snippet provided.

## Details


When the squared root of the Uniswap V3 position is calculated from the [`_getOracleData()` function](https://github.com/code-423n4/2022-11-paraspace/blob/main/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L221-L280), the price may return a very high number (in the case that the token1 decimals are strictly superior to the token0 decimals). See: <https://github.com/code-423n4/2022-11-paraspace/blob/main/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L249-L260>

The reason is that at the denominator, the `1E9` (10&ast;&ast;9) value is hard-coded, but should take into account the delta between both decimals.<br>
As a result, in the case of `token1Decimal > token0Decimal`, the [`getAmountsForLiquidity()`](https://github.com/code-423n4/2022-11-paraspace/blob/main/paraspace-core/contracts/dependencies/uniswap/LiquidityAmounts.sol#L172-L205) is going to return a huge value for the amount of token0 and token1 as the user position liquidity.

The [`getTokenPrice()`](https://github.com/code-423n4/2022-11-paraspace/blob/main/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L156), using this amount of liquidity to [calculate the token price](https://github.com/code-423n4/2022-11-paraspace/blob/main/paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol#L176-L180) is as its turn going to return a huge value.

### Proof of Concept

This POC demonstrates in which case the returned squared root price of the position is over inflated

```solidity
// SPDX-License-Identifier: UNLISENCED
pragma solidity 0.8.10;

import {SqrtLib} from "../contracts/dependencies/math/SqrtLib.sol";
import "forge-std/Test.sol";

contract Audit is Test {
    function testSqrtPriceX96() public {
        // ok
        uint160 price1 = getSqrtPriceX96(1e18, 5 * 1e18, 18, 18);

        // ok
        uint160 price2 = getSqrtPriceX96(1e18, 5 * 1e18, 18, 9);

        // Has an over-inflated squared root price by 9 magnitudes as token0Decimal < token1Decimal
        uint160 price3 = getSqrtPriceX96(1e18, 5 * 1e18, 9, 18);
    }

    function getSqrtPriceX96(
        uint256 token0Price,
        uint256 token1Price,
        uint256 token0Decimal,
        uint256 token1Decimal
    ) private view returns (uint160 sqrtPriceX96) {
        if (oracleData.token1Decimal == oracleData.token0Decimal) {
            // multiply by 10^18 then divide by 10^9 to preserve price in wei
            sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(((token0Price * (10**18)) / (token1Price))) *
                    2**96) / 1E9
            );
        } else if (token1Decimal > token0Decimal) {
            // multiple by 10^(decimalB - decimalA) to preserve price in wei
            sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(
                    (token0Price * (10**(18 + token1Decimal - token0Decimal))) /
                        (token1Price)
                ) * 2**96) / 1E9
            );
        } else {
            // multiple by 10^(decimalA - decimalB) to preserve price in wei then divide by the same number
            sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(
                    (token0Price * (10**(18 + token0Decimal - token1Decimal))) /
                        (token1Price)
                ) * 2**96) / 10**(9 + token0Decimal - token1Decimal)
            );
        }
    }
}
```

### Recommended Mitigation Steps

```solidity
        if (oracleData.token1Decimal == oracleData.token0Decimal) {
            // multiply by 10^18 then divide by 10^9 to preserve price in wei
            oracleData.sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(
                    ((oracleData.token0Price * (10**18)) /
                        (oracleData.token1Price))
                ) * 2**96) / 1E9
            );
        } else if (oracleData.token1Decimal > oracleData.token0Decimal) {
            // multiple by 10^(decimalB - decimalA) to preserve price in wei
            oracleData.sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(
                    (oracleData.token0Price *
                        (10 **
                            (18 +
                                oracleData.token1Decimal -
                                oracleData.token0Decimal))) /
                        (oracleData.token1Price)
                ) * 2**96) /
                    10 **
                        (9 +
                            oracleData.token1Decimal -
                            oracleData.token0Decimal)
            );
        } else {
            // multiple by 10^(decimalA - decimalB) to preserve price in wei then divide by the same number
            oracleData.sqrtPriceX96 = uint160(
                (SqrtLib.sqrt(
                    (oracleData.token0Price *
                        (10 **
                            (18 +
                                oracleData.token0Decimal -
                                oracleData.token1Decimal))) /
                        (oracleData.token1Price)
                ) * 2**96) /
                    10 **
                        (9 +
                            oracleData.token0Decimal -
                            oracleData.token1Decimal)
            );
        }
```



***
