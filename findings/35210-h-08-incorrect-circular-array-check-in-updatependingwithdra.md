---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Gondi]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
---
# [H-08] Incorrect circular array check in `_updatePendingWithdrawalWithQueue` flow, causing received funds to be added to the wrong queues

- id: 35210
- impact: HIGH
- protocol: [[Gondi]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


Summary: The `queueClaimAll` function in Pool.sol is intended to distribute received funds to newer queues, but due to a bug in the code, the oldest queue is skipped and the funds are not distributed correctly. This can result in lost or frozen funds. The severity of this bug has been assessed as high and a mitigation has been implemented.

## Details


In Pool.sol, `queueClaimAll` flow will transfer received funds (returned funds from loans) for each queue to newer queues.

Received funds for a given queue are intended to be [distributed to newer queues](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L656-L661):

>        /// @dev We go from idx to newer queues. Each getTotalReceived is the total        
>        /// returned from loans for that queue. All future queues/pool also have a piece of it.
>        /// X_i: Total received for queue `i`
>        /// X_1  = Received * shares_1 / totalShares_1
>        /// X_2 = (Received - (X_1)) * shares_2 / totalShares_2 ...
>        /// Remainder goes to the pool.

This logic is implemented in `_updatePendingWithdrawalWithQueue()`. Due to queue arrays are circular, the array index never exceeds `getMaxTotalWithdrawalQueues` and will restart from `0`.

`% totalQueues` should be used when checking array indexes in most cases. However, [in the queue index for-loop](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L672C17-L672C57), `if (secondIdx == _cachedPendingQueueIndex + 1) {break;}` is used to break the loop instead of `secondIdx == (_cachedPendingQueueIndex + 1)%totalQueues`.

This is problematic in some cases:

1. When `_cachedPendingQueueIndex` `<` `getMaxTotalWithdrawalQueues`.
`_updatePendingWithdrawalWithQueue()` will always skip the oldest queue when distributing `getTotalReceived[_idx]` funds.

    In `_queueClaimAll()`, [the first for-loop start with the oldestQueueIndex](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L693) (`_cachedPendingQueueIndex + 1) % totalQueues + 0)%totalQueues`). When (`_cachedPendingQueueIndex + 1`) `% totalQueues== _cachedPendingQueueIndex + 1`, this first iteration will always result in a break in the [second for-loop](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L662), where `secondIdx == oldestQueueIndex == _cachedPendingQueueIndex + 1`.

    As a result, any received funds from the `oldesQueueIndex` ([`getTotalReceived\[oldestQueueIndex\]`](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L648)) will not be distributed and directly [deleted](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L654) (`getTotalReceived[_idx] = 0;`).

2. When `_cachedPendingQueueIndex` `==` `getMaxTotalWithdrawalQueues`
The [second for-loop](https://github.com/code-423n4/2024-04-gondi/blob/b9863d73c08fcdd2337dc80a8b5e0917e18b036c/src/lib/pools/Pool.sol#L662) will never break, because `secondIdx < _cachedPendingQueueIndex + 1`. `for (uint256 i; i < totalQueues;)` will always run `getMaxTotalWithdrawalQueues+1` times. This will result in received funds from any queues being distributed to both newer queues and older queues.

### Recommended Mitigation Steps

Based on my understanding, this should be `if (i≠0 && secondIdx == (_cachedPendingQueueIndex + 1)%totalQueues) { break;}`

### Assessed type

Error

**[0xA5DF (judge) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/47#issuecomment-2063430859):**
 > > causing received funds to be added to the wrong queues
> 
> What are the consequences of that? I'll might consider high severity if this leads to frozen funds.

**[0xend (Gondi) confirmed and commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/47#issuecomment-2067281634):**
 > Conversation continued over discord. There's a bug here I believe (a high severity one), the condition for breaking the loop should be `secondIdx == _cachedPendingQueueIndex`.

**[0xA5DF (judge) increased severity to High](https://github.com/code-423n4/2024-04-gondi-findings/issues/47#issuecomment-2068017566)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Need to break 1 before.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/48), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/57) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/9).

***
