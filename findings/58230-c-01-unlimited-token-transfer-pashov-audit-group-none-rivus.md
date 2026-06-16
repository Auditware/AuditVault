---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
  - sector/staking
protocol: "[[Rivus]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md"
genome:
  - "[[arithmetic/rounding]]"
  - "[[indirect-loss]]"
  - "[[integer-bounds]]"
---
# [C-01] Unlimited token transfer

- id: 58230
- impact: HIGH
- protocol: [[Rivus]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md

## Summary


The report highlights a bug in the function `getSharesByMintedRsTAO()` which is used to calculate the amount of shares corresponding to a certain amount of RsTAO. The issue is that when the total minted amount is 0, the function returns 0 instead of the actual amount. This can lead to various problems such as transferring unlimited tokens to third party contracts and extracting value from contracts with small deposits. The report recommends fixing this bug by returning the actual amount when the total minted tokens are 0 and applying the same fix to COMAI contracts.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Function `getSharesByMintedRsTAO()` has been used to calculate amount of shares that corresponds to the RsTAO amount and it's been used in multiple functions like `_transfer()` and `_mintRsTAO()`. The issue is that the function `getSharesByMintedRsTAO()` returns 0 when the total minted amount is 0 while it should have returned the amount itself. This has multiple impacts like transferring unlimited tokens while the total mint is 0, this is the POC:

1. Suppose RivusTAO is recently deployed or for other reasons (upgrade or ...) the total amount is zero.
2. Now attacker can transfer unlimited tokens to 3rd party contracts like DEX or lending platforms and credit tokens for himself.
3. This is possible because when RivusTAO wants to transfer tokens in the `_transfer()` it would call `getSharesByMintedRsTAO()` to calculate the share amount and the share amount would be 0, so the code would have no problem transferring 0 shares.
4. In the end the 3rd party contract would charge the user account while in reality, it didn't receive any tokens. The `transferFrom()` call would return true and won't revert.

There are other impacts. Function `_mintRsTAO()` uses `getSharesByMintedRsTAO()` too and when the return amount is 0 then the code uses `amount` to mint shares. The issue is that the return amount of `getSharesByMintedRsTAO()` can be 0 because of the rounding error (small values of `amount`) and the code should have minted 0 shares while it would mint >0 shares. This can be used to extract value from contracts with small deposit amounts while the share price is high.

This issue exists for rsCOMAI and RivusCOMAI contracts too.

## Recommendations

When the total minted tokens are 0 then the code should return `amount` in `getSharesByMintedRsTAO()`. The function `getMintedRsTAOByShares()` should be fixed too. Those fixes should be applied to COMAI contracts too.
