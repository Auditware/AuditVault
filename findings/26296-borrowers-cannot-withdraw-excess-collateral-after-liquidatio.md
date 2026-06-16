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
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# Borrowers cannot withdraw excess collateral after liquidation or default

- id: 26296
- impact: HIGH
- protocol: [[Term Finance]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/term-finance/term1/review.pdf

## Summary


A bug was found in the TermRepoLocker contract, where borrowers were unable to withdraw excess collateral after they were entirely liquidated or defaulted. The issue was caused by a check in the externalUnlockCollateral() function on line 282, which would always evaluate to true and trigger a revert if the borrower’s owed balance had been fully repaid. This prevented the borrower from retrieving the excess collateral tokens. The bug was fixed with the implementation of PR 757, which allowed borrowers to withdraw leftover collateral after their repurchase obligation had been entirely repaid through liquidation or default.

## Details

## Description

Borrowers are unable to withdraw excess collateral after they are entirely liquidated or defaulted. The excess collateral will be locked within the `TermRepoLocker` contract.

This issue stems from the check in `externalUnlockCollateral()` on line [282]:

```solidity
281 address borrower = termAuth.user;
if (termRepoServicer.getBorrowerRepurchaseObligation(borrower) == 0) {
283 revert ZeroBorrowerRepurchaseObligation(); // SigP: This will revert when loan paid in full
}
285 _unlockCollateral(borrower, collateralToken, amount);
if (isBorrowerInShortfall(borrower)) {
287 revert CollateralBelowMaintenanceRatios(borrower, collateralToken);
}
```

`termRepoServicer.getBorrowerRepurchaseObligation(borrower)` will always return `0` if the borrower’s owed balance has been fully repaid. In the case of a liquidation or a default, it is possible for this to happen without all of the collateral tokens being paid to the liquidator. The excess collateral tokens would then remain in the `TermRepoLocker` contract, marked as belonging to the borrower. If the borrower attempts to retrieve those tokens, however, the test on line [282] will evaluate to true and the revert on line [283] will be triggered.

## Recommendations

Allow borrowers to withdraw leftover collateral after their repurchase obligation has been entirely repaid through liquidation or default.

## Resolution

This finding has been addressed in PR 757.
