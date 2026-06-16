---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/oracle
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# [H-09] OmoAgent: `getPositionValue()` doesn't consider deposited assets

- id: 53327
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The bug report is about a high severity issue that affects the accuracy of calculating total assets in the `OmoVault` contract. The `totalAssets()` function calls `getPositionValue()` to calculate the total assets, but the `getPositionValue()` function does not include the value of deposited assets, leading to incorrect calculations and potential loss of funds for users. The recommendation is to modify the `getPositionValue()` function to include the value of deposited assets when calculating the total position value.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Function `totalAssets()` calls `getPositionValue()` for all the dynamic accounts to calculate the total assets. In the `OmoAgent` contract, the `getPositionValue()` function does not take into account the deposited assets when calculating the position value. This leads to an incorrect calculation of `totalAssets()` in `OmoVault`, which can result in potential loss of funds for users due to inaccurate asset tracking.  
**Note**: agents can deposit assets (not just positions) into `OmoAgent` by `depositAssets()` function

## Recommendations

Modify `getPositionValue()` to include the value of deposited assets when computing the total position value.
