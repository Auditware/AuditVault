---
tags:
  - lang/move
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

- id: 48282
- impact: HIGH
- protocol: [[Thala Labs]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.thalalabs.xyz/

## Summary


The report is about a bug in the protocol module where the function repay_internal is used to repay borrowed amounts from the vault. However, when repaying the borrowed amount, the interest is not being cleared properly. The protocol uses fees::absorb_fee to calculate and absorb the repaid interest amount, but it is not subtracting this amount from the vault.interest. This means that users are unable to clear the interest in their vault, even though the protocol absorbs it from the repayment amount. The suggested fix is to subtract the repay_interest_amount from the vault.interest. This bug has been fixed in the latest patch.

## Details

## Protocol Module

In the protocol module, `repay_internal` is used to repay amounts borrowed from the vault. In addition to the debt, clearing the interest should be done when repaying the borrowed amount. 

Although the protocol uses `fees::absorb_fee` to calculate and absorb the repaid interest amount, the protocol does not subtract this amount from `vault.interest`. Consequently, a user is unable to clear the interest in their vault, even though the protocol absorbs it from the repayment amount.

## Remediation

Subtract `repay_interest_amount` from the `vault.interest`.

## Patch

Fixed in `48f7c83` by subtracting `repay_interest_amount` from the `vault.interest`.
