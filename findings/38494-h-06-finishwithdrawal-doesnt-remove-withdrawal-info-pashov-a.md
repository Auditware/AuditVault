---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Karak]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-06] `finishWithdrawal()` doesn't remove withdrawal info

- id: 38494
- impact: HIGH
- protocol: [[Karak]]-June
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Karak-security-review-June.md

## Summary


This bug report discusses an issue with the withdrawal process for a user's funds. Currently, the user needs to make a withdrawal request and wait for a specific time period before being able to call the "finishWithdrawal" function to receive their funds. However, the problem is that this function does not delete the withdrawal information after it has been executed, allowing the user to call it multiple times without having to wait for the initial time period. The recommendation is to delete this information after it has been executed to prevent this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In order to withdraw funds, the user needs to make a withdrawal request. This will store information about the amount that the user wants to withdraw and the request will be queued for execution.

After `MIN_WITHDRAWAL_DELAY` passes user has the ability to call `finishWithdrawal` to get funds. The reason why the user needs to wait `MIN_WITHDRAWAL_DELAY` is to make sure the user can't avoid slashing by frontrunning the slash action.

The problem is that `finishWithdrawal` function doesn't delete information about withdrawal after it's executed and as a result user can execute it as many times as he wishes and he doesn't need to wait `MIN_WITHDRAWAL_DELAY` anymore.

## Recommendations

Delete withdrawal information, after you execute it.
