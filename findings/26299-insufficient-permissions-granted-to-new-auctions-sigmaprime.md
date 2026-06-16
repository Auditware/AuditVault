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
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Insufficient Permissions Granted to New Auctions

- id: 26299
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report discusses an issue with newly reopened auctions linked to TermRepoCollateralManager not having the necessary AUCTION_LOCKER permissions set. This lack of sufficient permissions set on new auctions will prevent them from ever completing. The recommendation is to grant AUCTION_LOCKER permissions to a new auction in TermRepoCollateralManager.reopenToNewAuction() by using the function reopenToNewAuction (TermAuctionGroup calldata termAuctionGroup ) external onlyRole (DEFAULT_ADMIN_ROLE ). The resolution is that this finding has been addressed in PR 759.

## Details

## Description
Newly reopened auctions linked to `TermRepoCollateralManager` do not have necessary `AUCTION_LOCKER` permissions set. Lack of sufficient permissions set on new auctions will prevent new auctions from ever completing.

## Recommendations
Grant `AUCTION_LOCKER` permissions to a new auction in `TermRepoCollateralManager.reopenToNewAuction()`, such as:

```solidity
function reopenToNewAuction(TermAuctionGroup calldata termAuctionGroup)
external
onlyRole(DEFAULT_ADMIN_ROLE)
{
    _grantRole(
        AUCTION_LOCKER,
        address(termAuctionGroup.auction)
    );
    //...
}
```

## Resolution
This finding has been addressed in PR 759.
