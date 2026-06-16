---
tags:
  - severity/high
  - lang/solidity
  - sector/restaking
  - sector/staking
  - platform/quantstamp
protocol: "[[Sapien   2]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html"
genome:
  - "[[timelock-bypass-deps]]"
  - "[[governance/timelock-bypass]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[redesign-logic]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# Lockup Period for Unstaking Can Be Decreased by Staking Again with Shorter Lockup Period

- id: 62026
- impact: HIGH
- protocol: Sapien - 2
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/sapien-2/9f938662-5bf7-4dc3-8774-3e7a12204cc3/index.html

## Summary


The client has marked a bug in the `SapienVault` contract as "Fixed". This bug allows users to reduce their lockup period by adding more tokens with a shorter lockup period. This undermines the intended locking mechanism. The bug can be exploited by staking an initial amount of tokens with a longer lockup period, and then adding more tokens with a shorter lockup period. This recalculates the effective lockup period, allowing the user to unlock their tokens earlier than originally committed. The recommendation is to disallow new stakes with shorter lockup periods and enforce that any additional stake must use a lockup period equal to or greater than the current one.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `c926eed4e5d707a63f34736158bd79873b8e0411` and `342795073d5d8abf2c3272f861cbbf63a4974774`.

**File(s) affected:**`SapienVault.sol`

**Description:** The `SapienVault` contract recalculates the effective lockup period when a user adds to an existing stake using the `stake()` function. The recalculation uses a **weighted average** between the current effective lockup period and the newly provided lockup period. This mechanism allows users to **reduce** their overall lockup duration by staking additional tokens with a shorter lockup period.

As a result, users can strategically lower their lockup commitment after the initial stake, undermining the intended locking mechanism.

**Exploit Scenario:**

1.   A user initially stakes 1,000 tokens with a 365-day lockup period.
2.   Later, the user stakes an additional 10,000 tokens with a 30-day lockup period.
3.   The weighted average lockup period is recalculated, heavily influenced by the new larger amount and shorter duration.
4.   The new effective lockup period becomes significantly lower than 365 days, allowing the user to unlock all tokens earlier than originally committed.
5.   The restaking can be repeated with a 30-day lockup period, further reducing the effective lockup duration.

**Recommendation:** Disallow new stakes with shorter lockup periods than the existing commitment. Enforce that any additional stake must use a lockup period equal to or greater than the current one.
