---
tags:
  - lang/solidity
  - sector/lending
  - sector/token
  - platform/code4rena
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Gondi]]"
auditors:
  - "[[zhaojie]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[missing-modifier]]"
  - "[[use-reentrancy-guard]]"
  - "[[role-bypass]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# [H-12] `addNewTranche()` no authorization from borrower

- id: 35214
- impact: HIGH
- protocol: [[Gondi]]
- reporter: zhaojie (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


In the `addNewTranche()` function, the code allows any lender to add a new tranche to any loan without the authorization of the borrower. This could potentially harm the borrower. The recommended mitigation is to add a check to ensure that only the borrower can perform this action. This issue has been confirmed and mitigated by Gondi. 

## Details


For `addNewTranche()`, the code implementation is as follows：

```solidity
    function addNewTranche(
        RenegotiationOffer calldata _renegotiationOffer,
        Loan memory _loan,
        bytes calldata _renegotiationOfferSignature
    ) external nonReentrant returns (uint256, Loan memory) {
        uint256 loanId = _renegotiationOffer.loanId;

        _baseLoanChecks(loanId, _loan);
        _baseRenegotiationChecks(_renegotiationOffer, _loan);
@>      _checkSignature(_renegotiationOffer.lender, _renegotiationOffer.hash(), _renegotiationOfferSignature);
        if (_loan.tranche.length == getMaxTranches) {
            revert TooManyTranchesError();
        }

        uint256 newLoanId = _getAndSetNewLoanId();
        Loan memory loanWithTranche = _addNewTranche(newLoanId, _loan, _renegotiationOffer);
        _loans[newLoanId] = loanWithTranche.hash();
        delete _loans[loanId];

        ERC20(_loan.principalAddress).safeTransferFrom(
            _renegotiationOffer.lender, _loan.borrower, _renegotiationOffer.principalAmount - _renegotiationOffer.fee
        );
        if (_renegotiationOffer.fee > 0) {
            /// @dev Cached
            ProtocolFee memory protocolFee = _protocolFee;
            ERC20(_loan.principalAddress).safeTransferFrom(
                _renegotiationOffer.lender,
                protocolFee.recipient,
                _renegotiationOffer.fee.mulDivUp(protocolFee.fraction, _PRECISION)
            );
        }

        emit LoanRefinanced(
            _renegotiationOffer.renegotiationId, loanId, newLoanId, loanWithTranche, _renegotiationOffer.fee
        );

        return (newLoanId, loanWithTranche);
    }
```

Currently only the signature of the `lender` is checked, not the authorization of the `borrower`. Then, any `lender` can add `tranche` to any `loan` by:

1. Specifying a very high apr.
2. Specifying any `_renegotiationOffer.fee`; for example: set `_renegotiationOffer.fee==_renegotiationOffer.principalAmount`.

This doesn't make sense for `borrower`. It is recommended that only the `borrower` performs this method.

### Impact

`lender` can be specified to generate a malicious `tranche` to compromise `borrower`.

### Recommended Mitigation

```diff
    function addNewTranche(
        RenegotiationOffer calldata _renegotiationOffer,
        Loan memory _loan,
        bytes calldata _renegotiationOfferSignature
    ) external nonReentrant returns (uint256, Loan memory) {
        uint256 loanId = _renegotiationOffer.loanId;
+       if (msg.sender != _loan.borrower) {
+           revert InvalidCallerError();
+       } 
        _baseLoanChecks(loanId, _loan);
        _baseRenegotiationChecks(_renegotiationOffer, _loan);
        _checkSignature(_renegotiationOffer.lender, _renegotiationOffer.hash(), _renegotiationOfferSignature);
        if (_loan.tranche.length == getMaxTranches) {
            revert TooManyTranchesError();
        }
```

### Assessed type

Context

**[0xend (Gondi) confirmed via duplicate Issue #52](https://github.com/code-423n4/2024-04-gondi-findings/issues/52#event-12543437001)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Added caller check.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/90), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/60) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/13).

***
