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
report: "https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit"
genome:
  - "[[stale-price]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
---
# Asymmetric First In-Block Swap Initialization Leads to Stale State

- id: 61376
- impact: HIGH
- protocol: OpenZeppelin [[Uniswap Hooks]] v1.1.0 RC 1 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/openzeppelin-uniswap-hooks-v1.1.0-rc-1-audit

## Summary


The AntiSandwichHook contract is designed to prevent sandwich attacks on the Uniswap platform by ensuring that prices are consistent throughout a block. However, there is a bug in how the contract updates and uses certain data, potentially leading to incorrect price calculations and rendering the anti-sandwich protection ineffective. The issue arises when the first swap in a block does not change the tick value, causing the contract to use outdated or incomplete data for subsequent swaps. To fix this, the contract should be updated to retrieve and use fresh tick data at the beginning of each block.

## Details

The [`AntiSandwichHook`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L47) contract aims to prevent sandwich attacks by ensuring that swaps adhere to prices from the beginning of the block. It uses a checkpoint, stored in the [`_lastCheckpoints`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L59) mapping, to calculate an expected output in [`_getTargetOutput`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L167).

The primary issue is how the [`_lastCheckpoints[poolId].state`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L56) (specifically its `ticks` component) is populated, leading to potentially stale or incomplete data.

1. In [`_beforeSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L77), for a new block, only [`_lastCheckpoints[poolId].slot0`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L88) (containing the initial tick and `sqrtPriceX96`) is updated from the pool's current state.
2. The more comprehensive [`_lastCheckpoints[poolId].state`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L56) (which includes [`state.ticks`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L131-L134), [`state.liquidity`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L141), and its own [`state.slot0`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L138)) is intended to be initialized or updated in the [`_afterSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L106) function, specifically after the first swap of the block.
3. The logic in [`_afterSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L106) to populate [`_lastCheckpoints[poolId].state.ticks`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L131-L134) iterates using `for (int24 tick = _lastCheckpoint.slot0.tick(); tick < tickAfter; tick += key.tickSpacing)`. Here, [`_lastCheckpoint.slot0.tick()`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L123) refers to the tick at the start of the block (captured in `_beforeSwap`), while [`tickAfter`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L122) is the tick *after* the first swap has been completed.

The problem arises if the first swap in a block does not result in [`tickAfter`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L122) being strictly greater than [`_lastCheckpoint.slot0.tick()`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L123) (e.g., the tick remains the same or decreases). In this scenario, the `for` loop in [line 123](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L123) will not execute. Consequently, [`_lastCheckpoints[poolId].state.ticks`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L131-L134) will not be populated with fresh data for the current block. It will retain stale tick data from a previous block or remain uninitialized.

Critically, even if this loop does not execute, [`_lastCheckpoint.blockNumber`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L54) *is* updated to the current `block.number` in [line 119](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L119). This prevents any subsequent calls to [`_afterSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L106) within the same block from re-attempting to initialize these tick values, as the `_lastCheckpoint.blockNumber != blockNumber` condition in [line 118](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L118) will be `false`.

If the first swap in a block does not advance the tick (or moves it backward), [`_lastCheckpoint.state.ticks`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L131-L134) is not updated for that block. Subsequent swaps in the same block will then call [`_getTargetOutput`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L167), which relies on this [`_lastCheckpoint.state`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L183) for its simulation. The simulation will use stale or uninitialized tick data, leading to an incorrect `targetOutput` and potentially negating the anti-sandwich protection.

Consider initializing the full start-of-block snapshot, including all necessary components of [`_lastCheckpoints[poolId].state`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L56) (such as `slot0`, `liquidity`, and a relevant range of `ticks`), within the [`_beforeSwap`](https://github.com/OpenZeppelin/uniswap-hooks/blob/release-v1.1-rc.0/src/general/AntiSandwichHook.sol#L77) hook when a new block is detected. This approach would ensure that the checkpoint is based purely on the state at the beginning of the block, independent of the effects or tick movements of the first swap. This would involve fetching tick data around `_lastCheckpoint.slot0.tick()` at the beginning of the block.
