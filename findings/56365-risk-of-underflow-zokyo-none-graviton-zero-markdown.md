---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Graviton Zero]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Risk of underflow

- id: 56365
- impact: HIGH
- protocol: [[Graviton Zero]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-Graviton Zero.md

## Summary


The bug report is about a problem in a code called StakingB_1.sol on line 579. The issue is that users are able to use the unstake function even when they have nothing to unstake. This causes a decrease in the "amountOfUsers" variable, which can lead to an underflow and prevent other users from unstaking. The recommendation is to check if the user's information has already been deleted before decreasing the "amountOfUsers" variable. This will prevent the bug from happening.

## Details

**Description**

StakingB_1.sol Line 579
Each user can use the unstake function even if they have nothing to unstake, so everyone can
decrease the “amountOfUsers” variable that can cause an underflow and won’t allow other
users to unstake.

**Recommendation**:

Check if “userInfo[msg.sender]” has not been already deleted before decreasing an
“amountOfUsers”.
