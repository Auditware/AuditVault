---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[Bauer]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[wrong-condition]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# [H-04] `KangarooVault.removeCollateral` updates storage without actually removing collateral, resulting in lost collateral

- id: 20227
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: Bauer (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


The bug report is about the function `KangarooVault.removeCollateral` which is supposed to allow the admin to remove collateral if a position is healthy enough. The function does not call `EXCHANGE.removeCollateral` and updates storage, but does not actually retrieve any collateral. This results in two problems, the first being that `processWithdrawalQueue` will revert unexpectedly, as `usedFunds` will be lower than it should. The second and main problem is that the amount of collateral "removed" in `removeCollateral` will be lost when closing a position in `KangarooVault._closePosition`.

To demonstrate the issue, the bug report includes a proof of concept which amends a test to `KangarooVault.t.sol`. The test shows how collateral is not transferred upon calling `removeCollateral()`.

The recommended mitigation is to ensure `Exchange.removeCollateral` is called. The bug report was confirmed via a duplicate issue and the severity was increased to High.

## Details


The admin can call `KangarooVault.addCollateral` to add additional collateral to a Power Perp position.

```solidity
File: src/KangarooVault.sol
424:     function addCollateral(uint256 additionalCollateral) external requiresAuth nonReentrant {
425:         SUSD.safeApprove(address(EXCHANGE), additionalCollateral);
426:         EXCHANGE.addCollateral(positionData.positionId, additionalCollateral);
427: 
428:         usedFunds += additionalCollateral;
429:         positionData.totalCollateral += additionalCollateral;
430: 
431:         emit AddCollateral(positionData.positionId, additionalCollateral);
432:     }
```

This transfers `SUSD` to the `EXCHANGE` and updates the `usedFunds` and `positionData.totalCollateral`

The function `KangarooVault.removeCollateral` allows the admin to remove collateral if a position is healthy enough.

```solidity
File: src/KangarooVault.sol
436:     function removeCollateral(uint256 collateralToRemove) external requiresAuth nonReentrant {
437:         (uint256 markPrice,) = LIQUIDITY_POOL.getMarkPrice();
438:     uint256 minColl = positionData.shortAmount.mulWadDown(markPrice);
439:         minColl = minColl.mulWadDown(collRatio);
440: 
441:         require(positionData.totalCollateral >= minColl + collateralToRemove);
442:         
443:         usedFunds -= collateralToRemove;
444:         positionData.totalCollateral -= collateralToRemove;
445: 
446:         emit RemoveCollateral(positionData.positionId, collateralToRemove);
447:     }    
```

The issue is that this function does not call `EXCHANGE.removeCollateral`.<br>
While it updates storage, it does not actually retrieve any collateral.

### Impact

2 problems arising:

*   `processWithdrawalQueue` will revert unexpectedly, as `usedFunds` will be lower than it should, leading to `availableFunds` being greater than the real balance of `SUSD` available (`KangarooVault.sol#L279`).
*   the main problem: the amount of collateral "removed" in `removeCollateral` will be lost :

When closing a position in `KangarooVault._closePosition`, the amount of collateral to retrieve is written in `tradeParams.collateralAmount`. As you can see below, it is capped by `positionData.totalCollateral`, which was decremented in `removeCollateral`.

```solidity
File: src/KangarooVault.sol
687:         if (amt >= positionData.shortAmount) {
688:             longPositionToClose = positionData.longPerp;
689: 
690:             tradeParams.amount = positionData.shortAmount;
691:             tradeParams.collateralAmount = positionData.totalCollateral; //@audit here
692:         } else {
693:             longPositionToClose = amt.mulDivDown(positionData.longPerp, positionData.shortAmount);
694:             uint256 collateralToRemove = amt.mulDivDown(positionData.totalCollateral, positionData.shortAmount);
695: 
696:             tradeParams.amount = amt;
697:             tradeParams.collateralAmount = collateralToRemove;
698:         }
699: 
700:         SUSD.safeApprove(address(LIQUIDITY_POOL), maxCost);
701:         uint256 totalCost = EXCHANGE.closeTrade(tradeParams);
```

This is the amount of collateral that will be transferred back to the trader (here the `KangarooVault`)

```solidity
src/Exchange.sol _closeTrade()
316: shortCollateral.sendCollateral(params.positionId, params.collateralAmount);
```

```solidity
File: src/ShortCollateral.sol
106:     function sendCollateral(uint256 positionId, uint256 amount) external override onlyExchange nonReentrant {
107:         UserCollateral storage userCollateral = userCollaterals[positionId];
108: 
109:         userCollateral.amount -= amount;
110: 
111:         address user = shortToken.ownerOf(positionId);
112: 
113:         ERC20(userCollateral.collateral).safeTransfer(user, amount); //@audit capped by `positionData.totalCollateral`
```

In conclusion, calling `removeCollateral` will result in that amount being lost.

### Proof of Concept

Amend this test to `KangarooVault.t.sol`, which shows how collateral is not transferred upon calling `removeCollateral()`.

```diff
429:     function testCollateralManagement() public {
430:         uint256 amt = 1e18;
431:         uint256 collDelta = 1000e18;
432: 
433:         kangaroo.openPosition(amt, 0);
434:         skip(100);
435:         kangaroo.executePerpOrders(emptyData);
436:         kangaroo.clearPendingOpenOrders(0);
437: 
438:         (,,,,,,, uint256 initialColl,) = kangaroo.positionData();
+439:         uint256 balanceBefore = susd.balanceOf(address(kangaroo));
440: 
441:         kangaroo.addCollateral(collDelta);
+442:         uint256 balanceAfter = susd.balanceOf(address(kangaroo));
+443:         assertEq(collDelta, balanceBefore - balanceAfter);
444:         (,,,,,,, uint256 finalColl,) = kangaroo.positionData();
445: 
446:         assertEq(finalColl, initialColl + collDelta);
447: 
+448:         uint256 balanceBefore2 = susd.balanceOf(address(kangaroo));
449:         kangaroo.removeCollateral(collDelta);
+450:         uint256 balanceAfter2 = susd.balanceOf(address(kangaroo));
+451:         assertEq(0, balanceAfter2 - balanceBefore2); //@audit collateral not removed
452: 
453:         (,,,,,,, uint256 newColl,) = kangaroo.positionData();
454: 
455:         assertEq(newColl, initialColl);
456:     }

```

### Tools Used

Manual Analysis, Foundry

### Recommended Mitigation

Ensure `Exchange.removeCollateral` is called:

```diff
File: src/KangarooVault.sol
436:     function removeCollateral(uint256 collateralToRemove) external requiresAuth nonReentrant {
437:         (uint256 markPrice,) = LIQUIDITY_POOL.getMarkPrice();
438:         uint256 minColl = positionData.shortAmount.mulWadDown(markPrice);
439:         minColl = minColl.mulWadDown(collRatio);
440: 
441:         require(positionData.totalCollateral >= minColl + collateralToRemove);
442:         
443:         usedFunds -= collateralToRemove;
444:         positionData.totalCollateral -= collateralToRemove;
445: 
+            EXCHANGE.removeCollateral(positionData.positionId, collateralToRemove)
446:         emit RemoveCollateral(positionData.positionId, collateralToRemove);
447:     }    
```

**[mubaris (Polynomial) confirmed via duplicate issue `#111`](https://github.com/code-423n4/2023-03-polynomial-findings/issues/111#issuecomment-1493876338)**

**[Dravee (judge) increased severity to High](https://github.com/code-423n4/2023-03-polynomial-findings/issues/189#issuecomment-1532268430)**



***
