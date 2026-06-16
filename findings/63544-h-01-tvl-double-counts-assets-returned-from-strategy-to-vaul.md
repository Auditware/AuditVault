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
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-01] TVL double-counts assets returned from strategy to vault

- id: 63544
- impact: HIGH
- protocol: Elytra_2025-07-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Elytra]]-security-review_2025-07-10.md

## Summary


The bug report states that when assets are allocated to a strategy, there is an issue where the same tokens are counted twice in the total value locked (TVL) calculations. This is because the tokens are counted once in the deposit pool's strategy allocation and again in the vault's claimable assets. The report recommends adjusting the values when the receiveFromStrategy function is triggered to avoid this double-counting issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When assets are allocated to a strategy, `ElytraDepositPoolV1.assetsAllocatedToStrategies[asset]` is incremented. Later, the strategy can return funds to the unstaking vault via:

```solidity
    /// @notice Receives assets from strategy for withdrawal processing
    /// @param asset Asset address
    /// @param amount Amount received
    function receiveFromStrategy(address asset, uint256 amount) external onlyStrategy {
        claimableAssets[asset] += amount;
        emit AssetsReceivedFromStrategy(asset, amount);
    }
```

However, this would create a double-counting problem in the TVL calculations since the same tokens would end up counted twice 
1. In the deposit pool’s strategy allocation (`assetsAllocatedToStrategies[asset]`).
2. In the vault’s claimable assets (`claimableAssets[asset]`).

Since `getTotalAssetTVL` sums both values, the returned strategy assets inflate TVL improperly.

## Recommendations

Consider decreasing the `assetsAllocatedToStrategies` and the `assetStrategyAllocations` of `ElytraDepositPoolV1`, when `receiveFromStrategy` is being triggered.
