---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - fix/add-check
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[pda-derivation]]"
---
# Minipools can borrow from lending pool reserves that are not borrowable

- id: 49179
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report is about a high-risk issue in a code called BorrowLogic.sol. In a specific section of the code, there are missing checks to ensure that the reserve is not frozen and can be borrowed from. This could lead to problems when depositing assets into the lending pool. Additionally, there are other checks that are not being performed, such as checking for collateral and the health of the mini pool. The recommendation is to fix this issue by making sure the code checks if the reserve can be borrowed from and that the borrowing feature is enabled. This issue has been fixed in a recent code update and verified by the developer.

## Details

## Security Report

## Severity
**High Risk**

## Context
**File:** BorrowLogic.sol  
**Lines:** L276-L283

## Description
In this context, unlike the borrow flow of the lending pool, we don't check whether:

- The reserve is not frozen. This check is later performed when one deposits assets into the lending pool again when calling:
  
  ```solidity
  ILendingPool(vars.LendingPool).deposit(underlying, true, vars.amountReceived, address(this));
  ```

- The reserve can be borrowed from.

Additionally, based on the assumption that it is an unbacked borrow, the following checks are omitted:

- Checking that there are some collaterals.
- The position of the mini pool is healthy (checking the health factor).
- The amount being borrowed does not exceed what is allowed based on the total collateral, average LTV, and the total borrowed amount.

## Recommendation
Make sure `executeMiniPoolBorrow` checks whether the reserve can be borrowed from. `reserve.configuration.getBorrowingEnabled()` should return true.

## Code
**Fixed in commit:** de7bbdc6

## Verification
**Spearbit:** Fix verified.
