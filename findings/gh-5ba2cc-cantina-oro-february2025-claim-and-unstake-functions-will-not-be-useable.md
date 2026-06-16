---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/dos/init-constraint
  - impact/loss-of-funds/locked-funds
  - precondition/uninitialized
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/add-check
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[init-constraint]]"
  - "[[locked-funds]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[initializer-auth]]"
---
3.1.3
claim() and unstake() functions will not be useable
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The position account in both claim() and unstake() functions is marked with the init
constraint, while this same account is already initialized in the stake() function:
#[ account(
init,
payer = user,
space = 8 + Position::INIT_SPACE,
) ]
pub position: Box<Account<'info, Position>>,
This will cause the claim() and unstake() functions to revert when called, since an account cannot be
initialized if it already exists. As a result, all funds staked are stuck indeﬁnitely, as users cannot claim
rewards or withdraw their tokens.
Recommendation: Replace the init constraint with the mut constraint in the position account deﬁnition
for both claim() and unstake() functions.
Oro: Fixed in commit 9b580ede.
Cantina Managed: Fix veriﬁed.
