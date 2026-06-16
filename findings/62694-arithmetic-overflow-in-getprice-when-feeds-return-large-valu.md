---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Pike/README.md#1-arithmetic-overflow-in-getprice-when-feeds-return-large-values"
genome:
  - "[[liquidation-logic]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[chainlink-round-completeness]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# Arithmetic Overflow in `getPrice` When Feeds Return Large Values

- id: 62694
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Pike/README.md#1-arithmetic-overflow-in-getprice-when-feeds-return-large-values

## Summary


The `ChainlinkOracleComposite` contract has a bug in its `getPrice` function. This causes the contract to freeze if a feed reports a price higher than $100,000, resulting in all contracts that depend on this oracle to also freeze. To fix this, it is recommended to either use a 512-bit safe-math library or reduce the `SCALING_DECIMALS` value. This issue is classified as high severity as it can affect multiple protocols that use this oracle.

## Details

##### Description
This issue has been identified within the `getPrice` function of the `ChainlinkOracleComposite` contract. 

`getPrice` normalises each feed answer and then multiplies the current composite price by that rate:

```solidity
rate = uint256(price) 
     * 10**(SCALING_DECIMALS - feed.decimals());
compositePrice = (compositePrice * rate) 
               / SCALING_FACTOR; // 36-dec fixed-point
```

If a feed reports `price > 1.16 * 10^(5 + feed.decimals)` (≈ $100 000 when denominated in wei), the term  

```
compositePrice * rate * 10^36
```

exceeds the 256‑bit limit. The call reverts with arithmetic overflow, freezing every contract that depends on this oracle for lending, liquidation, or pricing logic.

The issue is classified as **high** severity because a single inflated data point bricks the entire oracle and all protocols integrated with it. 

##### Recommendation
We recommend either replacing the simple `* /` pair with a 512‑bit safe‑math library such as OpenZeppelin’s `mulDiv` or reducing `SCALING_DECIMALS`.
