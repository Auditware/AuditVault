---
tags:
  - lang/rust
  - sector/restaking
  - sector/staking
  - platform/ottersec
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[ComposableFi]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.picasso.network/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Inaccurate Reward Calculation

- id: 47370
- impact: HIGH
- protocol: [[ComposableFi]]
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.picasso.network/

## Summary


The bug report is about a problem with the "withdrawal_request" function in a program called "restaking". The issue is that the "last_received_rewards_height" parameter of "vault_params" is not being updated to the current height after rewards are calculated and transferred. This can cause problems if a user cancels a withdrawal request and then requests a withdrawal again, as the function will use outdated information to calculate rewards. The suggested solution is to update the "last_received_rewards_height" parameter to the current height within the "withdrawal_request" function. This issue has been fixed in a patch by updating the parameter in line 69bba3.

## Details

## Withdrawal Request Issue

In `withdrawal_request`, the `last_received_rewards_height` parameter of `vault_params` is not updated to the `current_height` after rewards are calculated and transferred.

> _restaking/programs/restaking/src/lib.rs_

```rust
pub fn withdrawal_request(ctx: Context<WithdrawalRequest>) -> Result<()> {
    let vault_params = &mut ctx.accounts.vault_params;
    let staking_params = &mut ctx.accounts.staking_params;
    let stake_token_mint = ctx.accounts.token_mint.key();
    [...]
    vault_params.withdrawal_request = Some(withdrawal_request_params);
    [...]
}
```

If a user cancels a withdrawal request and later requests withdrawal again, the function erroneously considers the `last_received_rewards_height` as the height when the last rewards were claimed, rather than the height when the last withdrawal request was raised. This affects the reward calculation as it will be based on outdated information.

## Remediation

Update the `last_received_rewards_height` parameter to the current height after rewards are calculated and transferred within `withdrawal_request`.

## Patch

Fixed by updating the `last_received_rewards_height` parameter accordingly in commit `69bba3`.

© 2024 Otter Audits LLC. All Rights Reserved. 10/20
