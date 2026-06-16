---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - novelty/variant
  - sector/launchpad
protocol: "[[Pump]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
[H-01]
Front-running on the migration
process
High
Resolved
[M-01]
Insufficient Token Handling in buy()
Medium
Resolved
[L-01]
Virtual Reserves must exceed or
match Real Reserves
Low
Resolved
[L-02]
Rounding down of fees in get_fee()
Low
Resolved
[L-03]
State inconsistency due to Solana
rollback
Low
Acknowledged
[L-04]
Default withdraw authority will cause
loss of funds during the migration
Low
Acknowledged
[L-05]
Pool migration fee is under
constrained
Low
Resolved
[L-06]
Missing production program ID
Configuration
Low
Acknowledged
[L-07]
Add validation check for duplicate
authority
Low
Acknowledged
[L-08]
Tokens can be donated before
migration to reduce the listing price
after migration
Low
Acknowledged
[L-09]
Missing checked arithmetic
operations on the lib
Low
Resolved
[L-10]
Bonding can be delayed indefinitely
Low
Acknowledged
[L-11]
Extend account can be called to
unnecessarily waste native tokens
Low
Resolved
6

8. Findings
8.1. High Findings
[H-01] Front-running on the migration
process
Severity
Impact: High
Likelihood: Medium
Description
An attacker can front-run the migration transaction by sending a small amount
of token to the pool_authority_mint_account , which can cause the account
closure to fail and disrupt the entire migration process.
Relevant code:
fund_pool_authority_mint_account_from_associated_bonding_curve(&ctx)?;
  
         let sol_amount = ctx.accounts.bonding_curve.real_sol_reserves - pool_migratio
    fund_pool_authority_wsol_account_from_bonding_curve(&ctx, sol_amount)?;
    create_pool(&ctx, sol_amount)?;
    close_token_account(
        &ctx,
        ctx.accounts.pool_authority_mint_account.to_account_info(),
    )?;
The attack scenario is as follows:
1. An attacker submits their own transaction to send a dust amount to a pre-
created pool_authority_mint_account .
2. If the attacker's transaction is processed before the migration transaction,
pool_authority_mint_account  will have a non-zero balance.
7

3. When the migration transaction executes, the operation will fail because the
account has a non-zero balance.
Recommendations
Implement Balance Check and Sweep: At the beginning of the migration
process, check the balance of pool_authority_mint_account  and sweep any
unexpected funds to a designated address. For example:
let unexpected_balance = ctx.accounts.pool_authority_mint_account.amount;
