---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Elytra]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Elytra-security-review_2025-07-10.md"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[token-decimal-normalization]]"
---
# [H-03] Scaling error in `elyAsset` price calculation leads to fee loss

- id: 63546
- impact: HIGH
- protocol: Elytra_2025-07-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elytra]]-security-review_2025-07-10.md

## Summary


The bug report describes a problem with the `updateElyAssetPrice()` function in `ElytraOracleV1`. The function is supposed to calculate the price of a digital asset called `elyAsset`, but it has a calculation error that causes the price to be incorrect. This is because the function does not account for the expected 18-decimal precision in price calculations. As a result, the price is artificially deflated and the protocol loses value. The report recommends fixing the calculation by adding a missing scaling factor of 1e18. 

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `updateElyAssetPrice()` function in `ElytraOracleV1` contains a calculation error where the elyAsset price is computed without proper decimal scaling. The formula `totalValueInProtocol / elyAssetSupply` fails to account for the 18-decimal precision expected for price calculations.

```solidity
        {
            uint256 tempElyAssetPrice = totalValueInProtocol / elyAssetSupply;
            if (tempElyAssetPrice > oldElyAssetPrice) {
                uint256 increaseInElyAssetPrice = tempElyAssetPrice - oldElyAssetPrice;
                uint256 rewardInHYPE = (increaseInElyAssetPrice * elyAssetSupply) / 1e18;
                protocolFeeInHYPE = (rewardInHYPE * protocolFeeInBPS) / 10_000;
            }
        }
```

This creates an issue where:

1. Both `totalValueInProtocol` and `elyAssetSupply` are in 18 decimals (e.g., 2000e18 and 1000e18).
2. The division results in a price of 2 instead of 2e18.
3. This artificially deflates the elyAsset price by a factor of 1e18.
4. The protocol permanently loses value as `tempElyAssetPrice` will always be less than `oldElyAssetPrice`.

## Recommendations

Fix the price calculation by adding the missing 1e18 scaling factor:

```solidity
tempElyAssetPrice = (totalValueInProtocol * 1e18) / elyAssetSupply
```
