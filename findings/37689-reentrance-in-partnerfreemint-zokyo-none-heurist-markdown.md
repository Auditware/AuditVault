---
tags:
  - lang/solidity
  - sector/token
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Heurist]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[reentrancy-guard]]"
---
# Reentrance in `partnerFreeMint`

- id: 37689
- impact: HIGH
- protocol: [[Heurist]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-07-01-Heurist.md

## Summary


This bug report discusses a high severity issue that has been resolved. The `partnerFreeMint` function is not following the proper checks-effects-interactions pattern, which could lead to reentrancy attacks. This means that a contract could call back into the function and bypass the 24 hours limit before it is updated. The recommendation is to update the `lastMinted` mapping before calling the `_safeMint` function to prevent these attacks. The client has addressed the issue by adhering to the checks-effects-interactions pattern and has also added an extra layer of security by using the reentrancy guard modifier.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The `partnerFreeMint` function doesn’t implement the checks-effects-interactions pattern. The `_safeMint` function call occurs before updating the `lastMinted` mapping. If the to address is a contract, it could call back into the `partnerFreeMint` function, allowing re-entrance before `lastMinted` is updated and bypassing the 24 hours limit.

**Recommendation**: 

To prevent reentrancy attacks, update the `lastMinted` mapping before calling the `_safeMint` function.

**Fix**: Client addressed the issue in commit a27af000 by adhering to the checks-effects-interactions pattern. It is recommended though to add an extra layer of security by applying the reentrancy guard modifier to the function since the code base utilizes it already in other places of the codebase. 

**Update**: The client added the reentrancy guard modifier.
