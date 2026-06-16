---
tags:
  - platform/spearbit
  - lang/solidity
  - has/github
  - severity/high
  - sector/vault
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# Mempool denial-of-service via MAX_ADDRESSES

- id: 62884
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report discusses an issue with the current transaction pool architecture in Monad. The report explains that there are two mempools in Monad - a tracked pool and a pending pool. However, there are two main issues with this setup that could potentially lead to a denial-of-service attack. 

The first issue is that the pool lacks an eviction strategy to handle transactions from different addresses. This means that if the maximum number of addresses is reached, the pool will simply drop new transactions instead of evicting lower fee transactions from different addresses. This can be seen as a vulnerability compared to other systems where the lowest fee transaction from any address is evicted in this scenario. 

The second issue is that tracked addresses can submit nonce-gapped transactions, which will never be executed in a committed block. This prevents the tracked address from being evicted from the pool, as they always have a transaction in their list. This can also lead to the tracked pool hogging the maximum number of addresses, preventing untracked addresses from being promoted. 

To address these issues, the report recommends implementing better eviction strategies that take into account the fee and executability of transactions. It also suggests not allowing addresses with only non-executable transactions in the tracked pool or demoting them if they no longer have any executable transactions. 

The report concludes by acknowledging that this issue is being tracked in an open issue and that the team is aware of the problem.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
Below is a rough diagram of the current transaction pool architecture implemented in Monad. Currently, there are two mempools in Monad: a tracked pool and a pending pool.

- All addresses are by default untracked.
- Any transaction for an untracked address will first fall into the pending pool, while transactions for tracked addresses will fall into the tracked pool.
- During `create_proposal` or `updated_committed_block`, addresses are promoted to the tracked pool, up to the `MAX_ADDRESSES` capacity.
- During `create_proposal`, only transactions from the tracked pool will be selected via standard priority fee mechanism.
- Time-based expiration per transaction exists only for the tracked pool.
- An address is evicted from the tracked pool when it no longer has any transactions in the `TrackedTxList`.

The way the transaction pool is architected allows for a denial-of-service vector by hogging the `MAX_ADDRESSES` limit via multiple spam accounts. There are two main issues here:

1. In both the tracked and pending mempool, priority fee replacement only works for transactions of the same address. If `MAX_ADDRESSES` is reached, we simply drop the transaction. The pool lacks an eviction strategy to evict lower fee transactions across addresses, which allows consuming space in `MAX_ADDRESSES` to prevent others from submitting transactions to the mempool. This differs from Geth where, if the transaction limit is reached, the lowest fee transaction from any address, not just the address that submitted the transaction, is evicted. This implementation can be seen in `legacypool.go#L743`.
   
2. A tracked address can periodically submit nonce-gapped transactions to the tracked pool. Such transactions will never be executed in a committed block (as they are nonce-gapped). Consequently, this prevents the tracked address from being evicted from the `TrackedTxMap` since they always have a single nonce-gapped transaction in their `TrackedTxList`, thereby consuming space in the `MAX_ADDRESSES` and preventing untracked addresses from being promoted.

## Recommendation
It is recommended to come up with better eviction strategies to handle transactions in the mempool. Here are some recommendations to take into account:

- Lower fee transactions should be evicted from the mempool if a higher fee transaction comes in, and eviction should also take into account whether the transaction is currently executable with the correct account nonce and priority fee.
- Addresses with ONLY non-executable transactions, such as nonce-gapped transactions, should not be allowed into the tracked mempool or should be demoted if they no longer have any executable transactions of the next nonce. This is to prevent hogging `MAX_ADDRESSES` for the tracked pool.

## Category Labs
We are tracking it in the open issue 2329.

## Spearbit
Acknowledged.
