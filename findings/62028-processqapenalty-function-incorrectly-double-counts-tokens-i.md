---
tags:
  - severity/high
  - lang/solidity
  - platform/quantstamp
  - sector/staking
protocol: "[[Sapien   2]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# `processQAPenalty()` Function Incorrectly Double Counts Tokens in Cooldown

- id: 62028
- impact: HIGH
- protocol: Sapien - 2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html

## Summary

The client has marked the reported issue as "Fixed". The bug was found in the `SapienVault.sol` file and it involves the `_calculateApplicablePenalty()` function. The function incorrectly calculates the available tokens for penalties by adding the user's stake amount and cooldown amount. However, the cooldown amount is already included in the stake amount, leading to double counting and potential errors or failed penalty applications. The recommendation is to only use the stake amount for calculating penalties and to deduct any leftover tokens from both the stake amount and cooldown amount to ensure the contract's internal accounting remains accurate.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `56d63be892926ae9381098d467d0c235a1b660ad`.

**File(s) affected:**`SapienVault.sol`

**Description:** The `_calculateApplicablePenalty()` function incorrectly calculates available tokens for penalties by adding `userStake.amount + userStake.cooldownAmount`. However, `cooldownAmount` represents tokens that are already included in `amount` but are queued for unstaking. This double counting allows penalties to exceed the user's actual stake balance, potentially leading to accounting errors or failed penalty applications when the contract attempts to transfer more tokens than available.

**Recommendation:** Consider using only `userStake.amount` as the total available balance for penalties since `cooldownAmount` is a subset of this value, not an additional amount. In cases where the penalty amount is greater then `amount - cooldownAmount` the leftover tokens must be deducted from both `amount` and `cooldownAmount` to ensure the contract's internal accounting remains correct.
