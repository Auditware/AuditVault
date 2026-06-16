---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - sector/staking
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
---
3.1.10
Incorrect Time Validation in unstake Function leads to permanent lock of the staked funds
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: The unstake function is designed to allow unstaking only after 12 months from the stake
start time. However, the current time validation logic incorrectly multiplies the seconds in a year by the
number of claimed months, leading to an excessive required time delay.
8

let enlapsed_time = Clock::get()?.unix_timestamp - self.position.start_time;
// < SECONDS_IN_A_YEAR
if enlapsed_time
< SECONDS_IN_A_YEAR
.checked_mul(
(self.position.claimed as i64)
.checked_add(1)
.ok_or(Overflow)?,
)
.ok_or(Overflow)?
{
return Err(ErrorCode::NotEnoughTimeElapsed.into());
}
If a user claims rewards for 6 months and later tries to unstake after 12 months, the function would
require over 7 years to elapse, resulting in a signiﬁcant loss of funds.
Recommendation: Modify the validation logic to check only for a minimum of 12 months (1 year) elapsed
time:
let enlapsed_time = Clock::get()?.unix_timestamp - self.position.start_time;
// < SECONDS_IN_A_YEAR
if enlapsed_time < SECONDS_IN_A_YEAR {
return Err(ErrorCode::NotEnoughTimeElapsed.into());
}
Oro: Fixed in commit a5585707.
Cantina Managed: Fix veriﬁed.
