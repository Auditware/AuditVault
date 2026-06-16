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
  - "[[cross-contract-state-consistency]]"
  - "[[frozen-funds]]"
  - "[[variant]]"
---
# [H-01] `withdraw_tokens` fails to adjust `claimed_supply` locking tokens permanently

- id: 55454
- impact: HIGH
- protocol: DesciLaunchpad_2025-02-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/DesciLaunchpad-security-review_2025-02-07.md

## Summary


This bug report discusses an issue with the `withdraw_tokens` function in a program that allows users to reclaim their payment tokens. The bug occurs when the function is used and the `min_threshold` is not met. In this case, the function does not update the `claimed_supply` or transfer the `tokens_purchased` back to the authority, resulting in the tokens being locked indefinitely. To fix this, the report recommends subtracting the `tokens_purchased` from the `claimed_supply` and transferring the corresponding amount back to the authority.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `withdraw_tokens` function allows users to reclaim their payment tokens if the `min_threshold` is not met. However, the function does not update `claimed_supply` or transfer `tokens_purchased` back to the authority to reflect the refunded amounts.

Since the user’s stats are marked as claimed, the corresponding `tokens_purchased` remain locked indefinitely.

For example, if a user has `tokens_purchased = 1000` and the `claimed_supply = 5000`, after withdrawal, and then he call the `withdraw_tokens` function and get his payment tokens back and only `4000` tokens can be claimed by others, while `1000` tokens remain permanently locked.

The relevant code snippet is shown below:

```rust
pub fn withdraw_token_handler(ctx: Context<WithdrawToken>) -> Result<()> {
    let token_stats = &mut ctx.accounts.token_stats;
    let user_stats: &mut Account<UserStats> = &mut ctx.accounts.user_stats;

    let curr_time = Clock::get()?.unix_timestamp;
    require!(
        token_stats.end_time < curr_time,
        RocketxLaunchpadError::InvalidWithdrawTime
    );
    require!(
        token_stats.is_launched,
        RocketxLaunchpadError::TokenNotLaunched
    );
    require!(
        !user_stats.is_claimed,
        RocketxLaunchpadError::TokenAlreadyClaimed
    );
    require!(
        token_stats.revenue < token_stats.min_threshold,
        RocketxLaunchpadError::InvalidThreshold
    );

    user_stats.is_claimed = true;

    let signer_seed = &[STATS_SEED, &[ctx.accounts.stats.bump]];

    let refund_amount = (((user_stats.tokens_purchased as f64)
        / (10u64.pow(token_stats.decimals as u32) as f64))
        * (token_stats.price_per_token as f64)) as u64;

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.stats_pay_token.to_account_info(),
                to: ctx.accounts.user_pay_token.to_account_info(),
                authority: ctx.accounts.stats.to_account_info(),
            },
            &[signer_seed],
        ),
        refund_amount,
    )?;

    Ok(())
}
```

## Recommendations

To properly reflect the token refund and prevent permanent token locking, consider the following mitigations:

1. **Subtract `tokens_purchased` from `claimed_supply`** when a user withdraws their payment tokens.
2. **Transfer the corresponding `tokens_purchased` amount back to the authority** to ensure the tokens are not locked indefinitely.
