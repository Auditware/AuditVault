---
tags:
  - lang/solidity
  - sector/lending
  - platform/sigmaprime
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Term Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Rollover bids are set to maximum price, causing reverts

- id: 26295
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report concerns an issue with processing an auction with at least one rollover bid. The transaction to complete the auction reverts because the rollover bids have their price set to type(uint256).max in the function InTermAuctionBidLocker._fillRevealedBidsForAuctionClearing(). The rollover bids are submitted with a bid price hash TermRepoRolloverElectionSubmission.rolloverBidPriceHash to the function TermRepoRolloverManager.electRollover(). Additionally, the code reverts with an integer overflow in TermAuction._calculateClearingPrice() when the rollover price is added to another price.

To resolve this issue, the logic of setting rollover bids prices to type(uint256).max in _fillRevealedBidsForAuctionClearing() should be reviewed and a method for processing rollover bids with their submitted prices should be considered. This finding has been addressed during initial testing in PR 681.

## Details

## Description

When processing an auction with at least one rollover bid, the transaction to complete the auction reverts.

In `TermAuctionBidLocker._fillRevealedBidsForAuctionClearing()`, all rollover bids have their price set to `type(uint256).max` on line [481]. Rollover bids are submitted with a bid price hash `TermRepoRolloverElectionSubmission.rolloverBidPriceHash` to the function `TermRepoRolloverManager.electRollover()`. Also, all bids provided to `_fillRevealedBidsForAuctionClearing()` are in an array called `revealedBids` of bids with revealed prices. It is unclear why the rollover prices are being overwritten.

When processing auctions containing rollover bids and standard revealed bids, the code reverts with an integer overflow in `TermAuction._calculateClearingPrice()` when the rollover price was added to another price in this section of code:

```solidity
443 uint256 finalClearingPrice = 0;
if (clearingOffset > state.currentOfferIndex) {
445 finalClearingPrice =
(sortedOffers[0].offerPriceRevealed +
447 sortedBids[
_minUint256(
449 sortedBids.length - 1,
state.currentBidIndex + clearingOffset
451 )
].bidPriceRevealed) /
453 2;
} else {
455 // ...
```

## Recommendations

Review the logic of setting rollover bids prices to `type(uint256).max` in `_fillRevealedBidsForAuctionClearing()` and consider a method for processing rollover bids with their submitted prices.

## Resolution

This finding has been addressed during initial testing in PR 681.
