---
tags:
  - lang/solidity
  - sector/dex
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/fee-theft
protocol: "[[BMX]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fot-slippage]]"
---
# H-5: `RangePool::adjustToTick()` desyncs when `nextTick == tick` leading to stolen fees

- id: 62812
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


This bug report is about a problem found in the DeliSwap contract code. The issue was discovered by a user called 0x73696d616f and it involves the function "adjustToTick()" in the RangePool contract. This function breaks when the current tick is equal to the next tick, causing the contract to desync with the Uniswap pool. This can lead to an attacker exploiting the contract and stealing fees from honest users. The root cause of the issue is an incorrect break condition in the code. The impact of this bug is that 100% of the fees can be stolen by the attacker. The protocol team has fixed this issue in their code, but there has been no response from them in this bug report.

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/178 

## Found by 
0x73696d616f

### Summary

`RangePool::adjustToTick()` breaks when the `nextTick` equals the current tick:
```solidity
function adjustToTick(State storage self, int24 tickSpacing, int24 tick, address[] memory tokens) internal {
    int24 currentTick = self.tick;
    int128 liquidityChange = 0;
    bool lte = tick <= currentTick;

    if (lte) {
        while (tick < currentTick) {
            (int24 nextTick, bool initialized) =
                self.tickBitmap.nextInitializedTickWithinOneWord(currentTick, tickSpacing, true);

            if (nextTick <= tick) { //@audit here
                break;
            }
    ...
```
However, this will desync with the Uniswap pool whenever the sqrtPrice reaches the next tick. 

For example, consider that a swap moved the price to tick 60, tick spacing is 60, and there is an initialized tick at 60. Looking at the Uniswap pool [code](https://github.com/Uniswap/v4-core/blob/main/src/libraries/Pool.sol#L409-L413), it will cross the tick, and positions from ticks 0 to 60 will now accrue fees, not 60 to 120.

But, this won't happen in the DailyEpochGauge nor IncentiveGauge. These pools will be [poked](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/DeliHook.sol#L292-L293) after the swap, so the tick at 60 has been crossed in the Uniswap pool, but in the `RangePool::adjustToTick()` logic, it won't [cross](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/libraries/RangePool.sol#L174-L176) the tick, as the nextTick is 60, and so is the tick, which breaks and doesn't flip the tick nor update liquidity.

As a result, the following happens:
1. Positions with tick lower at 60 should be out of range (real Uniswap pool tick becomes 59 when the sqrtPrice reaches 60), but in the DailyEpochGauge and IncentiveGauge they will in reality be in range.
2. Thus, an attacker may exploit this to add liquidity to the Uniswap pool at ticks 60 to 120, out of range, where regular users and bots won't add liquidity because it is out of range. The attacker will get away with most of the fees.
3. An attacker can force this to happen by specifying the sqrtLimit in the swap to be exactly the next initialized tick, and add liquidity to the out of range position to steal fees.

### Root Cause

In `RangePool.sol:174`, the [break condition](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/libraries/RangePool.sol#L174-L176) is incorrect and makes the pool desync.

### Internal Pre-conditions

None.

### External Pre-conditions

None.

### Attack Path

1. Attacker swaps in `PoolManager.swap()`, setting the sqrtPrice to the next initialized tick. The Uniswap pool will cross the tick, but the DailyEpochGauge/IncentiveGauge won't.
2. Attacker adds liquidity to the position out of range in the Uniswap pool, stealing the fees from honest users that placed liquidity in the in range position.

### Impact

100% of the fees are stolen by the out of range positions.

### PoC

See above.

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/morphex-labs/deli-swap-contracts/pull/19
