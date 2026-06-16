---
tags:
  - lang/solidity
  - sector/oracle
  - platform/cantina
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
protocol: "[[Mellow]]"
auditors:
  - "[[Kaden]]"
report: "https://cdn.cantina.xyz/reports/cantina_mellow_apr2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# getOraclePrice is prone to manipulation 

- id: 40579
- impact: HIGH
- protocol: [[Mellow]]
- reporter: Kaden (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_mellow_apr2024.pdf

## Summary


The bug report is about a faulty assumption in the code of VeloOracle.sol, specifically in line 70. The function getOraclePrice is used to get the latest price from a Velodrome pool. However, the code assumes that if the latest observation's timestamp is in the past, the price cannot be manipulated and is returned without any additional checks. This is a problem because Velodrome pools only update their observations every 15 seconds, which leaves room for a manipulated price to be returned. The recommendation is to only use the latest observation price if more than 15 seconds have passed since the last update. This bug has been fixed in commit 736eef90 by both Mellow and Cantina Managed. The risk level of this bug is considered medium. It is important for external protocols to not solely rely on the price returned by this function, but also make a call to ensure that there is no manipulation.

## Details

## Vulnerability Assessment

## Context
**File:** VeloOracle.sol  
**Line:** 70

## Description
The `getOraclePrice` function is used to retrieve the latest price from a Velodrome pool. There is a faulty assumption that if the latest observation's timestamp is in the past, the `slot0` price can't have been manipulated, and thus it is returned with no extra checks made. The problem arises because Velodrome pools write observations once every 15 seconds, allowing for a manipulated price with an outdated observation.

```solidity
if (block.timestamp != blockTimestamp)
    return (spotSqrtPriceX96, spotTick);
```

## Recommendation
Use the latest observation price only if more than 15 seconds have passed since the last observation.

## Additional Notes
- **Mellow:** Fixed in commit `736eef90`.
- **Cantina Managed:** Fixed in commit `736eef90`. Oracle now always returns the spot price. It is important for external protocols to not simply rely on the price returned here, but rather also make a call to `ensureNoMEV`.
