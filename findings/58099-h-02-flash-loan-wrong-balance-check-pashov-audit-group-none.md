---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[flashloan-callback-auth]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[use-reentrancy-guard]]"
---
# [H-02] Flash loan wrong balance check

- id: 58099
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report is about a medium severity issue in the flash loan functionality. The bug causes the `balanceAfter` variable to be higher than needed, resulting in users having to pay extra to use a flash loan. The likelihood of this bug occurring is high as it happens every time a flash loan is used. The report recommends dropping the `toRepay` variable or recording the `balanceBefore` after the `safeTransferFrom` function to fix the bug.

## Details

## Severity

**Impact:** Medium, because the flash loan functionality is affected

**Likelihood:** High, because it will revert every time а flash loan is used

## Description

`balanceBefore` is recorded before the flash loan amount being transferred. As a result, in line 714, `balanceAfter` need to be more than needed. Users have to pay extra with the same amount to use a flash loan.

```solidity
File: src\abstract\As4626.sol
696:     function flashLoanSimple() external nonReentrant {

705:         uint256 fee = exemptionList[msg.sender] ? 0 : amount.bp(fees.flash);
706:         uint256 toRepay = amount + fee;
707:
708:         uint256 balanceBefore = asset.balanceOf(address(this));
709:         totalLent += amount;
710:
711:         asset.safeTransferFrom(address(this), address(receiver), amount);
712:         receiver.executeOperation(address(asset), amount, fee, msg.sender, params);
713:
714:         if ((asset.balanceOf(address(this)) - balanceBefore) < toRepay)
715:             revert FlashLoanDefault(msg.sender, amount);

718:     }
```

## Recommendations

The `toRepay` variable could be dropped, or record the `balanceBefore` after `safeTransferFrom`:

```diff
File: src\abstract\As4626.sol
696:     function flashLoanSimple() external nonReentrant {

705:         uint256 fee = exemptionList[msg.sender] ? 0 : amount.bp(fees.flash);
- 706:         uint256 toRepay = amount + fee;
707:
708:         uint256 balanceBefore = asset.balanceOf(address(this));
709:         totalLent += amount;
710:
711:         asset.safeTransferFrom(address(this), address(receiver), amount);
712:         receiver.executeOperation(address(asset), amount, fee, msg.sender, params);
713:
- 714:         if ((asset.balanceOf(address(this)) - balanceBefore) < toRepay)
+ 714:         if ((asset.balanceOf(address(this)) - balanceBefore) < fee)
715:             revert FlashLoanDefault(msg.sender, amount);

718:     }

```
