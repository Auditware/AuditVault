---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#3-potential-data-corruption-in-trie-structure"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# Potential Data Corruption in Trie Structure

- id: 53801
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#3-potential-data-corruption-in-trie-structure

## Summary


A critical vulnerability has been found in the `removeOrderFromNonRightmostNodeDescendants` function of the `Trie` contract. This function does not properly check if the given `order_id` exists in the matching node before updating the subtree, which can lead to data corruption and potential loss of funds. It is recommended to check the `found` boolean value before updating the subtree to prevent this issue and maintain the integrity of the trie. This issue is classified as critical and should be addressed immediately to avoid severe consequences.

## Details

##### Description
The issue is identified within the[`removeOrderFromNonRightmostNodeDescendants`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/TrieLib.sol#L780-L795) function of the `Trie` contract.

There is a critical vulnerability where the `matchesNode` function checks if the `order_id` potentially exists in the matching node, but it doesn't verify the `found` boolean value before updating the subtree. If the `order_id` does not actually exist in the matching node, it can lead to a violation of the validity and consistency of the trie, resulting in data corruption and potential loss of funds.

The issue is classified as **critical** severity because it can cause severe data corruption and financial loss.
##### Recommendation
We recommend checking the `found` boolean value before updating the subtree to ensure that the `order_id` actually exists in the matching node. This will prevent inconsistencies and maintain the integrity of the trie.
