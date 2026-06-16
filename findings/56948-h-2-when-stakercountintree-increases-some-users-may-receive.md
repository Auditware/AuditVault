---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/staking
  - platform/sherlock
protocol: "[[LayerEdge   Staking]]"
auditors:
  - lukris02
report: "https://github.com/sherlock-audit/2025-05-layeredge-judging"
genome:
  - "[[reward-accounting]]"
  - "[[debt-accrual-update]]"
  - "[[logic/reward-calculation]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[fix-arithmetic]]"
  - "[[precondition/specific-contract-state]]"
  - "[[blast-radius/single-user]]"
---
# H-2: When `stakerCountInTree` Increases, Some Users May Receive Less Interest

- id: 56948
- impact: HIGH
- protocol: LayerEdge - Staking
- reporter: lukris02 (Sherlock)
- source: N/A

## Summary


The bug report is about an issue found in the `_checkBoundariesAndRecord` function of the LayerEdgeStaking smart contract. When the `stakerCountInTree` variable increases, some users in tier 3 are not properly promoted to tier 2, resulting in them receiving less interest. This happens because the ranking of `new_t1 + new_t2` is not considered when updating the user's tier, only the ranking of `old_t1 + old_t2` is updated. This can be exploited by an attacker to receive less interest than expected. A proof-of-concept (PoC) has been provided to demonstrate the issue and a mitigation has been proposed to fix the problem. The impact of this bug is that some users may receive less interest than they should. 

## Details

Source: https://github.com/sherlock-audit/2025-05-layeredge-judging/issues/230 

## Found by 
Cybrid, Hecok, Hurricane, Pablo, X77, benjamin\_0923, durov, future, jkoppel, kazan, lukris02, montecristo, rudhra1749, shiazinho, slavina, t0x1c

### Summary
In the `_checkBoundariesAndRecord` function, when `stakerCountInTree` increases, a user in tier 3 is not promoted to tier 2 when it should be.

### Root Cause
The root cause is that when `stakerCountInTree` increases, users who need to transition from tier 3 to tier 2 are not properly updated.
At this point, the ranking of `new_t1 + new_t2` could be moved from tier 3 to tier 2. 
However, in line 897, only the ranking of `old_t1 + old_t2` is updated instead of considering `new_t1 + new_t2`.

https://github.com/sherlock-audit/2025-05-layeredge/tree/main/edgen-staking/src/stake/LayerEdgeStaking.sol#L896
```solidity
    function _checkBoundariesAndRecord(bool isRemoval) internal {
        ...
        // Tier 2 boundary handling
        if (new_t1 + new_t2 > 0) {
            if (new_t2 != old_t2) {
                // Need to update all users between the old and new tier 2 boundaries
                uint256 old_boundary = old_t1 + old_t2;
                uint256 new_boundary = new_t1 + new_t2;

                if (new_boundary > old_boundary) {
                    // Promotion case: update all users from old_boundary+1 to new_boundary
                    for (uint256 rank = old_boundary + 1; rank <= new_boundary; rank++) {
                        _findAndRecordTierChange(rank, n);
                    }
                } else {
                    // Demotion case: update all users from new_boundary+1 to old_boundary
                    for (uint256 rank = new_boundary + 1; rank <= old_boundary; rank++) {
                        _findAndRecordTierChange(rank, n);
                    }
                }
            }
            // Handle case where Tier 2 count stays the same
            else if (isRemoval) {
                _findAndRecordTierChange(new_t1 + new_t2, n);
896:        } else if (!isRemoval) {
                _findAndRecordTierChange(old_t1 + old_t2, n);
            }
        }
    }
```

### Internal pre-conditions
N/A

### External pre-conditions
N/A

### Attack Path
Consider the scenario where `oldStakerCountInTree = 14` and `newStakerCountInTree = 15`. 
The tier distribution changes from (2, 4, 8) to (3, 4, 8), but the seventh-ranked user's tier does not change from tier 3 to tier 2.

