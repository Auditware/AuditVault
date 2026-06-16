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
[H-02]
Voting events limited to 255 maximum due to
type mismatch
High
Resolved
[M-01]
Staking and vault accounts not properly closed
locking rent-exempt funds
Medium
Resolved
[M-02]
Staking allows surpassing max_usdc_capacity
causing reward mismatch
Medium
Acknowledged
[M-03]
High likelihood of overflow in reward calculation
due to f64  precision limit
Medium
Resolved
Pashov Audit Group
[[Btr]] Security Review
5 / 32

ID
Title
Severity
Status
[M-04]
Denial of service via associated token account pre-
creation
Medium
Resolved
[M-05]
Users cannot unstake after 7 days if voting event
duration is longer
Medium
Resolved
[L-01]
Mint and gov authorities not properly managed for
rent exemption
Low
Resolved
[L-02]
VaultPool  bump not stored and redundant
assignment in create_vault_request
Low
Resolved
[L-03]
Incorrect assignment of total_minted  in vote
function
Low
Resolved
[L-04]
Vault creation blocked if one signer is
compromised
Low
Resolved
[L-05]
Variable naming does not reflect its purpose
Low
Resolved
[L-06]
Staking duration can be invalid due to prematurely
set staking_end_time
Low
Resolved
[L-07]
Improper signer validation leads to permanent
denial of service
Low
Resolved
[L-08]
Inconsistent TWAP staleness check allows use of
stale price data
Low
Resolved
[L-09]
VaultPool  and escrow token rent lamports not
refunded on cancellation
Low
Resolved
[L-10]
UpdateSignersEvent  rent refund goes to
approver not creator
Low
Acknowledged
[L-11]
MintEvent  rent refund goes to approver not
creator
Low
Resolved
[L-12]
Missing recipient validation for voting event and
associated Mint event
Low
Resolved
[L-13]
Missing seed validation allows unauthorized token
approval
Low
Resolved
Pashov Audit Group
BTR Security Review
6 / 32

Critical findings
