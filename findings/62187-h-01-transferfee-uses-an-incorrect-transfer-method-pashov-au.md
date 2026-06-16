---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Resolv]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Resolv-security-review_2024-12-09.md"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# [H-01] `transferFee()` uses an incorrect transfer method

- id: 62187
- impact: HIGH
- protocol: Resolv_2024-12-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Resolv]]-security-review_2024-12-09.md

## Summary


This bug report is about a medium severity bug that has been resolved. The bug affects the `TheCounter` contract and causes the `transferFee` function to fail. This is because the function incorrectly uses `safeTransferFrom` instead of `safeTransfer` when transferring fees to the admin. This results in the admin being unable to collect fees. The report recommends changing the code to use `safeTransfer` instead of `safeTransferFrom` to fix the bug.

## Details


_Resolved_


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `transferFee` function in the `TheCounter` contract incorrectly uses `safeTransferFrom` instead of `safeTransfer` when transferring collected fees from the contract to the admin. This implementation error will cause the function to revert due to missing allowances.

As a result, the admin is unable to collect protocol fees.

```solidity
    function transferFee() external onlyRole(DEFAULT_ADMIN_ROLE) {
        ...
        token.safeTransferFrom(address(this), msg.sender, feeToTransfer); // @audit should use safeTransfer
        ...
    }
```

## Recommendations

```diff
    function transferFee() external onlyRole(DEFAULT_ADMIN_ROLE) {
        ...
-        token.safeTransferFrom(address(this), msg.sender, feeToTransfer);
+        token.safeTransfer(msg.sender, feeToTransfer);
        ...
    }

```
