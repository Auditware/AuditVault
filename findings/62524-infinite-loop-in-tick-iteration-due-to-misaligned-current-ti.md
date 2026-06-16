---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Uniswap Hooks]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-2-audit"
genome:
  - "[[frozen-funds]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Infinite Loop in Tick Iteration Due to Misaligned Current Tick

- id: 62524
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 2 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-2-audit

## Summary


The AntiSandwichHook contract has a bug that causes an infinite loop when trying to update liquidity and fee data. This happens when the current tick is not aligned with the pool's configured tick spacing, making the loop condition never satisfied. This can result in a denial-of-service attack, preventing users from executing swaps in the affected pool. The issue has been resolved in a recent update by caching the last tick value and checking for a tick difference instead of comparing ticks directly. However, there is a possibility of a large tick difference causing a large loop, which could result in a memory error in extreme cases. 

## Details

The [`AntiSandwichHook`](https://github.com/OpenZeppelin/uniswap-hooks/blob/3e9fa228ec0f7fe05a95e09e25442466b459a712/src/general/AntiSandwichHook.sol) contract implements an anti-MEV mechanism by storing a snapshot of the pool state at the beginning of each block. As part of this process, the [`_beforeSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/3e9fa228ec0f7fe05a95e09e25442466b459a712/src/general/AntiSandwichHook.sol#L76) function [iterates](https://github.com/OpenZeppelin/uniswap-hooks/blob/3e9fa228ec0f7fe05a95e09e25442466b459a712/src/general/AntiSandwichHook.sol#L98-L105) over tick indices from the last checkpoint to the current tick to update liquidity and fee data. This iteration is performed in a `for` loop using a fixed [`step`](https://github.com/OpenZeppelin/uniswap-hooks/blob/3e9fa228ec0f7fe05a95e09e25442466b459a712/src/general/AntiSandwichHook.sol#L96) equal to the pool's `tickSpacing`, and continues as long as `tick != currentTick`.

However, `currentTick` may not always be aligned with the pool's configured `tickSpacing`. This misalignment occurs naturally due to the dynamics of price movement in the pool, which can cause the current tick to land on any arbitrary value rather than on a multiple of the tick spacing. When this happens, the loop condition `tick != currentTick` will never be satisfied, because the increment or decrement using `tickSpacing` will skip over the misaligned current tick. As a result, the loop becomes infinite, consuming all available gas and rendering the transaction invalid. This creates a denial-of-service (DoS) vector, as users can no longer execute swaps in the affected pool.

Consider modifying the tick iteration logic to compute the step dynamically based on the direction and difference between the current tick and the checkpoint tick, ensuring that the loop reliably reaches the current tick even when it is not aligned with the tick spacing.

***Update:** Resolved in [pull request #80](https://github.com/OpenZeppelin/uniswap-hooks/pull/80) at commit [5e42129](https://github.com/OpenZeppelin/uniswap-hooks/commit/5e4212978e55eb5507a639034b69328e8f017774). The team stated:*

> *In order to solve the infinite loop iteration, we now cache the `lastTick` value before `_lastCheckpoint.state.slot0` is updated and instead of comparing `currentTick != lastTick`, which could cause the misalignment, we check if `currentTick <= lastTick` or `currentTick >= lastTick`. We also added a comment on the natspec with a warning on the possibility of a large tick difference which could lead to a large for loop (although not infinite) which could lead to `MemoryOOG` error in extreme cases (small tick spacing and really large tick difference).*
