---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Gondi]]"
auditors:
  - "[[bin2chen]]"
report: "https://code4rena.com/reports/2024-04-gondi"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-13] `_processOffersFromExecutionData()` lack of check `executionData.duration<=offer.duration`

- id: 35215
- impact: HIGH
- protocol: [[Gondi]]
- reporter: bin2chen (Code4rena)
- source: https://code4rena.com/reports/2024-04-gondi

## Summary


The bug report discusses an issue with the `emitLoan()` function in the code. Currently, this function only limits the `offer.duration` to be different from zero, but there is no limit on the `executionData.duration` being less than or equal to `offer.duration`. This could lead to problems with borrowing time exceeding the set duration and also cause accounting issues if the lender is a LoanManager and exceeds the maximum pending queues when using the `repayLoan()` function. The recommended mitigation is to check for `executionData.duration` being less than or equal to `offer.duration`. The bug has been confirmed and mitigated by adding a duration check.

## Details


`emitLoan()` only limits `offer.duration != 0`. There's no limit in `executionData.duration<=offer.duration`.

`emitLoan()` -> `_processOffersFromExecutionData()` -> `_validateOfferExecution()`

```solidity
    function _validateOfferExecution(
        OfferExecution calldata _offerExecution,
        uint256 _tokenId,
        address _lender,
        address _offerer,
        bytes calldata _lenderOfferSignature,
        uint256 _feeFraction,
        uint256 _totalAmount
    ) private {
...

@>      if (offer.duration == 0) {
            revert ZeroDurationError();
        }
        if (offer.aprBps == 0) {
            revert ZeroInterestError();
        }
        if ((offer.capacity > 0) && (_used[_offerer][offer.offerId] + _offerExecution.amount > offer.capacity)) { 
            revert MaxCapacityExceededError();
        }

        _checkValidators(_offerExecution.offer, _tokenId);
    }
```

If the `executionData.duration` time is not limited, it can lead to far exceeding the borrowing time `offer.duration`. If the `lender` is a `LoanManager`, when `repayLoan()` it can also exceed the maximum `pendingQueues`, leading to accounting issues.

### Impact

Far exceeding the borrowing time than `offer.duration`. If `lender` is `LoanManager` also exceeds max `pendingQueues`, causing bookkeeping issues.

### Recommended Mitigation

Check `executionData.duration<=offer[n].duration`.

### Assessed type

Context

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-04-gondi-findings/issues/28#event-12545511916)**

**[0xA5DF (judge) commented](https://github.com/code-423n4/2024-04-gondi-findings/issues/28#issuecomment-2067729769):**
> Sustaining high due to accounting issues.

**[Gondi mitigated](https://github.com/code-423n4/2024-05-gondi-mitigation?tab=readme-ov-file#mitigation-of-high--medium-severity-issues):**
> Added duration check.

**Status:** Mitigation confirmed. Full details in reports from [oakcobalt](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/91), [minhquanym](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/61) and [bin2chen](https://github.com/code-423n4/2024-05-gondi-mitigation-findings/issues/14).

***
