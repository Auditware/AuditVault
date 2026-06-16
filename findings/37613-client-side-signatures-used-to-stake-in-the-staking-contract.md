---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[signature-replay]]"
  - "[[reward-theft]]"
  - "[[permit-fork-replay]]"
---
# Client Side Signatures Used To Stake In the Staking Contract Can Be Reused To Bypass UI Restrictions (Signature Replayability)

- id: 37613
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


The bug report describes a problem where users are able to bypass security checks in a contract and upgrade their stake tokens for free by reusing the same signature. This is considered a high severity issue and has been resolved. The report recommends expiring the signature nonce after each function call to prevent this from happening.

## Details

**Severity**: High

**Status**: Resolved

**Description**

When a user stakes into the contract, there is a requirement that the signer has first signed the message before executing their stake (the signer being the application client side). The staking signature can then be reused by bots or other smart contracts in order to modify their positions by reusing the signature used in `stakeTokens`. This was rated a High in severity because this bypasses one of the invariants intended by the protocol that is to streamline the user experience through the client side, leveraging this bug, a user is able to bypass client side checks in order to upgrade their stake tokens for free by supplying the same signature to `upgradeStakeTokens`. 

**Recommendations**: 

It’s recommended that the signer’s (or Client Side) signature nonce used for each function call is immediately expired after it’s used. This will ensure that the contract is only interacted with via the UI.
