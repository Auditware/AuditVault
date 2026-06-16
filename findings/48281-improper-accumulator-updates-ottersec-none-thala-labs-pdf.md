---
tags:
  - lang/move
  - sector/lending
  - sector/staking
  - sector/staking-pool
  - platform/ottersec
  - has/poc
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Thala]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.thalalabs.xyz/"
genome:
  - "[[reward-calculation]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[reward-theft]]"
  - "[[flashloan-callback-auth]]"
  - "[[reward-accounting]]"
  - "[[move-reward-update-ordering]]"
---
# Improper Accumulator Updates

- id: 48281
- impact: HIGH
- protocol: [[Thala Labs]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.thalalabs.xyz/

## Summary


The report discusses a bug in the THL coin rewards system that allows a malicious user to exploit the system and potentially claim all rewards from a farming protocol. This is due to a failure to properly update the rewards accumulator when staking and unstaking, which can result in incorrect calculations and extra rewards being claimed. The suggested solution is to update the accumulator before modifying the stake amount and to use a vector to store the names of additional reward coins. This bug has been fixed in the latest patch by adding an additional field to store the amounts of extra reward coins and updating them during the staking and unstaking processes.

## Details

## Stake and Unstake Update Parameters for THL Coin Rewards

The stake and unstake update parameters for THL coin rewards are affected by the `stake_amount`. As a result, altering the stake amount may cause incorrect calculations of extra rewards. A malicious user may exploit this vulnerability and take out a flash loan to increase their `stake_amount`, enabling them to collect rewards for the newly added stake.

## Proof of Concept

1. The manager adds more reward coins to the farming protocol.
2. A user claims additional rewards from the farm, which updates the global accumulator based on the current pool stake value.
3. An attacker stakes a large amount and attempts to claim the reward.
4. Due to the failure to update `user_pool_info.last_acc_rewards_per_share` for extra rewards before staking and unstaking, the attacker may claim the entire pool balance by calling `claim_extra_reward`.

## Remediation

`stake_and_unstake` should first update the accumulator for extra rewards using `claim_extra_reward` before modifying the stake amount. Creating a vector to store the names of all additional reward coins and using them in the claim function is a way to approach it.

## Patch

Fixed in `2693e34` by adding an additional field to the `PoolInfo` structure for storing the amounts of extra reward coins. These amounts are updated during the staking and unstaking processes.
