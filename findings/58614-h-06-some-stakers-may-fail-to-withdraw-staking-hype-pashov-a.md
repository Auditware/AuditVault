---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/staking
  - sector/liquid-staking
protocol: "[[Kinetiq]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md"
genome:
  - "[[reward-accounting]]"
  - "[[dos-resistance]]"
  - "[[dos/lockup]]"
  - "[[dos/selective]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-06] Some stakers may fail to withdraw staking HYPE

- id: 58614
- impact: HIGH
- protocol: Kinetiq_2025-02-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Kinetiq-security-review_2025-02-26.md

## Summary


The `StakingManager` contract has a problem where it is not using its buffer effectively. This can cause issues during periods of high withdrawal demands. The contract has two variables that are supposed to maintain a reserve of HYPE tokens, but the withdrawal logic does not utilize the buffer before initiating validator exits. This can lead to unnecessary exits and reduced staking efficiency. It is recommended to modify the contract to prioritize using the buffer before initiating validator exits.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `StakingManager` contract implements a buffer system intended to maintain a reserve of HYPE tokens for processing withdrawals. However, the current implementation fails to utilize this buffer effectively, potentially forcing unnecessary validator exits and creating systemic risks during periods of high withdrawal demand.

The contract maintains two buffer-related state variables:

- `hypeBuffer`: The current amount of HYPE tokens held in reserve
- `targetBuffer`: The desired buffer size

When users stake HYPE, the contract attempts to maintain this buffer through the `_distributeStake()` function, which prioritizes filling the buffer before delegating remaining tokens to validators. However, the critical flaw lies in the withdrawal logic.

In `queueWithdrawal()`, the contract immediately initiates a validator withdrawal through `_withdrawFromValidator()` without first attempting to service the withdrawal from the buffer. This defeats the purpose of maintaining a buffer and can lead to:

1. Unnecessary validator exits even when sufficient funds are available in the buffer
2. Reduced staking efficiency as funds may be pulled from productive validation

```solidity
_withdrawFromValidator(currentDelegation, amount);
```

This contrasts with more robust implementations like Lido's buffered ETH system, where withdrawals are first serviced from the buffer, and validator exits are only triggered when withdrawal demands exceed available reserves.

### Proof of Concept

1. User A stakes 100 HYPE, with `targetBuffer` set to 50 HYPE
    - 50 HYPE goes to buffer
    - 50 HYPE is delegated to validator
2. User B requests withdrawal of 40 HYPE
    - Despite having 50 HYPE in buffer, contract calls `_withdrawFromValidator()`

## Recommendations

Modify the `queueWithdrawal()` function to prioritize using the buffer before forcing validator exits.




