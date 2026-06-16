---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - sector/staking
  - platform/pashov
  - severity/high
  - vuln/pda/missing-seeds-check
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - fix/add-check
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-seeds-check]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[account-discriminator-check]]"
  - "[[pda-derivation]]"
---
[C-02] Only one voter is allowed per voting event due to incorrect
PDA seeds
Severity
Impact: High
Likelihood: High
Description
The CreateVoterInfo  struct uses a PDA (Program Derived Address) that only includes the
voting event's public key as a seed, without incorporating the voter's public key:
#[account(
    init,
    payer = voter,
    space = 8 + 32 + 8 + 32, // Account discriminator + Pubkey + i64 + Pubkey
    seeds = [b"voter_info", voting_event.key().as_ref()],
    bump
)]
pub voter_info: Account<'info, VoterInfo>,
This design severely limits the protocol's functionality by allowing only one VoterInfo
account per voting event. When a second user attempts to call create_voter_info  for the
same voting event, the transaction will fail because the account already exists.
The impacts of this issue include:
Governance functionality broken: Only one user can participate in each voting event,
defeating the purpose of decentralized governance.
Contradicts design intentions: The VotingEvent  struct includes a min_participants
field and a current_participants  counter, clearly indicating the system was designed
for multiple voters per event.
Recommendations
Modify the VoterInfo  PDA derivation to include both the voting event key and the voter's
public key:
#[account(
    init,
    payer = voter,
    space = 8 + 32 + 8 + 32, // Account discriminator + Pubkey + i64 + Pubkey
    seeds = [b"voter_info", voting_event.key().as_ref(), voter.key().as_ref()],
    bump
)]
pub voter_info: Account<'info, VoterInfo>,
1. 
2. 
Pashov Audit Group
[[Btr]] Security Review
8 / 32

This change should be applied consistently across the codebase, including in: - staking/
programs/staking/src/instructions/create_voter_info.rs . - staking/programs/
staking/src/instructions/vote.rs . - staking/programs/staking/src/instructions/
claim.rs .
[C-03] Missing user authorization in GovBTR  token claim function
Severity
Impact: High
Likelihood: High
Description
The ClaimGovBtr  struct in the claim function has faulty account constraints for 
voter_info . It allows any user to claim GovBTR tokens from any valid voter_info
account, regardless of whether those tokens actually belong to them.
The current implementation only validates that the voter_info  account is a PDA derived
from "voter_info" and the voting event's key, but doesn't verify that this account belongs to
the transaction signer:
#[account(
    mut,
    seeds = [b"voter_info", voting_event.key().as_ref()],
    bump
)]
pub voter_info: Account<'info, VoterInfo>,
As a result, a malicious user can: 1. Find valid voter_info  accounts associated with any
voting event. 2. Pass these accounts to the claim instructions. 3. Successfully transfer tokens
from the escrow to their own account. 4. Effectively steal tokens that rightfully belong to other
users.
This vulnerability could lead to significant financial losses for legitimate voters.
Recommendations
Add a constraint to verify that the voter_info  account belongs to the transaction signer:
#[account(
    mut,
    seeds = [b"voter_info", voting_event.key().as_ref(), user.key().as_ref()],
    bump,
    constraint = voter_info.voter == user.key() // Assuming VoterInfo has an owner field
)]
pub voter_info: Account<'info, VoterInfo>,
Pashov Audit Group
BTR Security Review
9 / 32

This change ensures that users can only claim GovBTR tokens from voter accounts they
actually own.
