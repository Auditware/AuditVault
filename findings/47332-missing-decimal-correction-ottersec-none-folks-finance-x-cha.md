---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/token
  - platform/ottersec
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Folks Finance]]"
auditors:
  - "[[Robert Chen]]"
report: "https://folks.finance/"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[token-decimal-normalization]]"
---
# Missing Decimal Correction

- id: 47332
- impact: HIGH
- protocol: [[Folks Finance]] X-Chain
- reporter: Robert Chen (OtterSec)
- source: https://folks.finance/

## Summary


The price oracle is not accounting for the decimal places in ERC-20 tokens, causing incorrect pricing of debt and collateral assets. This oversight has critical security implications and can be exploited to steal funds. To fix this issue, the price needs to be divided by 10**decimals to account for varying decimal places. This has been fixed in version 333bcf7.

## Details

## Pricing Oversight in ERC-20 Tokens

The price oracle does not account for ERC-20 decimals, resulting in the incorrect pricing of debt and collateral assets. This occurs because the price of ERC-20 tokens is typically denoted in USD per unit (10 ** decimals). Consequently, when comparing the value of two ERC-20 tokens with different decimals, it is imperative to divide the multiplication result by 10 ** decimals to account for the difference.

This oversight has critical security implications, as it can be easily exploited to steal funds. To clarify, we will illustrate the following scenario:

1. Assume a borrowing scenario where the collateral is DAI and the debt is USDC. Note that DAI has 18 decimals, while USDC has 6 decimals. Also, assume a collateral factor of 0.4 and a borrow factor of 1, resulting in a Loan-to-Value (LTV) ratio of 40%.
   
2. A user deposits 1 DAI, which has a notional value of 1 USD. Thus, the user should be able to borrow at most 0.4 USDC under correct calculations.
   
3. However, due to the oversight, the user may actually borrow 4×10^11 USDC. This erroneous calculation occurs because the value of 1 DAI is improperly calculated as 1 × 10^18 (reflecting its full atomic units), while the value of 4 × 10^11 USDC is calculated as 4 × 10^11 × 10^6 = 0.4 × 10^18.

The failure to properly account for the decimal difference leads to the collateral being critically overvalued, enabling the user to borrow vastly more than what the collateral should allow.

## Remediation
Divide the price by 10 ** decimals to account for varying decimals.

## Patch
Fixed in 333bcf7.

© 2024 Otter Audits LLC. All Rights Reserved. 6/13
