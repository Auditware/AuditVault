---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - platform/quantstamp
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Sperax Farms]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# Underflow in `Farm._getRewardAccrualTimeElapsed()`

- id: 59249
- impact: HIGH
- protocol: Sperax - Farms
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html

## Summary


This report is about a bug found in a code for a Farm contract. The bug allows someone to exploit the contract and drain all the reward tokens from it. The bug occurs when setting up the Farm and the start time for reward accumulation is in the future. When a user makes a deposit, the reward calculation is incorrect and all reward tokens can be drained. The recommendation is to fix the calculation in the code to prevent this exploit.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `edb854e128420bb1723ef517f79c06b08bfbb6d7`. The client provided the following explanation:

> *   The bug was introduced in Demeter UniswapV3 Farm upgrades #21.
> *   Replaced lastFundUpdateTime with farmStartTime. -_getRewardAccrualTimeElapsed now returns 0 if block.timestamp > farmStartTime or lastFundUpdateTime = 0.
> *   Updated the logic for when lastSecondsInside is updated to address issues in UniV3ActiveLiquidityFarm.
> *   Adjusted test cases to reflect these changes.

**File(s) affected:**`Farm.sol`

**Description:** When the Farm is set up using `_setupFarm()`, a `_farmStartTime` is assigned which marks the start of reward accumulation. This timestamp is stored in the `lastFundUpdateTime` variable, which is later meant to keep track of the last update time. After the setup is completed, the Farm is already considered active and open such that deposits can already be made. This in turn attempts to update the reward calculations using the `_updateFarmRewardData()` function. This function does not check the intended start time of the Farm, and instead retrieves the elapsed time since the last update from `_getRewardAccrualTimeElapsed()`, where an unchecked subtraction occurs. However, since `lastFundUpdateTime` stores the start time, which can be in the future, this calculation will underflow and result in massive time periods, for which rewards will be incorrectly accrued leading to the loss of all reward tokens already present in the contract. This exploit can occur at any time between the setup of the Farm and the specified start time.

**Exploit Scenario:**

1.   A new Farm is created to have a Farm start time defined for 2 seconds in the future. `Farm._setupFarm()` updates the state variable, `lastFundUpdateTime` to be this configured start time, `lastFundUpdateTime = 2`.
2.   1 second later (`block.timestamp = 1`), a user deposits into this Farm. During the deposit, `_updateFarmRewardData()` is called, which in turn, calculates the time used for determining the accrued rewards to be `_getRewardAccrualTimeElapsed()`.
3.   The time that has passed will calculated to be `1 - 2 = type(uint256).max` in `_getRewardAccrualTimeElapsed()` due to the subtraction happening in the `unchecked` block.
4.   Now, in `_updateFarmRewardData()`, when calculating the `_getAccRewards()`, the accumulated rewards will be equivalent to the balance of Reward Tokens in the contract, which will be totally allocated to this sole depositor.
5.   Immediately following this deposit, the user could claim their rewards to drain the contract of all Reward tokens.

**Recommendation:** In `_getRewardAccrualTimeElapsed()`, if `lastFundUpdateTime` is in the future, return zero.
