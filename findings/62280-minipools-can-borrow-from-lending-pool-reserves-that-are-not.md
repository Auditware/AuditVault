---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Minipools can borrow from lending pool reserves that are not borrowable

- id: 62280
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


The report states that there is a high-risk bug in the BorrowLogic.sol file between lines 276 and 283. In this section, there is a missing check to ensure that the reserve is not frozen before allowing a borrower to deposit assets into the lending pool. This check is later performed when assets are deposited into the pool, but it should also be done before allowing a borrower to borrow from the reserve.

Additionally, there are other checks that are not being performed in this context, such as checking for collaterals, the health of the mini pool, and the amount being borrowed does not exceed the allowed limit. The recommendation is to add a check to ensure that the reserve can be borrowed from and that the configuration for borrowing is enabled. The bug has been fixed in a recent commit and has been verified by the team.

## Details

## Severity: High Risk

## Context
BorrowLogic.sol#L276-L283.

## Description
In this context, unlike the borrow flow of the lending pool, we don't check whether:

- The reserve is not frozen. This check is later performed when one deposits assets into the lending pool again when calling:
  ```solidity
  ILendingPool(vars.LendingPool).deposit(
      underlying, true, vars.amountReceived, address(this)
  );
  ```
- The reserve can be borrowed from.

Additionally, based on the assumption that it is an unbacked borrow, the following checks are omitted:

- Checking that there are some collaterals.
- The position of the mini pool is healthy (checking the health factor).
- The amount being borrowed does not exceed what is allowed based on the total collateral, average LTV, and the total borrowed amount.

## Recommendation
Make sure `executeMiniPoolBorrow` checks whether the reserve can be borrowed from. `reserve.configuration.getBorrowingEnabled()` should return true.

## Astera
Fixed in commit de7bbdc6.

## Spearbit
Fix verified.
