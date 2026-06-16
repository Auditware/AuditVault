---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/bridge
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-check]]"
  - "[[precondition/privileged-caller]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] Loss of claimable rewards upon gauge deactivation

- id: 58153
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


This bug report describes an issue in the `Voter` contract where the `killGauge` and `reviveGauge` functions allow the `emergencyCouncil` to deactivate and reactivate gauges. However, when a gauge is killed, its associated claimable rewards are set to zero, resulting in the permanent loss of any accumulated rewards. This means that even if the gauge is later revived, the previously accumulated rewards cannot be recovered. Additionally, the other gauge's reward is still based on `totalWeight`, which is never properly adjusted, leading to a loss of rewards. To fix this issue, it is recommended to implement a mechanism that allows for the recovery of `claimable` rewards when a gauge is revived.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `killGauge` and `reviveGauge` functions in the `Voter` contract allow the `emergencyCouncil` to deactivate and reactivate gauges. However, once a gauge is killed, its associated claimable rewards are set to zero, resulting in the permanent loss of any accumulated rewards, even if the gauge is later revived.

In the contract, the following code snippets illustrate the issue:

```solidity
   function killGauge(address _gauge) external {
       require(msg.sender == emergencyCouncil, "not emergency council");
       require(isAlive[_gauge], "gauge already dead");
       isAlive[_gauge] = false;
       claimable[_gauge] = 0; // Claimable rewards are reset to zero
       emit GaugeKilled(_gauge);
   }
```

When a gauge is killed, the `claimable` rewards for that gauge are set to zero, meaning that any rewards that were accumulated prior to killing the gauge are permanently lost. Even if the gauge is revived later, the previously accumulated rewards cannot be recovered.

Also, at the same time, the other gauge's reward is still based on `totalWeight`, which is never properly adjusted, leading to a loss of rewards.

```solidity
            uint _delta = _index - _supplyIndex; // see if there is any difference that need to be accrued
            if (_delta > 0) {
                uint _share = (uint(_supplied) * _delta) / 1e18; // add accrued difference for each supplied token
                if (isAlive[_gauge]) {
                    claimable[_gauge] += _share;
                }
```

```solidity
    function notifyRewardAmount(uint amount) external {
        _safeTransferFrom(base, msg.sender, address(this), amount); // transfer the distro in
        uint256 _ratio = (amount * 1e18) / totalWeight; // 1e18 adjustment is removed during claim
        if (_ratio > 0) {
            index += _ratio;
        }
        emit NotifyReward(msg.sender, base, amount);
    }

```

## Recommendations

To address this issue, it is recommended to implement a mechanism that allows for the recovery of `claimable` rewards when a gauge is revived.
