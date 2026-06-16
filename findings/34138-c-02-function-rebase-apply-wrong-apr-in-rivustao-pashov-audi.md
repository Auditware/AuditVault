---
tags:
  - lang/solidity
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/direct-drain
  - precondition/specific-token-type
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Rivus]]"
auditors:
  - "[[Pashov Audit Group]]"
report: https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# [C-02] Function `rebase()` apply wrong APR in RivusTAO

- id: 34138
- impact: HIGH
- protocol: [[Rivus]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Rivus-security-review.md

## Summary


This bug report describes an issue with the `rebase()` function, which is supposed to apply a daily APR (Annual Percentage Rate) to the share price by decreasing the total share amount. However, the code currently uses an incorrect calculation for the `burnAmount`, resulting in a larger burned amount than intended. This can cause an incorrect reward rate and unfair distribution of tokens. The recommended solution is to use a different calculation for the burn amount.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

The function `rebase()` is supposed to apply daily APR to the share price by decreasing the total share amount. The issue is that the code uses `totalSharesAmount * apr` to calculate `burnAmount` so the burned amount would be bigger than what it should be. This is the POC:

1. Suppose there are 100 shares and 100 tokens.
2. Admin wants to apply a 20% increase for one day.
3. Code would calculate the burn amount as `100 * 20% = 20` and the new total share would be 80.
4. Now the token to share price would be `100/80 = 1.25` and as you can see the ratio increases by 25%.
5. This would cause a wrong reward rate and those who withdraw sooner would steal others tokens.

**Recommendations**

Code should use `totalSharesAmount * apr / (1 +apr)` to calculate the burn amount.
