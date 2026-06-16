---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/lending
  - platform/quantstamp
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
  - fix/use-reentrancy-guard
protocol: "[[Yield Basis]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html"
genome:
  - "[[single-function]]"
  - "[[temporary]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[use-reentrancy-guard]]"
  - "[[flashloan-callback-auth]]"
  - "[[reentrancy-guard]]"
---
# Incorrect Flashloan Integration

- id: 62012
- impact: HIGH
- protocol: [[Yield Basis]]
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/yield-basis/e07ecad3-524c-4609-b4f6-71ed7fdc3281/index.html

## Summary


The `VirtualPool` contract, which uses a crvUSD flashloan provider to increase user arbitrage, has an incomplete flashloan integration. The `onFlashLoan()` function needs to be external according to ERC3156 and should verify the addresses of `initiator` and `token`. The `exchange()` function calls a non-existent `FLASH.ceiling()` function and should also be `@nonreentrant`. The client has fixed some issues in a commit, but it is recommended to thoroughly test the contract and consider adding a test suite to ensure its correctness.

## Details

**Update**
The client fixed the issue in commit `0fd7b45e0e8323a437804bcd9e6d0c373d0d0896` and provided the following explanation:

> Mentioned issues were addressed in this commit, but this only can be considered fixed when VirtualPool is actually tested (not as of commit time)

**File(s) affected:**`contracts/VirtualPool.vy`

**Description:** The `VirtualPool` contract makes use of a crvUSD flashloan provider to amplify user arbitrage for price correction. However, the flashloan integration is incomplete.

1.   The `onFlashLoan()` function needs to be external according to ERC3156.
2.   The `onFlashLoan()` function should verify the `initiator` and `token` addresses. 
3.   The `exchange()` function calls a `FLASH.ceiling()` function that appears to be undefined based on the intended integrated flash contract, [Curve Flashlender](https://etherscan.io/address/0x26de7861e213a5351f6ed767d00e0839930e9ee1#code). 
4.   The `exchange()` function should be `@nonreentrant`.

**Recommendation:** Make sure that the flashloan integration is complete and secure. Consider adding a test suite to further check the correctness of the `VirtualPool` contract.
