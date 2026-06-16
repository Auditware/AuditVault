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
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# [H-04] DoS risk from pending prize locking mechanism

- id: 62541
- impact: HIGH
- protocol: RipIt_2025-04-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-04-25.md

## Summary


A bug was found in the `SpinLottery` contract where users can temporarily prevent others from participating in the lottery. This is caused by a minimum guarantee mechanism that sets a conservative value for `pendingCount` if certain conditions are met. This can lead to a Denial of Service (DoS) situation when the total available prizes are insufficient. To fix this, the locking logic needs to be refined.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `calculatePendingPrizesForRarity` function in the `SpinLottery` contract implements a minimum guarantee mechanism where, if `_prizeCount` is greater than `1` and the `weight` is greater than `0`, the `pendingCount` is conservatively set to 1.

```solidity
        // Ensure at least some prizes are allocated if weights allow it
        if (_prizeCount > 1 && pendingCount == 0 && weight > 0) {
            pendingCount = 1;
        }
```
In the `spin` function, the `pendingCounts` are locked, and if the total available prizes are insufficient, it can lead to an `InsufficientPrizes` error, resulting in a Denial of Service (DoS).

```solidity
        for (uint8 i = 1; i <= maxRarityId; i++) {
            if (rarityConfigs[i].active) {
                pendingCounts[i] = calculatePendingPrizesForRarity(_prizeCount, i);
                totalPending += pendingCounts[i];
            }
        }
        ...
        // Check if enough prizes are available considering pending ones
        for (uint8 i = 1; i <= maxRarityId; i++) {
            if (pendingCounts[i] > 0) {
                uint256 available = getAvailablePrizes(i);
                uint256 pending = prizePools[i].pendingCount;
                
                if (available - pending < pendingCounts[i]) {
                    revert InsufficientPrizes();
                }
            }
        }
```

This situation is exacerbated when **a high-value prize (`rarity`) has a low number of `available` prizes**. 

An attacker or normal user could initiate multiple `spin` transactions with `_prizeCount = 2`, effectively locking the limited prizes and temporarily preventing other users from participating in the lottery, leading to frequent DoS scenarios for a certain period of time, which leads to bad user experience.

## Recommendations

The relevant locking logic should be refined to fix this issue.
