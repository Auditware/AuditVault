---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#2-incorrect-condition-for-post_only-orders"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[add-check]]"
---
# Incorrect Condition for `post_only` Orders

- id: 56837
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#2-incorrect-condition-for-post_only-orders

## Summary


The report is about a bug found in the `placeOrder` function of the `LOB` contract. This bug affects the handling of `post_only` orders, causing them to always be executed and resulting in unintended financial costs for users. The provided test does not catch this issue. The bug is considered critical and the recommended solution is to flip the sign in the `if` statement condition.

## Details

##### Description
The issue is identified within the [`placeOrder`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L230)  function of the `LOB` contract.

There is a critical vulnerability in the `post_only` order handling logic. The incorrect condition in the `if` statement means that `post_only` bid orders will always be executed, causing the bidder to pay commissions that are not intended for passive orders in this architecture. This can lead to unintended financial costs for users.

The test named `testPostOnly` provided by the developers does not catch this issue because it does not properly check the execution path.

The issue is classified as **critical** severity, because it can lead to significant unintended financial consequences for users placing `post_only` orders.
##### Recommendation
We recommend flipping the sign in the `if` statement condition to ensure that `post_only` orders are handled correctly:
```solidity
if (price_id <= askTree.best_offer()) {
    return 0x0;
}
```
