---
tags:
  - lang/solidity
  - sector/dex
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
---
# Reward tokens can become inaccessible due to revert when `rewardPerTokenStored` is downcast and overflows

- id: 61553
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The bug report describes an issue with the return value of a function called `_newRewardPerToken()`. This value, which is used in all incentive logic contracts, is not safe to be converted to a specific data type because it can easily overflow. This is problematic when the decimals of the reward token and the liquidity token are different, as it can result in an incorrect value being returned. This bug can cause rewards to be locked in the contract and prevent them from being claimed. The recommended solution is to store the value directly in a `uint256` variable instead of converting it to a specific data type. The bug has been fixed in the latest version of the code.

## Details

**Description:** The return value of `_newRewardPerToken()` that is assigned to the `rewardPerTokenStored` state variable present in all incentive logic contracts is not safe to be type casted to `uint96` because it can easily overflow. The computation in which the scaling up of precision by `UNIT` should be noted is shown below:

```solidity
function _newRewardPerToken(IncentivizedPoolId id, address token) internal view override returns (uint256) {
    uint256 _totalSupply = poolStates[id].totalLiquidity;
    RewardData memory _state = poolRewardData[id][token];
    if (_totalSupply == 0) return _state.rewardPerTokenStored;

    uint256 lastUpdateTimeApplicable = block.timestamp < _state.endTimestamp ? block.timestamp : _state.endTimestamp;

    // decimals analysis: (seconds * (rewardDecimals / seconds) * 18 decimals) / liquidityDecimals = rewardDecimals + 18 - liquidityDecimals
    return _state.rewardPerTokenStored
        + ((((lastUpdateTimeApplicable - _state.lastUpdateTime) * _state.ratePerSec) * UNIT) / _totalSupply);
}
```

The result of the above computation will have `rewardDecimals + 18 - liquidityDecimals` as demonstrated in the comment. This becomes particularly problematic when the decimals of the reward token and the liquidity token differ. For instance, a reward token with 18 decimals and a Uniswap v4 liquidity token with 6 decimals would overflow as demonstrated in the PoC below.

Depending on the relative position of the current tick to those of the liquidity, Uniswap v4 pools liquidity inherit the decimal precision of either currency. For example, if a given pool comprises a 6-decimal `token0` and an 18-decimal `token0`, the output liquidity will either be in 6 or 18 decimals. For the `FullRangeHook` in particular, the intention is for the price of the pool to always reside between the defined limits such that execution is expected to always occur inside the middle `else if` branch:

```solidity
function getLiquidityForAmounts(
    uint160 sqrtRatioX96,
    uint160 sqrtRatioAX96,
    uint160 sqrtRatioBX96,
    uint256 amount0,
    uint256 amount1
) internal pure returns (uint128 liquidity) {
    if (sqrtRatioAX96 > sqrtRatioBX96) (sqrtRatioAX96, sqrtRatioBX96) = (sqrtRatioBX96, sqrtRatioAX96);

    if (sqrtRatioX96 <= sqrtRatioAX96) {
        liquidity = getLiquidityForAmount0(sqrtRatioAX96, sqrtRatioBX96, amount0);
    } else if (sqrtRatioX96 < sqrtRatioBX96) {
        uint128 liquidity0 = getLiquidityForAmount0(sqrtRatioX96, sqrtRatioBX96, amount0);
        uint128 liquidity1 = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioX96, amount1);

        liquidity = liquidity0 < liquidity1 ? liquidity0 : liquidity1;
    } else {
        liquidity = getLiquidityForAmount1(sqrtRatioAX96, sqrtRatioBX96, amount1);
    }
}
```

Therefore, in this example, its liquidity should always be in 6 decimals.

