---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/dos/init-constraint
  - impact/dos/permanent
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-check
  - sector/bridge
protocol: "[[Layer N]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[init-constraint]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[account-discriminator-check]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
  - "[[integer-bounds]]"
  - "[[pda-derivation]]"
---
3.1.1
Permanent DoS via funding un-initialised PDA accounts
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Finding Description: Because anyone can transfer lamports to any address, an attacker can pre-fund the
deterministic PDA addresses that the bridge will later create. Several PDAs are instantiated with system_-
instruction::create_account:
• challenge_block - challenge-nulliﬁer PDA.
• withdraw - effect-nulliﬁer PDA.
• set_permission - ACL-entry PDA.
create_account (see lines 160-168 of the System Program) fails if the target account already holds lam-
ports. In the surrounding logic of the aforementioned PDAs, the program also checks whether the PDA
is already created; if it holds lamports it veriﬁes the owner and reverts when the owner is not the bridge
program, e.g.:
• challenge_block.rs:
#[ account(mut, seeds = [
CHALLENGE_NULLIFIER_SEED,
&bridge.key().to_bytes(),
&block_id.to_le_bytes(),
&validator.key().to_bytes(),
] , bump) ]
pub challenge_nullifier: AccountInfo<'info>,
// .....
pub fn challenge_block(ctx: Context<ChallengeBlock>, block_id: u64) -> Result<()> {
// ...
if **ctx.accounts.challenge_nullifier.lamports.borrow() > 0 {
assert_eq!(*ctx.accounts.challenge_nullifier.owner, ctx.accounts.program.key());
return err!(crate::BridgeError::BlockAlreadyChallenged);
}
// ...
}
By pre-funding these PDAs with a minimal lamport balance, an attacker can permanently block their cre-
ation and thus DoS the associated functionality. The most critical impact is on challenge_block, where a
validator could be prevented from challenging a malicious block.
Recommendation: Consider doing what Anchor is doing when it tries to create an account and detects
that the account already has lamports:
• Allocate.
• Assign.
• Make sure it's rent extempt.
constraints.rs#L1648-L1675
The following cases should be handled:
• If the lamports, the data ﬁeld (discriminator), and the account ownership all match, and the account
has valid data, we should revert with an "already initialized" error.
• If only lamports exist (lamports > 0), but the account is still owned by the system program or the
data ﬁeld is empty, we should perform manual account creation.
• If no lamports exist (lamports == 0) and the account is owned by the system program, this means
the account has no data-so using the system instruction create_account is valid here.
4

[[Layer N]]: Fixed in commit 34dcb95d.
Cantina Managed: Fix veriﬁed. It would be beneﬁcial for the project to add some testing for this, if
possible, at least unit tests.
3.2
Medium Risk
3.2.1
Unﬁnalized Blocks Cannot Be Pruned Due to Effects Execution Check
Severity: Medium Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The current logic prevents pruning of unﬁnalized but expired blocks due to a strict check
that compares block.facts.effects_count with block.effects_executed. This check assumes all block
effects must have been executed, which is only valid for ﬁnalized blocks.
However, approved but unﬁnalized blocks-especially those that are expired or challenged-may not have
had their effects executed. Enforcing this check on such blocks causes a permanent revert when trying to
prune them. As a result:
• The refund account is never refunded.
• The block accounts remain open indeﬁnitely.
Additionally, for challenged blocks (marked invalid by validators), it's expected that their effects should
not be executed-yet this check still applies, incorrectly halting cleanup. Here's the problematic condition:
require!(
block.facts.effects_count == block.effects_executed,
BridgeError::BlockHasUnexecutedEffects
);
This
will
always
fail
for
unﬁnalized
blocks,
since
block.effects_executed
remains
0,
while
block.facts.effects_count is non-zero.
Recommendation: Restrict the execution check to ﬁnalized blocks only, where we are certain the effects
must have been executed. Suggested logic update:
let is_finalizable = IsChallengePeriodExpired {
slot_current: Clock::get().unwrap().slot,
slot_proposed: block.slot_proposed,
slots_challenge_period: ctx.accounts.bridge.challenge_period_slots,
}.run() && block.challenges < ctx.accounts.bridge.challenge_consensus_threshold;
if block.approval == Approval::Finalized || is_finalizable {
assert!(block.facts.effects_count >= block.effects_executed);
require!(
block.facts.effects_count == block.effects_executed,
BridgeError::BlockHasUnexecutedEffects
);
}
This ensures:
