---
tags:
  - lang/solidity
  - sector/dex
  - platform/mixbytes
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Hanji]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#2-potential-overflow-in-accumulator-variables"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Potential Overflow in Accumulator Variables

- id: 55172
- impact: HIGH
- protocol: [[Hanji]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#2-potential-overflow-in-accumulator-variables

## Summary


The report describes a bug in the `Trie` contract's `Node` struct, specifically with the use of `uint64` variables for `total_shares` and `total_value`. This can lead to an overflow if the scaling factor is set too small or the price of assets increases significantly, causing new orders to not be added. This is classified as a high severity issue as it can prevent the system from functioning properly, but it can be fixed by storing these values in larger `uint` types and setting requirements for the scaling factor during initialization. 

## Details

##### Description
The issue is pinpointed within the [`Node`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/TrieLib.sol#L10) struct of the `Trie` contract.

There is a vulnerability due to the use of `uint64` variables for `total_shares` and `total_value` accumulators. When the admin sets a small scaling factor or the price of one asset compared to another raises significantly, these values can overflow, leading to a hault in adding new orders. This overflow risk poses a grave threat to the functionality and reliability of the contract.

The issue is classified as **high** severity as it can immobilize the system, preventing new orders from being added and interrupting standard operations. However, it does not lead to permanent losses since the orders can still be claimed/cancelled.

##### Recommendation
We recommend either storing `total_shares` and `total_value` in larger uint types such as `uint128` to accommodate larger sums and setting explicit requirements for the `scaling_factor` parameters during initialization to avert overflow.
