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
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# User can claim rewards before the start.

- id: 56419
- impact: HIGH
- protocol: [[Cwbc]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-02-27-CWBC.md

## Summary


The bug report is about a function called claimReward() in the Arkouda.sol file. The problem is that the function does not check for a specific condition, which means that users are able to claim tokens even before the rewards have started. This is because the variable rewardGenerationStartTime is not properly checked and is set separately from the main functionality. The recommendation is to review the code and add the necessary conditions to fix this issue. 

## Details

**Description**

Arkouda.sol, claimReward()
rewardGenerationStartTime is not checked against 0, thus the condition in function is always
true, and the user gets the ability to claim tokens before rewards start. Especially because
rewardGenerationStartTime is set independently from main functionality.
**Recommendation**:
Review the functionality and add necessary conditions.
