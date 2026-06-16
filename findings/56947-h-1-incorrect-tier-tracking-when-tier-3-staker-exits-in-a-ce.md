---
tags:
  - lang/solidity
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LayerEdge   Staking]]"
auditors:
  - newspacexyz
report: "https://github.com/sherlock-audit/2025-05-layeredge-judging"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# H-1: Incorrect tier tracking when tier 3 staker exits in a certain case

- id: 56947
- impact: HIGH
- protocol: LayerEdge - Staking
- reporter: newspacexyz (Sherlock)
- source: N/A

## Summary


Issue H-1: Incorrect tier tracking when a tier 3 staker exits in a certain case.

Summary:
The code for tracking tiers in the staking contract is not working properly. When a tier 3 staker exits, the code breaks and the tier tracking becomes incorrect.

Root Cause:
The issue lies in the code that handles the removal of a staker. When a tier 3 staker exits, the code does not properly account for this and breaks the tier tracking.

Attack Path:
1. Initially, there are 15 stakers, with 3 in tier 1, 4 in tier 2, and 8 in tier 3.
2. When a tier 3 staker exits, the code should result in 2 tier 1 stakers, 4 tier 2 stakers, and 8 tier 3 stakers.
3. However, due to the issue in the code, the result is 2 tier 1 stakers, 5 tier 2 stakers, and 7 tier 3 stakers.
4. This leads to incorrect tier tracking and can result in loss of funds for the protocol.

Impact:
The incorrect tier tracking can result in loss of funds for the protocol, as they may have to handle a larger APY due to more users being in tier 2 unfairly.

Proof of Concept:
A proof of concept has been provided in the staking test contract to demonstrate the issue. The code has been fixed in the protocol team's PRs/commits.

Mitigation:
No response has been provided for mitigating this issue.

## Details

Source: https://github.com/sherlock-audit/2025-05-layeredge-judging/issues/83 

## Found by 
MysteryAuditor, X77, future, jkoppel, newspacexyz, rudhra1749, slavina, wickie

### Summary

Incorrect tier tracking when tier 3 staker exits in a certain case

### Root Cause

```solidity
            else if (isRemoval) {
                _findAndRecordTierChange(new_t1 + new_t2, n);
            }
```
Whenever a staker exits and the old T2 and new T2 counts are the same, then we'd end up above. However, this code does not properly work when a T3 staker exits from the tree and completely breaks the tier tracking.

In our scenario below (attack path and POC), there are 7 T1 and T2 and 8 T3 stakers (15 total) stakers initially. T3 staker exits, so now there must be 2 T1 stakers, 4 T2 stakers and 8 T3 stakers where the last T2 staker is demoted. However, in the snippet shown above, we write to `new_t1 + new_t2` rank which is 6 (2 + 4). However, as a T3 staker exited, then the 7th rank is the actual last T2 staker, not the 6th we are writing to.

### Internal Pre-conditions

- Check in the root cause snippet should be reached, this happens when the T2 count before and after a removal are the same

### External Pre-conditions

-

### Attack Path

