---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Sofamon August]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [H-03] `order.amount` not accounted when filling

- id: 41367
- impact: HIGH
- protocol: Sofamon-August
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Sofamon-security-review-August.md

## Summary


The bug report is about two functions, `fillAskOrder()` and `fillBidOrder()`, which are not working properly when trying to trade more than one token. The function `fillAskOrder()` is supposed to take `order.amount` as its value, but it does not account for this value when executing the trade. This means that the function is only able to trade one token at a time. There is another function, `fulfillMultipleOrders()`, which does account for `order.amount` and allows for trading with multiple tokens. The recommendation is to fix the issue in the necessary functions to allow for trading with more than one token.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`fillAskOrder()` and `fillBidOrder()` operate with values equal to `order.price`.
E.g.:

```solidity
    function fillAskOrder(FulfillOrder calldata order) public payable {
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = order.amount;

        order.orderPool.swapTokenForSpecificNFTs{ value: order.price }(amounts, order.price, payable(msg.sender), false, address(0));

        emit AskFilled(order.orderPool, msg.sender, order.nftId, order.amount, order.price);
    }
```

In this case, order.amount should always be 1.

There is another function which executes multiple orders - `fulfillMultipleOrders()`, and the calculation is different there.

```solidity
                order.orderPool.swapTokenForSpecificNFTs{ value: order.price * order.amount }(
                    amounts, order.price * order.amount, payable(msg.sender), false, address(0)
                );
```

This is the correct approach that allows trading with more than one token thanks to sending `order.price * order.amount`.

## Recommendations

Consider accounting for `order.amount` in necessary fill functions.
