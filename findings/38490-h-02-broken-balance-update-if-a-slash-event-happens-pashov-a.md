---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Karak]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# [H-02] Broken balance update if a slash event happens

- id: 38490
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


This bug report describes a problem where the value of `creditedNodeETH` is not being properly updated when a function called `_transferToSlashStore()` is executed. This results in an incorrect value for `creditedNodeETH` which causes another function called `_startSnapshot()` to fail. The severity of this bug is considered medium and the likelihood of it occurring is high. To fix this issue, the value of `creditedNodeETH` should be updated in the `_transferToSlashStore()` function.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When `_transferToSlashStore()` is called the slash ETH amount is transferred from the native node contract's balance but the code doesn't decrease the value of the `creditedNodeETH` so its value would be higher than it should be and `_startSnapshot()` would revert because of underflow:

```solidity
        // Calculate unattributed node balance
        uint256 nodeBalanceWei = node.nodeAddress.balance - node.creditedNodeETH;
```

## Recommendations

Update the value of the `creditedNodeETH` in `_transferToSlashStore()`.
