---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft-lending
  - sector/oracle
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Gondi]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2024-06-gondi"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# [H-02] OraclePoolOfferHandler's `_getFactors` allows exact `tokenId` offer terms to be used for collection offers. A borrower can take on a loan with incorrect terms

- id: 35263
- impact: HIGH
- protocol: [[Gondi]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2024-06-gondi

## Summary


Bug report summary:

The bug report discusses an inconsistency in the code of MultiSourceLoan.sol and OraclePoolOfferHandler.sol. This inconsistency allows for a borrower to use a cheaper token as collateral while receiving a higher principal, and for a borrower to be rejected for using an expensive token as collateral. This bug has a high-risk severity rating as it can lead to unfair loans being taken out at the expense of lenders. The recommended mitigation step is to swap the if conditions in `_getFactors()` to fix this issue.

## Details

In MultiSourceLoan.sol, a loan `offerExectuion` can be either a collection offer or an exact collateral token Id match offer. In a collection offer, the loanOffer's `collateralTokenId` doesn't have to match the borrower-supplied token id.

**1. `MutlisSourceLoan::_checkValidators`:**

The condition checks for a collection offer is [one empty validator address](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/loans/MultiSourceLoan.sol#L881-L882) in struct LoanOffer. (`(totalValidators == 1) && _loanOffer.validators[0].validator == address(0)`).

The condition check for exact Id match is either [`loanOffer.nftCollateralTokenId != 0`](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/loans/MultiSourceLoan.sol#L873-L875) or [`loanOffer.nftCollateralTokenId == 0 && totalValidators.length == 0`](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/loans/MultiSourceLoan.sol#L879).

**2. `OraclePoolOfferHandler::_getFactors`:**

The condition checks for a collection offer is [`totalValidators.length == 0`](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L351-L352). This is the opposite of number 1.

The condition checks for an exact Id offer is [one empty validator address](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L353). (`_validators.length == 1 && _isZeroAddress(_validators[0].validator)`) Also the opposite of number 1.

`MutlisSourceLoan::_checkValidators` and `OraclePoolOfferHandler::_getFactors` are invoked in the same `_validateOfferExecution()` call: 

( `MultiSourceLoan::emitLoan()->_processOffersFromExecutionData()-> _validateOfferExecution() -> Pool.validateOffer() / _checkValidators()`)

Impacts: A borrower's exact token id match OfferExecution will be validated against a collection offer term. Or vice versa, a borrower's collection `offerExecution` will be validated against any specific token-based term.

Suppose:
- `_hashKey(wrappedPunk, 30 days, tokenId 0)`'s principal factor is (50%, 25%).
- `_hashKey(wrappedPunk, 30 days, tokened 1)`'s principal factor is (33%, 16.67%).
- `_hashKey(wrappedPunk, 30 days, "")`'s principal factor is (25%, 12.5%).

`wrappedPunk`'s `currentFloor.value = historicalFloor.value = 1000` usd.

`MaxPrincipal`:
- `tokenId` 0: 250 usd
- `tokenId` 1: 166.67 usd
- collection offer: 125 usd

Alice can borrow using a cheap `tokenId` 1 as collateral, but with a LoanOffer based on `tokenId` 0 with a higher `MaxPrincipal`.

Alice's `ExecutionData`:
- `ExecutionData.tokenId` = 1,
- `ExecutionData.OfferExecution\[0].LoanOffer.nftCollateralTokenId` = 0,
- `ExecutionData.OfferExecution\[0].LoanOffer.validators.length` == 1,
- `ExecutionData.OfferExecution\[0].LoanOffer.validators\[0]` = `address(0)`,
- `ExecutionData.OfferExecution\[0].LoanOffer.validators.arguments.code` = 3, (individual)
- `ExecutionData.OfferExecution\[0].LoanOffer.validators.arguments.data` = uint(0),(`tokenId` 0)
- `ExecutionData.OfferExecution\[0].amount` = 250 usd

Alice's emitLoan tx succeeds. She transferred a cheaper token 1 but got 250 usd principal.

Bob uses a more expansive `tokenId` 0 as collateral for higher principal. Bob needs an exact `tokenId` offer term match so his `validators.length == 0`. 

Bob's `ExeuctionData`:
- `ExecutionData.tokenId` = 0,
- `ExecutionData.OfferExecution\[0].LoanOffer.nftCollateralTokenId` = 0,
- `ExecutionData.OfferExecution\[0].LoanOffer.validators.length` == 0,
- `ExecutionData.OfferExecution\[0].amount` = 250 usd

Bob's emitLoan tx reverted. Even though he has the expensive token 0, his offer is validated as a collection offer with a max 125 usd allowance.

### Recommended Mitigation Steps

In `_getFactors()`, consider swaping the if condition `_validator.length==0` with `_validators.length == 1 && _isZeroAddress(_validators[0].validator)`.

### Assessed type

Error

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-06-gondi-findings/issues/7#event-13414606817)**

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-06-gondi-findings/issues/7#issuecomment-2220143528):**
 > The Warden has demonstrated how the offer type conditionals across the codebase are inconsistent permitting a token ID-specific offer type to be used for a collection-level offer and vice versa.
> 
> I believe a high-risk severity rating is appropriate given that the vulnerability demonstrated can be utilized to cause unfair loans to be taken out at the expense of lenders, and a significant feature of the protocol is impacted. 

*Note: For full discussion, see [here](https://github.com/code-423n4/2024-06-gondi-findings/issues/7).*

***
