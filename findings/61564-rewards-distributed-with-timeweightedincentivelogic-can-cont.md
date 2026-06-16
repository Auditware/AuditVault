---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/account
  - platform/cyfrin
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[timestamp-dependence]]"
  - "[[reward-accounting]]"
  - "[[logic/wrong-condition]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[trigger/time-based/timelock-expiry]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Rewards distributed with `TimeWeightedIncentiveLogic` can continue to be claimed after the distribution ends

- id: 61564
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The `TimeWeightedIncentiveLogic` rewards users based on the amount of time they have deposited liquidity without making any changes to their position. However, there is a bug where users who have already passed the required minimum duration before reward distribution will not receive the full amount without manually updating their state. This means that users who are eligible for the maximum reward amount may only receive a partial amount if they do not manually update their state. Additionally, the bug allows users to claim additional rewards after the distribution has ended, which can result in losses for the distribution manager and other users. A recommended solution is to modify the `_earnedTimeWeighted()` function to prevent the time difference calculation from exceeding the distribution end timestamp. The bug has been fixed by the Paladin team.

## Details

**Description:** The `TimeWeightedIncentiveLogic` rewards users proportionally to the amount of time they have deposited liquidity without modification to their position. There is an initial required ramp-up duration, during which users will receive partial rewards and after which the maximum rate is applied. It is understood that a user who has already passed the required minimum duration in the pool prior to reward distribution should have the maximum rate applied for the whole duration, and so if they are the only depositor then the full reward amount should be distributed. It is also understood that claims should not impact this in any way. Similarly, a reduction in a user’s position should not impact their duration in the pool, whereas increases by addition of liquidity and/or transfers should reduce their duration based on the amount compared to their previous balance.

Due to a known and accepted tradeoff, users who were already deposited for the required duration before reward distribution will not receive the full amount without manually updating their state. It can be observed in the below test that a user who has already held their position for the 1 week required duration before the distribution receives only three quarters of what they would expect as their checkpoint is not automatically updated. However, if their state is manually updated at the same time as the distribution, immediately before the deposit of rewards, then they receive the full amount.

```solidity
function test_TimeWeightedManualUpdate() public {
    skip(1 weeks);

    logic.updateDefaultFee(0);

    IncentivizedPoolId incentivizedId = IncentivizedPoolKey({ id: pool1, lpToken: lpToken1 }).toId();

    manager.setListedPool(incentivizedId, true);

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // The user1 has all the liquidity of the pool, hence all the rewards should go to them
    manager.notifyAddLiquidty(systems, pool1, lpToken1, user1, int256(100 ether));

    skip(1 weeks);

    // The distributor sends 1000 tokens that will be distributed during 1 week
    uint256 amount = 1000 ether;
    uint256 duration = 1 weeks;

    // claiming without automatic state update
    uint256 snapshotId = vm.snapshotState();

    (, uint256 checkPointDuration1) = logic.userCheckpoints(incentivizedId, user1);
    console.log(checkPointDuration1);

    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    skip(1 weeks);
    uint256 tokensClaimed1 = logic.claim(incentivizedId, address(token0), user1, user1);
    console.log(tokensClaimed1);

    // claiming with manual state update
    require(vm.revertToState(snapshotId));

    logic.updateUserState(incentivizedId, user1);

    (, uint256 checkPointDuration2) = logic.userCheckpoints(incentivizedId, user1);
    console.log(checkPointDuration2);

    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    skip(1 weeks);
    uint256 tokensClaimed2 = logic.claim(incentivizedId, address(token0), user1, user1);
    console.log(tokensClaimed2);

    assertGt(tokensClaimed2, tokensClaimed1);
}
```

Ignoring this limitation case, it is the intention that reward accrual should end when the distribution ends, regardless of when the rewards are claimed; however, this is not currently so. It should be noted that this occurs when rewards are distributed but claimed some time after the end of the duration for both when the required duration is less than and equals the full distribution duration. Here, additional rewards can be claimed versus if they were to be claimed immediately at the end of the distribution and then attempted again (with no additional being claimed).

