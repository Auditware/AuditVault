---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [C-01] Incorrect token order passed for WETH -> RDNT swaps

- id: 31661
- impact: HIGH
- protocol: [[Radiant]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review.md

## Summary


The report states that there is a high severity bug in a function called `BalancerPoolHelper.swapWethToRdnt()`. The function is supposed to swap WETH for RDNT, but it is currently attempting to swap RDNT for WETH. The report recommends changing the input and output tokens in the function to fix the bug.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

The `BalancerPoolHelper.swapWethToRdnt()` is intended to swap WETH for RDNT. However, the input and output tokens are in reverse:

```solidity
_swap(RDNT_ADDRESS, REAL_WETH_ADDR, _wethAmount, _minAmountOut, WETH_RDNT_POOL_ID, msg.sender);
```

resulting in an attempted RDNT -> WETH swap instead.

**Recommendations**

```diff
- _swap(RDNT_ADDRESS, REAL_WETH_ADDR, _wethAmount, _minAmountOut, WETH_RDNT_POOL_ID, msg.sender);
+ _swap(wethAddr, RDNT_ADDRESS, _wethAmount, _minAmountOut, WETH_RDNT_POOL_ID, msg.sender);
```
