---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[reward-accounting]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
---
# Missing user liquidity sync in `TimeWeightedIncentiveLogic::_updateAllUserState` can result in rewards becoming locked

- id: 61560
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The bug report describes a problem in the incentive logic contracts where user liquidity synchronization is not being performed automatically in the `TimeWeightedIncentiveLogic` contract. This can lead to a loss of funds for users if they do not manually sync their liquidity before claiming rewards. The report provides a proof of concept showing how a user can receive only half of their entitled rewards if they do not manually sync their liquidity. The recommended mitigation is to add the automatic user liquidity sync in the `_updateAllUserState` function. The bug has been fixed by a recent commit.

## Details

**Description:** Within the incentive logic contracts, liquidity synchronization is a necessary step that must be performed before executing any computation based on liquidity values in storage. In the case of total liquidity within `TimeWeightedIncentiveLogic`, an automatic sync is performed upon depositing rewards:

```solidity
function _depositRewards(
    IncentivizedPoolId id,
    address token,
    uint256 amount,
    uint256 duration,
    uint256 requiredDuration,
    RewardType rewardType
) internal {
    ...
    // Sync pool total liquidity if not already done
    if(!poolSynced[id]) {
        _syncPoolLiquidity(id);
        poolSynced[id] = true;
    }

    emit RewardsDeposited(id, token, amount, duration);
}
```

In contrast, user liquidity synchronization is not currently performed anywhere in `TimeWeightedIncentiveLogic`. The base `BaseIncentiveLogic::syncUser` method is exposed for a caller to execute the synchronization manually; however, in other logic contracts this user liquidity synchronization is performed upon executing the `BaseIncentiveLogic::_updateAllUserState`. Since `TimeWeightedIncentiveLogic` overrides this method without including the internal call, the user liquidity sync is missing:

```solidity
function _updateAllUserState(IncentivizedPoolId id, address account) internal override {
    address[] memory _tokens = poolRewards[id];
    uint256 _length = _tokens.length;
    for (uint256 i; i < _length; i++) {
        _updateRewardState(id, _tokens[i], account);
    }
    _updateCheckpoints(id, account);
}
```

This can lead to a loss of funds for the user if they does not manually sync their liquidity before claiming any rewards.

**Impact:** It is possible for users to lose funds that will become stuck in the contract. This can be avoided by manually syncing user liquidity manually; however, it is worth mentioning that the other incentive logic contracts do this automatically, and so it is reasonable for users to expect the same to apply to `TimeWeightedIncentiveLogic`.

**Proof of Concept:** The following test shows that a user receives half of the rewards to which they are entitled when they do not manually sync their liquidity before claiming:

```solidity
function test_MissingUserSync() public {
    skip(1 weeks);

    logic.updateDefaultFee(0);

    address[] memory emptySystems = new address[](0);
    IncentivizedPoolId incentivizedId = manager.getIncentivizedKey(pool1, lpToken1);

    manager.setListedPool(incentivizedId, true);

    // Register 100 tokens for the user1 for an empty logic
    // Manager.TotalLiquidity = 100
    // Manager.User1Liquidity = 100
    manager.notifyAddLiquidty(emptySystems, pool1, lpToken1, user1, int256(100 ether));

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // 1000 tokens will be distributed during 1 week
    uint256 amount = 1000 ether;
    uint256 duration = 1 weeks;

    // Distributing rewards triggers total liquidity sync
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 0
    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    // Register now 100 more tokens for the user1 once the new logic is already registered
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 100
    manager.notifyAddLiquidty(systems, pool1, lpToken1, user1, int256(100 ether));

    // Skip a lot of time to avoid the time weighted feature
    skip(10000000 weeks);

    uint256 tokensEarned = logic.claim(incentivizedId, address(token0), user1, user1);

    console.log(tokensEarned);
}
```

Output:
```bash
[PASS] test_MissingUserSync() (gas: 525165)
Logs:
  499999974999958531200
```