### PoC
https://github.com/sherlock-audit/2025-05-layeredge/tree/main/edgen-staking/test/stake/LayerEdgeStakingTest.t.sol
```solidity
    function toString(uint256 value) internal pure returns (string memory result) {
        assembly {
            result := add(mload(0x40), 0x80)
            mstore(0x40, add(result, 0x20)) // Allocate memory.
            mstore(result, 0) // Zeroize the slot after the string.
            let end := result // Cache the end of the memory to calculate the length later.
            let w := not(0) // Tsk.
            for { let temp := value } 1 {} {
                result := add(result, w) // `sub(result, 1)`.
                mstore8(result, add(48, mod(temp, 10)))
                temp := div(temp, 10) // Keep dividing `temp` until zero.
                if iszero(temp) { break }
            }
            let n := sub(end, result)
            result := sub(result, 0x20) // Move the pointer 32 bytes back to make room for the length.
            mstore(result, n) // Store the length.
        }
    }
    function test_LayerEdgeStaking_checkBoundariesAndRecord() public {
        vm.startPrank(admin);
        uint256 userAmount = 10_000 * 1e18;
        address[20] memory users;
        for (uint256 i = 0; i < 20; i++) {
            users[i] = makeAddr(string(abi.encodePacked("users", toString(i)))); 
            token.transfer(users[i], userAmount);
        } 
        vm.stopPrank();
        for (uint256 i = 1; i <= 15; i++) {
            vm.startPrank(users[i]);
            token.approve(address(staking), MIN_STAKE);
            staking.stake(MIN_STAKE);
            vm.stopPrank();
        }
        address user = users[7];
        vm.warp(block.timestamp + 365 days);
        uint256 userAPY = staking.getUserAPY(user);
        vm.startPrank(user);
        uint256 beforeUserAmount = token.balanceOf(user);
        staking.claimInterest();
        uint256 afterUserAmount = token.balanceOf(user);
        console2.log("Procotol User   APY : %d", userAPY);
        console2.log("Actual Received APY : %d", 100e18 * (afterUserAmount - beforeUserAmount) / MIN_STAKE);
        vm.stopPrank();
    }
```
forge test --match-test "test_LayerEdgeStaking_checkBoundariesAndRecord" -vv
Result:
```bash
Ran 1 test for test/stake/LayerEdgeStakingTest.t.sol:LayerEdgeStakingTest
[PASS] test_LayerEdgeStaking_checkBoundariesAndRecord() (gas: 6634274)
Logs:
  Procotol User   APY : 35000000000000000000
  Actual Received APY : 20000000000000000000
```
After mitigation, Result:
```bash
Ran 1 test for test/stake/LayerEdgeStakingTest.t.sol:LayerEdgeStakingTest
[PASS] test_LayerEdgeStaking_checkBoundariesAndRecord() (gas: 6956510)
Logs:
  Procotol User   APY : 35000000000000000000
  Actual Received APY : 35000000000000000000
```
### Impact
1. Some Users receive less interest.

### Mitigation
https://github.com/sherlock-audit/2025-05-layeredge/tree/main/edgen-staking/src/stake/LayerEdgeStaking.sol#L897
```diff
        if (new_t1 + new_t2 > 0) {
            if (new_t2 != old_t2) {
                // Need to update all users between the old and new tier 2 boundaries
                uint256 old_boundary = old_t1 + old_t2;
                uint256 new_boundary = new_t1 + new_t2;

                if (new_boundary > old_boundary) {
                    // Promotion case: update all users from old_boundary+1 to new_boundary
                    for (uint256 rank = old_boundary + 1; rank <= new_boundary; rank++) {
                        _findAndRecordTierChange(rank, n);
                    }
                } else {
                    // Demotion case: update all users from new_boundary+1 to old_boundary
                    for (uint256 rank = new_boundary + 1; rank <= old_boundary; rank++) {
                        _findAndRecordTierChange(rank, n);
                    }
                }
            }
            // Handle case where Tier 2 count stays the same
            else if (isRemoval) {
                _findAndRecordTierChange(new_t1 + new_t2, n);
            } else if (!isRemoval) {
897:            _findAndRecordTierChange(old_t1 + old_t2, n);
+               _findAndRecordTierChange(new_t1 + new_t2, n);
            }
        }
```
