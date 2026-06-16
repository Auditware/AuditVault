---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[weak-randomness]]"
---
# [H-03] Prize locking mechanism inconsistency with weight proportions

- id: 62540
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


This bug report is about a problem in the SpinLottery contract, where the locking of prizes does not follow the intended weight distribution. This can result in unfair outcomes and may also cause unexpected failures. The report recommends revising the lock mechanism to fix this issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the SpinLottery contract, users pay for `spin`s based on the weight distribution of the rarities, which determines the cost of participation. 

```solidity
    function calculateSpinCost(uint256 _totalSlots, uint256 _prizeCount) public view returns (uint256) {
        if (_totalSlots == 0 || _prizeCount == 0 || _prizeCount > _totalSlots) {
            revert InvalidSlotConfiguration();
        }

        uint256 totalWeightedPrice = 0;
        
        // Calculate weighted average price across all active rarities
        for (uint8 i = 1; i <= maxRarityId; i++) {
            RarityConfig memory config = rarityConfigs[i];
            if (config.active) {
                totalWeightedPrice += uint256(config.basePrice) * config.weight;
            }
        }
        
        if (totalRarityWeight == 0) revert InvalidWeightConfiguration();
        uint256 avgBasePrice = totalWeightedPrice / totalRarityWeight;
        
        return (avgBasePrice * _prizeCount * 1000) / (_totalSlots * 1000);
    }
```

However, the actual locking of prizes does not adhere to this weight distribution.
**For example, in a scenario where the weights are distributed as `80%`, `10%`, and `10%`, if `prizeCount` is set to 2, the prizes may be locked in a `1:1:1` ratio instead of reflecting the intended weight distribution. Conversely, if `prizeCount` is set to `1`, it may result in a locking of `1:0:0`, disregarding the weights entirely.** 

Especially, when `1:0:0` is locked, the prize could still fall into the `higher rarity`: without protection of `lock mechanism`, the `fulfillRandomness` could fail unexpectedly.

```solidity
    function determineRarity(uint256 randomValue) public view returns (uint8) {
        uint256 value = randomValue % totalRarityWeight;
        uint256 cumulativeWeight = 0;
        
        // Iterate through rarities to find where the random value lands
        for (uint8 i = 1; i <= maxRarityId; i++) {
            RarityConfig memory config = rarityConfigs[i];
            if (config.active) {
                cumulativeWeight += config.weight; // <= could still fall into higher rarity
                if (value < cumulativeWeight) { 
                    return i;
                }
            }
        }
        
        // Fallback to highest rarity (should not happen unless weights are misconfigured)
        return maxRarityId;
    }
```

This inconsistency can lead to unfair outcomes, as the allocation of prizes does not align with their contributions.

## Recommendations

Revise the logic of lock mechanism.
