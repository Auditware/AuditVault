---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Smoothly]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-08-01-Smoothly.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [C-02] Operator can still claim rewards after being removed from governance

- id: 26461
- impact: HIGH
- protocol: [[Smoothly]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-08-01-Smoothly.md

## Summary


A bug has been identified in the `deleteOperators` method, which is used when operators must be slashed. This bug leaves the `operatorRewards` mapping untouched when an operator is removed, meaning they can still claim their accrued rewards, even if they are acting maliciously or are inactive. This has a high impact on the PoolGovernance, as rewards shouldn't be claimable for operators that were removed. The likelihood of this happening is also high, as this will occur every time the functionality is used and an operator has unclaimed rewards. To fix this, it is recommended that the operator rewards are transferred to a chosen account, such as the `SmoothlyPool`, when an operator is removed.

## Details

**Severity**

**Impact:**
High, as rewards shouldn't be claimable for operators that were removed from governance

**Likelihood:**
High, as this will happen every time this functionality is used and an operator has unclaimed rewards

**Description**

The `deleteOperators` method removes an operator account from the `PoolGovernance` but it still leaves the `operatorRewards` mapping untouched, meaning even if an operator is acting maliciously and is removed he can still claim his accrued rewards. This shouldn't be the case, as this functionality is used when operators must be slashed. Also if an operator becomes inactive, even if he is removed, his unclaimed rewards will be stuck in the contract with the current implementation.

**Recommendations**

On operator removal transfer the operator rewards to a chosen account, for example the `SmoothlyPool`.
