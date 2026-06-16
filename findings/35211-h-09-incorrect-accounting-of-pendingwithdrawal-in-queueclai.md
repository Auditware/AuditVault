---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/staking-pool
protocol: "[[Gondi]]"
auditors:
  - "[[bin2chen]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[precision-loss]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-09] Incorrect accounting of `_pendingWithdrawal` in `queueClaiming` flow

- id: 35211
- impact: HIGH
- protocol: [[Gondi]]
- reporter: bin2chen (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


This bug report is about an error in the `queueClaiming` flow of the Pool.sol contract. Due to a mistake in the code, funds received from a previous queue index will be lost. This can lead to incorrect accounting of the `_pendingWithdrawal` variable. The problem lies in the second for-loop, where the value of `_pendingWithdrawal[secondIdx]` is not properly accumulated, causing it to erase the value from previous loops. The recommended mitigation step is to change the code to `_pendingWithdrawal[secondIdx] += pendingForQueue`. This bug has been confirmed and mitigated by the Gondi team.

## Details


Incorrect accounting of `_pendingWithdrawal` in `queueClaiming` flow, funds received from a previous queue index will be lost.

### Proof of Concept

In Pool.sol's `queueClaimAll()`, each queue's received funds `getTotalReceived[_idx]` (total returned funds from loans for that queue) will be distributed to all newer queues in a for-loop.

There are two for-loops in this flow. [First for-loop](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L692) iterate through each `pendingWithdrawal` index to get the received funds for that queue index (`getTotalReceived[_idx]`). [Second for-loop](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L662) iterates through each queue index again to distribute funds from `_idx`.

The problem is in the second for-loop, `_pendingWithdrawal[secondIdx]` will not accumulate distributed funds from previous queue indexes, instead it erases the value from previous loops and only records the last queue's received funds.

```solidity
//src/lib/pools/Pool.sol
    function _updatePendingWithdrawalWithQueue(
        uint256 _idx,
        uint256 _cachedPendingQueueIndex,
        uint256[] memory _pendingWithdrawal
    ) private returns (uint256[] memory) {
        uint256 totalReceived = getTotalReceived[_idx];
        uint256 totalQueues = getMaxTotalWithdrawalQueues + 1;
...
        getTotalReceived[_idx] = 0;
...
        for (uint256 i; i < totalQueues;) {
...
              //@audit this should be _pendingWithdraw[secondIdx] += pendingForQueue; Current implementation directly erases `pendingForQueue` value distributed from other queues. 
|>            _pendingWithdrawal[secondIdx] = pendingForQueue;
...
```

<https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L678>

Note that `getTotalReceived[_idx]` will be cleared before the for-loop (`getTotalReceived[_idx] = 0`), meaning that the erased `pendingForQueue` values from previous loops cannot be recovered. `_pendingWithdrawal` will be incorrect.

### Recommended Mitigation Steps

Change into `_pendingWithdrawal[secondIdx] + = pendingForQueue;`.

### Assessed type

Error

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/46#event-12543628520)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Missing `+`.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/49), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/58) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/10).

***
