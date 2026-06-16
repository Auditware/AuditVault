---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Term Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Cancelling an auction refunds the wrong amount for unrevealed offers

- id: 26293
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


When an admin cancels an auction, an incorrect amount of purchase tokens is returned for unrevealed offers. This is because the wrong array (sortedOffers instead of unrevealedOffers) was used on line 1162. As a result, the amount for the revealed offer of the corresponding unrevealed offer index is refunded instead. This could cause the transaction to revert if the value of the index is greater than the maximum index in sortedOffers. To fix this, the line 1162 should be changed to unrevealedOffers[i].amount. After a retest of commit e883f0e, the issue has been resolved - unrevealedOffers array is now used in termAuctionOfferLocker.unlockOfferPartial() function.

## Details

## Description
When the admin cancels an auction, an incorrect amount of purchase tokens is returned for unrevealed offers. The array `sortedOffers` is used on line [1162], while it should be `unrevealedOffers`. As a result, the amount for the revealed offer of the corresponding unrevealed offer index is returned instead.

```javascript
// Return unrevealed offer funds.
for (i = 0; i < unrevealedOffers.length; i++) {
    termAuctionOfferLocker.unlockOfferPartial(
        unrevealedOffers[i].id,
        unrevealedOffers[i].offeror,
        sortedOffers[i].amount
    );
}
```

If the value of the index `i` is greater than the maximum index in `sortedOffers`, the transaction would revert. Otherwise, the wrong amount is refunded.

## Recommendations
Change line [1162] to `unrevealedOffers[i].amount`.

## Resolution
Based on a retest of commit `e883f0e`, the issue has been resolved - `unrevealedOffers` array is now used in `termAuctionOfferLocker.unlockOfferPartial()` function.
