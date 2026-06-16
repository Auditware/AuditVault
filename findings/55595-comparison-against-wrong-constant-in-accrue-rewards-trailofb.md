---
tags:
  - lang/rust
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Reserve Protocol Solana DTFs]]"
auditors:
  - Samuel Moelius
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Comparison against wrong constant in accrue_rewards

- id: 55595
- impact: HIGH
- protocol: Reserve Protocol Solana DTFs
- reporter: Samuel Moelius (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-04-reserve-solana-dtfs-securityreview.pdf

## Summary


The `accrue_rewards` instruction in the `folio` program has a bug that causes the block of code on line 227 to never be executed. This means that when the instruction is called with a caller that is not the user, the user does not receive any rewards. To fix this, the code on line 227 should be changed to check for a different value instead of `4`. In the future, it is recommended to avoid using constants and instead use named variables to prevent similar bugs from occurring.

## Details

## Error Reporting: High Difficulty

## Description
The `accrue_rewards` instruction compares the `remaining_account_divider` variable to the constant `4`. However, the variable can take only the values `5` or `7`. Hence, the block guarded by the comparison is never executed.

```rust
const REMAINING_ACCOUNT_DIVIDER_FOR_CALLER: usize = 5;
const REMAINING_ACCOUNT_DIVIDER_FOR_USER: usize = 7;
// ...
let remaining_account_divider = if ctx.accounts.user.key() ==
ctx.accounts.caller.key() {
    REMAINING_ACCOUNT_DIVIDER_FOR_CALLER
} else {
    REMAINING_ACCOUNT_DIVIDER_FOR_USER
};
// ...
// All the logic for the extra user if user != caller
if remaining_account_divider == 4 {
```
*Figure 7.1: Excerpt of `accrue_rewards.rs` (dtfs-solana/programs/folio/src/instructions/stake/accrue_rewards.rs#14–227)*

## Exploit Scenario
The `accrue_rewards` instruction is called with a caller that is not the user, indicating that the block beginning on line 227 should be executed. However, because of the incorrect comparison on line 227, the block is never executed. The caller accrues rewards, but the user does not.

## Recommendations
- **Short term:** Correct the code on line 227 of figure 7.1 to check for `REMAINING_ACCOUNT_DIVIDER_FOR_CALLER` rather than `4`. This will ensure that proper accounting occurs in `accrue_rewards`.

- **Long term:** Avoid using constants like on line 227 of figure 7.1. One risks losing track of all the places where the constant is used. A better approach is to give the constant a name and to use the name instead.
