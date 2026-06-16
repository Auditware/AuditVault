---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
protocol: "[[Ammplify]]"
auditors:
  - "[[MoZi]]"
  - "[[OxNoble]]"
  - "[[Razkky]]"
  - "[[Theseersec]]"
  - "[[Xmanuel]]"
  - "[[coin2own]]"
  - "[[djshaneden]]"
  - "[[francoHacker]]"
  - "[[g4t0r]]"
  - "[[har0507]]"
  - "[[panprog]]"
  - "[[soloking]]"
  - "[[spaceleaf]]"
  - "[[sweven]]"
  - "[[volleyking]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[flashloan-callback-auth]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-1: Accrued maker fees not yet compounded can be stolen by manipulating uniswap pool spot price to reduce fees equivalent liquidity and liquidity share price on maker liquidity deposit

- id: 63167
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue where an attacker can manipulate the spot price of a pool in order to steal a large amount of accumulated maker fees. This is done by converting the fees into equivalent liquidity and then depositing and withdrawing maker liquidity at different spot prices. The report provides a detailed example of how this attack can be carried out and its impact on the pool and the attacker's profits. The report also suggests a possible solution to mitigate this issue by changing the way maker liquidity is deposited and increasing the fees proportionally. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/35 

## Found by 
MoZi, OxNoble, Razkky, Theseersec, Xmanuel, coin2own, djshaneden, francoHacker, g4t0r, har0507, panprog, soloking, spaceleaf, sweven, volleyking

### Summary

When maker liquidity is added, the existing accumulated maker fees (which are not compounded into liquidity yet) are converted into liquidity equivalent and added to actual liquidity in order to calculate liquidity share price:
```solidity
  uint128 equivLiq = PoolLib.getEquivalentLiq(
      iter.lowTick,
      iter.highTick,
      node.fees.xCFees,
      node.fees.yCFees,
      data.sqrtPriceX96,
      true
  );
  // If this compounding liq balance overflows, the pool cannot be on reasonable tokens,
  // hence we allow the overflow error to revert. This won't affect other pools.
  compoundingLiq = node.liq.mLiq - node.liq.ncLiq + equivLiq;
  currentLiq = uint128(FullMath.mulDiv(compoundingLiq, sliq, node.liq.shares));
  // The shares we'll have afterwards.
  targetSliq = uint128(FullMath.mulDiv(node.liq.shares, targetLiq, compoundingLiq));
```

Equivalent liquidity is calculated from the fees (which are in `token0` and `token1` - `node.fees.xCFees` and `node.fees.yCFees`) using the current spot price:
```solidity
    function getEquivalentLiq(
        int24 lowTick,
        int24 highTick,
        uint256 x,
        uint256 y,
        uint160 sqrtPriceX96,
        bool roundUp
    ) internal pure returns (uint128 equivLiq) {
        (uint256 lxX128, uint256 lyX128) = getAmounts(sqrtPriceX96, lowTick, highTick, X128, roundUp);
        uint256 liqValueX128 = (FullMath.mulX64(lxX128, sqrtPriceX96, false) >> 32) + (lyX128 << 96) / sqrtPriceX96;
        uint256 myValue = FullMath.mulX128(x, uint256(sqrtPriceX96) << 32, false) + (y << 96) / sqrtPriceX96;
        if (roundUp) {
            equivLiq = SafeCast.toUint128(FullMath.mulDivRoundingUp(myValue, X128, liqValueX128));
        } else {
            equivLiq = SafeCast.toUint128(FullMath.mulDiv(myValue, X128, liqValueX128));
        }
    }
```

`sqrtPriceX96` is set in `Data` from the current uniswap pool spot price:
```solidity
    function getSqrtPriceX96(address pool) internal view returns (uint160 sqrtPriceX96) {
        IUniswapV3Pool poolContract = IUniswapV3Pool(pool);
        (sqrtPriceX96, , , , , , ) = poolContract.slot0();
    }
```

Equivalent liquidity is calculated by dividing the value of fees at the current price by the value of 1 unit of liquidity at the current price. The issue is that equivalent liquidity amount depends on spot price, and spot price can be easily manipulated by the user. 

