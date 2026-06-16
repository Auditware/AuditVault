---
tags:
  - lang/solidity
  - sector/dex
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[trigger/low-liquidity]]"
---
# Swaps performed in pools with zero liquidity can cause a complete DoS of `FullRangeHook`

- id: 61558
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


**Summary:**

The `FullRangeHook` is a function that rebalances after every swap in a pool. However, if there is no liquidity in the position, it will cause a revert, allowing anyone to perform a swap and disrupt the pool. This can be fixed by preventing swaps when there is no liquidity or by atomically adding minimum liquidity when initializing the pool. The bug has been fixed by the Paladin team.

## Details

**Description:** The `FullRangeHook` is characterized by rebalancing after every swap executed in the pool:

```solidity
function _rebalance(PoolKey memory key) public {
    PoolId poolId = key.toId();
    // Remove all the liquidity from the Pool
    (BalanceDelta balanceDelta,) = poolManager.modifyLiquidity(
        key,
        IPoolManager.ModifyLiquidityParams({
            tickLower: MIN_TICK,
            tickUpper: MAX_TICK,
            liquidityDelta: -(poolManager.getLiquidity(poolId).toInt256()),
            salt: 0
        }),
        ZERO_BYTES
    );
    ...
}
```

It first removes all the liquidity deposited to the pool for later price adjusting; however, this assumes that there is already liquidity in the position to be removed. Hence, if there is none then it will revert due to the Uniswap following implementation that is invoked within `Pool::modifyLiquidity`:

```solidity
library Position {
    ...
    function update(
        State storage self,
        int128 liquidityDelta,
        uint256 feeGrowthInside0X128,
        uint256 feeGrowthInside1X128
    ) internal returns (uint256 feesOwed0, uint256 feesOwed1) {
        uint128 liquidity = self.liquidity;

        if (liquidityDelta == 0) {
            // disallow pokes for 0 liquidity positions
@>          if (liquidity == 0) CannotUpdateEmptyPosition.selector.revertWith();
        } else {
            self.liquidity = LiquidityMath.addDelta(liquidity, liquidityDelta);
        }
        ...
    }
}
```

Anyone could therefore execute a single swap immediately after initialization to DoS the pool because this would set the `hasAccruedFees` state to true. The first addition of liquidity would then execute the `_rebalance()` function with 0 liquidity in the position, resulting in a revert.

```solidity
function _unlockCallback(bytes calldata rawData) internal override returns (bytes memory) {
    ...
    // Rebalance the Pool if the Pool had swaps to adapt to new price
    if (pool.hasAccruedFees) {
        pool.hasAccruedFees = false;
        _rebalance(data.key);
    }
   ...
}
```

**Impact:** Anyone can DoS any pool initialized with the `FullRangeHook` simply by executing a swap right after initialization.

**Proof of Concept:** To run this test, we have to comment this line of code on `HookEnabledSwapRouter`:
```
function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
    ...

    // Make sure youve added liquidity to the test pool!
    // @audit disabled this for testing purposes
    // if (BalanceDelta.unwrap(delta) == 0) revert NoSwapOccurred();

    ...
}
```
The following test should be placed in `FullRangeHook.t.sol`:

```solidity
function test_FullRangeDoSDueToSwapWithNoLiquidity(uint256 token0Amount, uint256 token1Amount) public {
    // Constraining a minimum of 10000 to compute a liquidity above the 1000 minimum
    token0Amount = bound(token0Amount, 10000, key.currency0.balanceOfSelf());
    token1Amount = bound(token1Amount, 10000, key.currency1.balanceOfSelf());

    manager.initialize(key, SQRT_PRICE_1_1);

    IPoolManager.SwapParams memory params;
    HookEnabledSwapRouter.TestSettings memory settings;

    params =
        IPoolManager.SwapParams({ zeroForOne: true, amountSpecified: int256(- 1), sqrtPriceLimitX96: 79228162514264337593543950330 });
    settings =
        HookEnabledSwapRouter.TestSettings({ takeClaims: false, settleUsingBurn: false });

    router.swap(key, params, settings, ZERO_BYTES);

    (bool hasAccruedFees,) = fullRange.poolInfo(id);
    assertEq(hasAccruedFees, true);

    vm.expectRevert();
    fullRange.addLiquidity(
        FullRangeHook.AddLiquidityParams(
            key.currency0, key.currency1, 3000, token0Amount, token1Amount, 0, 0, address(this), MAX_DEADLINE
        )
    );
}
```

Here, 1 wei was swapped but in reality any amount can be used to DoS the pool.

The following line of code in `HookEnabledSwapRouter` should be commented out to successfully run the test:

```solidity
function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
    ...
    // Make sure youve added liquidity to the test pool!
    // @audit disabled this for testing purposes
    // if (BalanceDelta.unwrap(delta) == 0) revert NoSwapOccurred();
    ...
}
```

This is just a helper function to execute swaps in the tests but prevents swaps of 0 delta.

**Recommended Mitigation:** Prevent swaps from being made in the pool when there is no liquidity to prevent the square root price from being moved arbitrarily:

```diff
    function beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, bytes calldata)
        external
        override
        onlyPoolManager
        returns (bytes4, BeforeSwapDelta, uint24)
    {
--      PoolInfo storage pool = poolInfo[key.toId()];
++      PoolId poolId = key.toId();
++      PoolInfo storage pool = poolInfo[poolId];
++      require(poolManager.getLiquidity(poolId) > 0);

        if (!pool.hasAccruedFees) {
            pool.hasAccruedFees = true;
        }

        return (FullRangeHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
```

Alternatively, consider atomically adding the minimum liquidity when initializing the pool.

**Paladin:** Fixed by commit [`46fa611`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/46fa6111e3aee74913a05f2de72120fc70d4f032).

**Cyfrin:** Verified. `FullRangeHook::beforeSwap` now prevents swaps from being performed against zero liquidity.
