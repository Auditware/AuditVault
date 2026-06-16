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
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# makeBuyOer can be used to place the activeBuyOers with zero msg.value

- id: 21016
- impact: HIGH
- protocol: [[Lotaheros]]
- reporter: AuditOne
- source: https://github.com/solodit/solodit_content/blob/main/reports/AuditOne/2023-04-13-Lotaheros.md

## Summary


A bug report has been submitted regarding the function makeBuyOer() in the IOTA-Heroes-Contracts GitHub repository. This function allows a non-token owner to place a buy order without any msg.value. The issue is when the token owner calls the function acceptBuyOer(), it transfers the tokens to the buyer and sends the msg.value to the seller. As a result, the seller receives zero msg.value, but still transfers token to the buyer. The recommendation is to check msg.value is greater than 0 when calling the makeBuyOer() function.

## Details

**Description:** 

non-token owner can place the buy order using the function makeBuy[Oer.](https://github.com/Crelde/IOTA-Heroes-Contracts/blob/3e345747f723637c0a1ce884d1ae0e1584015e98/contracts/HeroMarketplace.sol#L197-L240)

The function checks that the existing active activeSellOers and activeBuyOers as shown below,

But it does not check whether the msg.value is greater than 0.

when there are no active order placed , the value activeBuyOers[tokenId].price is zero. so, the second if condition will not be executed.

So, the non-token owner can place , without any msg.value

Here comes the issue,

when the token owner calls the function acceptBuyOer( function, it transfer the tokens to the buyer and sends the msg.value to the seller.

If the above mentioned scenario happens, the seller would receive zero msg.value but transfers token to the buyer.

**Recommendations:**

check msg.value is > 0 when calling the makeBuyOer()
