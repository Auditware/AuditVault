---
tags:
  - lang/solidity
  - sector/lending
  - platform/ottersec
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Thala]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.thalalabs.xyz/"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# Deducting Vault Interest When Repaying Debt

- id: 48052
- impact: HIGH
- protocol: [[Thala]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.thalalabs.xyz/

## Summary


The bug report is about a problem in the protocol module where the function "repay_internal" is used to repay borrowed amounts from a vault. The issue is that when repaying the borrowed amount, the interest is not being properly cleared. The protocol uses a function called "fees::absorb_fee" to calculate and absorb the interest, but it is not subtracting this amount from the vault's interest. This means that users are unable to clear the interest in their vault, even though the protocol is absorbing it from the repayment amount. To fix this issue, the report suggests subtracting the "repay_interest_amount" from the vault's interest. This has been addressed in a recent patch, which can be found in the commit "48f7c83".

## Details

## Protocol Module

In the protocol module, `repay_internal` is used to repay amounts borrowed from the vault. In addition to the debt, clearing the interest should be done when repaying the borrowed amount. 

Although the protocol uses `fees::absorb_fee` to calculate and absorb the repaid interest amount, the protocol does not subtract this amount from `vault.interest`. Consequently, a user is unable to clear the interest in their vault, even though the protocol absorbs it from the repayment amount.

## Remediation

Subtract `repay_interest_amount` from the `vault.interest`.

## Patch

Fixed in `48f7c83` by subtracting `repay_interest_amount` from the `vault.interest`.
