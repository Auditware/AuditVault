---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/bridge
  - sector/lending
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-04-30.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-04] Stale `inFlightBridgeAmounts` cause incorrect `tvl` calculations

- id: 61481
- impact: HIGH
- protocol: Blueberry_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-04-30.md

## Summary


The bug report describes an issue with the `inFlightBridgeAmounts` mapping in the `L1EscrowActions` contract. This mapping is not being cleared after assets are settled on L1, leading to outdated and incorrect values being included in TVL calculations. To reproduce this issue, one must execute `bridgeToL1` for one asset, settle it on L1, then execute `bridgeToL1` for another asset and calculate TVL. The recommendation to resolve this issue is to implement a 2D mapping structure to track in-flight amounts by both asset index and block number.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `inFlightBridgeAmounts[assetIndex]` mapping in the `L1EscrowActions` contract is not cleared after assets are settled on L1. This leads to outdated and unrelated in-flight amounts lingering in the mapping, which are then incorrectly included in `tvl` calculations.

**Steps to reproduce**  
1. **Block 1**: Execute `bridgeToL1` for `assetA`. The `inFlightBridgeAmounts[assetA]` mapping is updated with the corresponding bridged amount.  
2. **Block 2**: Asset A settles on L1. However, the `inFlightBridgeAmounts[assetA]` mapping remains uncleared.  
3. **Block 3**: Execute `bridgeToL1` for `assetB`. The `inFlightBridgeAmounts[assetB]` mapping is updated with the new bridged amount.  
4. **Block 3**: Compute `tvl`. The calculation incorrectly factors in the stale `inFlightBridgeAmounts[assetA]` alongside the active `inFlightBridgeAmounts[assetB]`.

This behavior results in inflated `tvl` reporting which has secondary effects on the protocol's share accounting.

## Recommendations

To resolve this issue, consider implementing a 2D mapping structure to track in-flight amounts by both asset index and block number:  
```solidity
mapping(uint64 assetIndex => mapping(uint256 blockNumber => uint256 amount)) inFlightBridgeAmounts;
```  
