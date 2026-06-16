---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Gondi]]"
auditors:
  - "[[zhaojie]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[frozen-funds]]"
  - "[[liquidation-logic]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
---
# [H-15] `_baseLoanChecks()` check errors for expire

- id: 35217
- impact: HIGH
- protocol: [[Gondi]]
- reporter: zhaojie (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


This report highlights a bug in the `_baseLoanChecks()` function, which is used to check if a loan has expired. The bug can lead to malicious attacks and locking of NFTs and funds. The bug occurs when the expiration time and current time are equal, causing both checks to pass. This can be mitigated by changing the strict comparison operator to a less than or equal to operator. The bug has been confirmed and mitigated by the Gondi team.

## Details


`_baseLoanChecks()` is used to check whether Loan has expired:

```solidity
    function _baseLoanChecks(uint256 _loanId, Loan memory _loan) private view {
        if (_loan.hash() != _loans[_loanId]) {
            revert InvalidLoanError(_loanId);
        }
@>      if (_loan.startTime + _loan.duration < block.timestamp) {
            revert LoanExpiredError();
        }
    }
```

The expiration checks in liquidation are as follows:

```solidity
    function _liquidateLoan(uint256 _loanId, IMultiSourceLoan.Loan calldata _loan, bool _canClaim)
        internal
        returns (bool liquidated, bytes memory liquidation)
    {
...

        uint256 expirationTime = _loan.startTime + _loan.duration;
@>      if (expirationTime > block.timestamp) {
            revert LoanNotDueError(expirationTime);
        }
```

This way, both checks pass when `block.timestamp == _loan.startTime + _loan.duration`.

This leads to the problem that a malicious attacker can perform the following steps
when `block.timestamp == _loan.startTime + _loan.duration`:

1.  Alice calls `liquidateLoan` (`loandId` = 1) -> success.
    - `LoanLiquidator` generates an auction.
    - `_loans\[loandId = 1]` is still valid , and will only be cleared when the auction is over.
2.  Alice call `addNewTranche` (`loandId` = 1) -> success.
    - `_baseLoanChecks` (`loandId` = 1) will pass.
    - delete `_loans\[1]`;
    - `_loans\[2] = newLoan.hash()`.
3.  Bidding ends, call `loanLiquidated(loandId = 1)` will fail , because `_loans[1]` has been cleared.

### Impact

Maliciously disrupting the end of the bidding, causing the NFT/funds to be locked.

### Recommended Mitigation

```diff

    function _baseLoanChecks(uint256 _loanId, Loan memory _loan) private view {
        if (_loan.hash() != _loans[_loanId]) {
            revert InvalidLoanError(_loanId);
        }
-       if (_loan.startTime + _loan.duration < block.timestamp) {
+      if (_loan.startTime + _loan.duration <= block.timestamp) {
            revert LoanExpiredError();
        }
    }
```

### Assessed type

Context

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/26#event-12545527904)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Strict `->` `<=`.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/93), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/63) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/16).

***
