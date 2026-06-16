---
tags:
  - lang/solidity
  - sector/oracle
  - platform/pashov
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-July.md"
genome:
  - "[[spot-price]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-01] `spotTimeWeightedPrice` and `withSwapping` may conflict

- id: 41031
- impact: HIGH
- protocol: Radiant-July
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-July.md

## Summary


The `autoRebalance` function has two input parameters that are used to determine the new `baseLower` and `baseUpper` values. However, when the `useOracleForNewBounds` parameter is set to `false` and the `withSwapping` parameter is set to `true`, there is a problem that causes the spot price after the swap to be different from the `spotTimeWeightedPrice` obtained before the swap. This results in an unreasonable final liquidity range, which can lead to issues such as mint failure or uncompensated losses. To fix this, it is recommended to ensure that the swap limit price is the same as `priceRefForBounds`.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `autoRebalance` function has two input parameters.

- `useOracleForNewBounds`: If `false`, use `spotTimeWeightedPrice` to determine the new `baseLower` and `baseUpper`
- `withSwapping`: If `true`, when the difference between spot and oracle prices is too large, some tokens will be swapped to make the spot price closer to the oracle price.

The following scenario occurs when `useOracleForNewBounds` is `false` and `withSwapping` is `true` and the price difference between spot and oracle is too large. There is a discrepancy between the spot price after the swap and the `spotTimeWeightedPrice` obtained before the swap. The `baseLower` and `baseUppe` are determined by the price before the swap. This will lead to an unreasonable final liquidity range.

In extreme cases, this may result in mint failure or uncompensated losses due to the use of unreasonable liquidity ranges.

## Recommendations

Make sure the swap limit price is the same as `priceRefForBounds`.
