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
  - "[[role-bypass]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Authentication tokens could be reused from another chain or project

- id: 26300
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report covers two issues in the Term Finance contracts. The first issue is that authentication tokens are not unique per chain and could be reused on another chain. This is because the tokens only encode a user’s address and a single counter, called the nonce. The second issue is that the function TermRepoCollateralManager.getCollateralBalances() returns the zero address as the token address if a user does not have a balance in a given token. This causes rollover bids to fail as TermAuctionBidLocker._isInInitialCollateralShortFall() loops through all of the tokens returned and calls termPriceOracle.usdValueOfTokens() for each one.

For the first issue, it is recommended to include a hash of the transaction parameters, the destination contract address (or the address of Authenticator), the chain ID, and an expiry time in the TermAuth authentication token so that it can only be used to authorise the intended transaction on the intended protocol on the intended blockchain. For the second issue, it is recommended to either dynamically set the length of the returned arrays after determining how many token balances will be returned, or else return all token addresses, with zero balances where appropriate, and handle this returned data accordingly.

The issue has been resolved for both issues. For the first issue, block.chainid and transaction’s contract address is now included as a part of the hash being signed. For the second issue, TermAuctionBidLocker._isInInitialCollateralShortFall() now has a check to omit zero balances of collateral tokens.

## Details

## Description

Authentication tokens are not unique per chain and could be reused on another chain. Each transaction in Term Finance requires a special authentication token created by the address which is being affected. This does not have to be the same address as the one submitting the transaction. Once submitted in a completed transaction, these tokens are marked as used and so cannot be reused. 

However, if Term Finance deploys on multiple chains, authentication tokens that are marked as used on one chain would not be marked as used on another. They could then be used by any user to authorize any Term Finance transaction on any chains where that token has not already been used. Even if Term Finance never deploys on another chain, it would only require another project to fork the code and that project’s tokens would be usable on Term Finance and vice versa. This is because the tokens only encode a user’s address and a single counter, called the nonce.

Reused tokens could authorize any transaction that requires a TermAuth authentication token.

## Recommendations

Include a hash of the transaction parameters, the destination contract address (or the address of Authenticator), the chain ID, and an expiry time in the TermAuth authentication token so that it can only be used to authorize the intended transaction on the intended protocol on the intended blockchain.

## Resolution

Based on a retest of commit e883f0e, the issue has been resolved - `block.chainid` and the transaction’s contract address is now included as a part of the hash being signed.
