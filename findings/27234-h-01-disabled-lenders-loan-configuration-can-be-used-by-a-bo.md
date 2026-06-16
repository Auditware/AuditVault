---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Lumin]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-Lumin.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-01] Disabled lender's loan configuration can be used by a borrower

- id: 27234
- impact: HIGH
- protocol: [[Lumin]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-Lumin.md

## Summary


This bug report is about a vulnerability in the `LoanConfig` struct, which is used in the `LoanManager::createLoan` method. The `enabled` field in the `LoanConfig` struct is set to `true` for newly created loan configs and can be set to `true/false` in `LoanConfigManager::updateLoanConfigEnabledStatus`. The problem is that in `LoanManager::createLoan`, when a borrower takes in a loan from a lender, the `enabled` property is never checked. This means that even when a lender has called `LoanConfigManager::updateLoanConfigEnabledStatus` with `enabled == false` for a loan configuration they created, the configuration can still be used by borrowers. 

The impact of this vulnerability is medium, as a borrower can use a disabled loan configuration but it will still work as a normal loan, so no lender value loss. The likelihood is high, as the disabling functionality can never work with the current code. To fix this, the recommendation is to check if a loan config is enabled in `LoanManager::createLoan` and revert the transaction if it is not.

## Details

**Severity**

**Impact:**
Medium, as a borrower can use a disabled loan configuration but it will still work as a normal loan, so no lender value loss

**Likelihood:**
High, as the disabling functionality can never work with the current code

**Description**

In the `LoanConfig` struct we have the `enabled` field, which is set to `true` for newly created loan config and can be set to `true/false` in `LoanConfigManager::updateLoanConfigEnabledStatus`. The problem is that in `LoanManager::createLoan`, when a borrower takes in a loan from a lender, a `configId` is given as an argument and then the corresponding `LoanConfig` struct object is used in the method, but the `enabled` property is never checked. This means that even when a lender has called `LoanConfigManager::updateLoanConfigEnabledStatus` with `enabled == false` for a loan configuration they created, the configuration can still be used by borrowers.

Here is an executable Proof of Concept unit test that demonstrates the vulnerability (you can add this in the end of your `LoanManager` test file):

```solidity
function test_DisabledLoanConfigCanStillBeUsed() public {
    // Alice disables her loan config
    vm.prank(alice);
    wrappedLoanManagerDelegator.updateLoanConfigEnabledStatus(loan.configId, false);
    vm.startPrank(bob);

    // there are no current loans
    assertEq(0, wrappedLoanManagerDelegator.getLoanCounter());

    vm.expectEmit();
    emit LoanCreated(1, 1);
    wrappedLoanManagerDelegator.createLoan(loan, collateralAssets);

    // a loan was created
    assertEq(1, wrappedLoanManagerDelegator.getLoanCounter());

    // Alice's free deposit was lowered
    IAssetManager.DepositData memory aliceDepositAfterLending = wrappedAssetManager.depositOf(assetId[0], alice);
    assertEq(aliceDepositAfterLending.depositAmount, userDepositAlice[0] - loan.principalAmount);
    assertEq(aliceDepositAfterLending.lockedAmount, 0);
}
```

**Recommendations**

Check if a loan config is enabled in `LoanManager::createLoan` and revert the transaction if it is not.
