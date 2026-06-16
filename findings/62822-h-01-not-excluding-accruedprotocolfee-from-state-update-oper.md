---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/uncollat-lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - fix/use-twap
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Covenant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Covenant-security-review_2025-08-18.md"
genome:
  - "[[underflow]]"
  - "[[wrong-state]]"
  - "[[use-twap]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-01] Not excluding `accruedProtocolFee` from state update operations causes several issues

- id: 62822
- impact: HIGH
- protocol: Covenant_2025-08-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Covenant]]-security-review_2025-08-18.md

## Summary


The report outlines a bug that can cause issues if the Covenant governance turns on protocol fees. When a certain function is called, it calculates a fee based on a value and then uses that value in multiple operations. However, the issue is that the fee is not subtracted from the value before it is used in subsequent operations, causing incorrect calculations and potential underflow errors. The report recommends subtracting the fee before using the value in other operations. 

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Covenant governance can turn on protocol fees, which if done, can cause several issues.

When `_calculateMarketState` is called, it calculates the accrued fee based on `baseTokenSupply`. This fee is added to `protocolFeeGrowth` and deducted from `baseTokenSupply`. However, several operations after the fee accrual still use the `baseTokenSupply` value that includes the fee, which causes several issues.

- The `lastETWAPBaseSupply` update will use an incorrect `baseTokenSupply`, since the accrued fee decreases `baseTokenSupply`. This results in an overestimation of the actual `baseTokenSupply` that should be used to update `lastETWAPBaseSupply`.

```solidity
// ...
            // If baseTokenSupply has decreased since the last update, then decrease the ETWAPBaseSupply tracker
            if (marketState.baseTokenSupply < marketState.lexState.lastETWAPBaseSupply)
                marketState.lexState.lastETWAPBaseSupply =
                    marketState.lexState.lastETWAPBaseSupply.rayMul(updateFactor) +
                    marketState.baseTokenSupply.rayMul(WadRayMath.RAY - updateFactor); // eTWAP update if baseSupply decreased vs last update
        }

        // if baseTokenSupply has increased (even in same timeblock), update record
        if (marketState.baseTokenSupply >= marketState.lexState.lastETWAPBaseSupply)
            marketState.lexState.lastETWAPBaseSupply = marketState.baseTokenSupply; // immediatedly update if baseSupply increased vs last update
```

- The `baseTokenSupply` converted to `liquidity` is also used to determine `maxDebtValue`. This overestimates `maxDebtValue`, which is very dangerous as it could incorrectly indicate that the market is not undercollateralized.

```solidity
// ...
            marketState.liquidity = _synthToDex(marketState, baseTokenSupply, AssetType.BASE, Math.Rounding.Floor)
                .toUint160();

            // Calculate debt balanced value from zTokenSupply
            marketState.dexAmounts[0] = _synthToDex(
                marketState,
                marketState.supplyAmounts[0],
                AssetType.DEBT,
                Math.Rounding.Floor
            );

            // Check max value for debt, given availablie liquidity in market.
            uint256 maxDebtValue = SqrtPriceMath.getAmount0Delta(
                _edgeSqrtPriceX96_A,
                _edgeSqrtPriceX96_B,
                marketState.liquidity,
                Math.Rounding.Floor
            );
// ...
```

- Which also used to calculate `dexAmounts[1]` and `lastSqrtPriceX96`.

```solidity
// ...
            (marketState.dexAmounts[1], marketState.lexState.lastSqrtPriceX96) = LatentMath
                .getMarketStateFromLiquidityAndDebt(
                    _edgeSqrtPriceX96_A,
                    _edgeSqrtPriceX96_B,
                    marketState.liquidity,
                    marketState.dexAmounts[0]
                );
// ...
```

- The `lastSqrtPriceX96`, `dexAmounts`, and `liquidity` are also used inside `mint`, `redeem`, and `swap` operations, causing these operations to return incorrect token amounts.

- Full-redeem underflow/DoS via protocol fee accrual, full redeem sets `amountOut = baseTokenSupply`, but `Covenant then subtracts both `amountOut` and `protocolFees`, underflowing and reverting when any fee > 0.

```solidity
// ...
if (aTokenAmountIn == marketState.supplyAmounts[1] && zTokenAmountIn == marketState.supplyAmounts[0]) {
    amountOut = marketState.baseTokenSupply;
    nextSqrtPriceX96 = _targetSqrtPriceX96;
}
// ..
```

```solidity
// ...
        // Update market state (storage)
        marketState[redeemParams.marketId].baseSupply = baseSupply - amountOut - protocolFees;
        if (protocolFees > 0) marketState[redeemParams.marketId].protocolFeeGrowth += protocolFees;
// ...
```

## Recommendations

Decrease `baseTokenSupply` by the calculated fee before using it in subsequent operations.
