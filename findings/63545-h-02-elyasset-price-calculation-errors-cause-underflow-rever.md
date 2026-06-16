---
tags:
  - lang/solidity
  - sector/oracle
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Elytra]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Elytra-security-review_2025-07-10.md"
genome:
  - "[[underflow]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[token-decimal-normalization]]"
---
# [H-02] `elyAsset` price calculation errors cause underflow reverts

- id: 63545
- impact: HIGH
- protocol: Elytra_2025-07-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elytra]]-security-review_2025-07-10.md

## Summary


This bug report discusses an issue with the `updateElyAssetPrice()` function in a software program. The function contains a mathematical error that causes a scaling mismatch, resulting in an underflow. This occurs because the code unnecessarily multiplies a value by 1e18, making it too large. The report recommends removing this multiplication to fix the calculation.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `updateElyAssetPrice()` function contains a mathematical error where `protocolFeeInHYPE` is incorrectly multiplied by 1e18 before being subtracted from `totalValueInProtocol`. Since both values are already in 18-decimal precision, this unnecessary multiplication creates a massive scaling mismatch that causes the subtraction to underflow.

```solidity
uint256 newElyAssetPrice = (totalValueInProtocol - (protocolFeeInHYPE * 1e18)) * 1e18 / elyAssetSupply;
```

The issue occurs because:

2. `protocolFeeInHYPE` is already in 18 decimals.
3. The code multiplies `protocolFeeInHYPE` by 1e18, making it e36.

#### Let's take a simple example:

`elyAssetSupply` - 1,000e18
`oldElyAssetPrice` - 1.00e18 
`totalValueInProtocol` - 1,050e18
`protocolFeeInBPS` - 1,000 (10%)

```solidity
tempElyAssetPrice = totalValueInProtocol / elyAssetSupply
                  = 1050e18 / 1000e18
                  = 1.05e18 // I scaled this to fix C-03

increaseInElyAssetPrice = tempElyAssetPrice - oldElyAssetPrice
                        = 1.05e18 - 1.00e18
                        = 0.05e18

rewardInHYPE = (increaseInElyAssetPrice * elyAssetSupply) / 1e18
             = (0.05e18 * 1000e18) / 1e18
             = 50e18

protocolFeeInUSD = (rewardInUSD * protocolFeeInBPS) / 10_000
                 = (50e18 * 1000) / 10_000
                 = 5e18

newElyAssetPrice = (1050e18 - 5e18 * 1e18) * 1e18 / 1000e18
                 = (1050e18 - 5e36) * 1e18 / 1000e18
                 = underflow ❌
```

## Recommendations

Fix the calculation by removing the unnecessary 1e18 multiplication:
```solidity
newElyAssetPrice = (totalValueInProtocol - protocolFeeInHYPE) * 1e18 / elyAssetSupply;
```
