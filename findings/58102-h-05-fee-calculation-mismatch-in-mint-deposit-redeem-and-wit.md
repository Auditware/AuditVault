---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/bridge
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-05] Fee calculation mismatch in `mint`, `deposit`, `redeem` and `withdraw`

- id: 58102
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report discusses a problem with the code that calculates fees for the mint, deposit, redeem, and withdraw functions. The report explains that the code currently overcharges users when they call the deposit and redeem functions. This is because the code calculates the fee based on the user-specified amount, rather than the total amount including the fee. The report recommends a solution to fix this issue by calculating the fee with the total amount (including the fee) in mind. This will ensure that users are not overcharged when using these functions.

## Details

## Severity

**Impact:** Medium, fee will be a little higher/lower

**Likelihood:** High, because it happens in every call to mint and deposit functions

## Description

When users calls `mint(shares)` code calls `_deposit(previewMint(_shares), _shares` and `previewMint(shares) = convertToAssets(shares).addBp()`.
When users calls `deposit(amount)` code calls `_deposit(_amount, previewDeposit(_amount)` and `previewDeposit(amount) = convertToShares(amount).subBp`.

Let's assume that price is 1:1 and fee is 10% and check the both case:

1. If user wants to mint 100 share then he would call `mint(100)` and code would calculate `amount = previewMint(100) = convertToAssets(100).addBp(10%) = 110`. So in the end user would pay 110 asset and receive 100 shares and 10 asset will be fee.
2. If users wants to deposit 110 asset then he would call `deposit(110)` and code would calculate `share = previewDeposit(110) = convertToShare(110).subBp(10%) = 99`. So in the end user would pay 11 asset and receive 99 share and 11 asset will be fee.

As you can see the `deposit()` call overcharge the user. The reason is that code calculates fee based on user-specified amount by using `subBp()` but user-specified amount is supposed to be `amount + fee` so the calculation for fee should be `.... * base / (base +fee)`.

---

When users call `redeem(shares)` code calls `_withdraw(previewRedeem(_shares), _shares)` and `previewRdeem(shares) = convertToAssets(_shares).subBp()`.

When users call `withdraw()` code calls `_withdraw(_amount, previewWithdraw(_amount))` and `previewWithdraw(_amount) = convertToShares(_assets).addBp()`

Let's assume that asset to share price is 1:1 and fee is 10% and check both case:

1. If user wants to redeem 110 shares then he would call `redeem(110)` and code would calculate `amount = previewRdeem(110) = convertToAssets(110).subBp(10%) = 99`. So in the end user would burn 110 shares and receive 99 asset and 11 asset will be fee.
2. If user wants to withdraw 100 asset then he would call `withdraw(100)` and code would calculates `shares = previewWithdraw(100) = convertToShares(100).addBp(10%) = 110`. So in the end userwould burn 110 shares and receive 100 asset and 10 asset will be fee.

So as you can see `redeem()` overcharges users. The reason is that code calculates fee based on user provided share with `subBp()` but the provided amount is total amount (burnAmount + fee) and calculation should be `..... * base / (base + fee)`

## Recommendations

Calculate the fee for `deposit()` with `convertToShare(amount) * base / (base +fee)`.
Calculate the fee for `previewRedeem()` with `convertToAssets(shares) * base / (base + fee)`
