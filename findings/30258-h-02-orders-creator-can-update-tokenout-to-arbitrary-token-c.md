---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - precondition/specific-token-type
  - novelty/variant
  - sector/lending
protocol: "[[INIT Capital]]"
auditors:
  - "[[Said]]"
report: "https://code4rena.com/reports/2024-01-init-capital-invitational"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
---
# [H-02] Order's creator can update `tokenOut` to arbitrary token

- id: 30258
- impact: HIGH
- protocol: [[INIT Capital]]
- reporter: said (Code4rena)
- source: https://code4rena.com/reports/2024-01-init-capital-invitational

## Summary


The bug report discusses an issue in the code that allows the order creator to change the `order.tokenOut` to a different token before the `fillOrder` is executed. This can potentially be exploited by the order creator by changing the token to a high-value one, causing the executor to transfer the amount using the new token. The report suggests a mitigation step to validate the new token when the `updateOrder` function is called. The severity of the bug has been increased to High as it can violate the executor's expectation and is a common practice for the executor to approve the hook to spend multiple tokens.

## Details


When an order is created, it checks whether the `order.tokenOut` is equal to `marginPos.baseAsset` or `_tokenOut` is equal to `marginPos.quoteAsset`. However, when `tokenOut` is updated via `updateOrder`, it can be changed to an arbitrary token. This has the potential to be exploited by changing `tokenOut` to a high-value token right before the executor executes the `fillOrder`.

### Proof of Concept

It can be observed that order's creator can update `order.tokenOut` to arbitrary token.

<https://github.com/code-423n4/2024-01-init-capital-invitational/blob/main/contracts/hook/MarginTradingHook.sol#L504-L526>

```solidity
    function updateOrder(
        uint _posId,
        uint _orderId,
        uint _triggerPrice_e36,
        address _tokenOut,
        uint _limitPrice_e36,
        uint _collAmt
    ) external {
        _require(_collAmt != 0, Errors.ZERO_VALUE);
        Order storage order = __orders[_orderId];
        _require(order.status == OrderStatus.Active, Errors.INVALID_INPUT);
        uint initPosId = initPosIds[msg.sender][_posId];
        _require(initPosId != 0, Errors.POSITION_NOT_FOUND);
        MarginPos memory marginPos = __marginPositions[initPosId];
        uint collAmt = IPosManager(POS_MANAGER).getCollAmt(initPosId, marginPos.collPool);
        _require(_collAmt <= collAmt, Errors.INPUT_TOO_HIGH);

        order.triggerPrice_e36 = _triggerPrice_e36;
        order.limitPrice_e36 = _limitPrice_e36;
        order.collAmt = _collAmt;
        order.tokenOut = _tokenOut;
        emit UpdateOrder(initPosId, _orderId, _tokenOut, _triggerPrice_e36, _limitPrice_e36, _collAmt);
    }
```

This can be exploited by the order's creator. When the executor is about to execute the `fillOrder`, the order creator can front-run the operation by changing the `order.tokenOut` to a token with a high value. Consequently, the executor will transfer the amount that needs to be transferred but using this new high-value token. But this require hook already have approval from the executor to manage the new high value token.

### Recommended Mitigation Steps

Validate the new token when `updateOrder` is called :

```diff
    function updateOrder(
        uint _posId,
        uint _orderId,
        uint _triggerPrice_e36,
        address _tokenOut,
        uint _limitPrice_e36,
        uint _collAmt
    ) external {
        _require(_collAmt != 0, Errors.ZERO_VALUE);
        Order storage order = __orders[_orderId];
        _require(order.status == OrderStatus.Active, Errors.INVALID_INPUT);
        uint initPosId = initPosIds[msg.sender][_posId];
        _require(initPosId != 0, Errors.POSITION_NOT_FOUND);
        MarginPos memory marginPos = __marginPositions[initPosId];
        uint collAmt = IPosManager(POS_MANAGER).getCollAmt(initPosId, marginPos.collPool);
        _require(_collAmt <= collAmt, Errors.INPUT_TOO_HIGH);
+       _require(_tokenOut == marginPos.baseAsset || _tokenOut == marginPos.quoteAsset, Errors.INVALID_INPUT);

        order.triggerPrice_e36 = _triggerPrice_e36;
        order.limitPrice_e36 = _limitPrice_e36;
        order.collAmt = _collAmt;
        order.tokenOut = _tokenOut;
        emit UpdateOrder(initPosId, _orderId, _tokenOut, _triggerPrice_e36, _limitPrice_e36, _collAmt);
    }
```

**[fez-init (INIT) confirmed](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/23#issuecomment-1929196620)**

**[Ladboy233 (Warden) commented](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/23#issuecomment-1932316201):**
 > I think the severity should be high because it is very common the executor tries to fill a lot of order that have different token.
> 
> It is common that executor approves the hook to spend multiple tokens.
> 
> Order creator frontrun to update order to different token clearly violate order executor's expectation if order creator update a low value token with high value token before the order is filled.

**[hansfriese (Judge) increased severity to High and commented](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/23#issuecomment-1932318773):**
 > I left a comment [here](https://github.com/code-423n4/2024-01-init-capital-invitational-findings/issues/6#issuecomment-1932316024).


***
