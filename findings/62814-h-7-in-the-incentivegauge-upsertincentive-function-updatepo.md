---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[BMX]]"
auditors:
  - "[[0xpetern]]"
  - "[[ami]]"
  - "[[cpsec]]"
  - "[[jayjoshix]]"
  - "[[maigadoh]]"
  - "[[oct0pwn]]"
  - "[[x15]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[reward-calculation]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-7: In the `IncentiveGauge._upsertIncentive()` function, `_updatePoolByPid()` should be called outside the `if` statement

- id: 62814
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: x15 (Sherlock)
- source: N/A

## Summary


Summary:

A bug was found by several individuals in the `IncentiveGauge._upsertIncentive()` function of the Deli-Swap protocol. If the reward rate is set to 0, the `_updatePoolByPid()` function is not executed, resulting in the pool's `lastUpdated` timestamp remaining at an older time. This causes the released reward amount for a token to be inaccurately calculated during the next update. This can lead to a shortage of available rewards for claiming, difficulty in removing liquidity, and hinder position burning. The bug has been fixed by calling `_updatePoolByPid()` outside of the `if` statement in the code.

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/240 

## Found by 
0xpetern, ami, cpsec, jayjoshix, maigadoh, oct0pwn, x15

### Summary

In the `IncentiveGauge._upsertIncentive()` function, if `rewardRate == 0`, then `_updatePoolByPid()` is not executed. This results in the `lastUpdated` timestamp of the pool remaining at its original, older timestamp. Meanwhile, the reward token being upserted begins its release from the current timestamp.

Consequently, during the next update, the released reward amount for the token will be inaccurately calculated. The released amount is determined by the timestamp difference between the pool's `lastUpdated` and the moment of the update, incorrectly assuming that the reward started its release at the pool's `lastUpdated` timestamp.

### Root Cause

As shown at line [486](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/IncentiveGauge.sol#L486), the function `IncentiveGauge._upsertIncentive()` calls `_updatePoolByPid()` only if `info.rewardRate > 0`.

```solidity
    function _upsertIncentive(PoolId pid, IERC20 token, uint256 amount) internal returns (uint128 rate) {
        IncentiveInfo storage info = incentives[pid][token];

        uint256 total = amount;
        if (info.rewardRate > 0) {
            // For active schedules, first update pool accounting, then add leftover budget
486          _updatePoolByPid(pid);
            if (block.timestamp < info.periodFinish) {
                uint256 remainingTime = info.periodFinish - block.timestamp;
                uint256 leftover = remainingTime * info.rewardRate;
                if (amount <= leftover) revert DeliErrors.InsufficientIncentive();
                total += leftover;
            }
        }

        rate = SafeCast.toUint128(total / TimeLibrary.WEEK);
        info.rewardRate = rate;
497     info.periodFinish = uint64(block.timestamp + TimeLibrary.WEEK);
        info.lastUpdate = uint64(block.timestamp);
        info.remaining = SafeCast.toUint128(total);
    }
```

Consider the case where `info.rewardRate == 0`:

1. `_updatePoolByPid()` is not called. Since the pool is not updated, the pool's `lastUpdated` remains an older timestamp.
2. As indicated at line 497, the release of the reward token begins from the current timestamp.
3. During the next update:

    The released reward amount is calculated using active seconds: `endTs - poolLast`, but this is incorrect because `poolLast` is an older timestamp that predates the reward token's release.
    ```solidity
        function _updatePool(PoolId pid, int24 currentTick) internal {
            ...

                if (info.rewardRate > 0) {
                    uint256 endTs = nowTs < info.periodFinish ? nowTs : info.periodFinish;
                    if (endTs > poolLast) {
    @>                  uint256 activeSeconds = endTs - poolLast;
                        amt = uint256(info.rewardRate) * activeSeconds;
                    }
                }

                ...
    ```

As a result, a larger amount is incorrectly captured as the released amount.

### Internal pre-conditions

### External pre-conditions

### Attack Path

### Impact

This issue leads to an excess reward amount being allocated to the pool, which can result in a lack of available rewards for claiming, hinder position burning, and make it impossible to remove liquidity.

### PoC

### Mitigation

`_updatePoolByPid()`  should be called outside the `if` statement:

```diff
    function _upsertIncentive(PoolId pid, IERC20 token, uint256 amount) internal returns (uint128 rate) {
        IncentiveInfo storage info = incentives[pid][token];

+       _updatePoolByPid(pid);

        uint256 total = amount;
        if (info.rewardRate > 0) {
            // For active schedules, first update pool accounting, then add leftover budget
-            _updatePoolByPid(pid);
            if (block.timestamp < info.periodFinish) {
                uint256 remainingTime = info.periodFinish - block.timestamp;
                uint256 leftover = remainingTime * info.rewardRate;
                if (amount <= leftover) revert DeliErrors.InsufficientIncentive();
                total += leftover;
            }
        }

        ...
    }
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/morphex-labs/deli-swap-contracts/pull/21
