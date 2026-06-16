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
# [H-01] User can prevent balance updates by withdrawing

- id: 38489
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


This bug report describes a problem where the value of `creditedNodeETH` is not being updated correctly when the `finishWithdraw()` function is called. This can lead to an incorrect balance for users and can also be exploited by malicious users to prevent balance updates. The report recommends updating the value of `creditedNodeETH` in the `finishWithdraw()` function to fix the issue. The severity of this bug is medium and the likelihood of it occurring is high.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

When `finishWithdraw()` is called the ETH amount is transferred from the native node contract's balance but the code doesn't decrease the value of the `creditedNodeETH` so its value would be higher than it should be and `_startSnapshot()` would revert because of underflow:

```solidity
        // Calculate unattributed node balance
        uint256 nodeBalanceWei = node.nodeAddress.balance - node.creditedNodeETH;
```

The issue would happen to all users who withdraw tokens and malicious users can do it intentionally to prevent balance updates (when they are slashed in the beacon chain)

## Recommendations

Update the value of the `creditedNodeETH` in `finishWithdraw()`.
