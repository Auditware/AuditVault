---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Ammplify]]"
auditors:
  - "[[ARMoh]]"
  - "[[SOPROBRO]]"
  - "[[blockace]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# H-5: Borrow fee uses APY as per-second rate, causing extreme overcharging

- id: 63171
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: SOPROBRO (Sherlock)
- source: N/A

## Summary


The borrow fee rate returned by the smooth rate curve is being incorrectly calculated, resulting in borrowers being charged significantly higher fees than intended. This is due to the function `chargeTrueFeeRate` in the `Fee.sol` file treating the annual percentage yield (APY) as a per-second rate, leading to fees being inflated by around 31,536,000 times. This overcharging occurs even for short time intervals and can result in the loss of borrower funds. The root cause of this issue is the incorrect implementation of the APY calculation, which does not take into account the number of seconds in a year. This allows attackers to exploit the system by borrowing tokens and being overcharged when closing their position. The impact of this bug can be catastrophic for borrowers, as they can be charged fees that are orders of magnitude higher than intended. A proof of concept (PoC) has been provided to demonstrate the issue, and a fix has been proposed by using the `FullMath.mulDiv` function to accurately convert the annual rate to a per-second rate. The protocol team has already fixed this issue in their codebase.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/379 

## Found by 
ARMoh, SOPROBRO, blockace

### Summary

The borrow fee rate returned by the smooth rate curve is an annual percentage yield (APY), but the implementation multiplies it directly by elapsed seconds without annualizing. This treats an annual rate as if it were a per-second rate, inflating fees by roughly 31,536,000x over the intended amount. Borrowers are charged massive, unjustified fees even over short time intervals.

### Root Cause

