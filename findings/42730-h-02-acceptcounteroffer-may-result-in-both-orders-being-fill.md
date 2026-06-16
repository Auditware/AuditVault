---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - sector/lending
protocol: "[[Putty]]"
auditors:
  - "[[hyh]]"
report: "https://code4rena.com/reports/2022-06-putty"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-02] `acceptCounterOffer()` May Result In Both Orders Being Filled

- id: 42730
- impact: HIGH
- protocol: [[Putty]]
- reporter: hyh (Code4rena)
- source: https://code4rena.com/reports/2022-06-putty

## Summary


The bug report is about a vulnerability in the code for Putty Finance, a platform for trading digital assets. The bug allows an attacker to fill an order twice by accepting a counter offer for an already filled order. This results in both orders being filled and the person making the transaction being twice as leveraged as intended. The impact of this bug is that it can cause financial loss for users. The report suggests a mitigation step to fix the bug, which involves adding a line of code to prevent the order from being filled if it has already been filled. The bug has been confirmed and resolved by the team at Putty Finance. 

## Details

_Submitted by kirk-baird, also found by csanuragjain, hansfriese, Lambda, and minhquanym_

When a user is attempting to accept a counter offer they call the function [acceptCounterOffer()](https://github.com/code-423n4/2022-06-putty/blob/3b6b844bc39e897bd0bbb69897f2deff12dc3893/contracts/src/PuttyV2.sol#L573-L584) with both the `originalOrder` to be cancelled and the new `order` to fill. It is possible for an attacker (or any other user who happens to call `fillOrder()` at the same time) to fill the `originalOrder` before `acceptCounterOffer()` cancels it.

The impact is that both `originalOrder` and `order` are filled. The `msg.sender` of `acceptCounterOffer()` is twice as leveraged as they intended to be if the required token transfers succeed.

### Proof of Concept

[acceptCounterOffer()](https://github.com/code-423n4/2022-06-putty/blob/3b6b844bc39e897bd0bbb69897f2deff12dc3893/contracts/src/PuttyV2.sol#L573-L584) calls `cancel()` on the original order, however it will not revert if the order has already been filled.

```solidity
    function acceptCounterOffer(
        Order memory order,
        bytes calldata signature,
        Order memory originalOrder
    ) public payable returns (uint256 positionId) {
        // cancel the original order
        cancel(originalOrder);


        // accept the counter offer
        uint256[] memory floorAssetTokenIds = new uint256[](0);
        positionId = fillOrder(order, signature, floorAssetTokenIds);
    }
```

[cancel()](https://github.com/code-423n4/2022-06-putty/blob/3b6b844bc39e897bd0bbb69897f2deff12dc3893/contracts/src/PuttyV2.sol#L526-L535) does not revert if an order has already been filled it only prevents future `fillOrder()` transactions from succeeding.

```solidity
    function cancel(Order memory order) public {
        require(msg.sender == order.maker, "Not your order");


        bytes32 orderHash = hashOrder(order);


        // mark the order as cancelled
        cancelledOrders[orderHash] = true;


        emit CancelledOrder(orderHash, order);
    }
```

Therefore any user may front-run the `acceptCounterOffer()` transaction with a `fillOrder()` transaction that fills the original order. As a result the user ends up filling both `order` and `originalOrder`. Then `acceptCounterOffer()` cancels the `originalOrder` which is essentially a no-op since it's been filled and continues to fill the new `order` resulting in both orders being filled.

### Recommended Mitigation Steps

Consider having `cancel()` revert if an order has already been filled. This can be done by adding the following line `require(_ownerOf[uint256(orderHash)] == 0)`.

**[outdoteth (Putty Finance) confirmed and commented](https://github.com/code-423n4/2022-06-putty-findings/issues/44#issuecomment-1179004913):**
 > Report: It’s possible to fill an order twice by accepting a counter offer for an already filled order.

**[outdoteth (Putty Finance) resolved](https://github.com/code-423n4/2022-06-putty-findings/issues/44#issuecomment-1185411950):**
 > PR with fix: https://github.com/outdoteth/putty-v2/pull/2.

**hyh (warden) reviewed mitigation:**
 > Fixed by requiring that order can't be in the filled state on cancel. This fully adheres to the original logic, but wasn't controlled for before.


***
