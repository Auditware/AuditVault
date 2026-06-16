---
tags:
  - lang/solidity
  - sector/oracle
  - sector/staking
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#4-flawed-precision-and-scaling-logic-in-price"
genome:
  - "[[decimal-mismatch]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[chainlink-round-completeness]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
# Flawed Precision and Scaling Logic in `price()`

- id: 62663
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#4-flawed-precision-and-scaling-logic-in-price

## Summary


The bug report is about a function called `price()` in the `ChainlinkCompositeOracleProvider` code. This function starts with a 36-decimal fixed-point accumulator. However, there are two mistakes in the code that distort the final price. 

The first mistake occurs when dealing with inverted feeds (where `isInverted == true`). The code multiplies the accumulator by `(10**assetDecimals) * (10**feed.decimals()) / feedPrice`. This causes the precision scale to increase by `assetDecimals` on each iteration, which can lead to incorrect prices or an overflow error. 

The second mistake happens with non-inverted feeds (where `isInverted == false`). In this case, the accumulator is multiplied by `feedPrice` and divided by `10**currentDecimals`, which maintains the scale of the price. However, when all feeds are non-inverted, the final division by `PRECISION` truncates all fractional data, resulting in a whole-number price. 

These errors can lead to significant discrepancies in prices, making it possible for people to profit from arbitrage opportunities. Therefore, the issue is classified as high severity. 

To fix these mistakes, the recommendation is to use a uniform fixed-point workflow that keeps all intermediate values on the same scale. This can be achieved by using the code snippet provided in the report. The final decimal conversion should only be done at the very end, before returning the price.

## Details

##### Description
The `price()` function in `ChainlinkCompositeOracleProvider` begins with a 36-decimal fixed-point accumulator (`highPrecisionPrice = PRECISION`). Each feed is then folded into that value, but two subtle arithmetic mistakes distort the final price:

1. **Inverted feeds (`isInverted == true`)**
   The code multiplies the accumulator by `(10**assetDecimals) * (10**feed.decimals()) / feedPrice`.
   Because both exponents are reapplied for every inverted feed, the precision scale increases by `assetDecimals` on each iteration, corrupting the effective price by several orders of magnitude, or exceeding the 256-bit limit causing overflow.

2. **Non-inverted feeds (`isInverted == false`)**
   Here, the accumulator is multiplied by `feedPrice` and divided by `10**currentDecimals`, that keeps the scale of price. When all feeds are non-inverted, the accumulator retains its initial 36-decimal offset while the final division by `PRECISION` truncates all fractional data, returning a whole-number price.

Combined, these errors can cause large under- or over-flows, creating a clear path for profitable arbitrage in outer contracts. Hence, the issue is classified as **High** severity.

##### Recommendation
We recommend adopting a uniform fixed-point workflow that keeps every intermediate value on the same scale:
```solidity
uint256 rate = cfg.isInverted
    ? SCALING_FACTOR.mulDiv(
        10 ** config.feed.decimals(),
        uint256(feedPrice)
    )
    : uint256(feedPrice) * (
        10 ** (SCALING_DECIMALS - config.feed.decimals())
    );

highPrecisionPrice = highPrecisionPrice.mulDiv(
    rate,
    SCALING_FACTOR
);

```
and only converts to final decimals once, at the very end:
```solidity
return highPrecisionPrice.mulDiv(10 ** this.decimals(), SCALING_FACTOR);
```
