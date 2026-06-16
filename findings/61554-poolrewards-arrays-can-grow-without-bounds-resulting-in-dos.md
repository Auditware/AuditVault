---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
---
# `poolRewards` arrays can grow without bounds, resulting in DoS of core functionality

- id: 61554
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The bug report discusses an issue with the `poolRewards` mapping in the `IncentivizedPoolId` function. This mapping keeps track of reward token addresses, but anyone can add tokens to it without permission. This can cause problems, such as an Out of Gas error, when looping over the unbounded array. This can lead to a Denial of Service (DoS) attack on important functions like `updateRewardState()` and `updateUserState()`, which can result in loss of user funds. The impact of this bug is considered critical and it is recommended to limit reward distribution to only widely-used and valuable tokens. The bug has been fixed by implementing a reward token allowlist.

## Details

**Description:** The `poolRewards` mapping maintains an array of reward token addresses for a given `IncentivizedPoolId`. Given that the distribution of rewards is permissionless, anyone can invoke this functionality with arbitrary ERC-20 tokens to cause the array to grow without bounds. The implication of looping over an unbounded array and associated Out Of Gas error is the DoS of the following functions:

1. `_updateAllRewardState()` which is called in `updateRewardState()`:
```solidity
function _updateAllRewardState(IncentivizedPoolId id) internal virtual {
    address[] memory _tokens = poolRewards[id];
    uint256 _length = _tokens.length;
    for (uint256 i; i < _length; i++) {
        _updateRewardState(id, _tokens[i], address(0));
    }
}
```
This is not very severe as it simply prevents manual triggering of reward state updates.

2. `_updateAllUserState()` which is called in `updateUserState()`, `notifyBalanceChange()` and `notifyTransfer()`:
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
```
This is critical because reverting the notification of balance change and transfer will DoS the hooks and for instance the Uniswap pool interactions. Furthermore, this function is also used in `TimeWeightedIncentiveLogic::claim` and `TimeWeightedIncentiveLogic::claimAll` which will result in loss of user funds as they are not able to retrieve the rewards.

3. `earnedAll()`:
```solidity
    function earnedAll(IncentivizedPoolId id, address account) external view virtual returns (EarnedData[] memory _earnings) {
        address[] memory _tokens = poolRewards[id];
        uint256 _length = _tokens.length;
        _earnings = new EarnedData[](_length);
        for (uint256 i; i < _length; i++) {
            _earnings[i].token = _tokens[i];
            _earnings[i].amount = _earned(id, _tokens[i], account);
        }
    }
```

This is not very severe as it does not affect on-chain execution.

4. `claimAll()`:
```solidity
    function claimAll(IncentivizedPoolId id, address account, address recipient)
        external
        virtual
        nonReentrant
        returns (ClaimedData[] memory _claims)
    {
        _checkClaimer(account, recipient);

        address[] memory _tokens = poolRewards[id];
        uint256 _length = _tokens.length;
        _claims = new ClaimedData[](_length);
        for (uint256 i; i < _length; i++) {
            _claims[i].token = _tokens[i];
            _claims[i].amount = _claim(id, _tokens[i], account, recipient);
        }
    }
```

This is not very severe as it simply prevents batch claiming of rewards.

**Impact:** This finding has critical impact due to low cost to perform an attack (distributing fake/worthless ERC-20 tokens is permissionless) and the implications for critical functions such as `notifyBalanceChange()`, `notifyTransfer()`, and `TimeWeightedIncentiveLogic::claim()`.

**Recommended Mitigation:** Reward distribution should be limited to permissioned, widely-used/valuable ERC-20 tokens to prevent attackers from filling the arrays with spam tokens.

**Paladin:** Fixed by commit [`b95ae97`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/b95ae97a67eca4e1e33cafc636ae3d3d3c1af088).

**Cyfrin:** Verified. A reward token allowlist has been implemented.
