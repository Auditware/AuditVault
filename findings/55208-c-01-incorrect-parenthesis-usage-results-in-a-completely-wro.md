---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Burve]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[precision-loss]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [C-01] Incorrect parenthesis usage results in a completely wrong calculation

- id: 55208
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Burve]]-security-review_2025-01-29.md

## Summary


This bug report is about a critical issue in the code for the `Edge.calcLowerImplied()` function. When the price is below a certain range, the code uses a formula to calculate a ratio. However, the formula is incorrect and will result in the variable holding the wrong value. This mistake is also present in a few other functions. The report recommends a simple fix to the formula to prevent this issue from occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Upon calling `Edge.calcLowerImplied()` when the price is below the narrow range low tick, we have the following piece of code:

```solidity
uint256 xyX192 = (x << (128 / y)) << 64;
```

It aims to compute the `x/y` ratio in 192-bit precision by first moving `x` to 128-bit precision, dividing by `y` and then going to 192-bit precision when shifting left by 64 bits. However, the formula has a critical issue as `x` is shifted left by `128 / y` bits due to the parenthesis usage, this will round down to 0 in pretty much every case which results in the variable simply holding the value of `x` shifted left by 64 bits.

This vulnerability is also in a few other functions.

## Recommendations

```diff
+ uint256 xyX192 = ((x << 128) / y) << 64;
- uint256 xyX192 = (x << (128 / y)) << 64;
```
