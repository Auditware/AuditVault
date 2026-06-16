---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/dex
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
3.1.6
Incorrect Reward token calculation enables pool drain via arbitrage
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The liquid_stake() function contains a critical mathematical error in calculating the
amount of reward tokens to mint to stakers when the rewards mint supply is non-zero. The current
implementation calculates the reward amount as:
amount * self.config.liquid_amount / self.rewards_mint.supply
The root cause is in the reward calculation logic where the numerator and denominator are swapped.
This creates a situation where malicious users can:
1. Perform liquid_stake() to receive an inﬂated amount of reward tokens.
2. Use liquid_unstake() to withdraw more underlying tokens than initially deposited.
3. Repeat until the pool is drained.
Recommendation: The reward token calculation should be corrected to maintain proper proportions
between deposits and rewards. Update the calculation to:
- amount * self.config.liquid_amount / self.rewards_mint.supply
+ amount * self.rewards_mint.supply / self.config.liquid_amount
Oro: The reward token calculation has been ﬁxed across multiple commits (see for instance commit
7df8758f), recommend to check the current implementation of the instruction.
Cantina Managed: Fix veriﬁed.
