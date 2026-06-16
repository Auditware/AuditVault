---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
protocol: "[[Burve]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[integer-bounds]]"
  - "[[logic/wrong-condition]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[precondition/specific-contract-state]]"
  - "[[blast-radius/single-pool]]"
---
# [H-02] Normalizing token weights can result in a revert

- id: 55213
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md

## Summary


The bug report describes a problem with normalizing weights in a code. When there is only one element in the array, it results in a revert when calling a function. The recommendation is to set the element to a specific value to avoid the revert.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Upon normalizing weights when having a swap, we have this piece of code to turn the `weights` array from an array with amounts to an array with percentages:

```solidity
self.weights[i] = FullMath.mulDivX256(
                self.weights[i],
                self.totalWeight
            );
```

The issue is that if there is a single element in the array, then that element will equal the `totalWeight` which results in a revert when calling `mulDivX256()` as we have the following check there:

```solidity
require(denominator > num, "0");
```

As they are equal, we will revert.

## Recommendations

When the values are equal, set the `weights` element to `2 ^ 256 - 1` or `type(uint256).max`
