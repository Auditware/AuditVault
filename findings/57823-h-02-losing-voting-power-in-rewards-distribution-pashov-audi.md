---
tags:
  - lang/solidity
  - sector/governance
  - sector/perpetuals
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Hyperstable]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperstable-security-review_2025-03-19.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# [H-02] Losing voting power in rewards distribution

- id: 57823
- impact: HIGH
- protocol: Hyperstable_2025-03-19
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Hyperstable]]-security-review_2025-03-19.md

## Summary


The report discusses a bug in two contracts called `RewardsDistributor` and `TokenRewardsDistributor`. These contracts do not properly account for perpetual locks when calculating voting power and rewards. This means that users with perpetual locks are unable to claim their rewards, despite having an active and constant lock. The recommendation is to update the implementation to handle this issue.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Both `RewardsDistributor` and `TokenRewardsDistributor` contracts lack of properly account for perpetual locks in their voting power and rewards calculations. The contracts calculate voting power using the linear decay formula (`bias - slope * time`), which incorrectly handle the perpetual locks as that perpetual locks should maintain constant voting power over time.

This issue affects the following functions in both contracts:

- `ve_for_at()`
- `_checkpoint_total_supply()`
- `_claim()`
- `_claimable()`

Since perpetual locks are initialized with `bias = 0` and `slope = 0`, the current reward logic calculates `zero` voting power for them.

As a result, users with perpetual locks unable to claim their rewards, despite having an active and constant lock. The only way for such users to receive rewards is to first convert their perpetual lock into a normal lock.

## Recommendation

Update the implementation to handle the case for perpetual locks.
