---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/stable
protocol: "[[Accountable]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[debt-accrual-update]]"
  - "[[fee-accounting]]"
  - "[[timestamp-dependence]]"
---
# `AccountableOpenTerm` loan interest cannot be repaid once principal hits zero

- id: 62973
- impact: HIGH
- protocol: [[Accountable]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md

## Summary


The bug report is about a code called `AccountableOpenTerm`, which accrues interest but has no mechanism to pay or realize the interest. This means that any interest accrued by the code is never delivered to the intended recipients. This can happen intentionally or unintentionally, resulting in the borrower avoiding paying any interest. A test was added to the code to showcase this bug, and a recommended solution is proposed to fix it. The bug has been fixed in the code by the developers. 

## Details

**Description:** In `AccountableOpenTerm`, interest accrues virtually via `_scaleFactor`, but there is no mechanism to pay/realize that interest. The only funding paths are `borrow()`, `supply()`, and `repay()`. Both `supply()` and `repay()` first service withdrawals and then reduce `_loan.outstandingPrincipal`. When principal reaches zero, `repay()` sets `loanState = Repaid`; in `Repaid`, `_requireLoanOngoing()` blocks further `supply()/repay()`, and `_sharePrice()` switches to `assetShareRatio()` (ignoring accrued `_scaleFactor`). As a result, any accrued interest becomes unpayable and is never delivered to LPs (or fee recipients).

**Impact:** If the borrower repays the principa after time has passed, the loan flips to `Repaid` and all accrued interest is effectively forgiven. LPs receive principal back with zero interest. A borrower can always avoid interest by repaying principal before realizing it. This can happen intentionally by a malicious borrower or even unintentionally since the payments decrease principal first. Hence all interest needs to be repaid with the last payment.

**Proof of Concept:** Add the following test to `AccountableOpenTerm.t.sol`:
```solidity
function test_openTerm_repay_principal_only_setsRepaid_no_interest_paid() public {
    vm.warp(1739893670);

    // Setup borrower & terms
    vm.prank(manager);
    usdcLoan.setPendingBorrower(borrower);
    vm.prank(borrower);
    usdcLoan.acceptBorrowerRole();

    LoanTerms memory terms = LoanTerms({
        minDeposit: 0,
        minRedeem: 0,
        maxCapacity: USDC_AMOUNT,
        minCapacity: USDC_AMOUNT / 2,
        interestRate: 150_000,           // 15% APR so scale factor grows visibly
        interestInterval: 30 days,
        duration: 0,
        depositPeriod: 2 days,
        acceptGracePeriod: 0,
        lateInterestGracePeriod: 0,
        lateInterestPenalty: 0,
        withdrawalPeriod: 0
    });
    vm.prank(manager);
    usdcLoan.setTerms(terms);
    vm.prank(borrower);
    usdcLoan.acceptTerms();

    // Single LP deposits during deposit period → 1:1 shares at PRECISION
    vm.prank(alice);
    usdcVault.deposit(USDC_AMOUNT, alice, alice);
    assertEq(usdcVault.totalAssets(), USDC_AMOUNT, "vault funded");

    // Borrower draws full principal → vault drained
    vm.prank(borrower);
    usdcLoan.borrow(USDC_AMOUNT);
    assertEq(usdcVault.totalAssets(), 0, "all assets borrowed");
    assertEq(usdcLoan.loan().outstandingPrincipal, USDC_AMOUNT, "principal outstanding");

    // Time passes → interest accrues virtually (scale factor > PRECISION)
    vm.warp(block.timestamp + 180 days);
    uint256 sfBefore = usdcLoan.accrueInterest();
    assertGt(sfBefore, 1e36, "scale factor increased (virtual interest)");

    // Borrower repays EXACTLY principal (no extra for interest)
    usdc.mint(borrower, USDC_AMOUNT);
    vm.startPrank(borrower);
    usdc.approve(address(usdcVault), type(uint256).max);
    usdcLoan.repay(USDC_AMOUNT);
    vm.stopPrank();

    // Loan marked repaid even though totalAssets < totalShareValue at sfBefore
    assertEq(uint8(usdcLoan.loanState()), uint8(LoanState.Repaid), "loan flipped to Repaid");

    // After Repaid, share price uses assetShareRatio (actual assets), not the higher scale factor.
    // With one LP and totalAssets == totalSupply, ratio == PRECISION → no interest realized.
    uint256 spAfter = usdcLoan.sharePrice(address(usdcVault));
    assertEq(spAfter, 1e36, "share price fell back to assetShareRatio (no interest paid)");

    // Sanity: vault now only holds repaid principal
    assertEq(usdcVault.totalAssets(), USDC_AMOUNT, "vault holds only principal after repay");
    assertEq(usdcVault.totalSupply(), USDC_AMOUNT, "shares unchanged");

    // Now borrower cannot "pay the interest" anymore
    vm.prank(borrower);
    vm.expectRevert(); // blocked by _requireLoanOngoing()
    usdcLoan.supply(1e6);
}
```

**Recommended Mitigation:** Consider modeling borrower liability in debt shares instead of tracking principal/interest separately.

On `borrow(assets)`, after `accrue()`, mint `debtShares = ceil(assets * PRECISION / price)` where `price = scaleFactor`. Debt then equals `debtShares * price / PRECISION`. Interest accrual only moves `price`, not shares.

On `repay(assets)`, after `accrue()`, burn `sharesToBurn = floor(assets * PRECISION / price)` (capped to balance). When `debtShares == 0`, the loan is repaid.

This guarantees interest can always be repaid at the current price, prevents the “principal hits zero” dead-end, and supports partial/frequent repayments cleanly. If protocol/establishment fees apply, take them on each accrual/settle step before any excess refunds to keep fee accounting correct.

**Accountable:** Fixed in commits [`fce6961`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/fce6961c71269739ec35da60131eaf63e66e1726) and [`8e53eba`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/8e53eba7340f223f86c9c392f50b8b2d885fdd39)

**Cyfrin:** Verified. Debt is not tracked using shares.

\clearpage
