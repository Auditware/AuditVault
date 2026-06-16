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
  - "[[griefing]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# Unbounded memory consumption in the mempool due to lack of transaction size and count limits

- id: 62883
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report discusses an issue in the Monad software, where there are two mempools that do not have sufficient limits on transaction size and count. This can lead to unbounded memory consumption and cause the software to crash. The report recommends enforcing stricter limits on transaction size and count, similar to how it is implemented in another software called Geth. The issue has been partially fixed, but there is still work being done on it. The team responsible for Monad has acknowledged the issue. 

## Details

## Severity: High Risk

**Context:**  
(No context files were provided by the reviewer)

**Description:**  
Currently, there are two mempools in Monad: a tracked mempool and a pending mempool. The problem is both mempools perform insufficient limit checks to prevent unbounded memory consumption, which can lead to an OOM crash scenario. For example:
- As discussed in [monad issue 1557](https://linktoissue.com), for both pools, there is no maximum limit on the transaction size, which can lead to a single transaction consuming unbounded amounts of memory.
- Furthermore, there is no limit on the number of transactions for any address in the tracked pool, meaning that a single address that has been promoted to the tracked pool can flood the tracked pool with many spam transactions to exhaust memory and cause an OOM.

**Recommendation:**  
It is recommended to enforce more checks on the transaction size and count limits. For instance, here is how Geth implements their strategy to manage transaction limits in the mempool, which can be referenced in `legacypool.go`.
- Enforce a 512kB size limit (> max initcodesize) on individual transactions.
- Track transactions using the amount of 32kB slots they occupy (this is similar to Geth implementation in `legacypool.go#L1916-L1918`), enforcing a total of 4096 + 1024 = 5120 slots in the mempool (so that the maximum memory consumed by the mempool is 5120 * 32kB = 163.84MB). This maximum slot size can be incremented if the expected minimum hardware requirements for Monad are stronger.

**Category Labs:**  
The issue is partially fixed in monad issue 2328, which enforces a 384kB size limit on individual transactions. The tracked pool transaction count limit is currently being worked on in the open issue 2328.

**Spearbit:**  
Acknowledged.
