---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[debt-accrual-update]]"
  - "[[interest-rate-overflow]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-26: Cross chain debt accrues incorrectly

- id: 58395
- impact: HIGH
- protocol: LEND
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by multiple users in the LendStorage contract for the Lend protocol. The issue is related to cross chain borrowing, where using the borrow index of an LToken on the same chain can result in incorrect interest being accrued. This is due to a function using the wrong parameters for calculating cross chain borrow interest. This bug can impact cross chain functionality and the accuracy of debt calculations. No response or proof of concept has been provided yet. A possible solution is to change the mechanism for accruing cross chain borrow index.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/1009 

## Found by 
0xc0ffEE, JeRRy0422, future, jokr, newspacexyz, t.aksoy

### Summary

Using the borrow index of LToken on the same chain for cross chain borrow can cause the cross chain borrow to be incorrectly accrued interest

### Root Cause

The function [`LendStorage::borrowWithInterest()` ](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/LendStorage.sol#L478-L503) is used to calculate cross borrow with interest. However, the parameters `_lToken` actually the LToken on the same chain. The function is accruing cross chain borrow interest **with same-chain LToken borrow index**. This can cause debt calculation of cross chain borrows to be imprecise, hence impacting cross chain functionality.
```solidity
    function borrowWithInterest(address borrower, address _lToken) public view returns (uint256) {
        address _token = lTokenToUnderlying[_lToken];
        uint256 borrowedAmount;

        Borrow[] memory borrows = crossChainBorrows[borrower][_token];
        Borrow[] memory collaterals = crossChainCollaterals[borrower][_token];

        require(borrows.length == 0 || collaterals.length == 0, "Invariant violated: both mappings populated");
        // Only one mapping should be populated:
        if (borrows.length > 0) {
            for (uint256 i = 0; i < borrows.length; i++) {
                if (borrows[i].srcEid == currentEid) {
                    borrowedAmount +=
@>                        (borrows[i].principle * LTokenInterface(_lToken).borrowIndex()) / borrows[i].borrowIndex;
                }
            }
        } else {
            for (uint256 i = 0; i < collaterals.length; i++) {
                // Only include a cross-chain collateral borrow if it originated locally.
                if (collaterals[i].destEid == currentEid && collaterals[i].srcEid == currentEid) {
                    borrowedAmount +=
@>                        (collaterals[i].principle * LTokenInterface(_lToken).borrowIndex()) / collaterals[i].borrowIndex;
                }
            }
        }
        return borrowedAmount;
    }
```

### Internal Pre-conditions

NA

### External Pre-conditions

NA

### Attack Path

NA

### Impact

- Cross chain borrow accrues interest incorrectly
- Cross chain functionalities does not work properly 

### PoC

_No response_

### Mitigation

Consider changing the mechanism to accrue cross chain borrow index
