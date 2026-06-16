---
tags:
  - lang/solidity
  - sector/dex
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
  - "[[0xAsen]]"
  - "[[0xapple]]"
  - "[[0xnija]]"
  - "[[0xpinkman]]"
  - "[[Icon_0x]]"
  - "[[SOPROBRO]]"
  - "[[Sir_Shades]]"
  - "[[Theseersec]]"
  - "[[Xmanuel]]"
  - "[[anonymousjoe]]"
  - "[[crunter]]"
  - "[[maigadoh]]"
  - "[[neeloy]]"
  - "[[panprog]]"
  - "[[roshark]]"
  - "[[thimthor]]"
  - "[[v_2110]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-3: Mismatch in actual pool's liquidity and pool node's liquidity infomation because of wrong `route` in `PoolWalker.settle`

- id: 63169
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses a critical issue found in the Ammplify protocol by a group of security researchers. The issue occurs when updating a pool's nodes' information and can lead to incorrect liquidity data and failed operations. The root cause of the issue is a discrepancy in the tree index used for updating the pool state. This can be exploited by creating assets with affected tick ranges and attempting to make new maker or taker operations. The impact of this bug includes mismatched balances and failed operations. A proof of concept is provided to demonstrate the discrepancy and its impact. The suggested mitigation is to use the correct tree index in the `PoolWalker.settle` function. The protocol team has already fixed this issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/208 

## Found by 
0xAsen, 0xapple, 0xnija, 0xpinkman, Icon\_0x, SOPROBRO, Sir\_Shades, Theseersec, Xmanuel, anonymousjoe, crunter, maigadoh, neeloy, panprog, roshark, thimthor, v\_2110

### Summary

When `WalkerLib.modify` updates a pool’s nodes' information, the protocol subsequently calls `PoolWalker.settle` to update the actual pool state.

However, `PoolWalker.settle` uses a different tree index for `highTick` compared to `WalkerLib.modify`.

This discrepancy can cause the settlement process to skip the correct right node, resulting in cases where the actual pool liquidity is not updated correctly.

As a result, the protocol may end up with mismatched liquidity between the node information and the actual pool state.

This is a critical issue because all fee calculations and liquidity accounting rely on incorrect pool liquidity data and further operations such as making new maker, new taker or remove maker related to the affected node would fail because of inconsistent pool state.

### Root Cause

