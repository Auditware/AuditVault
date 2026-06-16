---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/oracle
protocol: "[[Sqwid]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md"
genome:
  - "[[single-source]]"
  - "[[direct-drain]]"
  - "[[weak-randomness]]"
---
# Miners are able to manipulate the result of the raffle.

- id: 56645
- impact: HIGH
- protocol: [[Sqwid]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-06-16-Sqwid.md

## Summary


The bug report describes an issue with the function endRaffle() in the SqwidMarketplace.sol file. This function uses a pseudo-random number to determine the winner of a raffle, but it has been discovered that miners can manipulate the outcome by manipulating transactions and blocks. The issue is explained in an article linked in the report and the recommendation is to remove the to_string() function. The Sqwid team has acknowledged that this vulnerability exists due to the lack of off-chain Oracles in the Reef chain. 

## Details

**Description**

 SqwidMarketplace.sol: function endRaffle(), line 751.
 In order to determine the winner of the raffle, a pseudo-random number is generated, based
 on the information of the block. Miners are able to manipulate the transaction and some of
 the blocks in order to manipulate the outcomes of the raffle.
 
 **The issue is described in the following article**:
 https://betterprogramming.pub/how-to-generate-truly-random-numbers-in-solidity-and-
 blockchain-9ced6472dbdf
 
 **Recommendation**:
 
 remove to_string()
 
 **From client**:
 
 The Sqwid team states, that there are no off-chain Oracles in the Reef chain and
 opts with current solution vulnerable for miners manipulation
