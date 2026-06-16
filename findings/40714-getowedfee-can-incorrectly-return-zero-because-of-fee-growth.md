---
tags:
  - lang/solidity
  - sector/dex
  - platform/cantina
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/fee-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Particle]]"
auditors:
  - "[[100proof]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_particle_feb2024.pdf"
genome:
  - "[[underflow]]"
  - "[[fee-calculation]]"
  - "[[known-pattern]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
---
# getOwedFee can incorrectly return zero because of fee growth underﬂow 

- id: 40714
- impact: HIGH
- protocol: [[Particle]]
- reporter: 100proof (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_particle_feb2024.pdf

## Summary


This bug report discusses an issue with the getOwedFee function in the Uniswap V3 protocol. The function is supposed to calculate the fees owed to users, but in certain situations, it returns a value of zero instead of the correct amount. This occurs when there is an underflow in the calculation of feeGrowthInside0X128, which is not properly accounted for in the function. The report recommends rewriting the function to fix this issue. 

## Details

## Context
(No context files were provided by the reviewer)

## Description
Although function `getFeeGrowthInside` correctly accounts for Uniswap V3's principled use of underflow to calculate `feeGrowthInside[0/1]X128`, function `getOwedFee` will incorrectly return zero for `token[0/1]Owed` in the following situation:

- A Uniswap position has its `feeGrowthInside0X128` calculated, but an underflow happened during the calculation, e.g. `feeGrowthInside0X128 == type(uint256).max - 1e18 + 1`.
- A Particle user calls `openPosition` and has this value stored in the `Lien.Info`'s `feeGrowthInside0LastX128` field.
- While the Particle position is open, the Uniswap position has its values changed such that a call to `Base.getFeeGrowthInside` returns a small positive value, e.g. `feeGrowthInside0X128 == 2e18`.
- The Particle user calls `closePosition`, invoking `getOwedFee`. However, it is not true that `feeGrowthInside0X128 > feeGrowthInside0LastX128` on `Base.sol- L378`, so `token0Owed` is returned as zero.

If we look at Uniswap V3's `Position.update` function we have:

```solidity
uint128 tokensOwed0 =
uint128(
    FullMath.mulDiv(
        feeGrowthInside0X128 - _self.feeGrowthInside0LastX128,
        _self.liquidity,
        FixedPoint128.Q128
    )
);
uint128 tokensOwed1 =
uint128(
    FullMath.mulDiv(
        feeGrowthInside1X128 - _self.feeGrowthInside1LastX128,
        _self.liquidity,
        FixedPoint128.Q128
    )
);
```

Note that there is no check that `feeGrowthInside0X128 > _self.feeGrowthInside0LastX128`. If we use the values from our example, `2e18 - (type(uint256).max - 1e18 + 1)` will evaluate to `3e18` because Uniswap V3 contracts are compiled with Solidity version < 8, where underflow is permitted. The impact is that `getOwedFee` returns zero when it shouldn't, and LPs lose out on fees.

> **Note:** The same problem occurs in `ParticleInfoReader.getInterestInfo`, but the impact is lower.

More information can be found in these GitHub issues:
- Uniswap.
- Jeiwan's Uniswap V3 book.

## Recommendation
Rewrite `getOwedFee` as:

```solidity
function getOwedFee(
    uint256 feeGrowthInside0X128,
    uint256 feeGrowthInside1X128,
    uint256 feeGrowthInside0LastX128,
    uint256 feeGrowthInside1LastX128,
    uint128 liquidity
) internal pure returns (uint128 token0Owed, uint128 token1Owed) {
    unchecked {
        if (feeGrowthInside0X128 != feeGrowthInside0LastX128) {
            token0Owed = uint128(
                FullMath.mulDiv(feeGrowthInside0X128 - feeGrowthInside0LastX128, liquidity, FixedPoint128.Q128)
            );
        }
        if (feeGrowthInside1X128 != feeGrowthInside1LastX128) {
            token1Owed = uint128(
                FullMath.mulDiv(feeGrowthInside1X128 - feeGrowthInside1LastX128, liquidity, FixedPoint128.Q128)
            );
        }
    }
}
```

Similarly for `ParticleInfoReader.getInterestInfo`.

**Particle:** Fixed. The `< 0.8.0` underflow is now using unchecked.
