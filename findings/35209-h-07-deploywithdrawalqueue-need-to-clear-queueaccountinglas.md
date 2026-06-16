---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Gondi]]"
auditors:
  - "[[bin2chen]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[underflow]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# [H-07] `deployWithdrawalQueue()` need to clear `_queueAccounting[lastQueueIndex]`

- id: 35209
- impact: HIGH
- protocol: [[Gondi]]
- reporter: bin2chen (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The report is about a bug in the `deployWithdrawalQueue()` function. The function clears some variables but misses one variable called `_queueAccounting[lastQueueIndex]`. This means that when another function called `queueClaimAll()` is called, it will use the old data from `_queueAccounting[lastQueueIndex]`, which can cause problems. The recommended solution is to add a line of code to clear this variable in the `deployWithdrawalQueue()` function. The bug has been confirmed and mitigated by the developers.

## Details


In `deployWithdrawalQueue()`, only clears `_queueOutstandingValues[lastQueueIndex]` and `_outstandingValues`, but doesn't clear `_queueAccounting[lastQueueIndex]`.

```solidity
    function deployWithdrawalQueue() external nonReentrant {
...

        /// @dev We move outstanding values from the pool to the queue that was just deployed.
        _queueOutstandingValues[pendingQueueIndex] = _outstandingValues;
        /// @dev We clear values of the new pending queue.
        delete _queueOutstandingValues[lastQueueIndex];
        delete _outstandingValues;
@>      //@audit miss delete _queueAccounting[lastQueueIndex]

        _updateLoanLastIds();

@>      _pendingQueueIndex = lastQueueIndex;

        // Cannot underflow because the sum of all withdrawals is never larger than totalSupply.
        unchecked {
            totalSupply -= sharesPendingWithdrawal;
        }
    }

```

After this method, anyone calling `queueClaimAll()` will use this stale data `_queueAccounting[lastQueueIndex]`.

`queueClaimAll()` -> `_queueClaimAll(_pendingQueueIndex)`-> `_updatePendingWithdrawalWithQueue(_pendingQueueIndex)`

```solidity
    function _updatePendingWithdrawalWithQueue(
        uint256 _idx,
        uint256 _cachedPendingQueueIndex,
        uint256[] memory _pendingWithdrawal
    ) private returns (uint256[] memory) {
        uint256 totalReceived = getTotalReceived[_idx];
        uint256 totalQueues = getMaxTotalWithdrawalQueues + 1;
        /// @dev Nothing to be returned
        if (totalReceived == 0) {
            return _pendingWithdrawal;
        }
        getTotalReceived[_idx] = 0;

        /// @dev We go from idx to newer queues. Each getTotalReceived is the total
        /// returned from loans for that queue. All future queues/pool also have a piece of it.
        /// X_i: Total received for queue `i`
        /// X_1  = Received * shares_1 / totalShares_1
        /// X_2 = (Received - (X_1)) * shares_2 / totalShares_2 ...
        /// Remainder goes to the pool.
        for (uint256 i; i < totalQueues;) {
            uint256 secondIdx = (_idx + i) % totalQueues;
@>          QueueAccounting memory queueAccounting = _queueAccounting[secondIdx];
            if (queueAccounting.thisQueueFraction == 0) {
                unchecked {
                    ++i;
                }
                continue;
            }
            /// @dev We looped around.
@>          if (secondIdx == _cachedPendingQueueIndex + 1) {
                break;
            }
            uint256 pendingForQueue = totalReceived.mulDivDown(queueAccounting.thisQueueFraction, PRINCIPAL_PRECISION);
            totalReceived -= pendingForQueue;

            _pendingWithdrawal[secondIdx] = pendingForQueue;
            unchecked {
                ++i;
            }
        }
        return _pendingWithdrawal;
    }
```

### Impact

Not clearing `_queueAccounting[lastQueueIndex]` when executing `queueClaimAll()` will use this stale data to distribute `totalReceived`.

### Recommended Mitigation

```diff
    function deployWithdrawalQueue() external nonReentrant {
...

        /// @dev We move outstaning values from the pool to the queue that was just deployed.
        _queueOutstandingValues[pendingQueueIndex] = _outstandingValues;
        /// @dev We clear values of the new pending queue.
        delete _queueOutstandingValues[lastQueueIndex];
+       delete _queueAccounting[lastQueueIndex]
        delete _outstandingValues;


        _updateLoanLastIds();

        _pendingQueueIndex = lastQueueIndex;

        // Cannot underflow because the sum of all withdrawals is never larger than totalSupply.
        unchecked {
            totalSupply -= sharesPendingWithdrawal;
        }
    }
```

### Assessed type

Context

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/48#event-12543494424)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Clear state vars.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/47), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/56) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/8).

***
