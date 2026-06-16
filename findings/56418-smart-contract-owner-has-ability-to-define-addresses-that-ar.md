---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/staking
protocol: "[[Cwbc]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md"
genome:
  - "[[missing-modifier]]"
  - "[[access-roles]]"
  - "[[direct-drain]]"
---
# Smart contract owner has ability to define addresses that are able to burn anyone's tokens.

- id: 56418
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The report is about a bug related to the Arkouda.sol code, specifically the functions setAllowedAddresses and burn. The bug is causing an issue where only certain addresses are able to burn tokens, rather than allowing anyone to burn their own tokens. The recommendation is to fix this bug by making sure that both whitelisted addresses and regular addresses have the ability to burn their own tokens.

## Details

**Description**

Arkouda.sol, setAllowedAddresses & burn
**Recommendation**:
Whitelisted or anyone should be able to burn only their own tokens.
