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
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[merkle-tree-overflow]]"
---
# H-11: Takers pay significantly higher fees than expected due to borrow amounts being split across segments

- id: 63177
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by user "panprog" on the GitHub repository for the 2025-09-ammplify-judging project. The bug occurs when takers pay their fees, as the amounts of token0 and token1 are calculated based on the geometric mean price of the interval. However, due to the use of a segment tree to store taker liquidity, the amounts are calculated based on the geometric mean of each segment rather than the original price. This results in inflated borrow amounts, with the sum of these amounts being up to 200 times more than expected. This bug can cause takers to be charged fees that are much larger than they expect, up to 1000 times more. The root cause of this bug is the way taker liquidity is stored in the segment tree, and there are no internal or external pre-conditions for this bug to occur. It happens automatically and can affect takers with ranges that fit within a single node or multiple nodes. The impact of this bug is significant, as takers can be charged much more than expected, and a proof of concept test has been provided to demonstrate this issue. Mitigation for this bug is difficult and depends on the developer's intentions, but one possible solution is to calculate the borrow amounts for the full range and then split them into nodes according to the node width.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/452 

## Found by 
panprog

### Summary

When takers pay their fees, they pay their taker rate using the amounts of token0 and token1 based on the geometric mean price of the interval (in `Data.computeBorrows`):
```solidity
        int24 gmTick = lowTick + (highTick - lowTick) / 2; // The tick of the geometric mean.
```

For example, if there is 1e18 taker liquidity in the [-122880..245760] range, the borrow amounts for this interval should be: 
- `borrowX = 0.046e18`
- `borrowY = 21.6e18`

The issue is that since a segment tree is used to store taker liquidity, internally it's broken into 2 segments, and the amounts of `token0` and `token1` are calculated based on the geometric mean of each segment rather than original price, which inflates borrow amounts a lot:
- for [-122880..0]: `borrowX = 20.6e18`, `borrowY = 0.044e18`
- for [0..245760]:  `borrowX = 0.00214e18`, `borrowY = 464.7e18`
The sum of these borrow amounts is: `borrowX = 20.6e18`, `borrowY = 464.8e18`. It is at least 200x times more than the expected borrow amount.

With a 10% taker rate, taker expects to pay `0.0046e18` `token0` and `2.16e18` `token1`. However, due to how the liquidity is stored and calculated, the taker will pay `2.06e18` `token0` and `46.48e18` `token1`.

Note: there is a similar-sounding issue reported, but it's quite different from this one. This one concerns the way the taker liquidity is stored in the segment tree (i.e. it's impossible to recognize what the original range was after it's split into nodes), while the other issue is about the way the borrow amounts are propogated inside the tree during calculation. The root cause, code part and fix are different for these issues.

### Root Cause

The taker liquidity is stored in separate nodes with base borrow amounts calculated as sum of borrow amounts of all nodes:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L323-L327

Since a borrow amount of each segment is calculated at geometric mean of the segment, sum of subsegment borrow amounts is always greater than borrow amount of the parent segment.

### Internal Pre-conditions

None.

### External Pre-conditions

None.

### Attack Path

Happens by itself almost always (except when taker liquidity is perfectly alligned inside single node):
- Any time taker fees are charged, the borrow base amount is greater than expected

### Impact

Takers are charged fees which are much larger than they expect (up to 1000x more, but the actual amounts depends on taker range width and the alignment of the range over the segment tree nodes).

### Proof of concept

This test demonstrates that taker fees can be hugely different when the range is very similar, but one range fits within 1 node, while the other takes multiple nodes.
Add this test to `Taker.t.sol`:
```solidity
    // the test to demonstrate borrowX / borrowY amounts calculated from 1 range
    // are much smaller than sum of borrowX / borrowY from multiple sub-segments of the same range
    function testBorrowRange() public {
        ticks[0] = 60;
        ticks[1] = 61500;

        bytes memory rftData = "";

        // Collateralize before creating taker position
        _collateralizeTaker(recipient, liquidity);

        // add some liquidity to avoid revert due to the other bugs
        addPoolLiq(0, 0, 61440, 1);
        addPoolLiq(0, 61440, 61500, 1);
        addPoolLiq(0, 60, 61500, 1);
        addPoolLiq(0, 30720, 61440, 1);
        addPoolLiq(0, 15360, 30720, 1);
        addPoolLiq(0, 7680, 15360, 1);
        addPoolLiq(0, 3840, 7680, 1);
        addPoolLiq(0, 1920, 3840, 1);
        addPoolLiq(0, 960, 1920, 1);
        addPoolLiq(0, 480, 960, 1);
        addPoolLiq(0, 240, 480, 1);
        addPoolLiq(0, 120, 240, 1);
        addPoolLiq(0, 60, 120, 1);

        // current price inside the range
        swapTo(0, TickMath.getSqrtRatioAtTick(30000));

        // create a maker
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            ticks[0],
            ticks[1],
            1000e18, 
            false,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        // taker
        uint balance0Before = token0.balanceOf(address(this));
        uint balance1Before = token1.balanceOf(address(this));
        uint256 takerAssetId = takerFacet.newTaker(
            recipient,
            poolAddr,
            ticks,
            100e18,
            vaultIndices,
            sqrtPriceLimitsX96,
            316912650057057350374175801344, // sqrt price at tick 30000
            rftData
        );

        // skip 1 day (the default rates setup in test config are huge, so 1 day is over 100%)
        vm.roll(1);
        skip(86400);

        // close taker
        int balance0;
        int balance1;
        (,, balance0, balance1) = takerFacet.removeTaker(takerAssetId, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        console.log("taker delta0: ", int(token0.balanceOf(address(this))) - int(balance0Before));
        console.log("taker delta1: ", int(token1.balanceOf(address(this))) - int(balance1Before));
    }
```

Console output from running the test for different ranges:
```solidity
  Range: [0..61440]
  taker delta0:  -103656284008960492872
  taker delta1:  -2237080338801346043575

  Range: [60..61500]
  taker delta0:  -6872773555155430359929
  taker delta1:  -38030987209605234027252
```

Note: 
- The range [0..61440] fits within one segment tree node, thus it has correct taker fee of `103e18` `token0` and `2237e18` `token1`
- The range [60..61500] is very similar to previous range, so the taker fee should be very similar, but since it's broken down into many segments (60..120, 120..240, 240..480, ..., 15360..30720, 30720..61440, 61440..61500), the total borrow amounts are greater and total taker fee is `6872e18` `token0` and `38030e18` `token1`, at least 17x times greater than [0..61440] segment taker fees.

### Mitigation

This is hard to fix and is the core protocol design, so depends on the developer intentions. One possible solution is to calculate the `borrowX` and `borrowY` for the liquidity deposited in its full range, then split these amounts into nodes according to the node width.
