---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-02] `giveReward()` does not update the stake balances

- id: 55485
- impact: HIGH
- protocol: Coinflip_2025-02-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md

## Summary


The `Staking` contract has a bug where the `giveReward()` function does not update the stake balance of a staker and the total staked amount. This results in other stakers' rewards being distributed to the staker receiving the reward. To fix this, the stake balance and total staked amount should be updated in the `giveReward()` function. This bug is considered to have a high impact and a medium likelihood of occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the `Staking` contract, the `giveReward()` function can be called by the owner or the manager to distribute the profit of a staker. However, this function does not update the stake balance of the staker and the total staked amount. As a result, a portion of other stakers' rewards will be distributed to the staker whose reward is being given.

## Recommendations

Update the stake balance of the staker and the total staked amount in the `giveReward()` function.
