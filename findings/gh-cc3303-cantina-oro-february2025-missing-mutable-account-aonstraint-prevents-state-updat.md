---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[duplicate-mutable-accounts]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
---
3.1.8
Missing mutable account aonstraint prevents state updates
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The config account in liquid_stake(), liquid_unstake(), and reward() functions lacks the
required mut constraint in the account validation, preventing critical state updates from being persisted.
7

In Solana, accounts that need to be modiﬁed during instruction execution must be explicitly marked as
mutable using the mut constraint. Without this constraint, any attempts to modify the account's data will
not be persisted at runtime, even though the account is successfully loaded and the modiﬁcation logic
executes correctly.
The config account, which holds critical protocol state including liquid staking amounts and conﬁguration
parameters, is deﬁned without the mut constraint in its account validation struct. As a result, while the
code successfully executes state variable updates within this account (e.g., self.config.liquid_amount
+= amount in liquid_stake()), these changes are not persisted to the blockchain.
Recommendation: Add the mut constraint to the config account validation in liquid_stake(), liquid_-
unstake(), and reward() functions. The ﬁx should be applied as follows:
**[account(:**
+
mut,
seeds = [b"config".as_ref()],
bump = config.bump,
)]
pub config: Account<'info, State>,
Oro: Fixed in commit 7320cd80.
Cantina Managed: Fix veriﬁed.
