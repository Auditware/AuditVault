---
tags:
  - lang/move
  - lang/solidity
  - sector/lending
  - sector/staking
  - sector/staking-pool
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-06] Staking rewards should be claimed before each `balanceOfNote` changing

- id: 41693
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


This bug report is about a medium severity bug that has a high likelihood of occurring. The `claimRewards` function is not being invoked when the `balanceOfNote` changes, which can lead to incorrect calculations and cause losses in assets. The recommendation is to claim rewards for notes with `stakes[noteId].isStaked == true` before any changes are made to the `balanceOfNote`. This should be done before any of the following functions are called: `deposit`, `withdraw`, `mintDyad`, `burnDyad`, `liquidate` (for both `id` and `to` notes).

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Since staking rewards depend on `balanceOfNote` the `claimRewards` function should be invoked on each `balanceOfNote` changing. But this functionality is not implemented. This way reward can be calculated incorrectly which can cause sufficient asset losses.

```solidity
    function _calculateRewards(uint256 noteId, StakeInfo storage stakeInfo) internal view returns (uint256) {
        uint256 timeDiff = block.timestamp - stakeInfo.lastRewardTime;

>>      uint256 xp = dyadXP.balanceOfNote(noteId);

>>      return timeDiff * rewardsRate * stakeInfo.liquidity * xp;
    }
```

## Recommendations

Consider claiming rewards for notes with `stakes[noteId].isStaked == true` before any `balanceOfNote` changing: `deposit`, `withdraw`, `mintDyad`, `burnDyad`, `liquidate` (for both `id` and `to` notes).
