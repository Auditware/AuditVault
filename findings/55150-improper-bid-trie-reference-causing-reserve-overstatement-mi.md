---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#3-improper-bid-trie-reference-causing-reserve-overstatement"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Improper Bid Trie Reference Causing Reserve Overstatement

- id: 55150
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#3-improper-bid-trie-reference-causing-reserve-overstatement

## Summary


The report describes a bug found in the `_claimOrder` function of the `ProxyLOB` contract. This bug affects bid orders (when `isAsk = false`) and causes the contract's reserves to be inflated due to incorrect matching and settlement of claimed amounts. The bug is considered to be critical as it can lead to incorrect calculations and overstate the protocol's asset balances. The recommendation is to adjust the `_claimOrder` function to correctly convert the `orderId` when `isAsk = false` in order to properly identify bid orders in the bid trie.

## Details

##### Description
This issue has been identified within the `_claimOrder` function of the `ProxyLOB` contract. 

When `isAsk = false` (a bid), the final bit of the `orderId` indicates the relevant on-chain trie (bid trie expects a zero-ending bit). However, `_claimOrder` does not convert or mask the `orderId` before querying the trie, causing the bid order to appear non-existent and returning zero values. This erroneously inflates the contract’s reserves by failing to correctly match and settle claimed amounts from the reserves of the claimed order.

The issue is classified as **critical** severity because it can produce a chain of incorrect calculations that ultimately overstate the protocol’s asset balances.

##### Recommendation
We recommend adjusting `_claimOrder` to convert the `orderId` correctly when `isAsk = false`, ensuring that bid orders are properly identified in the bid trie.

---
