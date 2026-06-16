---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/code4rena
  - severity/high
  - vuln/logic/reward-calculation
  - impact/dos/permanent
  - impact/mev/frontrun
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Synthetix]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[reward-calculation]]"
  - "[[permanent]]"
  - "[[frontrun]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
[H-01]
Rewards loss due to share updates in
claim calculation
High
Resolved
[M-01]
UserCollateral.vaults array has no
length limit
Medium
Resolved
[M-02]
reward_distribution.schedule needs to
be updated when slot_duration == 0
Medium
Resolved
[M-03]
Permanent DoS on liquidation
process
Medium
Resolved
[M-04]
Permanent DoS during the price
update
Medium
Resolved
[L-01]
Preventing account closure by
sending small token amount
Low
Acknowledged
[L-02]
Overflow in
try_update_market_size_on_trade
Low
Resolved
[L-03]
Missing validation for minimum
publish time
Low
Resolved
[L-04]
Risky token extensions
Low
Acknowledged
[L-05]
Not clearing debt when
amount_delta_usd == 0
Low
Resolved
[L-06]
Function is missing
Low
Resolved
[L-07]
Improper validation of susd_mint
Low
Resolved
[L-08]
create_collateral_lock only allows
increasing the lock amount when the
previous lock expires
Low
Resolved
[L-09]
Missing update to
Low
Resolved
10

last_interaction_slot
[L-10]
Keepers can frontrun the trader order
cancellation
Low
Acknowledged
[L-11]
Missing confidence interval
validation
Low
Acknowledged
11

8. Findings
8.1. High Findings
[H-01] Rewards loss due to share updates in
claim calculation
Severity
Impact: High
Likelihood: Medium
Description
The reward calculation in prepare_reward_claim  is based on the current share
balance when calculating unclaimed rewards:
let user_shares = i128::try_from(connection.holdings.shares)?;
.
.
let new_reward = reward_distribution
    .reward_per_share
    .saturating_sub(reward_claim.last_reward_per_share)
    .checked_mul_decimal(user_shares)
However, any modification to shares through delegate_vault_collateral