The function [`chargeTrueFeeRate`](https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Fee.sol#L398) in `src/walkers/Fee.sol` treats the APY returned by `calculateRateX64` as a per-second rate by multiplying it by the elapsed seconds `timeDiff` without dividing by the number of seconds in a year.

```solidity
// src/walkers/Fee.sol
// ... inside FeeWalker.chargeTrueFeeRate(...)
uint256 timeDiff = uint128(block.timestamp) - data.timestamp; // Convert to 256 for next mult
uint256 takerRateX64 = timeDiff * data.fees.rateConfig.calculateRateX64(
    uint64((totalTLiq << 64) / totalMLiq)
);
```

However, the rate returned by the curve is an annualized rate. The library documents that the seconds-per-year (SPR) factor is 31,536,000 and distinguishes APR vs SPR:

```solidity
// lib/Commons/src/Math/SmoothRateCurveLib.sol
// ...
// SPR factor 31536000 = 365 * 24 * 60 * 60
// APR of 0.001% = 0.00001
// as a SPR = 0.00001 / 31536000 =  ...
```

Therefore, the correct computation must divide by 365 days to convert the annual rate to a per-second rate before applying `timeDiff`.

### Internal Pre-conditions

- There is non-zero taker liquidity and borrow amount in the visited subtree/column so that fees are computed and applied.

### External Pre-conditions

- Time passes between taker open and close (even short intervals like minutes or hours).

### Attack Path

1. Taker opens a position borrowing token X or Y in any range with non-zero utilization.
2. Even after a short time (e.g., 1 hour), `chargeTrueFeeRate` computes `takerRateX64 = timeDiff * APY` without dividing by 365 days.
3. Fee computation multiplies borrow principal by an enormous effective rate (`> 1x` of principal for small `timeDiff`), resulting in massive fees.
4. Upon closing the taker position, the borrower is overcharged by orders of magnitude.

### Impact

Borrowers pay fees that are larger by ~31,536,000x than intended, resulting in catastrophic overcharging and potential total loss of borrower funds for even brief borrow durations.

### PoC

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import { console } from "forge-std/console.sol";
import { UniswapV3Pool } from "v3-core/UniswapV3Pool.sol";
import { TickMath } from "v3-core/libraries/TickMath.sol";
import { AmmplifyAdminRights } from "../../src/facets/Admin.sol";

import { MultiSetupTest } from "../MultiSetup.u.sol";

import { PoolInfo } from "../../src/Pool.sol";
import { LiqType } from "../../src/walkers/Liq.sol";
import { TreeTickLib } from "../../src/tree/Tick.sol";
import { RouteImpl, Route } from "../../src/tree/Route.sol";
import { KeyImpl, Key } from "../../src/tree/Key.sol";

import { MockERC20 } from "../mocks/MockERC20.sol";

/// @dev The minimum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MIN_TICK)
uint160 constant MIN_SQRT_RATIO = 4295128739;
/// @dev The maximum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MAX_TICK)
uint160 constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

contract AuditPoCTest is MultiSetupTest {
    UniswapV3Pool public pool;

    address public poolAddr;
    int24 public lowTick;
    int24 public highTick;

    PoolInfo public poolInfo;


    function setUp() public {
        _newDiamond();
        (, address _pool, address _token0, address _token1) = setUpPool();

        token0 = MockERC20(_token0);
        token1 = MockERC20(_token1);
        pool = UniswapV3Pool(_pool);

        poolAddr = _pool;
        poolInfo = viewFacet.getPoolInfo(poolAddr);

        _createPoolVaults(poolAddr);
    }

    function test_Invalid_Fee_Rate_PoC() public {
        // Pool's fee is 3000 bps, tick spacing is 60
        // 887272 / 60 = 14787.866, nearest power of two is 8192
        // Tick spacing 0 = tree index 8192
        // Tick spacing 60 = tree index 8192
        // etc

        // Grant Taker Rights
        address taker = makeAddr("taker");
        adminFacet.submitRights(taker, AmmplifyAdminRights.TAKER, true);
        vm.warp(block.timestamp + 3 days);
        adminFacet.acceptRights();

        // Mint some tokens for taker
        token0.mint(taker, 100e18);
        token1.mint(taker, 100e18);
        token0.approve(address(takerFacet), type(uint256).max);
        token1.approve(address(takerFacet), type(uint256).max);


        // Add liquidity between [8192 + 0, 8192 + 2) tree index
        bytes memory rftData = "";
        lowTick = 60 * 0;
        highTick = 60 * 2;

        uint256 assetId = makerFacet.newMaker(
            address(this),
            poolAddr,
            lowTick,
            highTick,
            100e18,
            false,
            MIN_SQRT_RATIO,
            MAX_SQRT_RATIO,
            rftData
        );
        
        // Taker takes the liquidity
        vm.prank(taker);
        uint256 takerAssetId = takerFacet.newTaker(
            taker,
            poolAddr,
            [lowTick, highTick],
            50e18,
            [0, 1],
            [MIN_SQRT_RATIO, MAX_SQRT_RATIO],
            MIN_SQRT_RATIO,
            rftData
        );

        uint256 taker0BalBefore = token0.balanceOf(taker);
        uint256 taker1BalBefore = token1.balanceOf(taker);

        // 10 seconds pass
        vm.warp(vm.getBlockTimestamp() + 3600 seconds);

        // Taker removes taker position
        vm.prank(taker);
        takerFacet.removeTaker(takerAssetId, MIN_SQRT_RATIO, MAX_SQRT_RATIO, rftData);

        uint256 taker0BalAfter = token0.balanceOf(taker);
        uint256 taker1BalAfter = token1.balanceOf(taker);

        console.log("taker0Bal", taker0BalBefore, taker0BalAfter);
        console.log("taker1Bal", taker1BalBefore, taker1BalAfter);
        console.log("taker0Debt", taker0BalBefore - taker0BalAfter);
        console.log("taker1Debt", taker1BalBefore - taker1BalAfter);
    }
}
```

Logs from the PoC(Some logs are added to the codebase to better demonstrate the issue):

```bash
Logs:
  RateConfig invAlphaX128 102084710076281535261119195933814292480
  RateConfig betaX64 14757395258967642112
  RateConfig maxUtilX64 22136092888451461120
  RateConfig maxRateX64 17524406870024073216
  timeDiff 3600
  totalTLiq 100000000000000000000
  totalMLiq 200000000000000000000
  takerRateX64 Per Sec 4216398645419327111
  tLiqPrefix 0
  totalXBorrows Prefix 0
  totalYBorrows Prefix 0
  colXPaid 122868321103496876201
  colYPaid 123607710009953542987
  totalXBorrows 149319140229944084
  totalYBorrows 150217703137096283
  --------------------------
---
---
  taker0Bal 99999999999999999999 38565839448251561898
  taker1Bal 100000000000000000000 38196144995023228506
  taker0Debt 61434160551748438101
  taker1Debt 61803855004976771494
```

The test demonstrates:

- `takerRateX64` Per Second is 4216398645419327111 which is around 0.22
- 3600 seconds has passed, so total taker rate would be 792
- The taker pays 61.4 Token0 and 61.8 Token1 as debt, only in 3600 seconds

### Mitigation

Divide by seconds per year when converting APY to per-second rate. A minimal, precise fix is to use `FullMath.mulDiv` to avoid overflow and preserve precision:

```diff
--- a/src/walkers/Fee.sol
+++ b/src/walkers/Fee.sol
@@
-        uint256 timeDiff = uint128(block.timestamp) - data.timestamp; // Convert to 256 for next mult
-        uint256 takerRateX64 = timeDiff * data.fees.rateConfig.calculateRateX64(uint64((totalTLiq << 64) / totalMLiq));
+        uint256 timeDiff = uint128(block.timestamp) - data.timestamp; // seconds
+        uint256 takerRateX64 = FullMath.mulDiv(
+            timeDiff,
+            data.fees.rateConfig.calculateRateX64(uint64((totalTLiq << 64) / totalMLiq)),
+            365 days
+        );
```

This converts the annual rate into an accurate per-second rate before scaling by elapsed time, restoring correct fee accrual.


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Ammplify/pull/40
