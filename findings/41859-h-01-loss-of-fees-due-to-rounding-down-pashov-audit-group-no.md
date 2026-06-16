---
tags:
  - lang/solidity
  - sector/farm
  - sector/stable
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[TitanX]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/TitanX-security-review.md"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[integer-bounds]]"
---
# [H-01] Loss of fees due to rounding down

- id: 41859
- impact: HIGH
- protocol: [[TitanX]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/TitanX-security-review.md

## Summary


This bug report discusses an issue with the `FarmKeeper` contract, which is used to manage fees for users. The problem occurs when tokens with low decimals (e.g. USDC with 6 decimals) and large liquidity amounts are involved, as the contract uses a `SCALE_FACTOR` of `1e12` which can result in precision loss and rounding down to 0. This means that fees collected when liquidity is high will be permanently lost and unclaimable by users. The report recommends increasing the `SCALE_FACTOR` value to 18 to prevent this issue from occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `FarmKeeper` contract uses a `SCALE_FACTOR` of `1e12` when accumulating fees per share of liquidity. For tokens with low decimals (e.g. USDC with 6 decimals) and large liquidity amounts, this can lead to precision loss and rounding down to 0, resulting in permanent loss of fees for users.

Let's consider a token with 6 decimals such as USDC.

The issue occurs because:

- amount0/amount1 can be as low as 1 unit (e.g. 1e6 for USDC)
- liquidity is a uint128, so can be up to ~3.4e38
- SCALE_FACTOR is only 1e12

This means the calculation can result in: `1e6 * 1e12 / 1e38 = 1e-20` which rounds down to 0 due to integer division.

We can see that if the token is in 6 decimals, with the liquidity amount > 1e18 (doesn't need to be in e38), the incremental fee per share for the token is rounded down to 0.

Combined with the `updateFarm`, it can be called by anyone to collect the fees. Malicious actors can exploit this by calling `updateFarm` frequently to force fee collection when amounts are small.

```solidity
  function _collectFees(Farm storage farm) private {

    // Handle token0
    if (isInputToken0) {
    ...
    } else {
      farm.accFeePerShareForToken0 += Math.mulDiv(amount0, Constants.SCALE_FACTOR, liquidity);
    }

    // Handle token1
    if (isInputToken1) {
    ...
    } else {
      farm.accFeePerShareForToken1 += Math.mulDiv(amount1, Constants.SCALE_FACTOR, liquidity);
    }
  }
```

The impact is fees collected when liquidity is high will be permanently lost and unclaimable by users.

## Recommendations

Increase the `SCALE_FACTOR` value to 18 to prevent the calculation from rounding down to 0.
