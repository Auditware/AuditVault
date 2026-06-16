---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#3-improper-bid-trie-reference-causing-reserve-overstatement"
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

- id: 56819
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#3-improper-bid-trie-reference-causing-reserve-overstatement

## Summary


This bug report discusses an issue in the `_claimOrder` function of the `ProxyLOB` contract. When a bid (isAsk = false) is made, the `orderId` is not properly converted or masked before being queried, leading to incorrect calculations and an overstatement of the protocol's asset balances. The report recommends adjusting the function to correctly convert the `orderId` for bid orders.

## Details

##### Description
This issue has been identified within the `_claimOrder` function of the `ProxyLOB` contract. 

When `isAsk = false` (a bid), the final bit of the `orderId` indicates the relevant on-chain trie (bid trie expects a zero-ending bit). However, `_claimOrder` does not convert or mask the `orderId` before querying the trie, causing the bid order to appear non-existent and returning zero values. This erroneously inflates the contract’s reserves by failing to correctly match and settle claimed amounts from the reserves of the claimed order.

The issue is classified as **critical** severity because it can produce a chain of incorrect calculations that ultimately overstate the protocol’s asset balances.

##### Recommendation
We recommend adjusting `_claimOrder` to convert the `orderId` correctly when `isAsk = false`, ensuring that bid orders are properly identified in the bid trie.

---