While the `rewardPerToken` does not continue to increase, as expected, the usage of `timeDiff` in `_earnedTimeWeighted()` causes the calculation of the ratio to be larger than intended:

```solidity
    function _earnedTimeWeigthed(IncentivizedPoolId id, address token, address account, uint256 newRewardPerToken)
        internal
        view
        returns (uint256 earnedAmount, uint256 leftover)
    {
        UserRewardData memory _userState = userRewardStates[id][account][token];
        if (_userState.lastRewardPerToken == newRewardPerToken) return (_userState.accrued, 0);

        uint256 userBalance = poolStates[id].userLiquidity[account];

        uint256 maxDuration = distributionRequiredDurations[id][token];
        uint256 maxEarned = (userBalance * (newRewardPerToken - _userState.lastRewardPerToken) / UNIT);

        RewardCheckpoint memory _checkpoint = userCheckpoints[id][account];
        if (_checkpoint.duration >= maxDuration) {
            earnedAmount = maxEarned + _userState.accrued;
            leftover = 0;
        } else {
            uint256 lastUpdateTs = userRewardStateUpdates[id][account][token];
            lastUpdateTs = lastUpdateTs > _checkpoint.timestamp ? lastUpdateTs : _checkpoint.timestamp;
@>          uint256 timeDiff = block.timestamp - lastUpdateTs;
            uint256 newDuration = _checkpoint.duration + timeDiff;
            if (newDuration >= maxDuration) newDuration = maxDuration;
            uint256 ratio;
            if (newDuration >= maxDuration) {
                uint256 remainingIncreaseDuration = maxDuration - _checkpoint.duration;
                uint256 left = ((((maxDuration - _checkpoint.duration - 1) * UNIT) / 2) / maxDuration);
                ratio =
                    ((left * remainingIncreaseDuration) + (UNIT * (timeDiff - remainingIncreaseDuration))) / timeDiff;
            } else {
                ratio = ((((newDuration - _checkpoint.duration - 1) * UNIT) / 2) / maxDuration);
            }
            earnedAmount = ((maxEarned * ratio) / UNIT) + _userState.accrued;
            leftover = maxEarned - earnedAmount;
        }
    }
```

For users who are yet to update their checkpoints, the stored timestamp will be uninitialized as 0. Claiming after the distribution ends will require a calculation for the composite ratio that accounts for contributions from both the time when the rate would have been increasing, and also the remaining period after passing the required duration. If the claim `block.timestamp` exceeds the true end timestamp then this result in a large `timeDiff` that can exceed the intended duration of distribution. Therefore, the calculation of the ratio contribution from after the required duration has passed will be larger than the intended maximum distribution.

**Impact:** Additional rewards can be claimed after accrual should have ended, at the expense of the distribution manager and/or other users.

**Proof of Concept:** The following test, which should be placed within `TimeWeightedIncentiveLogic.t.sol`, demonstrates that a user can claim additional rewards after the distribution has ended:`

```solidity
function test_TimeWeightedClaimAfterEnd() public {
    skip(1 weeks);

    logic.updateDefaultFee(0);

    IncentivizedPoolId incentivizedId = IncentivizedPoolKey({ id: pool1, lpToken: lpToken1 }).toId();

    manager.setListedPool(incentivizedId, true);

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // 1000 tokens will be distributed during 1 week
    uint256 amount = 1000 ether;
    uint256 duration = 1 weeks;

    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    manager.notifyAddLiquidty(systems, pool1, lpToken1, user1, int256(100 ether));

    console.log("claiming immediately as duration ends");
    uint256 snapshotId = vm.snapshotState();

    skip(1 weeks);

    uint256 tokensEarned = logic.claim(incentivizedId, address(token0), user1, user1) / 1 ether;

    console.log(tokensEarned);

    console.log("claiming immediately as duration ends, then attempting again");
    require(vm.revertToStateAndDelete(snapshotId));
    snapshotId = vm.snapshotState();

    skip(1 weeks);

    uint256 tokensEarned1 = logic.claim(incentivizedId, address(token0), user1, user1) / 1 ether;
    skip(1 weeks);
    uint256 tokensEarned2 = logic.claim(incentivizedId, address(token0), user1, user1) / 1 ether;

    console.log(tokensEarned1);
    console.log(tokensEarned2);

    console.log("claiming some time after duration ends");
    require(vm.revertToStateAndDelete(snapshotId));
    snapshotId = vm.snapshotState();

    skip(5 weeks);

    tokensEarned = logic.claim(incentivizedId, address(token0), user1, user1) / 1 ether;

    console.log(tokensEarned);
}
```

Output:
```bash
Logs:
  claiming immediately as duration ends
  499
  claiming immediately as duration ends, then attempting again
  499
  0
  claiming some time after duration ends
  899
