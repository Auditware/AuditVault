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
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# Smart contract owner is able to disable claiming of Arkouda token rewards.

- id: 56422
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report is about a function called "flipArkoudaClaimStatus" in a program called "Arkouda.sol". The report suggests that restrictions should be added to this function to control when users can claim rewards in the form of "Arkouda tokens". This will help prevent any issues with the claiming process.

## Details

**Description**

Arkouda.sol, flipArkoudaClaimStatus

**Recommendation**:

Add restrictions when Arkouda tokens reward claiming should be stopped.
