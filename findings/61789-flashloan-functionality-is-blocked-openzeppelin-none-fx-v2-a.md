---
tags:
  - lang/solidity
  - sector/lending
  - platform/openzeppelin
  - has/github
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[f(x) Protocol]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/fx-v2-audit"
genome:
  - "[[fee-calculation]]"
  - "[[permanent]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
---
# Flashloan Functionality is Blocked

- id: 61789
- impact: HIGH
- protocol: f(x) v2 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/fx-v2-audit

## Summary


This bug report is about a function called `flashLoan` in the `FlashLoans` contract. The function has a condition that checks if the amount being returned is less than the amount borrowed plus a fee. However, the way the `returnedAmount` is calculated does not take into account the full amount borrowed, causing the condition to always be true and resulting in the flash loan failing. This issue has been resolved in a recent update to the contract.

## Details

The [`flashLoan` function](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/FlashLoans.sol#L67-L97) of the `FlashLoans` contract uses the [`returnedAmount < amount + fee`](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/FlashLoans.sol#L87) condition to validate repayment. However, `returnedAmount` is [computed](https://github.com/AladdinDAO/fx-protocol-contracts/blob/56a47eab8d10334e479df83a2b13a8b68ce390e9/contracts/core/FlashLoans.sol#L86) as the post-callback balance minus the pre-loan balance, which only represents the extra tokens sent to cover fees. As a result, `returnedAmount < amount + fee` is always `true`, causing every flash loan to revert unless the borrower somehow returns the entire principal, plus fee, as the fee.

Consider changing the condition to `returnedAmount < fee` so that the function correctly enforces repayment of the fee.

***Update:** Resolved in [pull request #17](https://github.com/AladdinDAO/fx-protocol-contracts/pull/17). This pull request fixes the issue by calculating `prevBalance` after the token transfer to the receiver. Additionally, compliance to [EIP-3156](https://eips.ethereum.org/EIPS/eip-3156) standard will be achieved once M-01 is resolved.*