```

**Recommended Mitigation:** The following diff passes all tests, but also requires modification of the copied `TestTimeWeightedLogic::_earnedTimeWeighted()` implementation:

```diff
function _earnedTimeWeigthed(IncentivizedPoolId id, address token, address account, uint256 newRewardPerToken)
    internal
    view
    returns (uint256 earnedAmount, uint256 leftover)
{
    UserRewardData memory _userState = userRewardStates[id][account][token];
    if (_userState.lastRewardPerToken == newRewardPerToken) return (_userState.accrued, 0);

    uint256 userBalance = poolStates[id].userLiquidity[account];

    uint256 maxDuration = distributionRequiredDurations[id][token];
    uint256 maxEarned = (userBalance * (newRewardPerToken - _userState.lastRewardPerToken) / UNIT);

    RewardCheckpoint memory _checkpoint = userCheckpoints[id][account];
    if (_checkpoint.duration >= maxDuration) {
        earnedAmount = maxEarned + _userState.accrued;
        leftover = 0;
    } else {
        uint256 lastUpdateTs = userRewardStateUpdates[id][account][token];
        lastUpdateTs = lastUpdateTs > _checkpoint.timestamp ? lastUpdateTs : _checkpoint.timestamp;
--      uint256 timeDiff = block.timestamp - lastUpdateTs;
++      uint256 timeDiffEnd = poolRewardData[id][token].endTimestamp;
++      if (timeDiffEnd > block.timestamp) timeDiffEnd = block.timestamp;
++      uint256 timeDiff = timeDiffEnd - lastUpdateTs;
        uint256 newDuration = _checkpoint.duration + timeDiff;
        if (newDuration >= maxDuration) newDuration = maxDuration;
        uint256 ratio;
        if (newDuration >= maxDuration) {
            uint256 remainingIncreaseDuration = maxDuration - _checkpoint.duration;
            uint256 left = ((((maxDuration - _checkpoint.duration - 1) * UNIT) / 2) / maxDuration);
             ratio =
                ((left * remainingIncreaseDuration) + (UNIT * (timeDiff - remainingIncreaseDuration))) / timeDiff;

        } else {
            ratio = ((((newDuration - _checkpoint.duration - 1) * UNIT) / 2) / maxDuration);
        }
        earnedAmount = ((maxEarned * ratio) / UNIT) + _userState.accrued;
        leftover = maxEarned - earnedAmount;
    }
}
```

Output:
```bash
Logs:
  claiming immediately as duration ends
  499
  claiming immediately as duration ends, then attempting again
  499
  0
  claiming some time after duration ends
  499
```

It is recommended to instead create a minimal test harness contract that inherits from the actual contract to be tested but wraps and exposes the internal functions so they can be used in the tests, e.g.:

```solidity
TimeWeightedLogicHarness is TimeWeightedLogic {
    ...

    function _earnedTimeWeighted_Exposed(...) public view returns (...) {
        _earnedTimeWeighted(...);
    }
}
```

This helps to avoid errors in repeated logic and ensures that the implementation being tested is the correct implementation itself. It is additionally recommended to avoid testing the implementation against itself by making assertions on the return values of public entrypoints against piecewise invocation of internal functions.

**Paladin:** Fixed by commit [`f8dc21e`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/f8dc21e765f6b2568ae221dc5e2855181896c6bb).

**Cyfrin:** Verified. The time difference calculation can no longer exceed the distribution end timestamp.

\clearpage
