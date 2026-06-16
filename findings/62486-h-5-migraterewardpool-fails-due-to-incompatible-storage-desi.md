---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/farm
  - sector/staking
  - sector/staking-pool
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Notional]]"
auditors:
  - "[[Ledger_Patrol]]"
  - "[[bretzel]]"
  - "[[mstpr-brainbot]]"
  - "[[tjonair]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# H-5: `migrateRewardPool` Fails Due to Incompatible Storage Design in `CurveConvexLib`

- id: 62486
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: tjonair (Sherlock)
- source: N/A

## Summary


This report discusses an issue with the `migrateRewardPool` function in the `AbstractRewardManager` contract. This function is meant to migrate rewards from an old Convex reward pool to a new one, but it fails in practice because the `CurveConvex2Token` contract has an immutable reward pool address. This means that even if the reward pool is changed in the reward manager, the `CurveConvex2Token` will still deposit tokens into the old reward pool. This violates the contract's interface and prevents the reward pool from being changed when Convex creates a new one. The team has acknowledged this issue but will not be fixing it at this time. A possible solution would be to create a migration logic for `CurveConvex2Token` so that the reward pool can be properly migrated from one to another.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/485 

This issue has been acknowledged by the team but won't be fixed at this time.

## Found by 
Ledger\_Patrol, bretzel, mstpr-brainbot, tjonair, xiaoming90

### Summary

The [`migrateRewardPool`](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/rewards/AbstractRewardManager.sol#L44-L65) function in the `AbstractRewardManager` contract is designed to migrate rewards from an old Convex reward pool to a new one by updating internal storage, withdrawing from old reward pool and depositing into the new reward pool. This mechanism relies on writing to local storage slots (e.g., `_getRewardPoolSlot()`), via delegatecall from a yield strategy contract.

In practice, this fails because when `CurveConvex2Token` is deployed, it deploys `CurveConvexLib`, where reward pool address is immutable. The `CurveConvex2Token` stores the address of `CurveConvexLib` into another immutable variable.

Since the reward pool address is immutable in `CurveConvexLib`, whenever Lp token is minted, the `CurveConvex2Token` deposit them to the same reward pool even if reward pool is changed in reward manager. There is no migration possible in `CurveConvex2Token`. This breaks the core migration functionality, despite the function being exposed and annotated for use when the reward pool changes.

This violates the IRewardManager interface contract [NATSPEC](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/interfaces/IRewardManager.sol#L82-L86), which states that `migrateRewardPool` should be used both initially and when the reward pool changes - of which reward pool change can be accomplished properly in this case.


### Root Cause

None

### Internal Pre-conditions

None

### External Pre-conditions

Convex protocol can decide to deprecate an old pool and create a new one

### Attack Path

None

### Impact

Reward pool cannot be changed when convex migrates to a new reward pool

### PoC

_No response_

### Mitigation

Create a migration logic for `CurveConvex2Token` where reward pool can be migrated from one to another
