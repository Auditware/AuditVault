---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Trustswap]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-TrustSwap.md"
genome:
  - "[[missing-modifier]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Use of arbitrary token addresses.

- id: 57520
- impact: HIGH
- protocol: [[Trustswap]]
- reporter: ZOKYO (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-08-08-TrustSwap.md

## Summary


This report discusses a bug in the LockToken contract, specifically in the functions lock Tokens(), lockNFTs(), and migrate(). These functions are public and allow users to pass in token addresses as parameters. This can create a vulnerability for malicious tokens. The recommendation is to add token whitelisting to validate the token addresses provided by users. The TrustSwap team has verified this issue and suggests using the nonReentrant modifier in all functions with token addresses to prevent critical vulnerabilities.

## Details

**Description**

LockToken.sol: functions lock Tokens(), lockNFTs(), migrate(). These functions are public, and any token addresses are passed in their parameter lists. This creates a vulnerability for the use of malicious tokens.

**Recommendation**

Add token whitelisting to validate any token addresses provided by users.

**Re-audit comment**

Verified.

Post audit:

TrustSwap team verified that this is an intended logic and users should be able to use arbitrary token addresses. Yet, usage of nonReentrant modifier in all functions with token address should be enough to mitigate any critical vulnerabilities.
