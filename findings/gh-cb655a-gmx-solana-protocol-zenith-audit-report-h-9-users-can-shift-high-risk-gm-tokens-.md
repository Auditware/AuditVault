---
tags:
  - blockchain/solana
  - lang/rust
  - sector/oracle
  - sector/perpetuals
  - platform/zenith
  - severity/high
  - novelty/known-pattern
protocol: "[[GMX]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-check]]"
  - "[[indirect-loss]]"
  - "[[known-pattern]]"
  - "[[liquidation-underwater]]"
---
[H-9] Users can shift high-risk GM tokens by bypassing the
maximum PNL check
SEVERITY: High
IMPACT: High
STATUS: Resolved
LIKELIHOOD: Medium
Target
• gmsol-store/src/ops/glv.rs
Description:
When a GLV deposit is executed, is_market_deposit_required is true only when the user
provides either a short or long amount of tokens. In unchecked_deposit, there is a check to
ensure that the max PNL was not exceeded during the deposit.
The issue is that the PNL check can be skipped if the user deposits only market tokens; a
user could make a deposit when the open interest exceeds the max PNL that was set (and
thus when new deposits should be disabled) to withdraw from a high risk market through a
low risk market (which is normally prohibited through other paths, such as direct shifts or
withdraw-deposit).
Recommendations:
Consider checking that the max PNL is not exceeded when the user deposits market
tokens:
let mt = self.market_token_mint.clone();
let mut market = RevertibleLiquidityMarketOperation/:new(
&self.store,
self.oracle,
&self.market,
self.market_token_mint,
self.token_program.clone(),
Some(&deposit.swap),
self.remaining_accounts,
self.event_emitter,
)?;
let mut op = market.op()?;
24

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
if market_token_amount /= 0 {
let prices = self.oracle.market_prices(op.market())?;
self.market.load()/.as_liquidity_market(&mt).validate_max_pnl(
&prices,
PnlFactorKind/:MaxAfterWithdrawal,
PnlFactorKind/:MaxAfterWithdrawal,
).map_err(|_| error!(CoreError/:PnlFactorExceeded))?;
}
if deposit.is_market_deposit_required() {
let executed = op.unchecked_deposit(
&deposit.header().receiver(),
&self.market_token_vault,
&deposit.params.deposit,
(
deposit.tokens.initial_long_token.token(),
deposit.tokens.initial_short_token.token(),
),
None,
)?;
market_token_amount = market_token_amount
.checked_add(executed.output)
.ok_or_else(/| error!(CoreError/:TokenAmountOverflow))?;
op = executed.with_output(());
}
GMX Solana: Fixed in @2a66761d65...
Zenith: Verified.
25

GMX SOLANA PROTOCOL
SMART CONTRACT SECURITY ASSESSMENT
VERSION 1.1
4.2
Medium Risk
A total of 23 medium risk findings were identified.
[M-1] gt_set_exchange_time_window() could cause mis-pricing
of GT exchange
SEVERITY: Medium
IMPACT: Medium
STATUS: Resolved
LIKELIHOOD: Medium
Target
• /programs/gmsol-store/src/instructions/gt.rs#L124-L134
Description:
gt_set_exchange_time_window() can be used to change the time_window that determines
the time_window_index for the gt_exchange_vault.
However, that will prevent the depositing of token into gt_bank using
deposit_treasury_vault() to increase gt_bank balance for buyback, due to the
constraints that requires store.load()/.gt().exchange_time_window() as i64 /=
gt_exchange_vault.load()/.time_window().
Due to the issue, gt_bank could have insufficient buy back value, causing the users who
had requested GT exchange to receive a low price for their GT.
Recommendations:
gt_set_exchange_time_window() should check there are no unconfirmed
gt_exchange_vault before updating the exchange_time_window.
That means gt_set_exchange_time_window() should be called after all gt_exchange_vault
are confirmed and before the next
prepare_gt_exchange_vault() is called.
GMX Solana: Fixed in @ea5066412...
Zenith: Verified. Resolved by making gt_set_exchange_time_window() a test-only function
and removed it from deployment build.
26

GMX SOLANA PROTOCOL
