---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - sector/staking
  - platform/pashov
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[overflow]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[realloc-rent-exemption]]"
---
[H-02] Voting events limited to 255 maximum due to type mismatch
Severity
Impact: High
Likelihood: High
Description
The voting system is designed to support a large number of voting events as evidenced by the
use of u64  for the id  field in the VotingEvent  struct. However, there's a critical type
mismatch in the codebase:
In staking/programs/staking/src/state/global_data.rs , the counter for voting
events is defined as:
pub id: u8,
// Limited to 255 values (0-255)
While in staking/programs/staking/src/state/voting_event.rs , the ID for each
voting event is defined as:
pub id: u64,
// Supports billions of values
In staking/programs/staking/src/instructions/create_voting.rs , when creating a
new voting event, the ID is assigned from the global counter:
voting_event.id = global_data.id as u64;
// Cast from u8 to u64
global_data.id = global_data.id + 1;
// Increment counter
Furthermore, all instructions that reference voting events by ID use u8  parameters:
#[instruction(voting_id: u8)]
This type mismatch means that despite the system being designed to support many voting
events (as evidenced by u64  for VotingEvent.id ), it's actually limited to a maximum of
255 total voting events. For a governance system intended for long-term use, this limitation
presents a serious constraint that contradicts the apparent design intent of supporting many
1. 
1. 
1. 
1. 
Pashov Audit Group
[[Btr]] Security Review
14 / 32

more voting events. Those two accounts are not being closed, so if we are again gonna
initialize the voting_event  and govbtr_account_escrow  at that address(at which an
account already exists) it would create dos.
Recommendations
Modify the GlobalData  struct to use a consistent data type for the ID counter:
// In global_data.rs
pub struct GlobalData {
pub id: u64,
// Change from u8 to u64
// ...other fields
}
Update all instruction definitions to consistently use u64  for voting IDs:
#[instruction(voting_id: u64)]
This change will ensure that the system can support the intended number of voting events
without arbitrary limitations from data type choices.
1. 
1. 
Pashov Audit Group
BTR Security Review
15 / 32

Medium findings
[M-01] Staking and vault accounts not properly closed locking rent-
exempt funds
Severity
Impact: Medium 
Likelihood: Medium
Description
Across several parts of the program, important on-chain accounts are not closed when they
become obsolete, resulting in permanent locking of users' rent-exempt lamports and
unnecessary state bloat. Specifically:
In the unstake()  function (vault staking), when user_entry.total_staked == 0 , the
user_entry  account is no longer usable for claims. However, it remains open, and the rent
stays locked.
In the unstake_btr()  function (BTR staking), when 
staker_info.total_staked == 0 , the staker_info  account similarly becomes useless
but is not closed.
In the CancelRequest  flow (vault creation), when a vault request is canceled, the
associated vault_pool  account becomes defunct, yet it is not closed to reclaim the rent-
exempt funds.
Leaving these accounts open unnecessarily consumes SOL for rent and increases the on-chain
account footprint, which may have long-term cost implications for both users and the program.
Recommendations
Implement proper closure of these accounts once they become obsolete:
For staking accounts ( user_entry , staker_info ), close them when total_staked
drops to zero. Use Anchor’s #[account(close = user)]  attribute or manual lamport
transfer and deallocation logic.
For vault pool accounts ( vault_pool ), close them upon cancellation of the vault request.
For example, update the CancelRequest  context to:
#[account(
    mut,
    seeds = [
• 
• 
• 
• 
• 
Pashov Audit Group
BTR Security Review
16 / 32

        VAULT_POOL_PREFIX.as_bytes(),
        &_vault_id.to_le_bytes()
    ],
