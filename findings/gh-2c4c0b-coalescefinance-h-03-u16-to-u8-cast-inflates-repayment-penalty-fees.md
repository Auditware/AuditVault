---
tags:
  - blockchain/solana
  - lang/rust
  - sector/account
  - sector/lending
  - sector/oracle
  - platform/pashov
  - severity/high
  - novelty/variant
protocol: "[[Coalescefinance]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[overflow]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[oracle-freshness]]"
  - "[[pda-derivation]]"
  - "[[pyth-oracle-completeness]]"
---
[H-03] u16  to u8  cast inflates repayment penalty fees
............................................................
Medium findings
............................................................................................................................................
[M-01] Empty deposit reserve accounts array in whitelist-only pools causes runtime error
...............
[M-02] Blacklist bypass in process_withdraw_obligation_collateral()
.....................................
[M-03] Inconsistent time precision in penalty calculations
...........................................................
[M-04] Single-borrower enforcement blocks whitelisted non-owners from borrowing
......................
[M-05] Fixed-term expiry bypass
.............................................................................................
[M-06] Platform pause guard missing across several privileged instructions
...................................
[M-07] days_late  handling inconsistency in grace period
.........................................................
[M-08] BorrowObligationLiquidity  lacks CoalesceFi extension accounts
....................................
[M-09] InitObligation  account order error disrupts instruction
................................................
[M-10] InitMultiPoolReserve  accounts fall short of processor needs
.........................................
[M-11] BorrowObligationLiquidity  account needs mismatch processor logic
..............................
[M-12] CoalesceFi  instruction discriminants misroute commands
..............................................
[M-13] Platform pause checks can be skipped, leaving sensitive ops enabled
.................................
[M-14] accrue_interest  neglects fixed rate settings
................................................................
Low findings
..................................................................................................................................................
[L-01] u64::MAX borrowing disabled by input validation
.............................................................
[L-02] Redundant can_borrow()  validation in borrow operation
.................................................
[L-03] Unreachable auto-whitelist logic in process_init_reserve()
...........................................
[L-04] Hardcoded staleness threshold in pyth price
....................................................................
[L-05] Incorrect platform pause check
......................................................................................
[L-06] Inconsistent token limit constant and lack of validation in set_access_mode()
....................
[L-07] Duplicate borrow limit validation in process_borrow_obligation_liquidity()
...................
[L-08] Inefficient token limit validation in process_borrow_obligation_liquidity()
....................
[L-09] PoolOwnership  PDA owner not checked
........................................................................
[L-10] platform_config.pool_reserve  remains none
...............................................................
[L-11] Init reserve allows AC incomplete pools
..........................................................................
[L-12] Platform fee receiver update does not affect existing reserves
............................................
[L-13] Missing per-reserve access control PDA  enforces global whitelist
.......................................
[L-14] Borrow flow requires whitelist for every user
...................................................................
[L-15] ACCESS_MODE_NO_ACCESS  incorrectly grants borrow privileges
............................................
Pashov Audit Group
Coalesce Finance Security Review
2 / 36

1. About Pashov Audit Group
Pashov Audit Group consists of 40+ freelance security researchers, who are well proven in the
space - most have earned over $100k in public contest rewards, are multi-time champions or
have truly excelled in audits with us. We only work with proven and motivated talent.
With over 300 security audits completed - uncovering and helping patch thousands of
vulnerabilities - the group strives to create the absolute very best audit journey possible.
While 100% security is never possible to guarantee, we do guarantee you our team's best
efforts for your project. 
Check out our previous work here or reach out on Twitter @pashovkrum.
2. Disclaimer
A smart contract security review can never verify the complete absence of vulnerabilities. This
is a time, resource and expertise bound effort where we try to find as many vulnerabilities as
possible. We can not guarantee 100% security after the review or even if the review will find
any problems with your smart contracts. Subsequent security reviews, bug bounty programs
and on-chain monitoring are strongly recommended.
3. Risk Classification
Severity
Impact: High
Impact: Medium
Impact: Low
Likelihood: High
Critical
High
Medium
Likelihood: Medium
High
Medium
Low
Likelihood: Low
Medium
Low
Low
Impact
• High - leads to a significant material loss of assets in the protocol or significantly harms a
group of users
• Medium - leads to a moderate material loss of assets in the protocol or moderately harms a
group of users
• Low - leads to a minor material loss of assets in the protocol or harms a small group of users
Likelihood
• High - attack path is possible with reasonable assumptions that mimic on-chain conditions,
and the cost of the attack is relatively low compared to the amount of funds that can be stolen
or lost
• Medium - only a conditionally incentivized attack vector, but still relatively likely
• Low - has too many or too unlikely assumptions or requires a significant stake by the
attacker with little or no incentive
Pashov Audit Group
Coalesce Finance Security Review
3 / 36

4. About Coalesce Finance
Coalesce Finance is a fork of Solend - protocol for lending and borrowing on Solana.
5. Executive Summary
A time-boxed security review of the saguarocrypto/coalescefi-program repository was done by
Pashov Audit Group, during which FrankCastle, newspace, 0xdeadbeef, ZeroTrust01 engaged to
review Coalesce Finance. A total of 32 issues were uncovered.
Protocol Summary
Project Name
Coalesce Finance
Protocol Type
Lending
Timeline
October 13th 2025 - October 24th 2025
Review commit hash:
• ed134a00f3a72bce725e56de283b15940bdd94dd
  (saguarocrypto/coalescefi-program)
Fixes review commit hash:
• 56d03be899d26c756faf30ba9e580395481e5cf9
  (saguarocrypto/coalescefi-program)
Scope
coalescefi_constants.rs
coalescefi_helpers.rs
coalescefi_instruction.rs
coalescefi_macros.rs
coalescefi_pda_utils.rs
coalescefi_processor.rs
entrypoint.rs
lib.rs
multi_pool.rs
processor.rs
constants.rs
legacy_compat.rs
platform_state.rs
mod.rs
pool_ownership.rs
pool_rate_config.rs
user_state.rs
Pashov Audit Group
Coalesce Finance Security Review
4 / 36

6. Findings
Findings count
Severity
Amount
High
3
Medium
14
Low
15
Total findings
32
Summary of findings
ID
Title
Severity
Status
