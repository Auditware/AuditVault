---
tags:
  - lang/move
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[DYAD]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [C-01] The entire kerosene supply can be drained by claiming rewards

- id: 41686
- impact: HIGH
- protocol: [[DYAD]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Dyad-security-review.md

## Summary


The bug report shows a problem with the formula used to calculate rewards when someone stakes a note. The issue is that the rewards can be very high, making it impossible for users to stake or allowing them to claim most of the total supply with a small investment. The recommendation is to divide the XP values by `1e18` to fix the issue.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

This is the current formula used to calculate rewards when a note is staked:

```solidity
	function _calculateRewards(uint256 noteId, StakeInfo storage stakeInfo) internal view returns (uint256) {
	    uint256 timeDiff = block.timestamp - stakeInfo.lastRewardTime;

	    uint256 xp = dyadXP.balanceOfNote(noteId);

->	    return timeDiff * rewardsRate * stakeInfo.liquidity * xp;
	}
```

The issue is that rewards can be extremely high, as the XP values are really big.

Kerosene has a total supply of: `1_000_000_000 1e18`, but most notes have too much XP.

In the best-case scenario, the XP will be larger than the total supply and it won't be possible to stake anything.

In the worst-case scenario, a user can claim most of the total supply with a minimal liquidity investment, as small as 1 wei.

## Recommendations

The XP must be scaled down in the reward calculation.
It is recommended to divide by `1e18` after multiplying `rewardsRate` and `stakeInfo.liquidity` together. Depending on the order of magnitude of `xp` values, the same will have to be done when multiplying by `xp`.