Example chart of equivalent liquidity depending on the price is given at this [link](https://www.desmos.com/calculator/akvmkwwzsj)

This allows attacker to manipulate spot price to a value, which makes the equivalent liquidity much smaller than at the correct spot price, deposit maker liquidity (at reduced liquidity share price), then manipulate spot price back to the correct value and remove maker liquidity (at correct liquidity share price). All of these actions can be done in 1 transaction, allowing attacker to also utilize flash loan to perform it.

After such an attack, the pool maker assets will remain the same, but part of the fees will be given to attacker (fees stolen).


### Root Cause

Equivalent liquidity depends on spot price:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/Pool.sol#L243-L259


### Internal Pre-conditions

Large enough fees accured and not compounded on maker position.

### External Pre-conditions

None.

### Attack Path

Note: `a0` is used for amount of `token0`, `a1` for amount of `token1`

1. Attacker chooses liquidity range with a lot of makers fees accured. For example:
1.1. Current `price = 100`, the range is `[10;200]`
1.2. Liquidity deposited by makers = 10K (293 `a0` + 68377 `a1` = $97677)
1.3. Fees accumulated: 977 `a0` = $97700
1.4. `Liquidity value = 0.977`
1.5. `Fees value = 9770`
1.6. `Equivalent liquidity = 9770 / 0.977 = 10000`
1.7. `liquidity share price = (10000 + 10000) / 10000 = 2.0`
2. Attacker manipulates spot price to 1:
2.1. Spend: -2162 `a0`
2.2. Get: +68377 `a1`
3. Attacker deposits 10000 maker liquidity
3.1. Liquidity composition at price = 1: 2455 `a0` + 0 `a1`
3.2. `Liquidity value = 0.2455`
3.3. `Fees value = 977`
3.4. `Equivalent liquidity = 977 / 0.2455 = 3979`
3.5. `liquidity share price = (10000 + 3979) / 10000 = 1.3979`
3.6. Deposit of 10000 liquidity, attacker spends: 2455 `a0`
3.7. Attacker liquidity shares added: 7153
3.8. After deposit, pool composition: 4910 `a0`, 0 `a1`, 17153 total liquidity shares
4. Attacker manipulates spot price back to 100:
4.1. Spend: -117287 `a1`
4.2. Get: +4408 `a0`
5. Attacker withdraws all his maker liquidity (7153 liquidity shares)
5.1. Liquidity composition at price = 100: 502 `a0` + 117287 `a1`
5.2. Attacker receives 209 `a0`, 48910 `a1`, 407 `a0` from fees
5.3. After withdrawal, pool composition: 293 `a0`, 68377 `a1`, 10000 total liquidity shares
5.4. Remaining fees: 570 `a0` = $57000

Pool balances before attack: 293 `a0`, 68377 `a1`, fees: 977 `a0`
Pool balances after attack: 293 `a0`, 68377 `a1`, fees: 570 `a0`

Attacker balances:
`a0`: `-2162-2455+4408+209+407 = +407`
`a1`: `+68377-117287+48910 = 0`
manipulation fees paid (0.3%): 2162 `a0` * 0.003 + 4408 `a0` * 0.003 = 7 + 13 = 20 `a0`
total profit: +407 - 20 = +387 `a0`

Attacker has stolen almost half of the maker fees in 1 transaction. The attack can be repeated or performed with a larger amount to steal higher percentage of the fees.

### Impact

Most maker fees which were not yet compounded can be stolen by anyone in 1 transaction.

Notes: 
1. It only makes sense to steal fees when enough of them have accumulated due to manipulation fees. However, the manipulation fees are comparatively low, in the example above $2000 was used in manipulation fees on liquidity worth $97677 (about 2% of liquidity). So the attack is profitable once at least 2% of maker fees are accumulated. And for pools with smaller fee (0.05%) this number is even smaller.
2. The chart of equivalent liquidity dependance on price can be different depending on fee composition, maker range and current price. However, in most combinations the attack above is possible by choosing the manipulation to a price with the smallest possible equivalent liquidity. In rare circumstances current price will already be in this minimum, either a different range can be chosen, or attacker can just wait until price moves away from this value.

### PoC

None

### Mitigation

Currently withdrawals already handle such manipulation gracefully by only calculating the ratio of liquidity and fees to withdraw. Similar approach to maker liquidity deposit is possible to get rid of equivalent liquidity:
- deposit user liquidity by fetching correct asset amounts from the user
- additionally take corresponding share of maker fees from the user and deposit them to fees (increasing maker fees instead of maker liquidity)

Such approach will keep the liquidity share price the same regardless of price, but the maker fees will increase proportionally with any maker liquidity deposit. This also means that any user's share of fees will be the same after all deposits and withdrawals.
