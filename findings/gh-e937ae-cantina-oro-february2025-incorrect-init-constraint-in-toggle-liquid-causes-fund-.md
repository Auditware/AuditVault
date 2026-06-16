---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/dos/init-constraint
  - vuln/pda/bump-canonicalization
  - vuln/pda/reinitialization
  - impact/dos/permanent
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-check
  - fix/initialize-proxy
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[frozen-funds]]"
  - "[[init-constraint]]"
  - "[[bump-canonicalization]]"
  - "[[reinitialization]]"
  - "[[permanent]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
  - "[[pda-derivation]]"
---
3.1.1
Incorrect init Constraint in toggle_liquid Causes Fund Locking and DoS
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The toggle_liquid function is completely frozen because it uses the init constraint with
the config account. Since the init constraint is already used in the initialize_config function, any
attempt to call toggle_liquid will always revert.
This results in two critical issues affecting the protocol’s functionality:
1. Fund Locking: If toggle_liquid is responsible for initialization, the bump seeds used for signing
the transfer CPI will not be stored hence the signing will not work permanently. This will lead to a
complete lock of funds for all tokens staked by users.
2. Denial of Service: If initialize_config is used for initialization, the liquid_staking program will be
permanently disabled because the liquid ﬁeld in the config account will always remain false. As a
result, the liquid_stake function will always revert, preventing staking operations.
Recommendation: Modify the config account in the toggle_liquid function to avoid reinitialization. The
corrected implementation is as follows:
**[account(:** mut,
seeds = [b"config".as_ref()],
bump = config.bump,
)]
pub config: Account<'info, State>,
Oro: Fixed in commit 9b580ede.
Cantina Managed: Fix veriﬁed.
