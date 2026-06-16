---
tags:
  - lang/solidity
  - sector/dex
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/fee-theft
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[frozen-funds]]"
  - "[[fee-theft]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Incorrect Timing of removingAllLiquidity Flag Calculation in cancelOrder

- id: 61385
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The `LimitOrderHook` contract has a problem with its `cancelOrder` function. This function is used to cancel orders and distribute fees, but it is not working correctly. The contract is incorrectly calculating a flag that determines how fees are allocated, and this is causing the fees to be held in the contract instead of being given to the user who cancelled their order. This also creates a vulnerability where someone can steal these fees by reusing the same order key. To fix this issue, the contract needs to check the flag before reducing the total liquidity and reset the order key when an order is cancelled. These changes will ensure that the correct fees are distributed and prevent funds from being locked in the contract.

## Details

The `LimitOrderHook` contract contains a logical flaw in its `cancelOrder` [function](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L281) pertaining to the [calculation](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L313) of the `removingAllLiquidity` [flag](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L105). This flag determines how fees are allocated in the `_handleCancelCallback` [function](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L466), but it is being computed at the wrong moment in the execution sequence.

In the current implementation, the contract first [decrements](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L299) the user's liquidity from `orderInfo.liquidityTotal` and then [compares](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L313) the user's liquidity amount with the updated total. Since the total has already been reduced by the user's contribution, this comparison will always be evaluated to `false`. This means that even when a user cancels the last remaining liquidity in an order, the `removingAllLiquidity` flag is incorrectly set to `false`.

This issue impacts fee distribution, as [explained](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L490) in the `_handleCancelCallback` function. When a user cancels the last of an order's liquidity, the fees should go to them instead of being allocated to non-existent remaining liquidity providers. However, the current implementation incorrectly holds these fees in the contract where they become apparently inaccessible. There is also a second issue that allows these fees to be stolen: at the order key in the `orders` mapping, the ID is not being reset to `ORDER_ID_DEFAULT`. This means that someone can place an order, fill it, and place it again using the same order key as before. This will cause the order to be effectively fillable again, and the stuck fees would become available to be taken.

To fix this issue, the `removingAllLiquidity` check should be performed before reducing the total liquidity, and the `cancelOrder` or its callback should also reset the `orderId` inside the `orders` mapping. These changes ensure that when the last user cancels their liquidity, they correctly receive any accrued fees, maintaining proper accounting within the contract and preventing funds from being locked indefinitely.
