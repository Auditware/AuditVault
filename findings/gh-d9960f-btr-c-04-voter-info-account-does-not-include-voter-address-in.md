---
tags:
  - blockchain/solana
  - lang/rust
  - sector/governance
  - sector/staking
  - platform/pashov
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
  - fix/add-check
protocol: "[[Btr]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-modifier]]"
  - "[[missing-seeds-check]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[pda-derivation]]"
---
[C-04] voter_info  account does not include voter address in
seeds
Severity
Impact: High
Likelihood: High
Description
In the current implementation of the CreateVoterInfo  instruction, the voter_info
account is derived using the following seed:
seeds = [b"voter_info", voting_event.key().as_ref()],
This means only one
voter_info  account can exist per voting_event , regardless of how
many users participate. Since the PDA does not include the voter ’s public key, any attempt
by a second user to create a voter_info  account will fail due to a PDA collision.
This results in:
Inability for multiple users to vote or stake govBTR  in a voting event.
Protocol-wide loss of value, as users are unable to lock tokens and gain rewards or voting
influence.
Complete freeze of the voting mechanism, effectively breaking governance participation.
Here is the current code excerpt:
#[account(
    init,
    payer = voter,
    space = 8 + 32 + 8 + 32,
    seeds = [b"voter_info", voting_event.key().as_ref()],
    bump
)]
pub voter_info: Account<'info, VoterInfo>,
Recommendations
Modify the PDA derivation to include the voter ’s public key in the seed so that each voter
can have their own voter_info  account per voting event:
• 
• 
• 
Pashov Audit Group
[[Btr]] Security Review
10 / 32

#[account(
    init,
    payer = voter,
    space = 8 + 32 + 8 + 32,
    seeds = [b"voter_info", voting_event.key().as_ref(), voter.key().as_ref()],
    bump
)]
pub voter_info: Account<'info, VoterInfo>,
This ensures uniqueness per (voting_event, voter)  pair and enables proper tracking of
each participant’s stake and voting behavior.
Also, make sure to update all instructions that derive or access voter_info  PDAs to match
the new seed structure.
[C-05] Missing access control in claim  function allows
unauthorized token claims
Severity
Impact: High
Likelihood: High
Description
The claim  function lacks proper access control, allowing any signer to claim govBTR
tokens stored in a voter_info  account-even if they are not the original voter who owns
that account. This oversight introduces several critical vulnerabilities:
Unauthorized Token Transfers: The function transfers all govBTR  tokens from the escrow
to the user_govbtr_account , but it does not verify that the user  is the same as 
voter_info.voter .
Voting Manipulation: An attacker can loop through various voter_info  accounts and
claim tokens for themselves, effectively aggregating infinite voting power. This undermines
the governance model and compromises the integrity of the system.
Fund Loss for Legitimate Voters: Legitimate voters will lose both their tokens and their
right to vote, as someone else can drain their tokens without their signature or consent.
Rent Theft: Once the voter's token account is drained, the attacker can also reclaim rent
from the now-empty account.
The following code demonstrates the issue:
1. 
2. 
3. 
4. 
Pashov Audit Group
BTR Security Review
11 / 32

pub struct ClaimGovBtr<'info> {
#[account(mut)]
pub user: Signer<'info>,
...
}
No validation exists to ensure that user == voter_info.voter .
Yet tokens are transferred to user_govbtr_account  as follows:
#[account(
    mut,
    token::mint = govbtr_token,
    token::authority = user
)]
pub user_govbtr_account: Account<'info, TokenAccount>,
And finally, the actual transfer logic:
token::transfer(
CpiContext::new_with_signer(
ctx.accounts.token_program.to_account_info(),
token::Transfer {
from: ctx.accounts.govbtr_account_escrow.to_account_info(),
to: ctx.accounts.user_govbtr_account.to_account_info(),
authority: voting_event.to_account_info(),
},
signer_seeds
),
amount,
)?;
Recommendations
Add a strict access control check to ensure that only the original voter can claim the tokens.
Specifically, assert that the user  signer matches the voter  field in the voter_info
account:
require!(
ctx.accounts.user.key() == ctx.accounts.voter_info.voter,
CustomError::UnauthorizedClaim
);
This check ensures that only the rightful owner of the voter_info  account can receive the
tokens and prevents unauthorized users from draining voting power or funds.
Pashov Audit Group
BTR Security Review
12 / 32

High findings
[H-01] Users cannot claim GOVBTR tokens when voting event status
is AllMinted
Severity
Impact: High
Likelihood: Medium
Description
The claim  function in staking/programs/staking/src/instructions/claim.rs  only
allows users to claim their GOVBTR tokens if a voting event is in either the Completed  or 
Expired  status:
require!(voting_event.status == VotingStatus::Completed || voting_event.status ==
VotingStatus::Expired, CustomError::VotingEventNotCompleted);
However, this check does not include the AllMinted  status, which is a legitimate terminal
state for a voting event. A voting event transitions to AllMinted  when all allocated BTR
tokens have been minted:
// In approve_mint_event function
if voting_event.total_minted == voting_event.max_btr_mintable {
voting_event.status = VotingStatus::AllMinted;
}
// In vote function
if voting_event.initial_mint == voting_event.max_btr_mintable {
voting_event.status = VotingStatus::AllMinted;
}
This creates a scenario where users who have voted in an event that transitions to 
AllMinted  cannot claim their GOVBTR tokens back, effectively locking their tokens
indefinitely. This is problematic because:
A voting event can directly transition from Live  to AllMinted  without going through
the Completed  status first.
Once in AllMinted , the voting event has fulfilled its purpose (all tokens minted), and
users should be able to reclaim their governance tokens.
Recommendations
Modify the condition in the claim  function to also allow claims when a voting event is in the 
AllMinted  status:
1. 
2. 
Pashov Audit Group
BTR Security Review
13 / 32

require!(
voting_event.status == VotingStatus::Completed ||
voting_event.status == VotingStatus::Expired ||
voting_event.status == VotingStatus::AllMinted,
CustomError::VotingEventNotCompleted
);
This change ensures that users can always claim their GOVBTR tokens once a voting event has
reached any terminal state ( Completed , Expired , or AllMinted ), preventing token
lockups.
