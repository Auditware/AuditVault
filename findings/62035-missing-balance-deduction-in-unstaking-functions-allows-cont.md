---
tags:
  - severity/high
  - lang/solidity
  - sector/staking
  - sector/gaming
  - platform/quantstamp
protocol: "[[Sapien]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/index.html"
genome:
  - "[[reward-accounting]]"
  - "[[integer-bounds]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/protocol-wide]]"
---
# Missing Balance Deduction in Unstaking Functions Allows Contract Drainage and Lock Period Bypass

- id: 62035
- impact: HIGH
- protocol: Sapien
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/index.html

## Summary


This bug report is about a vulnerability in the `SapienStaking.sol` contract, where users can drain all tokens from the contract by repeatedly calling the `unstake()` function. This is because the contract fails to deduct the staked amount from the user's balance, allowing them to withdraw more tokens than they initially staked. This also tricks the reward system off-chain, as the user's staking position is never updated. The report recommends modifying the `unstake()` function and adding checks for the lockdown duration to fix this issue. The client has marked this bug as "Fixed" and provided an explanation for the fix.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `4a45a4a`.

![Image 26: Alert icon](https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/static/media/success-icon-alert.4e26c8d3b65fdf9f4f0789a4086052ba.svg)

**Update**
Marked as "Fixed" by the client. Addressed in: `f647099b7988fa4d01fac6a9f3481d25e748527a`. The client provided the following explanation:

> The vulnerability in the unstaking functions was fixed by implementing proper balance deduction and state management.

![Image 27: Alert icon](https://certificate.quantstamp.com/full/sapien/ffb7e698-6178-46f0-8df8-52e537af70c0/static/media/success-icon-alert.4e26c8d3b65fdf9f4f0789a4086052ba.svg)

**Update**
Marked as "Fixed" by the client. Addressed in: `f647099b7988fa4d01fac6a9f3481d25e748527a`. The client provided the following explanation:

> The vulnerability in the unstaking functions was fixed by implementing proper balance deduction and state management.

**File(s) affected:**`SapienStaking.sol`

**Description:** The `initiateUnstake()` and `unstake()` functions in the staking contract contain a critical vulnerability that allows users to drain the entire contract's token balance. When unstaking, the functions fail to deduct the staked amount from the user's balance in the `StakingInfo` struct. This means a user can:

1.   Stake tokens once to create a valid staking position
2.   Call `initiateUnstake()` to start the cooldown period
3.   After the cooldown period, call `unstake()` multiple times with the same `orderId` to repeatedly withdraw tokens
4.   Each withdrawal succeeds since the staking position remains active and the balance is never decremented

As a result, a malicious user could drain all tokens from the contract by repeatedly calling `unstake()` with a single valid staking position, far exceeding their initial stake.

This also tricks the reward mechanism off-chain, because the user `isActive` state variable is never updated, which signals that the user stake is still active, as well as having the original amount that was staked.

In addition to the above, the lock duration is not checked during unstaking. Meaning that an attacker can game the reward system by staking for the maximum duration, and then unstake immediately.

**Exploit Scenario:**

1.   Alice stakes 100 tokens and receives a valid `orderId` and signature
2.   Alice initiates unstaking by calling `initiateUnstake()`
3.   After the cooldown period completes, Alice calls `unstake()` to withdraw 100 tokens
4.   Since her staking position remains active and unchanged, Alice can call `unstake()` again
5.   Alice can repeat this process until the contract's entire token balance is drained

**Recommendation:** Modify the `unstake()` function to properly update the user's staking position. Also, add checks for the lockdown duration.
