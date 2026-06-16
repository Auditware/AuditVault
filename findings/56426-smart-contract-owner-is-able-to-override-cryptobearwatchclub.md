---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/nft
protocol: "[[Cwbc]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md"
genome:
  - "[[missing-modifier]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Smart contract owner is able to override CryptoBearWatchClub NFT reward amounts in the Smart contract Arkouda after their purchase.

- id: 56426
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


Bug Report Summary:

The bug report is about a function in the Arkouda.sol contract called setTokenIdReward. The recommendation is to define rewards for non-fungible tokens (NFTs) based on their tier level when purchased and prevent the contract owner from changing it. The CBWC team provided a list of purchased NFTs and their tiers, which were verified to be correctly applied to the Arkouda contract as of a specific transaction.

## Details

**Description**

Arkouda.sol, setTokenIdReward

**Recommendation**:

Define rewards for NFT based on their tier level during purchase and revoke Smart contract
owner from changing it.

**Note**.

CBWC team provided list of purchased NFTs and their tiers. We verified that tier levels were
correctly applied to Arkouda contract as of Transaction.
