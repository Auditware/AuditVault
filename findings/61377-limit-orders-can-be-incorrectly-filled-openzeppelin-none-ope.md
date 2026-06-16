---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[fot-slippage]]"
---
# Limit Orders Can Be Incorrectly Filled

- id: 61377
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The LimitOrderHook contract has a bug where limit orders can be filled incorrectly in certain cases. This happens when a swap moves the tick into a limit order range and then back out again. The current code only checks for the tick crossing the lower boundary, but not the upper boundary. This results in the limit order being marked as filled even though the price did not cross the upper boundary. To fix this, the code should be updated to track both boundaries of the limit order range or to only mark an order as filled when both boundaries have been crossed. Alternatively, a mechanism could be implemented to handle partial fills. It is recommended to revise the _getCrossedTicks function to properly handle this edge case. 

## Details

The `LimitOrderHook` [contract](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol) [uses](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L198) the `_getCrossedTicks` [function](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L613) to determine which ticks were crossed during a swap by comparing the current pool tick with the previously stored tick. It then [processes](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L209) any limit orders within that range as filled in the `_afterSwap` [function](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L191).

However, there is an edge case where limit orders can be incorrectly filled when one of the following happens:

* A swap moves the tick into a limit order range (crossing the lower boundary but not the upper boundary).
* A subsequent swap moves the tick back in the opposite direction (crossing the lower boundary again).

This is demonstrated by the following scenario:

Consider a pool with:

```
 Current tick: -200
Tick spacing: 10
Limit order in range: [0, 10]

```

Sequence of events:

1. A swap moves the tick to 5 (increasing tick, crosses the lower boundary at 0). `tickLowerLast` [is](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L203) set [to 0](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L618) (the highest tick that was crossed).
2. A swap then moves the tick from 5 to -5 (decreasing tick, crosses the lower boundary again).
3. `_getCrossedTicks` [calculates](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L613-L628):

```
 tickLower = -10 (current tick rounded down)
tickLowerLast = 0 (from previous swap)

```

and it returns (-10, 0, 0) as the range of crossed ticks.

4. The for [loop](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L208) in `_afterSwap` iterates through this range exactly once, hitting tick 0. The limit order at [0, 10] is marked as [filled](https://github.com/OpenZeppelin/uniswap-hooks/blob/087974776fb7285ec844ca090eab860bd8430a11/src/general/LimitOrderHook.sol#L563) and deleted from the pool.

This is incorrect because the limit order was only partially filled (the price never crossed the upper boundary at tick 10).

The limit order filling mechanism should be modified to properly track when an order is fully filled by ensuring both boundaries of the order range have been crossed. One of the following approaches could be taken to address this:

* Track both the lower and upper boundaries of limit orders
* Only mark an order as filled when both boundaries have been crossed
* Alternatively, implement a mechanism to handle partial fills, allowing users to claim the filled portion while keeping the remainder of the order active.

At minimum, consider revising the `_getCrossedTicks` function to properly handle the case when a tick is crossed multiple times in opposite directions to avoid prematurely marking orders as filled.
