---
tags:
  - lang/solidity
  - sector/dex
  - platform/pashov
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[timestamp-dependence]]"
---
# [C-02] `_wethToRdnt()` will certainly revert as `rdntOut` is always zero

- id: 31662
- impact: HIGH
- protocol: [[Radiant]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md

## Summary


The reported bug is a high severity issue that can have a significant impact on the functionality of the system. The likelihood of encountering this bug is also high. The bug is related to the `BalancerPoolHelper._swap()` function, which always returns a value of `0` because it does not have a return statement or return parameter assigned. This causes the `rdntOut` variable to also be `0`, leading to the failure of the slippage check. The recommended solution is to add a return statement in the code to fix this issue.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

`BalancerPoolHelper._swap()` always returns `0` because it lacks a return statement or return parameter assignment. Hence, `rdntOut = poolHelper_.swapWethToRdnt(_wethIn, 0);` will always be 0, causing the slippage check to fail.

**Recommendations**

```diff
- IVault(vaultAddr).swap(singleSwap, funds, _minAmountOut, block.timestamp);
+ return IVault(vaultAddr).swap(singleSwap, funds, _minAmountOut, block.timestamp);
```
