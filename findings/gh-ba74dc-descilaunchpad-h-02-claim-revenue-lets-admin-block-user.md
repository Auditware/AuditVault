---
tags:
  - blockchain/solana
  - lang/rust
  - platform/pashov
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - sector/launchpad
protocol: "[[Descilaunchpad]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[access-roles]]"
---
[H-02]
claim_revenue lets admin block user
withdrawals below min threshold
High
Resolved
[M-01]
Prevent token claims if the minimum
threshold is not surpassed
Medium
Resolved
[L-01]
Incorrect check for > 0 buy amt
Low
Resolved
[L-02]
Missing maximum cooldown duration
validation
Low
Resolved
[L-03]
Unused is_lp_created flag
Low
Resolved
[L-04]
Missing toolchain version in
Anchor.toml
Low
Resolved
[L-05]
Use of transfer instead of
transfer_checked
Low
Resolved
[L-06]
All administrative keys are identical
Low
Acknowledged
[L-07]
State inconsistency due to solana
rollback
Low
Acknowledged
[L-08]
Missing validation for start_time and
end_time
Low
Resolved
6

8. Findings
8.1. Critical Findings
[C-01] Unclaimed tokens locked in
stats_token causing permanent fund loss
Severity
Impact: High
Likelihood: High
Description
In the claim_token  function, tokens are distributed to users based on the
proportion of tokens they purchased relative to the total claimed_supply . If
the claimed_supply  is less than the sale_supply , users receive a proportional
amount of claimed_supply  rather than the full sale_supply .
This is reflected in the following code snippet:
let adjusted_tokens = (
  (user_stats.tokens_purchased as f64 / token_stats.claimed_supply as f64)
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
Since the amount distributed from stats_token  is less than the sale_supply
originally transferred to the stats  account in deposit_token , as shown
7

below:
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
This results in the difference between sale_supply  and claimed_supply  being
locked indefinitely in the stats_token  account, causing a permanent loss of
funds for the protocol.
Recommendations
