---
tags:
  - sector/governance
  - sector/nft
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[governance-voting-power-snapshot]]"
  - "[[add-snapshot]]"
---
# [H-05]  Incorrect `last_point.blk` calculation due to shared memory in `_checkpoint()`

- id: 58016
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


This bug report discusses an issue in the `_checkpoint` function of the VotingEscrow contract. The issue is caused by a reference to `last_point` instead of an independent copy being assigned to `initial_last_point`. This results in incorrect block number calculations which affect voting power calculations and governance functionality. The recommendation is to create a copy of `last_point` to fix the issue.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the `_checkpoint` function of the VotingEscrow contract, there's an issue with how `initial_last_point` is assigned as a reference to `last_point` instead of creating an independent copy. This causes incorrect block number extrapolation calculations which affect voting power calculations throughout the system.

```solidity
    function _checkpoint(
        uint _tokenId,
        LockedBalance memory old_locked,
        LockedBalance memory new_locked
    ) internal {
        ...
        Point memory initial_last_point = last_point; // @audit initial_last_point is a pointer which points to last_point instead of a copy
        uint block_slope = 0; // dblock/dt
        if (block.timestamp > last_point.ts) {
            block_slope =
                (MULTIPLIER * (block.number - last_point.blk)) /
                (block.timestamp - last_point.ts);
        }

        {
            uint t_i = (last_checkpoint / WEEK) * WEEK;
            for (uint i = 0; i < 255; ++i) {
                // Hopefully it won't happen that this won't get used in 5 years!
                // If it does, users will be able to withdraw but vote weight will be broken
                t_i += WEEK;
                int128 d_slope = 0;
                if (t_i > block.timestamp) {
                    t_i = block.timestamp;
                } else {
                    d_slope = slope_changes[t_i];
                }
                last_point.bias -=
                    last_point.slope *
                    int128(int256(t_i - last_checkpoint));
                last_point.slope += d_slope;
                if (last_point.bias < 0) {
                    // This can happen
                    last_point.bias = 0;
                }
                if (last_point.slope < 0) {
                    // This cannot happen - just in case
                    last_point.slope = 0;
                }
                last_checkpoint = t_i;
                last_point.ts = t_i; // @audit last_point.ts is updated to t_i
                last_point.blk =
                    initial_last_point.blk +
                    (block_slope * (t_i - initial_last_point.ts)) / // @audit the initial_last_point.ts will also be updated to t_i.
                    MULTIPLIER;
                _epoch += 1;
                if (t_i == block.timestamp) {
                    last_point.blk = block.number;
                    break;
                } else {
                    point_history[_epoch] = last_point;
                }
            }
        }

        ...
    }
```

When `last_point.ts` is updated to `t_i` in the loop, `initial_last_point.ts` is also updated to the same value because they reference the same memory location. This results in `(t_i - initial_last_point.ts)` evaluating to zero, causing `last_point.blk` to remain unchanged throughout the loop iterations.

This issue directly impacts:
- The accuracy of historical voting power calculations: Total voting power and Per-NFT voting power.
- Governance functionality that depends on accurate vote weight.

## Recommendations

Create a copy of the `last_point`:

```diff
    function _checkpoint(
        uint _tokenId,
        LockedBalance memory old_locked,
        LockedBalance memory new_locked
    ) internal {
        ...
-       Point memory initial_last_point = last_point;
+       Point memory initial_last_point = Point({
+         bias: last_point.bias,
+         slope: last_point.slope,
+         ts: last_point.ts,
+         blk: last_point.blk
        ...
});

```
