---
tags:
  - severity/high
  - has/github
  - sector/dex
protocol: "[[Wild Protocol]]"
auditors:
  - Kann
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Wild Protocol.md"
genome:
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] LP Fees Unclaimable via launchV4Pool()

- id: 61781
- impact: HIGH
- protocol: Wild Protocol
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/Wild Protocol.md

## Summary


The bug report describes an issue with the launchV4Pool() function, which is used to create custom pools and graduate tokens. The problem is that this function does not call another function called setTokenParams(), which is necessary for configuring the LP locker and allowing fee claiming. This means that fees earned from the pool cannot be claimed, making the fee distribution logic useless for tokens created with launchV4Pool(). The team has responded that the issue has been fixed.

## Details


## Severity

High

## Description

The function launchV4Pool() allows custom pool creation and token graduation (with manually set ticks and spacing). However, it does not call lpLocker.setTokenParams(), which is required to configure the LP locker for fee claiming.

Without calling setTokenParams(), fees earned from the pool become unclaimable, rendering the fee distribution logic non-functional for tokens launched via launchV4Pool().

In contrast, the graduateToken() function does invoke lpLocker.setTokenParams(), meaning fee claiming only works when using that path. This makes the launchV4Pool() function incomplete and effectively useless for real-world deployments where fees matter.


## Team Response

Fixed.


