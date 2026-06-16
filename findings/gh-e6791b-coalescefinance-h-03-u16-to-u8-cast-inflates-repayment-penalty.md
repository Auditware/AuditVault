---
tags:
  - blockchain/solana
  - lang/rust
  - sector/lending
  - sector/oracle
  - platform/pashov
  - severity/high
  - vuln/access-control/missing-modifier
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Coalescefinance]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[oracle-freshness]]"
  - "[[pda-derivation]]"
  - "[[pyth-oracle-completeness]]"
---
[H-03]
u16  to u8  cast inflates repayment penalty
fees
High
Resolved
[M-01]
Empty deposit reserve accounts array in whitelist-
only pools causes runtime error
Medium
Resolved
[M-02]
Blacklist bypass in 
process_withdraw_obligation_collateral()
Medium
Resolved
[M-03]
Inconsistent time precision in penalty calculations
Medium
Resolved
[M-04]
Single-borrower enforcement blocks whitelisted
non-owners from borrowing
Medium
Resolved
[M-05]
Fixed-term expiry bypass
Medium
Resolved
[M-06]
Platform pause guard missing across several
privileged instructions
Medium
Resolved
[M-07]
days_late  handling inconsistency in grace
period
Medium
Resolved
[M-08]
BorrowObligationLiquidity  lacks CoalesceFi
extension accounts
Medium
Resolved
Pashov Audit Group
Coalesce Finance Security Review
5 / 36

ID
Title
Severity
Status
[M-09]
InitObligation  account order error disrupts
instruction
Medium
Resolved
[M-10]
InitMultiPoolReserve  accounts fall short of
processor needs
Medium
Resolved
[M-11]
BorrowObligationLiquidity  account needs
mismatch processor logic
Medium
Resolved
[M-12]
CoalesceFi  instruction discriminants misroute
commands
Medium
Resolved
[M-13]
Platform pause checks can be skipped, leaving
sensitive ops enabled
Medium
Resolved
[M-14]
accrue_interest  neglects fixed rate settings
Medium
Resolved
[L-01]
u64::MAX borrowing disabled by input validation
Low
Resolved
[L-02]
Redundant can_borrow()  validation in borrow
operation
Low
Resolved
[L-03]
Unreachable auto-whitelist logic in 
process_init_reserve()
Low
Resolved
[L-04]
Hardcoded staleness threshold in pyth price
Low
Resolved
[L-05]
Incorrect platform pause check
Low
Resolved
[L-06]
Inconsistent token limit constant and lack of
validation in set_access_mode()
Low
Resolved
[L-07]
Duplicate borrow limit validation in 
process_borrow_obligation_liquidity()
Low
Resolved
[L-08]
Inefficient token limit validation in 
process_borrow_obligation_liquidity()
Low
Resolved
[L-09]
PoolOwnership  PDA owner not checked
Low
Resolved
[L-10]
platform_config.pool_reserve  remains none
Low
Resolved
[L-11]
Init reserve allows AC incomplete pools
Low
Resolved
[L-12]
Platform fee receiver update does not affect
existing reserves
Low
Resolved
[L-13]
Missing per-reserve access control PDA  enforces
global whitelist
Low
Resolved
[L-14]
Borrow flow requires whitelist for every user
Low
Resolved
Pashov Audit Group
Coalesce Finance Security Review
6 / 36

ID
Title
Severity
Status
[L-15]
ACCESS_MODE_NO_ACCESS  incorrectly grants
borrow privileges
Low
Resolved
Pashov Audit Group
Coalesce Finance Security Review
7 / 36

High findings
[H-01] Blacklisted users can withdraw via combined handler
Severity
Impact: High
Likelihood: Medium
Description
The combined handler 
process_withdraw_obligation_collateral_and_redeem_reserve_liquidity  ( program/
src/processor.rs:3645-3698 ) skips the UserState::is_blacklisted  guard that the
standalone withdrawal path runs before calling _withdraw_obligation_collateral . 
Reproduction outline: 1. Create a UserState  for a borrower and set is_blacklisted =
true .
2. Ensure the borrower has collateral deposited in an obligation, and the reserve still has
liquidity to redeem.
3. Invoke the WithdrawObligationCollateralAndRedeemReserveLiquidity  instruction,
supplying the usual accounts but omitting (or spoofing) the blacklist PDA.
4. The transaction succeeds:
- _withdraw_obligation_collateral  never sees a blacklist error because the caller
performed no pre-check.
- _redeem_reserve_collateral  immediately returns liquidity to the user. 
This allows globally blocked users to unwind positions and extract funds despite compliance
requirements mandating the block.
Recommendations
Mirror the standalone handler: look up get_user_state_address(program_id,
obligation_owner)  and reject when is_blacklisted  is true. 
Fail fast if the PDA is missing, owned by another program, or cannot be decoded. 
