---
tags:
  - lang/solidity
  - sector/gaming
  - sector/staking
  - has/github
  - severity/high
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
---
# [C-01] Check for `Staking` liquidity in `flip()` does not account for other game contracts

- id: 55482
- impact: HIGH
- protocol: Coinflip_2025-02-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md

## Summary


This bug report describes a problem with the `Flip.flip()` function, which checks if the `Staking` contract has enough funds to cover a player's reward in case of a win. However, it does not take into account that other game contracts may also have funds locked in the `Staking` contract. This can cause the total locked liquidity among all game contracts to exceed the `Staking` contract's balance, preventing it from covering all rewards in case of a win. The recommended solution is to modify the `flip()` function to also check the total locked liquidity of all game contracts, not just the current one.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

`Flip.flip()` checks that the `Staking` contract has enough funds to cover the player's reward in the case of a win. However, it is not taken into account that other game contracts might have also funds locked in the `Staking` contract.

As a result, the total liquidity locked among all game contracts might exceed the total balance of the `Staking` contract, which would cause the `Staking` contract not to be able to cover all the rewards in the case of a win.

## Recommendations

In the `flip()` function check that the `Staking` contract balance is enough to cover the locked liquidity of all game contracts and not just the locked liquidity of the current game contract.
