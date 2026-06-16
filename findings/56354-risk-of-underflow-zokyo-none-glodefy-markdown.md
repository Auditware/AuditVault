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
protocol: "[[Glodefy]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Risk of underflow.

- id: 56354
- impact: HIGH
- protocol: [[Glodefy]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-01-26-GlodeFy.md

## Summary


The bug report is about a problem with a specific line of code (Line 579) in a file called StakingB_1.sol. The issue is that users are able to use a function called "unstake" even if they don't have anything to unstake. This can cause a problem with a variable called "amountOfUsers" and prevent other users from being able to unstake. The recommendation is to check if a certain variable has been deleted before decreasing another variable.

## Details

**Description**

StakingB_1.sol Line 579
Each user can use the unstake function even if they have nothing to unstake, so everyone can
decrease the “amountOfUsers” variable that can cause an underflow and won’t allow other
users to unstake.

**Recommendation**:

Check if “userInfo[msg.sender]” has not been already deleted before decreasing an
“amountOfUsers”.
