---
tags:
  - lang/solidity
  - platform/auditone
  - has/github
  - severity/high
  - sector/gaming
protocol: "[[Lotaheros]]"
auditors:
  - "[[AuditOne]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# makeBuyOer &withdrawBuyOer can be used to brick the acceptBuyOer

- id: 21015
- impact: HIGH
- protocol: [[Lotaheros]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md

## Summary


This bug report is about two ways to sell tokens. The first way is called Purchase and is called by non-token owners. The second way is called acceptBuyOer and is called by token owners. The issue is that if the buyer wants to buy the token by placing a makeBuyOer, a new user could overwrite this makeBuyOer by paying a slightly higher amount. After calling the makeBuyOer and overwriting the existing activeBuyOers, the malicious buyer could call the withdrawBuyOer to withdraw, leaving no activeBuyOers for the token. The recommendation is to have a time delay before allowing the withdrawBuyOer to be called once the makeBuyOer is placed and the activeBuyOers are created.

## Details

**Description:**

There are two ways,the token owner can sell the tokens.

1.Purchase - called by non-token owner

2.acceptBuyOer - called by token owner.

if there are no user to call the Purchase ,then the token owner can use the acceptBuyOer route to sell the token.

The issue is,if the buyer wants to buy the token by placing the makeBuyOer. ,new user can overwrite this makeBuyOer by slightly paying extra amount. as seen in the below line of codes, [https://github.com/Crelde/IOTA-Heroes-Contracts/blob/3e345747f723637c0a1ce884d1ae0e1584015 e98/contracts/HeroMarketplace.sol#L209-L214.](https://github.com/Crelde/IOTA-Heroes-Contracts/blob/3e345747f723637c0a1ce884d1ae0e1584015e98/contracts/HeroMarketplace.sol#L209-L214)

after calling the makeBuyOer and overwriting the existing activeBuyOers,the malicious buyer could call the withdrawBuyOer to withdraw.

So there will not be any activeBuyOers for the token.

**Recommendations:** 

have some time delay to call the withdrawBuyOer once the makeBuyOer is called and placed the activeBuyOers
