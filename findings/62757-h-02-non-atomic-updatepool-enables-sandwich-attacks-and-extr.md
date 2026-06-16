---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - vuln/pda/missing-seeds-check
  - impact/mev/backrun
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/sandwich-attack
  - novelty/variant
  - fix/add-check
  - sector/dex
protocol: "[[YuzuUSD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/YuzuUSD-security-review_2025-08-28.md"
genome:
  - "[[missing-seeds-check]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[variant]]"
  - "[[frontrun-exposure]]"
  - "[[pda-derivation]]"
  - "[[timestamp-dependence]]"
---
# [H-02] Non-atomic updatePool() enables sandwich attacks and extraction

- id: 62757
- impact: HIGH
- protocol: YuzuUSD_2025-08-28
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[YuzuUSD]]-security-review_2025-08-28.md

## Summary


There is a bug in the YuzuILP.updatePool() function, which allows for manipulation of the pool size and can lead to a type of attack called a "sandwich attack". This happens because the function does not check the current state of the pool before updating it with external input. This can be exploited by users to steal assets from other users. The recommended solution is to make the function only callable when the protocol is paused, or to add a cooldown period after any updates to allow for verification of the state.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `YuzuILP.updatePool()` lacks atomicity when updating the pool state, allowing manipulation of `poolSize` in a way that can be exploited through sandwich attacks.

The function directly sets `poolSize` from the externally provided input without validating against the current state or considering ongoing user operations.

```solidity
function updatePool(uint256 newPoolSize, uint256 newDailyLinearYieldRatePpm) external onlyRole(POOL_MANAGER_ROLE) {
    if (newDailyLinearYieldRatePpm > 1e6) {
        revert InvalidYield(newDailyLinearYieldRatePpm);
    }

    poolSize = newPoolSize;
    dailyLinearYieldRatePpm = newDailyLinearYieldRatePpm;
    lastPoolUpdateTimestamp = block.timestamp;

    emit UpdatedPool(newPoolSize, newDailyLinearYieldRatePpm);
}
```

Consider the following scenario:

1. User1 and User2 both deposit `100e6` assets into the pool.
2. The treasury funds the liquidity buffer with their deposits (`200e6` total).
3. Pool Manager prepares to call `updatePool(200e6, 0.1e6)` to set a `10%` yield rate.
4. User1 front-runs this transaction and redeems half their shares, reducing the actual `poolSize`.
5. The `updatePool()` transaction executes, artificially restoring `poolSize` to `200e6`.
6. User1 back-runs with another redemption for their remaining shares, now at an inflated value.
7. User1 extracts more assets than their fair share, effectively stealing from User2.

**Proof of Concept**: [test_audit_sandwichPoolUpdate](https://gist.github.com/merlinboii/b125979b081266de2491e883712713fc#file-yuzuilp-t-sol-L116)

## Recommendation

The `updatePool()` should maintain atomicity because it updates state that is used to price and account across the entire pool. 

The possible solutions are to make it callable only while the protocol is paused and/or add a short cooldown for user operations after any admin update. This gives the operator time to verify state consistency before deposits or redemptions resume.
