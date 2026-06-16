---
tags:
  - blockchain/solana
  - lang/rust
  - sector/lending
  - platform/pashov
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Coalescefinance]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[precision-loss]]"
  - "[[indirect-loss]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
---
[H-02] penalty_amount  incorrectly used as principal repayment
Severity
Impact: High
Likelihood: Medium
• 
• 
Pashov Audit Group
Coalesce Finance Security Review
8 / 36

Description
let CalculateRepayResult {
settle_amount,
repay_amount,
} = repay_reserve.calculate_repay(
@>
liquidity_amount.saturating_add(penalty_amount),
liquidity.borrowed_amount_wads,
)?;
pub fn calculate_repay(
&self,
amount_to_repay: u64,
borrowed_amount: Decimal,
) -> Result<CalculateRepayResult, ProgramError> {
let settle_amount = if amount_to_repay == u64::MAX {
@>
borrowed_amount
} else {
@>
Decimal::from(amount_to_repay).min(borrowed_amount)
};
let repay_amount = settle_amount.try_ceil_u64()?;
Ok(CalculateRepayResult {
settle_amount,
repay_amount,
})
}
Inside process_repay_obligation_liquidity  ( program/src/
processor.rs:3256-3262 ), penalty_amount  is added to liquidity_amount  before
calling calculate_repay . The resulting amount_to_repay  feeds both settle_amount
and repay_amount , so obligation.repay()  subtracts the penalty from the principal. If
the penalty exceeds the outstanding debt, it is clipped by min(amount_to_repay,
borrowed_amount)  and effectively never collected. The SPL token transfer later sends only 
repay_amount , with no separate movement for the penalty, confirming it is not charged
independently.
Recommendations
Split the flows: compute principal repayment solely from liquidity_amount , transfer 
penalty_amount  separately to the designated recipient, and ensure it does not reduce the
obligation’s principal. 
[H-03] u16  to u8  cast inflates repayment penalty fees
Severity
Impact: High
Likelihood: Medium
Pashov Audit Group
Coalesce Finance Security Review
9 / 36

Description
calculate_repayment_penalty  casts the u16  basis-point values returned by 
PoolRateConfig::get_early_penalty()  / get_late_penalty()  down to u8  before
calling Decimal::from_percent  ( program/src/processor.rs:345  and :354 ). 
let penalty_rate = Decimal::from_percent(pool_config.get_early_penalty() as u8);
Any penalty above 255 bps wraps during the u16 →u8  cast-e.g., 1000 bps becomes
232 bps and is applied as 2.32%, while 500 bps becomes 2.44%. Borrowers are drastically
overcharged, and the computation risks overflow, breaking repayment flows.
Recommendations
Preserve the full u16  precision when building the penalty rate: add a safe helper that
converts basis points to Decimal  (divide by 10,000 or use an explicit from_bps  API) and
call it from calculate_repayment_penalty  instead of casting to u8 . Add regression tests
with penalties above 255 bps to guarantee no future precision loss.
Pashov Audit Group
Coalesce Finance Security Review
10 / 36

Medium findings
[M-01] Empty deposit reserve accounts array in whitelist-only pools
causes runtime error
Severity
Impact: High
Likelihood: Low
Description
The process_borrow_obligation_liquidity()  incorrectly passes an empty array
to update_borrow_attribution_values()  when loan_to_value_ratio = 0  (whitelist-
only pools), potentially causing runtime errors and incorrect attribution calculations.
When loan_to_value_ratio = 0  (whitelist-only pools), the code incorrectly assumes no
deposit reserve accounts are needed, even when the obligation has existing deposits that
require attribution updates. This causes runtime errors in whitelist-only pools with existing
deposits.
// Lines 2998-3010
let deposit_reserve_accounts = if reserve_loan_to_value_ratio > 0 && accounts.len() > 14 {
// Overcollateralized pool - deposit reserves expected
&accounts[14..]
} else {
// Whitelist-only pool (0% LTV) - no deposit reserves needed
&[]
// ← PROBLEM: Empty array even when deposits exist
};
// Lines 3011-3015
let (open_exceeded, _) = update_borrow_attribution_values(
&mut obligation,
