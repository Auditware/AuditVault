---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#2-potential-overflow-in-accumulator-variables"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# Potential Overflow in Accumulator Variables

- id: 53804
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#2-potential-overflow-in-accumulator-variables

## Summary


The report discusses a vulnerability in the `Node` struct of the `Trie` contract. This vulnerability is caused by using `uint64` variables for `total_shares` and `total_value` accumulators, which can lead to overflow and halt the addition of new orders. This issue is classified as high severity as it can immobilize the system, but does not result in permanent losses. The recommendation is to use larger uint types and set explicit requirements for the `scaling_factor` parameter during initialization to prevent overflow. 

## Details

##### Description
The issue is pinpointed within the [`Node`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/TrieLib.sol#L10) struct of the `Trie` contract.

There is a vulnerability due to the use of `uint64` variables for `total_shares` and `total_value` accumulators. When the admin sets a small scaling factor or the price of one asset compared to another raises significantly, these values can overflow, leading to a hault in adding new orders. This overflow risk poses a grave threat to the functionality and reliability of the contract.

The issue is classified as **high** severity as it can immobilize the system, preventing new orders from being added and interrupting standard operations. However, it does not lead to permanent losses since the orders can still be claimed/cancelled.

##### Recommendation
We recommend either storing `total_shares` and `total_value` in larger uint types such as `uint128` to accommodate larger sums and setting explicit requirements for the `scaling_factor` parameters during initialization to avert overflow.
