---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/nft
  - sector/oracle
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-04-25.md"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[chainlink-round-completeness]]"
  - "[[weak-randomness]]"
---
# [H-06] Incorrect `pendingCounts` calculation

- id: 62543
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


This bug report is about a problem in the SpinLottery contract where users can spin to win a prize NFT. The spin result is based on randomness from Chainlink VRF, but it is asynchronous. This means that when a user triggers the spin function, the contract needs to check the current prize pool and any potential claimed prizes before calculating the result. 

The issue arises in the function `calculatePendingPrizesForRarity` where the `_prizeCount` parameter is used to calculate the `pendingCount`. However, this `_prizeCount` can be controlled by users and does not accurately reflect the number of prizes that will be distributed in one spin. This can cause problems with the logic in the `spin` function and may block future spins.

The recommendation is to revisit the calculation of `pendingCount` to ensure it accurately reflects the number of prizes to be distributed.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In SpinLottery contract, users can spin to win one prize NFT. The spin result is based on the randomness from Chainlink VRF. The spin result is asynchronous. When users trigger `spin` function, we will calculate the `pendingCounts`. Because there are some previous `spin` transactions, these transactions' results are unknown, and these `spin` transactions may win and claim some prize NFTs from the contract. So when we trigger `spin`, we need to check current prize in the pool and also the potential claimed prize. 

The `pendingCounts` is used to record the potential claimed prize NFT before this `spin`. 

According to current implementation, if the user wins in one spin, the user will gain one prize NFT. The problem here is that in function `calculatePendingPrizesForRarity`, when we calculate the `pendingCount`, the `pendingCount` is related to `_prizeCount`, `weight`, `totalRarityWeight`. The `_prizeCount` can be controlled by users. When users trigger `spin` with one large `_prizeCount`, we will get one large `pendingCount`. The `pendingCount` will be updated into `prizePools[i].pendingCount`.

This will cause the later `spin` may be blocked.

In function `calculatePendingPrizesForRarity`, the parameter `_prizeCount` is expected to be the prize count that we will distribute according to the commnet. However, this is incorrect. The `_prizeCount` can be controlled by the user, and no matter which value `_prizeCount` is, the distribute prize count for one spin will always be `1`. This will cause some logic related to `_prizeCount` in `spin` are incorrect.

```solidity
    function spin(uint256 _totalSlots, uint256 _prizeCount) external whenNotPaused returns (uint256) {
        for (uint8 i = 1; i <= maxRarityId; i++) {
            if (rarityConfigs[i].active) {
                pendingCounts[i] = calculatePendingPrizesForRarity(_prizeCount, i);
                totalPending += pendingCounts[i];
            }
        }
        if (totalPending == 0) {
            for (uint8 i = 1; i <= maxRarityId; i++) {
                if (rarityConfigs[i].active) {
                    pendingCounts[i] = 1;
                    totalPending = 1;
                    break;
                }
            }
        }
        for (uint8 i = 1; i <= maxRarityId; i++) {
            if (pendingCounts[i] > 0) {
                uint256 available = getAvailablePrizes(i);
                uint256 pending = prizePools[i].pendingCount;
                if (available - pending < pendingCounts[i]) {
                    revert InsufficientPrizes();
                }
            }
        }
        for (uint8 i = 1; i <= maxRarityId; i++) {
            if (pendingCounts[i] > 0) {
                prizePools[i].pendingCount += uint96(pendingCounts[i]);
            }
        }
    }
    function calculatePendingPrizesForRarity(uint256 _prizeCount, uint8 rarity) internal view returns (uint256) {
        if (_prizeCount == 1) {
            // For single prizes, prioritize first active rarity
            return rarity == 1 && rarityConfigs[1].active ? 1 : 0;
        }
        
        if (!rarityConfigs[rarity].active) return 0;
        
        uint256 weight = rarityConfigs[rarity].weight;
@>        uint256 pendingCount = (_prizeCount * weight) / totalRarityWeight;
        
        if (_prizeCount > 1 && pendingCount == 0 && weight > 0) {
            pendingCount = 1;
        }
        
        return pendingCount;
    }
```
## Recommendations

Revisit the `pendingCount`'s calculation.
