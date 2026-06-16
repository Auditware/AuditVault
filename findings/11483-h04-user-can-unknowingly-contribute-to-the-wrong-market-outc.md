---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/prediction
protocol: "[[Augur]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/augur-core-v2-audit-components/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
---
# [H04] User can unknowingly contribute to the wrong market outcome in forked universe

- id: 11483
- impact: HIGH
- protocol: [[Augur]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/augur-core-v2-audit-components/

## Summary


This bug report describes an issue with the `Market` contract in the Augur project. The `preemptiveDisputeCrowdsourcer` variable allows users to pool funds in support of the tentative winning outcome in anticipation of a dispute. When a different market undergoes a fork and `disavowCrowdsourcers` is called on the non-forking market, the dispute chain is reset to the initial reporter but the `preemptiveDisputeCrowdsourcer` is not reset. This can lead to the `preemptiveDisputeCrowdsourcer` supporting an outcome that is not the current tentative winning outcome. If a user calls the `contributeToTentative` function with the correct payout numerators corresponding to the tentative winning outcome, the user funds will be incorrectly added to the `preemptiveDisputeCrowdsourcer` outcome.

The bug was fixed in PR #5564, where the `preemptiveDisputeCrowdsourcer` state variable was reset in the `disavowCrowdsourcers` function.

## Details

The `Market` contract [has a `preemptiveDisputeCrowdsourcer` variable](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L59) that allows users to pool funds in support of the tentative winning outcome in anticipation of a dispute. If a dispute is successful, it becomes the new tentative winning outcome and [the `preemptiveDisputeCrowdsourcer`, if it is non-zero, becomes a counter-dispute contract](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L239-L251) in favor of the previous outcome.


However, it is possible for the `preemptiveDisputeCrowdsourcer` to (inconsistently) support an outcome that is not the current tentative winning outcome. In particular, when a different market in Augur undergoes a fork and `disavowCrowdsourcers` is called on the non-forking market, [the dispute chain is reset to the initial reporter](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L477-L479) but the `preemptiveDisputeCrowdsourcer` is not reset. While the initial reporter [becomes the tentative winning outcome](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L623-L628), it may have a different payout distribution hash to the `preemptiveDisputeCrowdsourcer`.


In this scenario, should a user call the [`contributeToTentative` function](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L166) with the correct payout numerators corresponding to the tentative winning outcome, the function will eventually [call `internalContribute` with `overload` set to `true`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L176). As a consequence, the internal call to `getOrCreateDisputeCrowdsourcer` [will retrieve the (inconsistent) `preemptiveDisputeCrowdsourcer`](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L402), and the user funds will be [incorrectly added to this outcome](https://github.com/AugurProject/augur/blob/67c0fec95e65fca8d27751f28a6c06e5247978c6/packages/augur-core/source/contracts/reporting/Market.sol#L203).


Consider resetting the `preemptiveDisputeCrowdsourcer` in the `disavowCrowdsourcers` function.


**Update**: *Fixed in [PR #5564](https://github.com/AugurProject/augur/pull/5564/files). The `preemptiveDisputeCrowdsourcer` state variable is now is reset in the `disavowCrowdsourcers` function.*
