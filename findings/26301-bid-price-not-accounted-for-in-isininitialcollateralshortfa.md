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
---
# Bid price not accounted for in _isInInitialCollateralShortFall()

- id: 26301
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report is about an issue in the TermAuctionBidLocker.sol code related to the repurchase value. The issue was that the check was only performed on the bid amount, not the submitted bid price. This could potentially allow a user to submit a large bid without providing enough collateral to service the interest on their loan, and still win an auction. To resolve this issue, a retest was performed on commit e883f0e, which now takes into account the repurchase price in the _isInInitialCollateralShortFall() function. This means that users now must provide sufficient collateral to cover the eventual repurchase price, ensuring that they are able to service the interest on their loan.

## Details

## Description

The calculated repurchase value on line [432] of `TermAuctionBidLocker.sol` does not take into account the submitted bid price. The check is only performed on the bid amount:

```solidity
Exp memory repurchasePriceUSDValue = termPriceOracle.usdValueOfTokens(
    purchaseToken,
    bidAmount
);
```

As a result, a user could submit a large bid without providing sufficient collateral to service the interest on their loan, and thereby win an auction. Note, this would make them under immediate threat of liquidation after conclusion of the auction, but nonetheless they would be able to participate in and complete the auction successfully.

## Recommendations

When calculating a position’s margin in `_isInInitialCollateralShortFall()`, take into account the submitted bid price to ensure the user puts up sufficient collateral to cover the eventual repurchase price.

## Resolution

Based on a retest of commit `e883f0e`, the issue has been resolved - `_isInInitialCollateralShortFall()` now takes into account repurchase price.