When the user manually syncs their liquidity before claiming, they receive the full entitled amount:
```solidity
function test_MissingUserSync() public {
    skip(1 weeks);

    logic.updateDefaultFee(0);

    address[] memory emptySystems = new address[](0);
    IncentivizedPoolId incentivizedId = manager.getIncentivizedKey(pool1, lpToken1);

    manager.setListedPool(incentivizedId, true);

    // Register 100 tokens for the user1 for an empty logic
    // Manager.TotalLiquidity = 100
    // Manager.User1Liquidity = 100
    manager.notifyAddLiquidty(emptySystems, pool1, lpToken1, user1, int256(100 ether));

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // 1000 tokens will be distributed during 1 week
    uint256 amount = 1000 ether;
    uint256 duration = 1 weeks;

    // Distributing rewards triggers total liquidity sync
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 0
    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    // Register now 100 more tokens for the user1 once the new logic is already registered
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 100
    manager.notifyAddLiquidty(systems, pool1, lpToken1, user1, int256(100 ether));

    // Skip a lot of time to avoid the time weighted feature
    skip(10000000 weeks);

    // Sync user's liquidity
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 200
    logic.syncUser(incentivizedId, user1);

    uint256 tokensEarned = logic.claim(incentivizedId, address(token0), user1, user1);

    console.log(tokensEarned);
}
```

Output:
```bash
[PASS] test_MissingUserSync() (gas: 527587)
Logs:
  999999949999917062400
```

Notice that the funds that were not claimed are stuck in the contract and the user can not claim them even with a subsequent synchronization:

```solidity
function test_MissingUserSync() public {
    skip(1 weeks);

    logic.updateDefaultFee(0);

    address[] memory emptySystems = new address[](0);
    IncentivizedPoolId incentivizedId = manager.getIncentivizedKey(pool1, lpToken1);

    manager.setListedPool(incentivizedId, true);

    // Register 100 tokens for the user1 for an empty logic
    // Manager.TotalLiquidity = 100
    // Manager.User1Liquidity = 100
    manager.notifyAddLiquidty(emptySystems, pool1, lpToken1, user1, int256(100 ether));

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // 1000 tokens will be distributed during 1 week
    uint256 amount = 1000 ether;
    uint256 duration = 1 weeks;

    // Distributing rewards triggers total liquidity sync
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 0
    logic.depositRewards(incentivizedId, address(token0), amount, duration);

    // Register now 100 more tokens for the user1 once the new logic is already registered
    // Manager.TotalLiquidity = 200
    // Manager.User1Liquidity = 200
    // Logic.TotalLiquidity = 200
    // Logic.User1Liquidity = 100
    manager.notifyAddLiquidty(systems, pool1, lpToken1, user1, int256(100 ether));

    // Skip a lot of time to avoid the time weighted feature
    skip(10000000 weeks);

    uint256 tokensEarned1 = logic.claim(incentivizedId, address(token0), user1, user1);
    logic.syncUser(incentivizedId, user1);
    uint256 tokensEarned2 = logic.claim(incentivizedId, address(token0), user1, user1);

    console.log(tokensEarned1);
    console.log(tokensEarned2);
}
```
Output:
```
[PASS] test_MissingUserSync() (gas: 534424)
Logs:
499999974999958531200
0
```

**Recommended Mitigation:** Execute the automatic user liquidity sync in the `_updateAllUserState` function:
```diff

function _updateAllUserState(IncentivizedPoolId id, address account) internal override {
++      if(!userLiquiditySynced[id][account]) {
++          _syncUserLiquidity(id, account);
++          userLiquiditySynced[id][account] = true;
++      }

    address[] memory _tokens = poolRewards[id];
    uint256 _length = _tokens.length;
    for (uint256 i; i < _length; i++) {
        _updateRewardState(id, _tokens[i], account);
    }
    _updateCheckpoints(id, account);
}
```

**Paladin:** Fixed by commit [`10383a1`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/10383a15bdd21f8ad61676fc3ec4959fcda01574).

**Cyfrin:** Verified. The missing sync has been added to `TimeWeightedIncentiveLogic::_updateAllUserState`.
