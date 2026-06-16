---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# [H-10] `_packPoolVirtualBalance()` reverts due to incorrect `POOL_VB_MASK`

- id: 36350
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report is about a problem with a value called POOL_VB_MASK, which is used in calculations for a project. The severity of this issue is considered medium, meaning it is not a critical problem but still needs to be fixed. The impact of this bug is also considered medium, as it can cause issues with calculations. The likelihood of this bug occurring is high, meaning it is a common problem. The bug causes all calculations using POOL_VB_MASK to fail, and this can be seen in a specific function called `_packPoolVirtualBalance()` during the process of providing liquidity. To fix this issue, the value of POOL_VB_MASK should be changed from 2 * 128 - 1 to 2 ** 128 - 1. This will ensure that the calculations work correctly. 

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

All calculations with POOL_VB_MASK always revert due to a wrong value stored.
E.g. reverts in `_packPoolVirtualBalance()` during the liquidity provision.

**Recommendations**

`POOL_VB_MASK` value should be fixed:

```diff
- uint256 public constant POOL_VB_MASK = 2 * 128 - 1;
+ uint256 public constant POOL_VB_MASK = 2 ** 128 - 1;
```
