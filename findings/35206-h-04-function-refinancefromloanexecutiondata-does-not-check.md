---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/staking
protocol: "[[Gondi]]"
auditors:
  - "[[minhquanym]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# [H-04] Function `refinanceFromLoanExecutionData()` does not check `executionData.tokenId == loan.nftCollateralTokenId`

- id: 35206
- impact: HIGH
- protocol: [[Gondi]]
- reporter: minhquanym (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The `refinanceFromLoanExecutionData()` function allows borrowers to use outstanding offers for new loans to refinance their current loan. However, there is a bug where the new loan may have a different collateral NFT than the one requested by the lender. This could be exploited by an attacker to pass in a valid NFT that will be accepted by all lender offers, while the actual NFT kept in escrow will be different. The recommended mitigation step is to add a check to ensure that the NFT requested by the lender matches the one used in the new loan. This bug has been confirmed and mitigated by the team.

## Details


The `refinanceFromLoanExecutionData()` function is used to refinance a loan from `LoanExecutionData`. It allows borrowers to use outstanding offers for new loans to refinance their current loan. This function essentially combines two actions: it processes the repayment for the previous loan and then emits a new loan.

The key difference is that the same NFT is used as collateral for the new loan, so it does not need to be transferred out of the protocol and then transferred back in. However, there is no check to ensure that the NFT id of the old loan matches the NFT id of the new execution data.

Therefore, the new loan may have a collateral NFT that does not match the NFT that the lender requested in their offers.

```solidity
/// @dev We first process the incoming offers so borrower gets the capital. After that, we process repayments.
///      NFT doesn't need to be transferred (it was already in escrow)
(uint256 newLoanId, uint256[] memory offerIds, Loan memory loan, uint256 totalFee) =
_processOffersFromExecutionData(
    borrower,
    executionData.principalReceiver,
    principalAddress,
    nftCollateralAddress,
    executionData.tokenId, // @audit No check if matched with loan.nftCollateralTokenId
    executionData.duration,
    offerExecution
);
```

### Proof of Concept

As we can see, `executionData.tokenId` is passed to the `_processOffersFromExecutionData()` function instead of `loan.nftCollateralTokenId`. This function performs all the checks to ensure that the lenders' offers accept this NFT.

```solidity
function _processOffersFromExecutionData(
    address _borrower,
    address _principalReceiver,
    address _principalAddress,
    address _nftCollateralAddress,
    uint256 _tokenId,
    uint256 _duration,
    OfferExecution[] calldata _offerExecution
) private returns (uint256, uint256[] memory, Loan memory, uint256) {
  ...
  _validateOfferExecution(
      thisOfferExecution,
      _tokenId,
      offer.lender,
      offer.lender,
      thisOfferExecution.lenderOfferSignature,
      protocolFee.fraction,
      totalAmount
  );
  ...
}
```

Eventually, it calls the `_checkValidators()` function to check the NFT token ID.

```solidity
function _checkValidators(LoanOffer calldata _loanOffer, uint256 _tokenId) private {
    uint256 offerTokenId = _loanOffer.nftCollateralTokenId;
    if (_loanOffer.nftCollateralTokenId != 0) {
        if (offerTokenId != _tokenId) {
            revert InvalidCollateralIdError();
        }
    } else {
        uint256 totalValidators = _loanOffer.validators.length;
        if (totalValidators == 0 && _tokenId != 0) {
            revert InvalidCollateralIdError();
        } else if ((totalValidators == 1) && (_loanOffer.validators[0].validator == address(0))) {
            return;
        }
        for (uint256 i = 0; i < totalValidators;) {
            IBaseLoan.OfferValidator memory thisValidator = _loanOffer.validators[i];
            IOfferValidator(thisValidator.validator).validateOffer(_loanOffer, _tokenId, thisValidator.arguments);
            unchecked {
                ++i;
            }
        }
    }
}
```

However, since `executionData.tokenId` is passed in, an attacker could pass in a valid `tokenId` (an NFT id that will be accepted by all lender offers). But in reality, the `loan.nftCollateralTokenId` will be the NFT kept in escrow.

### Recommended Mitigation Steps

Add a check to ensure that `executionData.tokenId` is equal to `loan.nftCollateralTokenId`.

### Assessed type

Invalid Validation

**[0xend (Gondi) confirmed via duplicate Issue #14](https://github.com/code-423n4/2024-04-gondi-findings/issues/14#event-12543529247)**

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Added `tokenIdCheck`.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/44), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/53) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/5).

***
