---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Ammplify]]"
auditors:
  - "[[Peter1992]]"
  - "[[SOPROBRO]]"
  - "[[Theseersec]]"
  - "[[anonymousjoe]]"
  - "[[panprog]]"
  - "[[samm-code]]"
  - "[[vtim]]"
report: "https://github.com/sherlock-audit/2025-09-ammplify-judging"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-7: `Maker.collectFees` re-targets liquidity to original amount even if the maker position was adjusted, causing unexpected position change when the user expected to collect fees only.

- id: 63173
- impact: HIGH
- protocol: [[Ammplify]]
- reporter: panprog (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the `Maker.collectFees` function. When this function is called, it targets the original amount of liquidity for an asset, but does not modify the asset's liquidity in the `adjustMaker` function. This can lead to unexpected changes in a user's position and potential loss of funds. The root cause is that `adjustMaker` does not change the asset's liquidity, which is used in `collectFees`. This can happen when a user has adjusted their position before collecting fees. The impact of this bug includes unexpected changes in a user's position and potential loss of funds. The protocol team has fixed this issue in a recent PR. 

## Details


Source: https://github.com/sherlock-audit/2025-09-ammplify-judging/issues/421 

## Found by 
Peter1992, SOPROBRO, Theseersec, anonymousjoe, panprog, samm-code, vtim

### Summary

When `Maker.collectFees` is called, it simply re-targets the liquidity to the asset's original amount:
```solidity
        // We collect simply by targeting the original liq balance.
        Data memory data = DataImpl.make(pInfo, asset, minSqrtPriceX96, maxSqrtPriceX96, asset.liq);
```

The issue is that `asset.liq` is set in `newMaker`, but is not modified in `adjustMaker`. The data is set to new target liquidity, but the asset node itself is never changed:
```solidity
        Data memory data = DataImpl.make(pInfo, asset, minSqrtPriceX96, maxSqrtPriceX96, targetLiq);
```

This means that if the user has ever adjusted his position and later tries to collect fees, his position will be unexpectedly modified along with collecting fees. Unsuspecting users can thus lose funds. For example, if his position has unexpectedly increases due to fee collection, he might lose funds from impermanent loss before realizing the issue and reducing again.

Additionally, the `Maker.collectFees` function doesn't expect that the user might have to pay, so the order of settlement is:
```solidity
        PoolWalker.settle(pInfo, asset.lowTick, asset.highTick, data);
...
        RFTLib.settle(recipient, tokens, balances, rftData);
```
If the user position is increased in this function, `PoolWalker.settle` will first mint a new uniswap position for the diamond, and only then the user will be charged with the amounts of tokens to mint it. Transaction might revert if diamond doesn't have enough funds (from takers collaterals).

### Root Cause

`Maker.adjustMaker` doesn't change asset's liquidity, which is used to re-target liquidity in `Maker.collectFees`:
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/facets/Maker.sol#L55-L68
https://github.com/sherlock-audit/2025-09-ammplify/blob/main/Ammplify/src/facets/Maker.sol#L142-L143

### Internal Pre-conditions

- User adjusted his position before collecting fees.
- Secondary condition: user reduced position before collecting fees and diamond doesn't have enough funds to mint the liquidity equal to this change (from taker collateral and previously collected fees not yet claimed or compounded).

### External Pre-conditions

None.

### Attack Path

Always happens by itself when internal pre-condition is met

### Impact

- User position is unexpectedly increased or decreased when `collectFees` is called
- User loses funds from either increased impermanent loss or decreased fees earned (from the time position changes until user finds out it has changed and adjusts it again)
- Unexpected behaviour of core functionality (`collectFees`)

Secondary impact:
- If user has decreased position before collecting fees, user's maker liquidity will increase in `collectFees`, and if diamond doesn't have enough tokens balance to mint this additional liquidity, the transaction will revert (core functionality not working in some cases). It can happen either for large user liquidity change, or if there is not too much taker collateral.

Notes:
- Since the user doesn't expect his position to change when doing `collectFees`, it can take some time before this position change is discovered. This allows for the funds loss from, e.g., increased impermanent loss, to become significant. For example, if user reduced liquidity from 1000e18 to 10e18 and then collected fees, his position will be back to 1000e18 and additional impermanent loss after 1 hour can be 1e18, which is 10% funds loss from the position amount of 10e18.

### Proof of concept

Add this test to `Maker.t.sol`:
```solidity
    // adjust maker position, then collect fees
    // instead of keeping liquidity, it will modify it back to original size
   function testAdjustMakerCollect() public {
        bytes memory rftData = "";

        // add funds to diamond so that it has some extra to mint before collecting from the user
        takerFacet.collateralize(recipient, address(token1), 1e20, "");

        // current price above the range we'll work at
        swapTo(0, TickMath.getSqrtRatioAtTick(1000));

        // Create maker
        uint256 makerAssetId = makerFacet.newMaker(
            recipient,
            poolAddr,
            720,
            960,
            300e18,
            false, // non-compounding
            minSqrtPriceX96,
            maxSqrtPriceX96,
            rftData
        );

        // reduce maker
        makerFacet.adjustMaker(recipient, makerAssetId, 100e18, minSqrtPriceX96, maxSqrtPriceX96, rftData);

        // collect maker
        // instead of keeping liquidity the same, it is increased
        makerFacet.collectFees(recipient, makerAssetId, minSqrtPriceX96, maxSqrtPriceX96, rftData);

        (,,,,, uint128 liq) = viewFacet.getAssetInfo(makerAssetId);
        console2.log("Liquidity after collecting: ", liq);
    }
```

The test creates new maker with 300e18 liquidity, reduces it to 100e18, the collects fees. After fees collection, liquidity is 300e18 instead of 100e18.

Console output from running the test:

```solidity
  Liquidity after collecting:  300000000000000000000
```

### Mitigation

Change the `asset.liq` amount to target liquidity in `Maker.adjustMaker`.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Ammplify/pull/31
