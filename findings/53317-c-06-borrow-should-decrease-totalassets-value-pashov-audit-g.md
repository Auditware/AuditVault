---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[use-reentrancy-guard]]"
---
# [C-06] `borrow()` should decrease `totalAssets` value

- id: 53317
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The OmoVault contract has a bug in the `borrow()` function, which is only used by the agent. This function transfers assets to the agent, but there is no system in place to keep track of these debts. This means that the contract relies on off-chain security, which is not ideal. Additionally, the `_totalAssets` variable is not being updated, which affects the calculation of `totalAssets()`. The current implementation counts the borrowed assets by the agent twice, when it should only be the sum of all assets in the vault and all Uni V3 position values in DynamicAccounts. To fix this, it is recommended to update the `_totalAssets` variable in the `borrow()` function to subtract the borrowed assets from the total. 

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `OmoVault.sol` contract has a `borrow()` used only by the agent, which transfers assets to the Agent.
It has no tracking system for those debts (it depends on off-chain security).
Also, it does not update the `_totalAssets` variable

```solidity
File: OmoVault.sol

403:     function borrow(uint256 assets, address receiver) external nonReentrant onlyAgent {
407:         address msgSender = msg.sender;
409:         require(assets != 0, "ZERO_ASSETS");
411:         asset.safeTransfer(receiver, assets);
414:     }

```

This will affect the `totalAssets()` calculation,because The current implementation computes the borrowed assets by the agent two times.
But the `totalAssets()` should be the sum of all assets in the vault and all Uni V3 position values in DynamicAccounts.

## Recommendations

```diff
File: OmoVault.sol

403:     function borrow(uint256 assets, address receiver) external nonReentrant onlyAgent {
407:         address msgSender = msg.sender;
409:         require(assets != 0, "ZERO_ASSETS");
+410:      _totalAssets =  _totalAssets - assets;
411:         asset.safeTransfer(receiver, assets);
414:     }

```