1. There are 15 stakers, distribution is:
- T1 = 15 * 0.2 = 3
- T2 = 15 * 0.3 = 4
- T3 = 15 - 3 - 4 = 8
2. User from T3 unstakes, distribution should be:
- T1 = 14 * 0.2 = 2
- T2 = 14 * 0.3 = 4
- T3 = 14- 4 - 2 = 8
3. The following code is reached upon the removal and the T2 boundary handling block:
```solidity
            else if (isRemoval) {
                _findAndRecordTierChange(new_t1 + new_t2, n);
            }
```
4. We write to the 6th rank (2 + 4), however as a T3 staker exited, then the current T1 and T2 staker counts are still the initial 7 (3 + 4), thus we must write to rank 7 (if T1 or T2 exits, then the 6th rank is properly demoted as that is the correct boundary as T1 and T2 current counts are now 6 due to the exit, however here, 7th is the correct boundary as T3 exited and T1 and T2 counts didn't change)
5. As we write to the 6th rank, he remains T2 instead of the 7th rank demoting to T3, thus the distribution breaks and is now `2 T1 (correct), 5 T2 (incorrect), 7 T3 (incorrect)`

### Impact

Incorrect tier tracking, loss of funds for the protocol as they must handle a bigger APY due to more users being in T2 unfairly

### PoC

First, due to issue starting with title `An edge case in ....`, we must do a little fix to reach the proper state:
```diff
            } else if (!isRemoval) {
+                _findAndRecordTierChange(new_t1 + new_t2, n);
-                _findAndRecordTierChange(old_t1 + old_t2, n);
            }
```
Note that I am not sure whether this fix is perfect, however it makes the state consistent, at least in the flow for our issue (we have assertions for that in our POC below).

Then, add this function in the staking contract to easily get the tier of a user:
```solidity
    function getTier(address user) public view returns (uint256) { // note: added
        if (stakerTierHistory[user].length == 0) return 0;
        TierEvent memory te = stakerTierHistory[user][stakerTierHistory[user].length - 1];
        return uint256(te.to);
    }
```

Now, paste the following POC in the staking test contract:
```solidity
       function testIssue() public {
        for (uint256 i; i < 15; i++) {
            address user = address(uint160(i + 1));
            deal(address(token), user, 3000e18);
            vm.startPrank(user);
            token.approve(address(staking), MIN_STAKE);
            staking.stake(MIN_STAKE);
        }

        uint256 t1Count;
        uint256 t2Count;
        uint256 t3Count;
        for (uint256 i; i < 15; i++) {
            address user = address(uint160(i + 1));
            uint256 tier = staking.getTier(user);
            if (tier == 1) {
                t1Count++;
                continue;
            }

            if (tier == 2) {
                t2Count++;
                continue;
            }

            if (tier == 3) {
                t3Count++;
                continue;
            }
        }

        // NOTE: Changed `old_t1 + old_t2` to `new_t1 + new_t2` in the last block of `_checkBoundariesAndRecord()` so we get into a correct state due to another issue (not sure if this is the proper fix but it works in this case)
        assertEq(staking.stakerCountInTree(), 15);
        (uint256 t1ShouldBe, uint256 t2ShouldBe, uint256 t3ShouldBe) = staking.getTierCountForStakerCount(staking.stakerCountInTree());

        assertEq(t1Count, 3);
        assertEq(t1ShouldBe, t1Count);
        assertEq(t2Count, 4);
        assertEq(t2ShouldBe, t2Count);
        assertEq(t3Count, 8);
        assertEq(t3ShouldBe, t3Count);

        address unstakingUser = address(uint160(10));
        uint256 r = staking.getTier(unstakingUser);
        assertEq(r, 3);

        vm.startPrank(unstakingUser);
        staking.unstake(MIN_STAKE);

        assertEq(staking.stakerCountInTree(), 14);
        (t1ShouldBe, t2ShouldBe, t3ShouldBe) = staking.getTierCountForStakerCount(staking.stakerCountInTree());

        t1Count = 0;
        t2Count = 0;
        t3Count = 0;
        for (uint256 i; i < 15; i++) {
            address user = address(uint160(i + 1));
            if (unstakingUser == user) continue; // He left the tree above so shouldn't include him
            uint256 tier = staking.getTier(user);
            if (tier == 1) {
                t1Count++;
                continue;
            }

            if (tier == 2) {
                t2Count++;
                continue;
            }

            if (tier == 3) {
                t3Count++;
                continue;
            }
        }

        assertEq(t1Count, 2); // Correct!
        assertEq(t1Count, t1ShouldBe);

        assertEq(t2Count, 5); // Incorrect!
        assertNotEq(t2Count, t2ShouldBe);

        assertEq(t3Count, 7); // Incorrect
        assertNotEq(t3Count, t3ShouldBe);
    }
```

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Layer-Edge/edgen-staking/pull/7
