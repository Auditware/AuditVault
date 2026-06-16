---
tags:
  - lang/rust
  - has/github
  - severity/high
  - sector/dex
protocol: "[[DesciLaunchpad]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/DesciLaunchpad-security-review_2025-02-07.md"
genome:
  - "[[reward-accounting]]"
  - "[[direct-drain]]"
---
# [C-01] Unclaimed tokens locked in `stats_token` causing permanent fund loss

- id: 55453
- impact: HIGH
- protocol: DesciLaunchpad_2025-02-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/DesciLaunchpad-security-review_2025-02-07.md

## Summary


This bug report describes a problem in the `claim_token` function where users receive a proportional amount of tokens instead of the full amount if the `claimed_supply` is less than the `sale_supply`. This results in a permanent loss of funds for the protocol as the remaining tokens are locked in the `stats_token` account. To fix this, the report suggests implementing a solution to transfer the surplus tokens back to the authority account or modifying the `claim_revenue` function to account for the difference.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

In the `claim_token` function, tokens are distributed to users based on the proportion of tokens they purchased relative to the total `claimed_supply`. If the `claimed_supply` is less than the `sale_supply`, users receive a proportional amount of `claimed_supply` rather than the full `sale_supply`.

This is reflected in the following code snippet:

```rust
let adjusted_tokens = ((user_stats.tokens_purchased as f64 / token_stats.claimed_supply as f64)
    * (token_stats.sale_supply.min(token_stats.claimed_supply) as f64))
    as u64;

transfer(
    CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.stats_token.to_account_info(),
            to: ctx.accounts.user_token.to_account_info(),
            authority: ctx.accounts.stats.to_account_info(),
        },
        &[signer_seed],
    ),
    adjusted_tokens,
)?;
```

Since the amount distributed from `stats_token` is less than the `sale_supply` originally transferred to the `stats` account in `deposit_token`, as shown below:

```rust
pub fn deposit_token_handler(ctx: Context<DepositToken>) -> Result<()> {
    let token_stats = &mut ctx.accounts.token_stats;
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.authority_token.to_account_info(),
                to: ctx.accounts.stats_token.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        ),
        token_stats.sale_supply,
    )?;
```

This results in the difference between `sale_supply` and `claimed_supply` being locked indefinitely in the `stats_token` account, causing a permanent loss of funds for the protocol.

## Recommendations

To mitigate this issue, consider implementing one of the following solutions:

1. Introduce a function to transfer the difference between `sale_supply` and `claimed_supply` back to the authority account if any surplus exists.
2. Modify the `claim_revenue` function to account for this difference and transfer the remaining tokens accordingly.
