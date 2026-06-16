---
tags:
  - blockchain/solana
  - lang/rust
  - sector/dex
  - sector/launchpad
  - platform/pashov
  - severity/high
  - impact/dos/permanent
  - novelty/known-pattern
  - check/pool-direct-transfer-dos
protocol: "[[Dub]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[pool-direct-transfer-dos]]"
---
[C-01] Sending PC tokens directly to pool_pc_token  account
leads to DOS
Severity
Impact: High
Likelihood: High
Description
Consider a scenario where the pool has successfully sold most of its PC tokens and accumulated a
significant amount of WSOL. At this point, the reserve ratio stands at 30,000,000 :
100,000,000,000 . A malicious user who initially purchased 30,000,000  PC tokens at a low price
during the early stages of the bonding curve can exploit this situation.
The first 30_000_000  will cost 1.387  Sol , which is a very low cost for the malicious user.
This malicious user can send those tokens directly to the pool_pc_account  without initiating a swap.
As a result, the following check in the migration function will always fail:
let pool_pc_balance = ctx.accounts.pool_token_pc.amount;
const MAX_POOL_PC_BALANCE: u64 = 30_000_000 * (10u64.pow(6)); 
assert!(pool_pc_balance < MAX_POOL_PC_BALANCE, "Migration can only happen 
when only 30mm tokens are left in the pool.");
Because the pool uses internal accounting for swaps, this donation of tokens does not affect the price
or the reserve ratio. The reserve ratio remains unchanged, as shown in the swap logic:
let a_reserves = ctx.accounts.pool.reserves_a;
let b_reserves = ctx.accounts.pool.reserves_b;
let output: u64 = if swap_a {
   ((input as u128) * (b_reserves as u128))
       .checked_div((a_reserves as u128) + (input as u128))
       .ok_or(BondingCurveError::Overflow)? as u64
} else {
   ((input as u128) * (a_reserves as u128))
       .checked_div((b_reserves as u128) + (input as u128))
       .ok_or(BondingCurveError::Overflow)? as u64
};

Since the constant product market maker (CPMM) mechanism makes it impossible to swap out the
entire token reserve, it becomes impossible to resume the migration. The migration function expects a
transfer of 30,000,000  PC tokens, which is now blocked due to the inflated token balance. This results
in a permanent and unrecoverable denial of service (DoS) to the migration process.
This issue can occur with various reserve ratios and only requires a donation of PC tokens, making
swaps of the pc_amount that will make the pool_pc_balance lower than the MAX_POOL_PC_BALANCE
prohibitively expensive or even impossible.
Recommendation
To prevent this manipulation, the check for the maximum pool PC balance should compare against
pool.reserves_b  instead of the actual balance of the pool. This change will ensure that token
donations do not interfere with the migration process and prevent a denial of service.
let pool_pc_balance = pool.reserves_a;
const MAX_POOL_PC_BALANCE: u64 = 30_000_000 * (10u64.pow(6)); 
assert!(pool_pc_balance < MAX_POOL_PC_BALANCE, "Migration can only happen 
when only 30mm tokens are left in the pool.");
[M-01] Lack of trading pause after migration
Severity
Impact: Medium
Likelihood: Medium
Description
In the migrate_cpmm  function, after a successful migration, trading is not paused. This creates a
vulnerability where any assets left in the pool can be permanently locked. Since the pool is not designed
to allow token withdrawal after migration and only allows swapping, any assets that will be traded in the
pool will be inaccessible to users, leading to a permanent lock of funds for those attempting to swap
after the migration.
Current migration function:
pub fn migrate_cpmm(
   ctx: Context<MigrateCPMM>,
) -> Result<()> {
   assert_eq!(ctx.accounts.pool.complete, true);
   assert_eq!(ctx.accounts.payer.key(), ctx.accounts.amm.migrator);
   ...

   let cpi_accounts = Burn {
       mint: ctx.accounts.amm_lp_mint.to_account_info(),
       from: ctx.accounts.user_token_lp.to_account_info(),
       authority: ctx.accounts.payer.to_account_info(),
   };
   let cpi_ctx: CpiContext<Burn> = 
CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
   token::burn(cpi_ctx, amount)?;
   Ok(())
}
If trading is not paused after migration, funds that remain in the pool post-migration will become
permanently locked. This issue can lead to significant financial losses for users who try to swap after
migration, as there will be no mechanism to withdraw funds from the pool.
Recommendations
1. Pause trading after migration: Add a flag to the pool structure, such as pool.trade_paused , and
set it to true  after the migration process is complete. This flag should be checked on every trade
attempt to prevent further swaps after migration.
2. Allow withdrawal after migration: Implement a mechanism to allow users to withdraw their funds
from the pool after the migration, ensuring that no assets are permanently locked.
Example modification:
pub fn migrate_cpmm(
   ctx: Context<MigrateCPMM>,
) -> Result<()> {
   assert_eq!(ctx.accounts.pool.complete, true);
   assert_eq!(ctx.accounts.payer.key(), ctx.accounts.amm.migrator);
   // Pause trading after migration
   ctx.accounts.pool.trade_paused = true;
   let cpi_accounts = Burn {
       mint: ctx.accounts.amm_lp_mint.to_account_info(),
       from: ctx.accounts.user_token_lp.to_account_info(),
       authority: ctx.accounts.payer.to_account_info(),
   };
   let cpi_ctx: CpiContext<Burn> = 
CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
   token::burn(cpi_ctx, amount)?;
