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
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Liquidator Can Bid With Insuﬃcient Cash

- id: 26269
- impact: HIGH
- protocol: [[Lyra Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lyra-finance/review.pdf

## Summary


This bug report describes an issue with the executeBid() function in the Lyra protocol. When performing the _symmetricManagerAdjustment() on the cash asset of the bidder, there is no check that the bidder’s cash balance remains positive after the adjustment. This could result in a negative cash balance after the bid, allowing an attacker to bid on an auction with an insufficient cash balance and let their cash balance go negative. This would effectively print cash, potentially making the protocol insolvent.

The testing team recommended performing risk checks after liquidation bids are executed. The development team has addressed this issue by adding a check to ensure a user has enough cash to bid at an auction. The check includes a revert function that will be triggered if the bidder has insufficient cash. This issue has been addressed in pull request #265.

## Details

Description
When executeBid() performs _symmetricManagerAdjustment() on the cash asset of the bidder, there is no check that
the bidder’s cash balance remains positive after the adjustment. This could result in a negative cash balance after the
bid.
The impact is that an attacker can bid on an auction with an insuﬃcient cash balance, and let their cash balance go
negative. The account being liquidated would still get an increase to their cash balance. This is eﬀectively printing cash
which could make the protocol insolvent.
Recommendations
The testing team recommends performing risk checks after liquidation bids are executed.
Resolution
This issue has been addressed in pull request #265.
The development team has added the following check to ensure a user has enough cash to bid at an auction:
int bidderCashBalance =subAccounts .getBalance (bidderId ,cash , 0);
if ( bidderCashBalance .toUint256 () < cashFromBidder )revert DA_InsufficientCash ();
Page | 11
Lyra V2 Detailed Findings
LYRA-05 Account Can Be Created With Arbitrary Manager Address
