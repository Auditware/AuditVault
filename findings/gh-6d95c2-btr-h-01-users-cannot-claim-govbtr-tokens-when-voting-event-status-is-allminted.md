---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - sector/oracle
  - sector/staking
  - platform/pashov
  - severity/high
  - vuln/access-control/missing-signer
  - vuln/logic/reward-calculation
  - vuln/oracle/stale-price
  - vuln/pda/missing-seeds-check
  - impact/dos/permanent
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/math-is-safe
  - misassumption/oracle-is-reliable
  - fix/add-access-control
  - fix/add-check
  - fix/fix-arithmetic
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-signer]]"
  - "[[reward-calculation]]"
  - "[[stale-price]]"
  - "[[missing-seeds-check]]"
  - "[[permanent]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[account-signer]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[oracle-freshness]]"
  - "[[pda-derivation]]"
  - "[[realloc-rent-exemption]]"
  - "[[reward-accounting]]"
  - "[[oracle-manipulation-resistance]]"
---
[H-01] Users cannot claim GOVBTR tokens when voting event status is AllMinted
...........................
[H-02] Voting events limited to 255 maximum due to type mismatch
...........................................
Medium findings
...........................................................................................................................................
[M-01] Staking and vault accounts not properly closed locking rent-exempt funds
..........................
[M-02] Staking allows surpassing max_usdc_capacity  causing reward mismatch
..........................
[M-03] High likelihood of overflow in reward calculation due to f64  precision limit
.......................
[M-04] Denial of service via associated token account pre-creation
..............................................
[M-05] Users cannot unstake after 7 days if voting event duration is longer
..................................
Low findings
..................................................................................................................................................
[L-01] Mint and gov authorities not properly managed for rent exemption
.....................................
[L-02] VaultPool  bump not stored and redundant assignment in create_vault_request
............
[L-03] Incorrect assignment of total_minted  in vote function
...................................................
[L-04] Vault creation blocked if one signer is compromised
..........................................................
[L-05] Variable naming does not reflect its purpose
....................................................................
[L-06] Staking duration can be invalid due to prematurely set staking_end_time
.........................
[L-07] Improper signer validation leads to permanent denial of service
.........................................
[L-08] Inconsistent TWAP staleness check allows use of stale price data
.......................................
[L-09] VaultPool  and escrow token rent lamports not refunded on cancellation
...........................
[L-10] UpdateSignersEvent  rent refund goes to approver not creator
.........................................
[L-11] MintEvent  rent refund goes to approver not creator
.......................................................
[L-12] Missing recipient validation for voting event and associated Mint event
................................
[L-13] Missing seed validation allows unauthorized token approval
...............................................
Pashov Audit Group
[[Btr]] Security Review
2 / 32

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
BTR Security Review
3 / 32

4. About BTR
BTR is a BTC-backed reserve on Solana, governed by staking, voting, and vault-based
investment products, with a treasury-backed supply of 10 million $BTR. The audit scope covers
the security and functionality of BTR's smart contracts including staking-voting logic and vault
maturity mechanisms, while excluding off-chain components like the ATM engine.
5. Executive Summary
A time-boxed security review of the btrfi/btr-contracts repository was done by Pashov Audit
Group, during which ctrus, 0xeix, FrankCastle, ZeroTrust01 engaged to review BTR. A total of 25
issues were uncovered.
Protocol Summary
Project Name
BTR
Protocol Type
Treasury Vault
Timeline
June 29th 2025 - July 5th 2025
Review commit hash:
• 38a176f5ed83f7ca346c81401519346739129e7e
  (btrfi/btr-contracts)
Fixes review commit hash:
• 6e4ae85ba1930afc2e39de31a5f608bd22043f83
  (btrfi/btr-contracts)
Scope
admin_functions.rs
approve_update_signer.rs
approve_voting.rs
claim.rs
create_staker_info.rs
create_update_signer.rs
create_voter_info.rs
create_voting.rs
initialize_global_data.rs
mod.rs
stake_btr.rs
unstake_btr.rs
vote.rs
global_data.rs
mint_event.rs
staker_info.rs
update_signer_event.rs
voter_info.rs
voting_event.rs
error.rs
lib.rs
approve_request.rs
cancel_request.rs
create_user_entry.rs
create_vault_request.rs
initialize.rs
stake.rs
unlock_vault.rs
unstake.rs
user_entry.rs
vault_pool.rs
get_price.rs
Pashov Audit Group
BTR Security Review
4 / 32

6. Findings
Findings count
Severity
Amount
Critical
5
High
2
Medium
5
Low
13
Total findings
25
Summary of findings
ID
Title
Severity
Status
