---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
3.1.5
Multiple unstake() calls at the same position can drain the vault
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the unstake() function, when a user unstakes their position, all staked tokens plus ac-
crued interest are sent back to the original staker. At this point, the staker should not be allowed to un-
stake from the same position again. However, there is no restriction in the function preventing multiple
unstake calls, which allows users to withdraw the same amount of Gold tokens repeatedly from a single
position. A malicious user can exploit this vulnerability to drain the vault by calling unstake() multiple
times on the same position.
Recommendation: To prevent this vulnerability, consider implementing one of these solutions:
• Close the position after the unstake operation is complete.
• Set the position's amount to zero after a successful unstake.
• Add a ﬂag to track whether a position has already been unstaked.
Oro: Fixed in commit 7320cd80.
Cantina Managed: Fix veriﬁed.
