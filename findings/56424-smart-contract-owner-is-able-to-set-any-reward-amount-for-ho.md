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
# Smart contract owner is able to set any reward amount for holding of

- id: 56424
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The CryptoBearWatchClub NFT in the Smart contract Arkouda had an issue with the setTokenIdReward function in the Arkouda.sol file. This has now been resolved. It is recommended to either predefine the reward amounts for each NFT tier or allow the community to vote on changing the reward amounts.

## Details

**Description**

CryptoBearWatchClub NFT in the Smart contract Arkouda. (Resolved)
Arkouda.sol, setTokenIdReward

**Recommendation**:
Predefine reward amounts per NFT tier or let community to vote on changing reward
amounts.
