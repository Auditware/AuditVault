---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#4-currentstoreprincipal-is-not-subtracted-after-it-was-withdrawn-allowing-users-to-claim-it-again-infinitely"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# `currentStore.principal` is not subtracted after it was withdrawn, allowing users to claim it again infinitely

- id: 57916
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#4-currentstoreprincipal-is-not-subtracted-after-it-was-withdrawn-allowing-users-to-claim-it-again-infinitely

## Summary


The `DIAWhitelistedStaking` contract has a bug where the `currentStore.principal` value is not being properly updated after a user withdraws their principal using the `unstake` function. This means that users can repeatedly withdraw the same amount of tokens, potentially causing significant losses for the contract. To fix this, the `currentStore.principal` value should be reset to zero before the token transfer is performed. This has been implemented as per the recommendation.

## Details

##### Description
In the `DIAWhitelistedStaking` contract, when a user withdraws their principal through the `unstake` function, the `currentStore.principal` value is not zeroed out or decremented after the withdrawal. This creates a critical vulnerability where users can repeatedly call `unstake` and claim the same principal amount multiple times, as the contract doesn't track that the principal has already been withdrawn.

This can lead to significant losses for the protocol, as an attacker may withdraw more tokens than were initially staked by them, potentially draining the contract's token balance.
<br/>
##### Recommendation
We recommend resetting `currentStore.principal` to zero in the `unstake` function. We recommend adding the line `currentStore.principal = 0;` before the token transfer is performed.

> **Client's Commentary:**
> fix added as per recommendation
