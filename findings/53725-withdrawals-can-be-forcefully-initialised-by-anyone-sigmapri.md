---
tags:
  - lang/solidity
  - sector/staking
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Derive]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/derive/review-round2.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Withdrawals Can Be Forcefully Initialised By Anyone

- id: 53725
- impact: HIGH
- protocol: [[Derive]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/derive/review-round2.pdf

## Summary


The `completeWithdrawAccount()` function can be called without `requestWithdrawAccount()` being called first, which can lead to a bypass of the `WITHDRAW_COOLDOWN` check. This means that an attacker could withdraw all SubAccounts in the system by enumerating account IDs. Additionally, `requestWithdrawAccount()` does not check if a withdrawal request has already been placed, leading to an extended cooling down period with every consecutive call. This issue has been fixed in the latest commit `254e39b`.

## Details

## Description

The `completeWithdrawAccount()` function can be called without `requestWithdrawAccount()` being called first. If `requestWithdrawAccount()` is not called first, `withdrawTimestamp[accountId]` will be 0 by default and, as a result, the `WITHDRAW_COOLDOWN` check on line [86] will be trivially bypassed.

Considering there are no access controls on `completeWithdrawAccount()`, an attacker could enumerate all account IDs (which would be a trivial task, given they are all sequential) and forcefully withdraw all SubAccounts in the system. Additionally, `requestWithdrawAccount()` does not have a mechanism in place to check if a withdrawal request has already been placed; therefore, every consecutive call to `requestWithdrawAccount()` will simply reset and further extend the cooling down period.

Note, no funds are at risk as they would simply be transferred back to their original owner’s address.

## Recommendations

When calling `requestWithdrawAccount()`, perform a check to ensure `requestWithdrawAccount()` has been called first.

## Resolution

This issue has been resolved in commit `254e39b`.