```solidity
function test_LessThan18Decimals() public {
    MockERC20 token0WithLessDecimals = new MockERC20("TEST1", "TEST1", 18);
    token0WithLessDecimals.mint(address(this), 1_000_000 * 10 ** 18);
    MockERC20 token1WithLessDecimals = new MockERC20("TEST2", "TEST2", 6);
    token1WithLessDecimals.mint(address(this), 1_000_000 * 10 ** 6);

    PoolKey memory newKey = createPoolKey(address(token0WithLessDecimals), address(token1WithLessDecimals), 3000, hookAddress);
    PoolId newId = newKey.toId();

    token0WithLessDecimals.approve(address(fullRange), type(uint256).max);
    token1WithLessDecimals.approve(address(fullRange), type(uint256).max);

    initPool(newKey.currency0, newKey.currency1, IHooks(hookAddress), 3000, SQRT_PRICE_1_1);

    uint128 liquidityMinted = fullRange.addLiquidity(
        FullRangeHook.AddLiquidityParams(
            newKey.currency0,
            newKey.currency1,
            3000,
            100 * 10 ** 18,
            100 * 10 ** 6,
            0,
            0,
            address(this),
            MAX_DEADLINE
        )
    );

    assertEq(liquidityMinted, 100 * 10 ** 6);
}
```

The checked type cast is subsequently performed in `_updateRewardState()` where any overflow will revert:

```solidity
function _updateRewardState(IncentivizedPoolId id, address token, address account) internal virtual {
    ...
    uint96 newRewardPerToken = _newRewardPerToken(id, token).toUint96();
    _state.rewardPerTokenStored = newRewardPerToken;
    ...
}
```

Given this is called within `BaseIncentiveLogic::_claim`, which itself is called in `BaseIncentiveLogic::claim`, any revert due to overflow will prevent the reward tokens from being claimed.

**Impact:** A Uniswap pool with just one 6-decimal token (eg. USDC, USDT on Ethereum) will result in `FullRangeHook` liquidity having 6-decimal precision. This results in an intermediate return value being larger than expected such that execution reverts when downcasting. Reward tokens will remain locked in the contract and only the generated fees will be able to be retrieved.

**Proof of Concept:** The following test should be placed in `BasicIncentiveLogic.t.sol`:

```solidity
function test_incentivesWithLessThan18Decimals() public {
    PoolId poolKey;
    IncentivizedPoolId poolId;
    address lpToken = address(7);

    poolKey = createPoolKey(address(1), address(2), 3000).toId();
    poolId = IncentivizedPoolKey({ id: poolKey, lpToken: lpToken }).toId();

    manager.setListedPool(poolId, true);

    address[] memory systems = new address[](1);
    systems[0] = address(logic);

    // Liquidity is in 6 decimals
    manager.notifyAddLiquidty(systems, poolKey, lpToken, user1, int256(100 * 10 ** 6));

    uint256 amount = 1000 ether;
    uint256 duration = 2 weeks;

    // Some tokens are deposited to be distributed during 2 weeks
    logic.depositRewards(poolId, address(token0), amount, duration);

    skip(2 weeks);

    // After 2 weeks, the only liquidity holder tries to claim the tokens
    // This reverts to an overflow during type casting
    vm.expectRevert();
    vm.prank(user1);
    uint256 claimedAmount = logic.claim(poolId, address(token0), user1, user1);
}
```

**Recommended Mitigation:** Storing this `rewardPerTokenStored` value directly in a full `uint256` is highly recommended:

```diff
    function _updateRewardState(IncentivizedPoolId id, address token, address account) internal virtual {
        ...
--      uint96 newRewardPerToken = _newRewardPerToken(id, token).toUint96();
++      uint256 newRewardPerToken = _newRewardPerToken(id, token);
        _state.rewardPerTokenStored = newRewardPerToken;
        ...
    }
```

Note that all other interactions with this variable need to be adjusted accordingly for this to work.

**Paladin:** Fixed by commit [`6bb56b5`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/6bb56b53e885734b389274b8a8d0419db39de514).

**Cyfrin:** Verified. The packing of `RewardData` and `UserRewardData` structs have been modified to account for the increase in `rewardPerTokenStored` width; however, the following remaining issues were identified:
* `BaseIncentiveLogic::_updateRewardState` still casts to `uint96`:
```solidity
uint256 newRewardPerToken = _newRewardPerToken(id, token).toUint96();
```
* `TimeWeightedIncentiveLogic::_updateRewardState` still casts to `uint96`:
```solidity
_state.rewardPerTokenStored = newRewardPerToken.toUint96();
```

**Paladin:** Fixed by commit [`d7275a2`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/d7275a2563b17c77b2baba1f2961e7244b3bb764). The fix for `BaseIncentiveLogic` was done in a previous commit and is no longer present in the latest version of the branch.

**Cyfrin:** Verified. The downcasts have been removed.
