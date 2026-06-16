---
tags:
  - lang/solidity
  - sector/lending
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Term Finance]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Unlocking offers does not return any funds

- id: 26292
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


This bug report is about an issue in the Term Auction Offer Locker.sol file. When a user unlocks an offer, the offer is deleted from the protocol, but the purchase tokens are not returned to the user. This is because on Line 235 of the file, the call to termRepoServicer.unlockOfferAmount() is called with the argument offerToUnlock.amount. OfferToUnlock is declared on Line 228 as a storage variable, and when the variable is deleted on Line 230, the contents of offerToUnlock are deleted too. This means that offerToUnlock.amount will be zero and no tokens will be returned. 

The recommendation is to use a memory variable to copy values that are about to be deleted from storage. The variable type on Line 228 could be changed to memory, but gas could be saved by instead copying only the information required: uint256 amountToUnlock = offers[id].amount. 

Based on a retest of commit e883f0e, the issue has been resolved - amountToUnlock is now set to offers[id].amount.

## Details

## Description

When a user unlocks (i.e., cancels) an offer, the offer is deleted from the protocol, but the purchase tokens are not returned to the user.

On line [235] of `TermAuctionOfferLocker.sol`, a call to `termRepoServicer.unlockOfferAmount()` should return the purchase tokens for an offer to the offerer. However, it is called with the argument `offerToUnlock.amount`. `offerToUnlock` is declared on line [228] as a variable of type `storage`. Storage variables are simply pointers or references to existing storage locations. Therefore, when the variable that `offerToUnlock` points to is deleted on line [230], the contents of `offerToUnlock` are deleted too. This means that `offerToUnlock.amount` will be zero, and so no tokens will be returned.

## Recommendations

Use a memory variable to copy values that are about to be deleted from storage. The variable type on line [228] could be changed to `memory`, but gas could be saved by instead copying only the information required:

```solidity
uint256 amountToUnlock = offers[id].amount;
```

Note that `uint256` variables inside functions are automatically of type `memory`.

## Resolution

Based on a retest of commit `e883f0e`, the issue has been resolved - `amountToUnlock` is now set to `offers[id].amount`.
