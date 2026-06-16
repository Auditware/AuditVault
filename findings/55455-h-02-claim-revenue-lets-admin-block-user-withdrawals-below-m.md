---
tags:
  - severity/high
  - has/github
  - lang/rust
  - sector/dex
protocol: "[[DesciLaunchpad]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/DesciLaunchpad-security-review_2025-02-07.md"
genome:
  - "[[access-roles]]"
  - "[[access-control/centralization]]"
  - "[[dos/selective]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-circuit-breaker]]"
  - "[[precondition/privileged-caller]]"
  - "[[misassumption/admin-is-honest]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] `claim_revenue` lets admin block user withdrawals below min threshold

- id: 55455
- impact: HIGH
- protocol: DesciLaunchpad_2025-02-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/DesciLaunchpad-security-review_2025-02-07.md

## Summary


This bug report discusses an issue with the `claim_revenue` function in the `withdraw_token` feature. This function should not be executable if the revenue falls below the `min_threshold`, but currently, if the admin calls the function immediately after the sale ends, users are unable to withdraw their payment tokens. This is because the `withdraw_token` function requires the revenue to be less than `min_threshold` in order to enable withdrawals. This means that if the admin withdraws the revenue, users are unable to withdraw their payment tokens. Additionally, if a user withdraws some payment tokens, the admin is unable to call `claim_revenue` because the balance of `stats_pay_token` is lower than `token_stats.revenue`, causing the transfer to fail. To fix this issue, two potential solutions are recommended: either disable `claim_revenue` if the launchpad has not reached the minimum revenue threshold, or introduce a cooldown period for `claim_revenue` to give users time to withdraw their payment tokens before the admin can claim revenue.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `claim_revenue` function should not be executable if the revenue falls below the `min_threshold`. In this case, users are allowed to reclaim their payment tokens after the sale duration ends. However, if the admin calls the `claim_revenue` function immediately after the sale ends, users will no longer be able to withdraw their payment tokens via `withdraw_token`.

The `withdraw_token` function requires the revenue to be less than `min_threshold` to enable withdrawals, as shown in the code snippet below:

```rust
pub fn withdraw_token_handler(ctx: Context<WithdrawToken>) -> Result<()> {
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
```

If the admin withdraws the revenue, users will be unable to withdraw their payment tokens. Additionally, if a user withdraws some payment tokens, the admin will not be able to call `claim_revenue` because the balance of `stats_pay_token` will be lower than `token_stats.revenue`, causing the transfer to fail.

## Recommendations

Consider implementing one of the following fixes:

1. **Disable `claim_revenue` if the launchpad has not reached the minimum revenue threshold**, allowing only users to reclaim their payment tokens.
2. **Introduce a cooldown period for `claim_revenue`**, giving users time to withdraw their payment tokens before the admin can claim revenue. Modify `claim_revenue` to transfer only the remaining payment token balance in the `stats_pay_token` account.
