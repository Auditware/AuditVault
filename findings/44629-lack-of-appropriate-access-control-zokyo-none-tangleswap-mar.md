---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/dex
protocol: "[[Tangleswap]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-04-27-Tangleswap.md"
genome:
  - "[[missing-modifier]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
---
# Lack of appropriate access control

- id: 44629
- impact: HIGH
- protocol: [[Tangleswap]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-04-27-Tangleswap.md

## Summary


The bug report states that the initAuctionLauncher() function does not have proper access controls, allowing anyone to call it and become an admin. It is recommended that the function is only called by the address that deployed the PostAuctionLauncher to improve security and reduce potential errors. The bug has been resolved.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The initAuctionLauncher() function lacks appropriate access controls. Anyone can call this initAuctionLauncher() function and initialize himself as an admin. 

**Recommendation**: 

It is advised that initAuctionLauncher is called only by the address that has deployed the PostAuctionLauncher rather than relying on quickly calling this init function after deployment of the contract. This will add more security to the initialization step and will reduce any chances of unwanted errors.
