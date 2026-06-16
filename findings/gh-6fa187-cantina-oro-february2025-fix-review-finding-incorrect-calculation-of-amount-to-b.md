---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[price-calculation]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
3.1.11
Fix review Finding: Incorrect Calculation of amount_to_burn in liquid_unstake
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the liquid_unstake function, the calculation of amount_to_burn is incorrect:
• amount represents the amount of gold to be unstaked.
• config.liquid_amount represents the total amount of gold in the pool.
• rewards_mint.supply represents the total minted supply of reward tokens.
The current formula incorrectly calculates amount_to_burn as:
let amount_to_burn = (amount as u128)
.checked_mul(self.config.liquid_amount.into())
.ok_or(Overflow)?
.checked_div(self.rewards_mint.supply.into())
.ok_or(Overflow)?;
This leads to an incorrect token burn amount, affecting the protocol's balance and potentially causing loss
of funds.
Recommendation: Use the correct formula, which ensures amount_to_burn is proportional to the un-
staked gold relative to the total gold in the protocol:
let amount_to_burn = (amount as u128)
.checked_mul(self.rewards_mint.supply.into())
.ok_or(Overflow)?
.checked_div(self.config.liquid_amount.into())
.ok_or(Overflow)?;
Oro: Fixed in commit 2c19a74f.
Cantina Managed: Fix veriﬁed.
9

3.2
High Risk
