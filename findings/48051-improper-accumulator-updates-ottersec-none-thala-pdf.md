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

- id: 48051
- impact: HIGH
- protocol: [[Thala]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.thalalabs.xyz/

## Summary


This bug report discusses a vulnerability in the THL coin rewards system, where altering the stake amount can result in incorrect calculations of extra rewards. This can be exploited by a malicious user who takes out a flash loan to increase their stake amount and claim rewards for the newly added stake. The report also includes a proof of concept and a recommended solution, which involves updating the accumulator for extra rewards before modifying the stake amount. The bug has been fixed in the latest patch.

## Details

## Stake and Unstake Update Parameters for THL Coin Rewards

Stake and unstake update parameters for THL coin rewards, which are also affected by the `stake_amount`. As a result, altering the stake amount may cause incorrect calculations of extra rewards. A malicious user may exploit this vulnerability and take out a flash loan to increase their `stake_amount`, enabling them to collect rewards for the newly added stake.

## Proof of Concept

1. The manager adds more reward coins to the farming protocol.
2. A user claims additional rewards from the farm, which updates the global accumulator based on the current pool stake value.
3. An attacker stakes a large amount and attempts to claim the reward.
4. Due to the failure to update `user_pool_info.last_acc_rewards_per_share` for extra rewards before staking and unstaking, the attacker may claim the entire pool balance by calling `claim_extra_reward`.

## Remediation

`stakeandunstake` should first update the accumulator for extra rewards using `claim_extra_reward` before modifying the stake amount. Creating a vector to store the names of all additional reward coins and using them in the claim function is a way to go about it.

## Patch

Fixed in `2693e34` by adding an additional field to the `PoolInfo` structure for storing the amounts of extra reward coins. These amounts are updated during the staking and unstaking processes.
