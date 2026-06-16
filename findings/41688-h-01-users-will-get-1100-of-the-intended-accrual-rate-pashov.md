---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
  - lang/move
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# [H-01] Users will get 1/100 of the intended accrual rate

- id: 41688
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


The report is about a bug in the accrual rate for a smart contract called DyadXPv2. The bug causes the accrual rate to be set to a value that is 2 orders of magnitude lower than the intended value. This means that users will receive a much lower yield for their deposit than they should. The severity of the bug is considered medium and the likelihood of it occurring is high. The recommended fix is to change the value of the accrual rate from `1e7` to `1e9`.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The base accrual rate, as described in the documentation, should be `1e9`.

However, in `DyadXPv2._computeXP` it is set to `1e7`:

```solidity
    uint256 adjustedAccrualRate = accrualRateModifier * 1e7;
```

As such, users will get a meager yield for their deposit (2 orders of magnitude less than the intended value).

## Recommendations

Consider the following change:

```diff
-    uint256 adjustedAccrualRate = accrualRateModifier * 1e7;
+    uint256 adjustedAccrualRate = accrualRateModifier * 1e9;
```
