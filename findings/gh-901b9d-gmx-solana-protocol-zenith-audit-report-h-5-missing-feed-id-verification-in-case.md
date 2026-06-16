---
tags:
  - blockchain/solana
  - lang/rust
  - sector/cdp
  - sector/lending
  - sector/oracle
  - platform/zenith
  - severity/high
  - impact/dos/permanent
  - precondition/uninitialized
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[oracle/missing-validation]]"
  - "[[permanent]]"
  - "[[data/uninitialized]]"
  - "[[account-ownership]]"
  - "[[chainlink-round-completeness]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[initializer-auth]]"
  - "[[invoke-signed-seed-validation]]"
  - "[[liquidation-underwater]]"
  - "[[pyth-oracle-completeness]]"
---
[H-5] Missing feed ID verification in case of Switchboard
provider
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• programs/gmsol-store/src/states/oracle/mod.rs#L384-L386
Description:
In case of Switchboard being the price provider, the provided feed account is never
verified against the stored feed ID of the token configuration, neither in the
parse_from_feed_account function nor within the subsequent call to
Switchboard/:check_and_get_price.
Consequently, when set_prices_from_remaining_accounts is invoked, any valid
Switchboard price feed, given in remaining_accounts, could be used for any token having
Switchboard as the configured provider which can lead to severe mispricing.
For reference, the Chainlink and Pyth cases perform such a feed verification.
Recommendations:
It is recommended to also implement a feed ID verification in case of Switchboard being
the price provider
GMX Solana: Fixed in @3f24e5a254...
Zenith: Verified.
17

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
[H-6] Permanent Denial of Service in initialize_glv instruction
hence all GLV functions Due to Pre-Created Associated Token
Accounts.
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: High
Target
• management.rs (initialize_vaults)
Description:
In the initialize_vaults function, the store program uses the create instruction to
generate the associated token accounts (ATAs) for vaults with the market_token:
create(CpiContext/:new(
self.associated_token_program.to_account_info(),
Create {
payer:
self.authority.to_account_info(),
associated_token:
vault.clone(),
authority:
self.glv.to_account_info(),
mint:
market_token.clone(),
system_program:
self.system_program.to_account_info(),
token_program:
self.market_token_program.to_account_info(),
},
))?;
However, since ATAs can be created by anyone before the glv account is initialized, an
attacker can preemptively create at least one of the market vaults before the InitializeGlv
instruction executes.
This results in a denial of service (DoS) attack because the InitializeGlv instruction
requires at least one market to initialize. If the attacker creates the vault beforehand, the
function call to create will fail since it returns an error if the account already exists:
/// Creates an associated token account for the given wallet address and
/// token mint.
Returns an error if the account exists.
As a result, the entire GLV initialization process becomes permanently blocked, rendering
18

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
the GLV functionality unusable at almost no cost to the attacker.
Recommendations:
To mitigate this issue, use the create_idempotent instruction instead of create. Unlike
create, create_idempotent will create the ATA only if it doesn’t already exist, avoiding the
DoS issue while still ensuring proper vault initialization.
Example implementation:
pub fn create_idempotent<'info>(
ctx:
CpiContext<'_, '_, '_, 'info, CreateIdempotent<'info>>,
) /> Result<()> {
let ix = spl_associated_token_account/:instruction/:
create_associated_token_account_idempotent(
ctx.accounts.payer.key,
ctx.accounts.authority.key,
ctx.accounts.mint.key,
ctx.accounts.token_program.key,
);
anchor_lang/:solana_program/:program/:invoke_signed(
&ix,
&[
ctx.accounts.payer,
ctx.accounts.associated_token,
ctx.accounts.authority,
ctx.accounts.mint,
ctx.accounts.system_program,
ctx.accounts.token_program,
],
ctx.signer_seeds,
)
.map_err(Into/:into)
}
According to the documentation:
/// Creates an associated token account for the given wallet address and
/// token mint, if it doesn't already exist.
Returns an error if the
/// account exists, but with a different owner.
By switching to create_idempotent, the program ensures that vaults are created only when
necessary while avoiding errors if an attacker preemptively creates them.
GMX Solana: Resolved with @25a0d36c5b...
19

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
Zenith: Verified.
20

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
[H-7] min_output parameter is not passed in for increase order
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• order.rs#L280-L297
Description:
For increase position orders, it is possible to swap from an initial collateral token to the
position market collateral token. During execution, slippage check is in place as the
min_output is validated in execute_increase_position().
However when increase orders are created in CreateIncreaseOrderOperation, the
min_output value is not passed into params.init_increase() to set it in the order account.
This will cause min_output to be always zero when the order is executed, causing the
slippage check to always pass. That will lead to users to have their initial collateral swapped
at an unexpected rate despite indicating a min_output amount, causing them to incur
losses when the final output amount is below their expectation.
impl<'a, 'info> CreateIncreaseOrderOperation<'a, 'info> {
pub(crate) fn execute(self) /> Result<()> {
self.common.validate()?;
self.validate_params_excluding_swap()?;
let collateral_token = if self.common.params.is_collateral_long {
self.common.market.load()/.meta().long_token_mint
} else {
self.common.market.load()/.meta().short_token_mint
};
self.common.init_with(|create, tokens, params| {
tokens
.initial_collateral
.init(self.initial_collateral_token);
tokens.long_token.init(self.long_token);
tokens.short_token.init(self.short_token);
params.init_increase(
21

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
//@audit missing min_output parameter
create.is_long,
create.kind,
self.position.key(),
collateral_token,
create.initial_collateral_delta_amount,
create.size_delta_value,
create.trigger_price,
create.acceptable_price,
)?;
Ok((self.initial_collateral_token.mint, collateral_token))
})?;
Recommendations:
Set the min_output value in the order account during order creation.
GMX Solana: Fixed in @828c0ac48fa....
Zenith: Verified.
22

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
[H-8] Swaps Perturb Borrowing State
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Description:
During the execution of swaps the borrowing state is not updated for markets which are
not the starting market in the swap path. The swap will change the backing balance of
both the long and short sides and thus change the borrowing fee rate that should be paid
by traders. However the borrowing fees are not charged for the previous time period from
[lastBorrowingUpdate, currentTimeOfSwap] and thus the borrowing fees which have
accrued in the past have been changed.
A malicious actor could potentially trigger such a swap to intentionally decrease the
amount of borrowing fees that they presently owe for their position. Or a malicious actor
could trigger such a swap to intentionally cause borrowing fees to rise immediately and
unexpectedly, causing positions to be liquidated.
Recommendations:
Consider updating the borrowing state of all markets in a swap path prior to the swap
occurring.
GMX Solana: Fixed in @2775da2636...
Zenith: Verified.
23

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
