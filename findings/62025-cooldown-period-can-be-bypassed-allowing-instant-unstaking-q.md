---
tags:
  - severity/high
  - lang/solidity
  - sector/staking
  - platform/quantstamp
protocol: "[[Sapien   2]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html"
genome:
  - "[[timelock-bypass-deps]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[governance/timelock-bypass]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[redesign-logic]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# Cooldown Period Can Be Bypassed Allowing Instant Unstaking

- id: 62025
- impact: HIGH
- protocol: Sapien - 2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html

## Summary


The client has marked a bug in the `SapienVault` contract as "Fixed" in a recent update. The bug allows users to bypass the intended cooldown period for the majority of their staked tokens. This can be done by initiating unstaking for a small portion of their tokens, waiting for the cooldown to complete, and then unstaking the remaining amount without waiting again. The report suggests three possible solutions to address this issue: updating the `cooldownStart` on each call to `initiateUnstake()`, restricting unstaking to the full available amount, or implementing per-amount cooldown tracking. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `3d82c229626f11633838f9aa94265d497a838de9`.

**File(s) affected:**`SapienVault.sol`

**Description:** The `initiateUnstake()` function in the `SapienVault` contract sets the cooldown start timestamp only if the user is not already in a cooldown state, as controlled by the condition `if (uint256(userStake.cooldownStart) == 0)`. This design creates an opportunity to bypass the intended cooldown period for the majority of a user's stake. Specifically, a user may initiate unstaking for a small portion of their stake, wait for the cooldown to complete, and then unstake the remaining amount without waiting again, effectively circumventing the cooldown for most of their tokens.

**Exploit Scenario:**

1.   A user stakes 1,000 tokens with a cooldown period of 7 days.
2.   After the lockup period expires, the user initiates unstaking for only 1 token, which sets `cooldownStart` to the current block timestamp.
3.   The user retains the remaining 999 tokens in active staking, continuing to receive associated benefits.
4.   Once the 2-day cooldown completes for the 1 token, the user initiates unstaking for the remaining 999 tokens.
5.   Since `cooldownStart` is already set and not updated, the cooldown is considered complete, allowing the user to immediately unstake all remaining tokens.

**Recommendation:** To enforce the cooldown consistently, consider one of the following mitigations:

*   **Update `cooldownStart` on each call to `initiateUnstake()`**, regardless of its current value. This ensures the cooldown period is enforced for each unstake request. Be aware that this approach may unintentionally reset the cooldown timer if users initiate small unstake amounts frequently.
*   **Restrict unstaking to the full available amount** at once, thereby preventing partial cooldown circumvention.
*   **Implement per-amount cooldown tracking**, associating each unstaked amount with its own cooldown start. This solution is the most accurate but requires structural changes to how stake and cooldowns are stored and managed.
