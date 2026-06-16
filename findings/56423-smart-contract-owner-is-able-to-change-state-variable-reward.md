---
tags:
  - lang/solidity
  - sector/nft
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/dos/init-constraint
  - precondition/uninitialized
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-check
protocol: "[[Cwbc]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md"
genome:
  - "[[init-constraint]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
  - "[[reward-accounting]]"
---
# Smart contract owner is able to change state variable rewardGenerationStartTime of Smart contract Arkouda to a newer date that will influence holders of CryptoBearWatchClub NFT and their claimable reward amounts.

- id: 56423
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report is about a function called Arkouda.sol which is currently not working properly. Specifically, there is an issue with the state variable startRewardGeneration, which is not being checked before storing a new value. This can cause problems and it is recommended to add a check to ensure that the variable is not already initialized before storing a new value.

## Details

**Description**

Arkouda.sol, startRewardGeneration
**Recommendation**:
Add check that the state variable startRewardGeneration was not initialized before storing a
new value to it.
