---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/pda/missing-seeds-check
  - fix/add-check
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-seeds-check]]"
  - "[[direct-drain]]"
  - "[[pda-derivation]]"
---
3.1.4
Missing seed and bump constraints in position account in claim() and unstake() functions
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The position account in both claim() and unstake() functions is missing seeds and bump
constraints, which means a user can include any position account belonging to another user when calling
these functions. As a result, a malicious user can claim/unstake others' positions to their own wallet,
effectively stealing their funds.
#[ account(
init,
payer = user,
space = 8 + Position::INIT_SPACE,
) ]
pub position: Box<Account<'info, Position>>,
Recommendation: Add seeds and bump constraints to the position account in both claim() and unstake()
functions, similar to how they are deﬁned in the stake() function.
Oro: Fixed in commit 9b580ede.
Cantina Managed: Fix veriﬁed.
5
