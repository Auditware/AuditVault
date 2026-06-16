---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/gaming
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# [H-07] `SpinLottery` will break if the first `prizeId` is selected

- id: 62544
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


This bug report discusses an issue with a function called `_claimPrize` that is used to select a prize for a user. The problem occurs when a certain condition is met, causing the function to break and making it impossible for users to claim a specific prize. This happens because of a line of code that increments one variable and decrements another, resulting in the loss of a prize. The report recommends removing the line of code causing the issue to fix the problem.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Inside the `_claimPrize` logic, if the randomly selected `prizeId` is equal to `firstPrizeId`, `firstPrizeId` will be incremented. However, `nextPrizeId` is also decremented.

```solidity
    function _claimPrize(uint8 rarity, uint256 randomValue) internal returns (address nftAddress, uint88 tokenId) {
        PrizePool storage pool = prizePools[rarity];
        if (pool.nextPrizeId <= pool.firstPrizeId) revert NoPrizesAvailable();
        
        // Calculate prize count and random index
        uint256 prizeCount = pool.nextPrizeId - pool.firstPrizeId;
        uint256 index = randomValue % prizeCount;
        uint256 prizeId = pool.firstPrizeId + index;
        
        // Get prize data
        uint256 packed = pool.prizeData[prizeId];
        
        // Remove prize using unordered removal pattern - more gas efficient than array management
        // When a prize is removed, we move the last prize to its place if it's not already the last
        if (prizeId != pool.nextPrizeId - 1) {
            uint256 lastPrizeId = pool.nextPrizeId - 1;
            pool.prizeData[prizeId] = pool.prizeData[lastPrizeId];
            delete pool.prizeData[lastPrizeId];
        } else {
            delete pool.prizeData[prizeId];
        }
        
        // If we've removed the first prize, increment firstPrizeId
        if (prizeId == pool.firstPrizeId) {
>>>         pool.firstPrizeId++;
        }
        
        // Decrement nextPrizeId
>>>     pool.nextPrizeId--;
        
        uint8 unpackedRarity;
        (nftAddress, tokenId, unpackedRarity) = unpackPrize(packed);
        assert(unpackedRarity == rarity);
    }
```

This will cause the prize selection function to break for the corresponding rarity. Consider the following scenario:

- `pool.firstPrizeId` = 1 and `pool.nextPrizeId` = 3, meaning there are 2 possible prizes.

- A user spins and wins the first prize (`prizeId` = 1).

- `pool.firstPrizeId++` and `pool.nextPrizeId--` are performed, resulting in `pool.firstPrizeId` = 2 and `pool.nextPrizeId` = 2, meaning the other prize is lost and can no longer be played and claimed by users.

## Recommendations

Remove the `pool.firstPrizeId++` logic, as it is unnecessary because the `lastPrizeId` is moved to the first position.
