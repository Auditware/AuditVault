---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/token
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
# [H-03] Flash loan not working due to transferFrom Issue

- id: 58100
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report is about a medium impact issue with the flash loan functionality. This function is not working properly, but there is no risk of losing funds. The likelihood of this issue occurring is high. The problem is that when users try to use the `flashLoanSimple` function, it fails to execute correctly. This is because the contract does not have enough allowance to transfer funds on behalf of itself. The recommendation is to replace the `safeTransferFrom` function with `safeTransfer` to fix this issue.

## Details

## Severity

**Impact:** Medium - The flash loan functionality is non-operational, but there's no risk of fund loss.

**Likelihood:** High - The flash loan function consistently fails to execute as intended.

## Description

The issue arises when users attempt to use the `flashLoanSimple` function:

```solidity
        function flashLoanSimple(
            IFlashLoanReceiver receiver,
            uint256 amount,
            bytes calldata params
        ) external nonReentrant {

            uint256 available = availableBorrowable();
            if (amount > available || amount > maxLoan) revert AmountTooHigh(amount);

            uint256 fee = exemptionList[msg.sender] ? 0 : amount.bp(fees.flash);
            uint256 toRepay = amount + fee;

            uint256 balanceBefore = asset.balanceOf(address(this));
            totalLent += amount;

@>          asset.safeTransferFrom(address(this), address(receiver), amount);
            receiver.executeOperation(address(asset), amount, fee, msg.sender, params);

            if ((asset.balanceOf(address(this)) - balanceBefore) < toRepay)
                revert FlashLoanDefault(msg.sender, amount);

            emit FlashLoan(msg.sender, amount, fee);
        }
```

To transfer the fund to users, it uses `asset.safeTransferFrom(address(this), address(receiver), amount);`

This line intends to transfer funds to the user. However, it fails because `safeTransferFrom` requires the contract to have a sufficient `allowance` to "spend" on behalf of itself. In the context of ERC20 tokens like USDC, the transferFrom function includes a crucial check: `value <= allowed[from][msg.sender]`

However, because the contract has not yet approved itself, leading to a situation where the allowance remains at zero, and hence the `transferFrom` call reverts.

        function transferFrom(
            address from,
            address to,
            uint256 value
        )
            external
            override
            whenNotPaused
            notBlacklisted(msg.sender)
            notBlacklisted(from)
            notBlacklisted(to)
            returns (bool)
        {
            require(
                value <= allowed[from][msg.sender],
                "ERC20: transfer amount exceeds allowance"
            );
            _transfer(from, to, value);
            allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
            return true;
        }

USDC - FiatTokenV1.sol: https://arbiscan.io/address/0xaf88d065e77c8cc2239327c5edb3a432268e5831

Using `transfer` does not require additional approval.

## Recommendations

Replacing the `safeTransferFrom` function with `safeTransfer`:

```diff
        function flashLoanSimple(
            IFlashLoanReceiver receiver,
            uint256 amount,
            bytes calldata params
        ) external nonReentrant {

            uint256 available = availableBorrowable();
            if (amount > available || amount > maxLoan) revert AmountTooHigh(amount);

            uint256 fee = exemptionList[msg.sender] ? 0 : amount.bp(fees.flash);
            uint256 toRepay = amount + fee;

            uint256 balanceBefore = asset.balanceOf(address(this));
            totalLent += amount;

-           asset.safeTransferFrom(address(this), address(receiver), amount);
+           asset.safeTransfer(address(receiver), amount);
            receiver.executeOperation(address(asset), amount, fee, msg.sender, params);

            if ((asset.balanceOf(address(this)) - balanceBefore) < toRepay)
                revert FlashLoanDefault(msg.sender, amount);

            emit FlashLoan(msg.sender, amount, fee);
        }
```
