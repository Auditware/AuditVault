---
tags:
  - lang/move
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Global Interlink]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Tx sender can steal the released tokens of any whitelisted user

- id: 44578
- impact: HIGH
- protocol: [[Global Interlink]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-03-27-Global Interlink.md

## Summary


This bug report discusses a critical issue in the contract token_vesting.move. The function `release` is supposed to release vested funds to a whitelisted address, but there is an error in the code. The function checks for the whitelisted address, calculates the amount of vested funds, and then transfers the tokens. However, the tokens are not being transferred to the whitelisted address, but to the account that called the function. This can cause confusion and incorrect distribution of funds. The recommendation is to implement a sanity check to ensure that the address of the transaction sender matches the receiver, or to simply assign the receiver address as the caller's address. This issue has been resolved.

## Details

**Severity**: Critical

**Status**: Resolved

**Description**

In contract token_vesting.move, function `release` is having the role of releasing the vested funds, first the function is checking that the parameter ‘receiver’ is a whitelisted address and after that is proceeding to calculate the amount that will be vested, adjust the storage and transfer the tokens, however there is one problem, the user that is checked for being whitelisted and is having his amount calculated is the ‘receiver’ variable, but the account that will actually receive the tokens is the function caller, there is where the problem is at L#225, the tokens in the end are not transferred to the receiver address but to the account that have called the function, which can be the receiver or not 

**Recommendation**: 

Implement proper sanity check by making sure the tx sender have the same address with the receiver or do not pass the receiver variable through the function parameters and just assign it the address of the caller
