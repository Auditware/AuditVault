---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Roots]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
---
# [C-01] Incorrect interface used for gauge contract in `Staker`

- id: 55110
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md

## Summary


This report describes a bug in the `Staker` contract that causes the `_updateRewardIntegral()` function to revert when `_fetchRewards()` is executed. This is due to a mismatch between the `IGauge` interface and the `RewardVault` contract for the `getReward` function. This bug has a high impact and likelihood, as it can lead to funds being locked. The recommended solution is to add an additional parameter to the `getReward` function call in the `_fetchRewards()` function.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The `Staker` contract is meant to interact with the `RewardVault` contract. However, the `IGauge` interface does not match the interface of the `RewardVault` contact for the [`getReward` function](https://docs.berachain.com/developers/contracts/reward-vault#getreward).

```solidity
File: IRewardVault.sol
function getReward(address account, address recipient) external returns (uint256);
```

```solidity
File: IGauge.sol
function getReward(address) external returns (uint256);
```

This will provoke the `_updateRewardIntegral()` function to revert when `_fetchRewards()` is executed.

```solidity
File: Staker.sol
    function _fetchRewards() internal {
        gauge.getReward(address(this));
```

The `_updateRewardIntegral()` function is executed on the most important operations for the protocol, such as opening, closing and adjusting troves, collateral redemption or liquidation, breaking the protocol's functionality and leading to funds being locked.

## Recommendations

```diff
    function _fetchRewards() internal {
-       gauge.getReward(address(this));
+       gauge.getReward(address(this), address(this));
```
