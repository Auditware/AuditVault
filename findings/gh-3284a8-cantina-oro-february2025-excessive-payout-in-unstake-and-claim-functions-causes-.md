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
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
3.1.9
Excessive Payout in unstake and claim Functions Causes Severe Fund Loss
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The unstake and claim functions incorrectly calculate the amount to transfer, resulting in
users receiving 12 times the amount they originally staked. This leads to a signiﬁcant loss of funds for the
protocol.
The ﬂawed calculation is shown here:
let amount_to_transfer = self.position.amount
+ (self.position.amount * (12 - self.position.claimed as u64) * 10025 / 10000);
This miscalculation causes users to receive an excessive reward, far exceeding the intended staking re-
wards.
Recommendation: The correct implementation should ensure that only a small portion of the staked
amount is transferred per claim. Corrected Claim Function Calculation::
let amount_to_transfer = self.position.amount * 25 / 10000;
Corrected Unstake Function Calculation:: To properly transfer the unclaimed amount after the staking
duration has passed:
let amount_to_transfer =
self.position.amount + ((12 - self.position.claimed as u64) * self.position.amount * 25 / 10000);
Oro: Fixed in commit 603555b6.
Cantina Managed: Fix veriﬁed.