In [`WalkerLib.modify` function](https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Lib.sol#L14-L19), it calculates the tree index for `highTick` like below.

```solidity
uint24 high = pInfo.treeTick(highTick) - 1;
```

But, in [`PoolWalker.settle` function](https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Pool.sol#L15-L20), it calculates the tree index for `highTick` differently(one increased: next index compaired to the previous one).

```solidity
uint24 high = pInfo.treeTick(highTick);
```

So `PoolWalker.settle` function makes different route rather than `WalkerLib.modify` function.

As it walks through different route, it might fails to update correct right node.

In some cases, it updates correct right node as walking functions also going through sibling nodes, but it fails in other cases.

### Internal Pre-conditions

Correct tree index for `highTick`(`pInfo.treeTick(highTick) - 1`) and the next one(`pInfo.treeTick(highTick)`) is in such condition that it can't walk through the correct node when walking up from the wrong right node in the wrong route.

### External Pre-conditions

None

### Attack Path

1. A Maker creates an asset(Asset A) with a tick range that meets internal pre-condition.
2. Another maker try to create an asset with an affected tick range(means that a range that walkers visits the affected node), but it would fail because there is no position for the affected node in the pool.
3. A taker try to create an asset with an affected tick range, but it would fail because of the same reason.
4. The owner of Asset A try to remove the asset, but it would fail because of the same reason.

### Impact

- As it doesn't update the correct right node's liquidity according to node's information, some balances remains in maker facet(in case of maker) and some liquidity would remains in pool(in case of taker).

- Further operations related to the affected node would fail because of the discrepancy in actual pool's state and pool node's information.

### PoC

To check the discrepancy between right node's liquidity information and pool's actual state in that node's range, please add the below test code to the `Ammplify\test\walkers\Lib.t.sol` and run ` forge test --mt testPoolWalkNotWorkCorrectly -vvvv`.

```solidity
import { Route, RouteImpl } from "../../src/tree/Route.sol";
import { Key } from "../../src/tree/Key.sol";

function testPoolWalkNotWorkCorrectly() public {
    // Generic data setup.
    PoolInfo memory pInfo = PoolLib.getPoolInfo(pools[0]);
    console.log("----------Pool's tree info----------");
    console.log("Tree Width", pInfo.treeWidth);
    console.log("Tick Spacing", pInfo.tickSpacing);
    int24 lowTick;
    int24 highTick;
    lowTick = -150;
    highTick = 150;
    (Asset storage asset, ) = AssetLib.newMaker(msg.sender, pInfo, lowTick, highTick, 1e24, true);
    Data memory data = DataImpl.make(pInfo, asset, 0, type(uint160).max, 1e24);
    WalkerLib.modify(pInfo, lowTick, highTick, data);

    uint24 low = pInfo.treeTick(lowTick);
    uint24 highInWalker = pInfo.treeTick(highTick) - 1;
    Route memory routeInWalker = RouteImpl.make(pInfo.treeWidth, low, highInWalker);
    Key left = routeInWalker.left;
    Key rightInWalker = routeInWalker.right;

    uint24 highInPoolWalker = pInfo.treeTick(highTick);
    Route memory routeInPoolWalker = RouteImpl.make(pInfo.treeWidth, low, highInPoolWalker);
    Key rightInPoolWalker = routeInPoolWalker.right;
    console.log("----------Tree Indexes For rights----------");
    console.log("In Walker", highInWalker);
    console.log("In Pool Walker", highInPoolWalker);
    console.log("----------Right Keys----------");
    console.log("Walker right key's base", rightInWalker.base());
    console.log("Walker right key's width", rightInWalker.width());
    console.log("PoolWalker right key's base", rightInPoolWalker.base());
    console.log("PoolWalker right key's width", rightInPoolWalker.width());

    console.log("----------After WalkerLib's modify called----------");
    console.log("Left liq dirty status", data.node(left).liq.dirty);
    console.log("Right liq dirty status", data.node(rightInWalker).liq.dirty);
    console.log("PoolWalker's Right liq dirty status", data.node(rightInPoolWalker).liq.dirty);

    // Settle the positions for realism (later walks will try to collect expecting a position to be there).
    PoolWalker.settle(pInfo, lowTick, highTick, data);
    console.log("----------After Pool Settle----------");
    console.log("Left liq dirty status", data.node(left).liq.dirty);
    console.log("Right liq dirty status", data.node(rightInWalker).liq.dirty);
    console.log("PoolWalker's Right liq dirty status", data.node(rightInPoolWalker).liq.dirty);
    console.log("----------Right node's liquidity information(Required liquidity of right node)----------");
    uint128 rightNodeLiquidity = uint128(data.node(rightInWalker).liq.net());
    console.log("Net Liquidity of node", rightNodeLiquidity);

    (int24 lowTickRight, int24 highTickRight) = rightInWalker.ticks(data.fees.rootWidth, data.fees.tickSpacing);
    uint128 poolLiq = PoolLib.getLiq(data.poolAddr, lowTickRight, highTickRight);
    console.log("----------Actual liquidity of the pool in the right node's tick range----------");
    console.log("Liquidity of pool in right node's range", poolLiq);
    assertNotEq(rightNodeLiquidity, poolLiq);
}
```

Also to see the impacts of this discrepancy, please add below code to `Ammplify\test\facets\Maker.t.sol` and run `forge test --mt testMismatchBreaksFurtherOperationsRelatedToWrongNode -vvvv`.
(PS: Need to change `(, address _pool, address _token0, address _token1) = setUpPool();` in the `setUp` function to `(, address _pool, address _token0, address _token1) = setUpPool(500);` to make it run successfully.)

```solidity
import { console2 as console } from "forge-std/console2.sol";
import { AmmplifyAdminRights } from "../../src/facets/Admin.sol";

function testMismatchBreaksFurtherOperationsRelatedToWrongNode() public {
    bytes memory rftData = "";
    int24 lowTick1 = -150;
    int24 highTick1 = 150;
    uint256 balance0 = token0.balanceOf(address(makerFacet));
    uint256 balance1 = token1.balanceOf(address(makerFacet));
    console.log("---------------Balance Before Creating Maker---------------");
    console.log("Toke0 balance", balance0);
    console.log("Toke1 balance", balance1);

    uint256 assetId = makerFacet.newMaker(
        recipient,
        poolAddr,
        lowTick1,
        highTick1,
        liquidity,
        false,
        minSqrtPriceX96,
        maxSqrtPriceX96,
        rftData
    );

    balance0 = token0.balanceOf(address(makerFacet));
    balance1 = token1.balanceOf(address(makerFacet));
    console.log("---------------Balance After Creating Maker---------------");
    console.log("Toke0 balance", balance0);
    console.log("Toke1 balance", balance1);

    int24 lowTick2 = 140;
    int24 highTick2 = 150;
    address recipient2 = makeAddr("otherUser");
    rftData = "";
    // Below call reverts because it tries to collect fees in the range (140, 150)
    // while calling WalkerLib.modify funcion call as the node's info indicate that there are some liquidity in that range.
    // But, actually, there is no position created when the first maker is created
    vm.expectRevert();
    makerFacet.newMaker(
        recipient2,
        poolAddr,
        lowTick2,
        highTick2,
        liquidity,
        true,
        minSqrtPriceX96,
        maxSqrtPriceX96,
        rftData
    );

    // Setup for taker operation
    uint160[2] memory sqrtPriceLimitsX96 = [MIN_SQRT_RATIO, MAX_SQRT_RATIO];
    uint160 freezeSqrtPriceX96 = 3 << 95;
    adminFacet.submitRights(address(this), AmmplifyAdminRights.TAKER, true);
    vm.warp(block.timestamp + 3 days);
    adminFacet.acceptRights();
    rftData = "";

    // Reverts because of the same reason above
    vm.expectRevert();
    takerFacet.newTaker(
        recipient2,
        poolAddr,
        [lowTick2, highTick2],
        1e18,
        [0, 1],
        sqrtPriceLimitsX96,
        freezeSqrtPriceX96,
        rftData
    );

    vm.startPrank(recipient);
    // Reverts as it doesn't have actual liquidity in pool for the affect node's range
    vm.expectRevert();
    rftData = "";
    makerFacet.removeMaker(
        recipient,
        assetId,
        uint128(minSqrtPriceX96),
        uint128(maxSqrtPriceX96),
        rftData
    );
    vm.stopPrank();
}
```

### Mitigation

Use correct tree index in the route of `PoolWalker.settle` function.

```solidity
function settle(PoolInfo memory pInfo, int24 lowTick, int24 highTick, Data memory data) internal {
    uint24 low = pInfo.treeTick(lowTick);
    uint24 high = pInfo.treeTick(highTick) - 1; //@audit: should deduct 1 like WalkerLib.modify
    Route memory route = RouteImpl.make(pInfo.treeWidth, low, high);
    route.walk(down, up, phase, WalkerLib.toRaw(data));
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Ammplify/pull/14/files
