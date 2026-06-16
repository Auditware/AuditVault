---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/lending
  - sector/options
protocol: "[[Lyra Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Fully Liquidated Auctions Cannot Be Terminated

- id: 26271
- impact: HIGH
- protocol: [[Lyra Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf

## Summary


A bug was discovered in the DutchAuction.sol code where it is possible to lock auctions in a state where it is impossible to terminate or start a new auction. This occurs when the liquidator inputs 1e18 as the parameter for percentOfAccount, causing the convertedPercentage to equal 1e18. In this state, if another user attempts to call bid() on this auction, the function will revert with Division or modulo by 0. Additionally, the auction cannot be terminated with terminateAuction() nor can a new auction be started for that SubAccount. This bug can be exploited by attackers to perform high-risk actions without any prospect of being liquidated, which can significantly increase the risk of the Lyra protocol becoming insolvent.

To address this issue, the development team adjusted the code on line 510 as per the recommendation, ensuring that fully liquidated auctions can be terminated. This bug was addressed in pull request #270.

## Details

Description
It is possible to lock auctions in a state where it is impossible to terminate or start a new auction.
On line [ 482] in DutchAuction.sol there is the condition if (convertedPercentage > maxOfCurrent) . If this condition
is true then the auction is terminated.
For an auction that can be fully liquidated, maxOfCurrent will equal 1e18 and if the liquidator wants to fully liquidate
an auction in a single bid, they will input 1e18 when calling bid() as the parameter for percentOfAccount , this will
result in convertedPercentage equal to 1e18 .
However in this situation the condition convertedPercentage > maxOfCurrent will be FALSE which results in the auc-
tion not being terminated even though it has been fully liquidated.
In this state if another user attempts to call bid() on this auction, the function will revert with
Division or modulo by 0 . Additionally the auction cannot be terminated with terminateAuction() , nor can a
new auction be started for that SubAccount.
An attacker can potentially use this to perform high risk actions in the Lyra protocol without any prospect of being
liquidated. This can signiﬁcantly increase the risk of Lyra protocol becoming insolvent.
Recommendations
Change the condition to convertedPercentage >= maxOfCurrent
Resolution
This issue has been addressed in pull request #270.
The development team has adjusted the code on line [ 510] as per the recommendation, ensuring that fully liquidated
auctions can be terminated.
Page | 13
Lyra V2 Detailed Findings
LYRA-07 Assets Can Be Transferred After Auction Started
