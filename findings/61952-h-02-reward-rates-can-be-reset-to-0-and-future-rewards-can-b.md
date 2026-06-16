---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/governance
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[KittenSwap]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-07-31.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Reward rates can be reset to 0 and future rewards can be stolen from voters

- id: 61952
- impact: HIGH
- protocol: KittenSwap_2025-07-31
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[KittenSwap]]-security-review_2025-07-31.md

## Summary


This bug report discusses a problem in the `Voter.distribute()` function that allows for an exploit to occur in the `AlgebraGauge` contract. This exploit can be used to reset reward rates to 0 and redirect pending rewards to the current period, resulting in a loss of rewards for users who voted in previous periods. To fix this issue, the report recommends returning early when distributing to gauges with no votes for the period to avoid accidentally distributing pool fees twice and incorrectly resetting the reward rate.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `Voter.distribute(uint256 _period, address _gauge)` function allows callers to specify any valid past period when distributing emissions to a gauge in the current period. This is meant to allow any missed distributions for gauges to be distributed in the current period. 

However, the `_distribute` function does not consider the case where the supplied `gauge` did not exist for the supplied period and therefore, `ps.gaugeTotalVotes[_gauge] == 0`. For this case, the `emissions` will be calculated as `0`, since the supplied period is a valid past period that had votes cast (so `ps.globalTotalVotes > 0`):

```solidity
        uint256 emissions = (ps.totalEmissions * ps.gaugeTotalVotes[_gauge]) / // @audit: gauge could have 0 votes for past period
            ps.globalTotalVotes;
        address _pool = gaugeToPool[_gauge];

        // transfer emissions to minter if gauge is killed
        if (gauge[_pool].isAlive == false) {
            kitten.transfer(address(minter), emissions);
            emissions = 0;
        } else {
            es.amount = emissions;
            es.distributed = true;
        }

        if (gauge[_pool].isAlgebra) _claimAndDistributeAlgebraPoolFees(_pool);
        kitten.approve(_gauge, emissions);
        IGauge(_gauge).notifyRewardAmount(emissions);
```

This allows `_claimAndDistributeAlgebraPoolFees` and `gauge::notifyRewardAmount(0)` to be triggered *after* actual emissions for the current period have already been executed. When the gauge in question is an `AlgebraGauge`, this opens up two attack vectors:

**Resetting reward rates to 0**

When `algebraGauge::notifyRewardAmount(0)` is invoked, the reward rates for the associated eternal farming virtual pool will be reset to `0`:

```solidity
// AlgebraGauge.sol

    function _notifyRewardAmount(
        uint256 _rewardAmount,
        uint256 _bonusRewardAmount
    ) internal {
        uint256 duration = PeriodLibrary.periodNext(block.timestamp) -
            block.timestamp;
...
        algebraGaugeFactory.setRates(
            key,
            SafeCast.toUint128(_rewardAmount / duration), // @audit: resets rates to `0` when _rewardAmount == 0
            SafeCast.toUint128(_bonusRewardAmount / duration)
        );
    }
```

```solidity
// EternalVirtualPool.sol

  function setRates(uint128 rate0, uint128 rate1) external override onlyFromFarming {
    _distributeRewards(); // @audit: distribute rewards based on previous rates
    (rewardRate0, rewardRate1) = (rate0, rate1); // @audit: update rates to 0
  }
```

An attacker can take advantage of this to block reward distribution for gauge's eternal farming virtual pool. 

Suppose we are currently in `period_5` and a new `AlgebraGauge` has been added (reward rates are initialized to `0`):

```
## gauge eternal virtual pool state

reward_rate = 0
reward_reserves = 1 (1 wei of rewards added during initialization)
```

Users can now vote for this gauge for the next period, `period_6`. We now enter `period_6`, and emissions are distributed to this gauge, and the reward rates are updated:

```
## gauge eternal virtual pool state

reward_rate = x
reward_reserves = 1 + y (y is reward amount added in period_6)
```

An attacker can immediately call `distribute(4, algebraGauge)`, which will ultimately trigger `algebraGauge::notifyRewardAmount(0)` and reset the reward rates back to `0`:

```
## gauge eternal virtual pool state

reward_rate = 0
reward_reserves = 1 + y
```

In the next period, when `algebraGauge.notifyRewardAmount` is called again, the virtual pool will not distribute pending rewards since the current rate was reset to `0`. 

An attacker can repeat this exploit for `n` distribution periods, where `n` is the number of valid periods that existed before the algebra gauge in question was created. 

**Redirecting pending rewards to the current period**

Additionally, when distributions are executed, pending algebra pool fees held in the associated community vault are transferred to the `votingReward` contract for that gauge and allocated for the current period:

```solidity
// Voter::_distribute

        if (gauge[_pool].isAlgebra) _claimAndDistributeAlgebraPoolFees(_pool);
```

```solidity
// Voter::_claimAndDistributeAlgebraPoolFees

    function _claimAndDistributeAlgebraPoolFees(address _pool) internal {
...
        votingReward.notifyRewardAmount(address(token0), token0Claimed);
...
        votingReward.notifyRewardAmount(address(token1), token1Claimed);
        emit DistributeAlgebraFees(_pool, token0Claimed, token1Claimed);
    }
```

```solidity
// Reward.sol

    function notifyRewardAmount(
        address _token,
        uint256 _amount
    ) public virtual nonReentrant onlyRole(NOTIFY_ROLE) {
        uint256 currentPeriod = getCurrentPeriod();
        _addReward(currentPeriod, _token, _amount);
```

Therefore, these rewards are meant for the users who voted in the previous period. An attacker is able to exploit the bug mentioned previously to trigger the `_claimAndDistributeAlgebraPoolFees` at the *end* of the current period, *after* distributions have already been made for all gauges in that period. This will result in a majority of the rewards intended for the next period being distributed for the current period. 

Suppose we are in `period_5`. A new `algebraGauge` is created, and users begin to vote for it for `period_6`. During `period_5`, pool fees are being accumulated in the gauge's community vault, which further entices users to vote for this gauge. At the start of `period_6`, distributions are made for the `algebraGauge` and all pending rewards are distributed to the gauge's `votingReward` contract for `period_6`. So far, this is working as expected.

Now, during `period_6` pool fees again begin to accumulate in the vault, which entices users to again cast votes for this gauge for `period_7`. However, at the end of `period_6`, an attacker calls `distribute(4, algebraGauge)` to trigger `_claimAndDistributeAlgebraPoolFees` a second time for `period_6`. Then, when `period_7` starts and distributions are made, less pool fees will be collected from the vault, and the voters for `period_7` will not receive their expected voting rewards. The rewards meant for `period_7` have therefore been successfully redirected to `period_6`. 

Similar to the first attack vector, this exploit can be executed `n` number of times, where `n` is the number of valid past periods that occurred before the algebra gauge in question was created. 

## Recommendations
When distributing to gauges, if the gauge has no votes for the period, return early to avoid accidentally distributing pool fees twice in a given period and incorrectly resetting the virtual pool's reward rate to `0`. 
