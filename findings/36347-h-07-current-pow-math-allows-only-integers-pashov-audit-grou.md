---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - platform/pashov
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# [H-07] Current pow math allows only integers

- id: 36347
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


The bug report states that there is a problem with the `FixedPointMathLib.rpow` function in the code. This function only accepts integers as a second parameter, but it should allow for calculations like 0.5 ^ 0.5. This is causing all current calculations using this function to fail and the report recommends using alternative math libraries to fix the issue. The severity of this bug is medium and the likelihood of it occurring is high.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

Pow math uses `FixedPointMathLib.rpow` which is not enough because it accepts only integers as a second param.
[link](https://github.com/lucidlyfi/lucidly-core-v1/blob/f00c45bbadc836b9eaa94717a0b3aa017e792588/src/Pool.sol#L1475)

But the expected pow calculations should allow calculations like 0.5 ^0.5 for instance (as it works with weights).

As a result, all current calculations using `FixedPointMathLib.rpow` will revert due to overflow.

**Recommendations**

Consider using alternative math libraries.
