---
tags:
  - lang/solidity
  - sector/dex
  - has/github
  - has/poc
  - severity/high
protocol: "[[Burve]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md"
genome:
  - "[[dos-resistance]]"
  - "[[rounding-direction]]"
  - "[[fee-calculation]]"
  - "[[mev/frontrun]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-01] DoS on `mint()` and `burn()` due to overestimation of available liquidity

- id: 57722
- impact: HIGH
- protocol: Burve_2025-03-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-03-05.md

## Summary


This bug report discusses an issue with the `compoundV3Ranges()` function in the Burve contract. This function is used when `mint()` or `burn()` are called and performs actions such as collecting fees and calculating liquidity. However, the calculation of liquidity is overestimated, causing transactions to fail and potentially leading to a denial of service attack. A proof of concept is provided, along with a recommendation to have an off-chain service calculate the liquidity value to prevent this issue.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the Burve contract, `compoundV3Ranges()` is executed when `mint()` or `burn()` are called. This function performs the following actions:

1. Collects fees from the UniswapV3 pool for all ranges.
2. Calculates the total liquidity that can be minted with the available balance of token0 and token1.
3. Calculates the liquidity that can be minted for each range, according to their weight distribution.
4. Mints the respective liquidity for each range.

Step 2) is performed by the `collectAndCalcCompound()` function and these are the steps followed:

1. Obtains the balance of token0 and token1 in the Burve contract.
2. Calculates the amounts of token0 and token1 required to mint `2^64` liquidity given the weight distribution of the ranges.
3. Calculates the nominal liquidity for each token by scaling up by `2^64` the amounts of token0 and token1 and dividing by the amounts calculated in the previous step.
4. Caps the nominal liquidity to the minimum of the liquidity for token0 and token1, and adjusts for rounding errors in minting.

However, it is not taken into account that the distribution of the scaled distribution might not match the distribution of the actual liquidity in the pool, which overestimates the amount of liquidity that can be minted, causing the transaction to fail.

Let's consider the following example:

- The Burve contract has two ranges with equal weight distribution.
- On burn, the balance of token0 and token1 is 1.
- `amount0InUnitLiqX64` and `amount1InUnitLiqX64` are calculated to be 1e18.
- We have that `nominalLiq0 = (1 << 64) / 1e18 = 18` (same for `nominalLiq1`).
- `mintNominalLiq` adjust for rounding errors, giving `mintNominalLiq =  18 - 2 * 2 = 14`.
- The real liquidity available is 0, though, as the 1 wei cannot be split into the two ranges.

As a result, the `mint()` and `burn()` functions will revert. The users will be forced to donate to the contract an amount of token0 or token1 such that the calculation of the nominal liquidity is not overestimated. Note, however, that a malicious attacker can also front-run their transaction by donating an amount that will cause the transaction to revert, causing a denial of service attack.

### Proof of concept

Modify the `forkSetup()` function in `test/single/Burve.t.sol` to use multiple ranges:

```diff
-       TickRange[] memory v3Ranges = new TickRange[](1);
-       v3Ranges[0] = TickRange(
-           clampedCurrentTick - v3RangeWidth,
-           clampedCurrentTick + v3RangeWidth
-       );
-
-       uint128[] memory v3Weights = new uint128[](1);
-       v3Weights[0] = 1;

+       TickRange[] memory v3Ranges = new TickRange[](2);
+       v3Ranges[0] = TickRange(
+           clampedCurrentTick - v3RangeWidth,
+           clampedCurrentTick + v3RangeWidth
+       );
+       v3Ranges[1] = TickRange(
+           clampedCurrentTick + v3RangeWidth,
+           clampedCurrentTick + v3RangeWidth + tickSpacing * 5
+       );
+
+       uint128[] memory v3Weights = new uint128[](2);
+       v3Weights[0] = 1;
+       v3Weights[1] = 1;
```

Add the following test function:

```solidity
function test_burnRevert() public forkOnly {
    deal(address(token0), address(alice), 1e32);
    deal(address(token1), address(alice), 1e32);

    // 1. Mint
    vm.startPrank(alice);
    token0.approve(address(burveV3), type(uint128).max);
    token1.approve(address(burveV3), type(uint128).max);
    burveV3.mint(address(alice), 2e18, 0, type(uint128).max);
    vm.stopPrank();

    // 2. Accumulate fees
    (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
    deal(address(token0), address(this), 100_100_000e18);
    deal(address(token1), address(this), 100_100_000e18);

    pool.swap(
        address(this),
        true,
        100_100_000e18,
        TickMath.MIN_SQRT_RATIO + 1,
        new bytes(0)
    );
    pool.swap(
        address(this),
        false,
        100_100_000e18,
        sqrtPriceX96,
        new bytes(0)
    );
    vm.roll(block.timestamp * 100_000);

    // 3. Burn
    vm.prank(alice);
    vm.expectRevert(bytes("STF"));
    burveV3.burn(1e18, 0, type(uint128).max);
}
```

Run the test with the following command:

```shell
forge test --mt test_burnRevert --fork-url https://rpc.berachain.com/ --fork-block-number 2109308 -vvvv
```

If we examine the logs, we can see that 24080586665097 token0 was collected. 16105268222585 token0 is transferred for the first range, and the transaction fails when trying to transfer 7975318442513 token0 for the second range.
The problem is that the liquidity is overestimated, and a total of 24080586665098 token0 (1 over real balance) is required to mint the calculated liquidity.

## Recommendations

A possible solution would be providing an off-chain service calculate the value of the liquidity off-line, so that the caller of `mint()` and `burn()` submits a liquidity amount, and the contract verifies that the provided liquidity is the optimal amount.
