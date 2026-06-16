---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[BMX]]"
auditors:
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[unbounded-loop]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
---
# H-1: Gas consumed in `notifyUnsubscribe` is underestimated during tests and is greater than 300,000 without pre-warming

- id: 62808
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


The bug report discusses a vulnerability found in the Uniswap V4 notifier that allows malicious users to force unsubscribe from Uniswap V4 while keeping their positions intact in Deli gauges. This can lead to dilution of rewards for other users. The report provides a proof of concept and recommends further gas optimizations to prevent this issue.

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/27 

## Found by 
cergyk

### Description

To protect users against bricked positions by malicious subscriber contracts, `Uniswap V4` notifier allows recovery of a reverting `notifyUnsubscribe` call:

[Notifier.sol#L80-L86](https://github.com/Uniswap/v4-periphery/blob/60cd93803ac2b7fa65fd6cd351fd5fd4cc8c9db5/src/base/Notifier.sol#L80-L86):
```solidity
    if (address(_subscriber).code.length > 0) {
        // require that the remaining gas is sufficient to notify the subscriber
        // otherwise, users can select a gas limit where .notifyUnsubscribe hits OutOfGas yet the
        // transaction/unsubscription can still succeed
        if (gasleft() < unsubscribeGasLimit) GasLimitTooLow.selector.revertWith();
        //@audit try/catch to protect against malicious _subscriber
        try _subscriber.notifyUnsubscribe{gas: unsubscribeGasLimit}(tokenId) {} catch {}
    }
```

Conversely, in order to protect `subscriber` against forced failure due to insufficient user gas limit, outer call reverts if less than `unsubscribeGasLimit` is available, and thus guarantees at least `(unsubscribeGasLimit*63)/64` is provided to `notifyUnsubscribe` call (the `63/64` factor is due to EIP 150).

`unsubscribeGasLimit` value on Base is set to `300,000`.

This is why `PositionManagerAdapter.notifyUnsubscribe` must keep gas cost under `(300,000*63)/64 ~= 295000`, to avoid users unsubscribing successfully on `Uniswap V4` while leaving positions with liquidity in Deli gauges accounting.

Unfortunately, this is not the case, and the call to `notifyUnsubscribe` can consume more than `300,000` gas, as shown in the POC below.

### Impact
Users can force unsubscribe from `Uniswap V4`, but keep positions accounting intact in Deli gauges.
Then the malicious user can either burn or resubscribe his position to `PositionManagerAdapter` immediately, diluting the rewards for that range by position `liquidity` forever (even if the admin calls `adminForceUnsubscribe`, `liquidity` remains accounted for in global gauge accounting).

[DailyEpochGauge.sol#L610-L618](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/DailyEpochGauge.sol#L610-L618):
```solidity
    poolRewards[pid].modifyPositionLiquidity(
        RangePool.ModifyLiquidityParams({
            tickLower: tickLower,
            tickUpper: tickUpper,
            //@audit when subscribing, current position liquidity is always added to global liquidity tracking
            liquidityDelta: SafeCast.toInt128(uint256(liquidity)),
            tickSpacing: poolTickSpacing[pid]
        }),
        toks
    );
```

### POC
Here we show that the already existing test case `testGasAdapterNotifyUnsubTwoWorst` can be adapted to show that `notifyUnsubscribe` fails due to OOG.

To do so, we isolate the "set up" of the test case in a separate transaction by using the special function `beforeTestSetup` (see [foundry documentation](https://getfoundry.sh/forge/tests/writing-tests/)).

Please run:
1. `git apply POC.patch`
2. `forge test --match-test testGasAdapterNotifyUnsubTwoWorst -vvvv --decode-internal`

```diff
diff --git a/deli-swap-contracts/test/integration/PositionLifecycleCleanup.t.sol b/deli-swap-contracts/test/integration/PositionLifecycleCleanup.t.sol
index 07499d3..56ab07e 100644
--- a/deli-swap-contracts/test/integration/PositionLifecycleCleanup.t.sol
+++ b/deli-swap-contracts/test/integration/PositionLifecycleCleanup.t.sol
@@ -594,31 +594,36 @@ contract PositionLifecycleCleanup_IT is Test, Deployers {
         _gasAdapterNotifyUnsub(3, "adapter_notify_unsub_3");
     }
 
-    /// Worst-case parameters for unsubscribe gas: two extra incentive tokens (plus base wBLT from _activateStream),
-    /// large elapsed time without prior syncs to force Daily's multi-day integration and maximize cold reads.
-    /// to force Daily's multi-day integration during unsubscribe and maximize cold reads.
-    function testGasAdapterNotifyUnsubTwoWorst() public {
+    function worstCaseBeforeSetup() public {
         // 1) Mint and subscribe two positions
-        uint256 tokenId = _mintAndSubscribe(-1800, 1800, 1e22);
+        uint256 tokenId = _mintAndSubscribe(-2400, 2400, 1e22);
+        //@audit-ok enforce first token minted has id == 2 for consistency with test case
+        assert(tokenId == 2);
         uint256 tokenId2 = _mintAndSubscribe(-1800, 1800, 1e22);
 
         // 2) Activate Daily stream and base incentive, then add two extra incentive tokens (3 total incentives)
         _activateStream();
-        _addIncentiveTokens(10);
+        //@audit-ok no need to add additional incentive tokens
 
-        // 3) Warp many days ahead to force DailyEpochGauge._amountOverWindow to iterate across many day boundaries
-        //    and ensure significant elapsed time for incentive calculations, without additional pokes.
-        vm.warp(block.timestamp + 4 days);
+        //@audit-ok no need to even warp
+    }
 
-        // 4) Measure only the adapter.notifyUnsubscribe path
-        vm.startPrank(address(positionManager));
-        vm.startSnapshotGas("adapter_notify_unsub_2_worst_first");
-        adapter.notifyUnsubscribe(tokenId);
-        vm.stopSnapshotGas();
-        vm.startSnapshotGas("adapter_notify_unsub_2_worst_second");
-        adapter.notifyUnsubscribe(tokenId2);
-        vm.stopSnapshotGas();
-        vm.stopPrank();
+    //@audit-ok special foundry function, isolates calls before test in a separate transaction
+    function beforeTestSetup(bytes4 testSelector) public returns (bytes[] memory beforeTestCalldata) {
+        if (testSelector == this.testGasAdapterNotifyUnsubTwoWorst.selector) {
+            beforeTestCalldata = new bytes[](1);
+            //@audit-ok make the setup for the worst case in an isolated transaction
+            //@audit-ok we do this to avoid warming up all of the storage slots used later in notifySubscribe call
+            beforeTestCalldata[0] = abi.encodeWithSelector(this.worstCaseBeforeSetup.selector);
+        }
+    }
+
+    /// Worst-case parameters for unsubscribe gas: two extra incentive tokens (plus base wBLT from _activateStream),
+    /// large elapsed time without prior syncs to force Daily's multi-day integration and maximize cold reads.
+    /// to force Daily's multi-day integration during unsubscribe and maximize cold reads.
+    function testGasAdapterNotifyUnsubTwoWorst() public {
+        //@audit-ok use hardcoded token id 2 for simplicity, but this is enforced with assert during preparation
+        positionManager.unsubscribe(2); // @audit-ok run forge test -vvvv to see that notifyUnsubscribe has failed with OOG
     }
 
     /*//////////////////////////////////////////////////////////////
```

### Recommendation

Further gas optimisations must be made to `notifyUnsubscribe` not to hit the limit. A radical change could be to only set a flag "pendingUnsubscribe" on the given position in both the daily gauge and the incentive gauge, to make it ineligible for claiming at first. Then the heavy work of unsubscribing and cleaning accounting data can be done during a subsequent call outside of the critical path.
