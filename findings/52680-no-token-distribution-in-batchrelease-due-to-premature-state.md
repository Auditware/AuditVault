---
tags:
  - lang/solidity
  - platform/halborn
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
  - sector/token
protocol: "[[Treasury Vesting]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/blockdag/treasury-vesting"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# No Token Distribution in BatchRelease Due to Premature State Updates

- id: 52680
- impact: HIGH
- protocol: [[Treasury Vesting]]
- reporter: Halborn
- source: https://www.halborn.com/audits/blockdag/treasury-vesting

## Summary


The bug report discusses an issue with the `batchRelease()` function in `TreasuryVesting` where the state updates and token transfers are separated into two loops. This causes the second loop to return 0 tokens since the state was already updated in the first loop. The report provides a proof of concept and a recommendation to combine the loops into a single one to ensure proper distribution of tokens. The issue has been resolved by the BlockDAG team.

## Details

##### Description

In the `batchRelease()` function of `TreasuryVesting`, currently separates state updates and token transfers into two separate loops, following the checks-effects-interactions pattern.

```
// Current implementation
function batchRelease(bytes32 category, address[] calldata users) external {

    //...

    // First loop: Updates state
    for (uint256 i = 0; i < users.length; i++) {
        uint256 releasable = getReleasableAmount(users[i], category); // Returns X tokens
        if (releasable > 0) {
            userReleased[users[i]][category] += releasable;  // Updates state
            categoryVestings[category].released += releasable;
            totalReleased += releasable;
            processed++;
        }
    }

    // Second loop: Attempts transfers
    for (uint256 i = 0; i < users.length; i++) {
        uint256 releasable = getReleasableAmount(users[i], category); // Returns 0 because state was updated
        if (releasable > 0) { // This condition is never true
            bdagToken.safeTransferFrom(msg.sender, users[i], releasable);
        }
    }

    //...

}
```

However, this implementation causes the second loop's `getReleasableAmount()` calls to return 0 since the state has already been updated in the first loop, resulting in no tokens being transferred to users.

##### Proof of Concept

Add the following test function in the foundry test file:

```
    function test_BatchRelease() public {
        test_AddEarlyBirdCategory();

        // Setup allocations
        vm.startPrank(operator);
        treasuryVesting.allocateTokens(user1, treasuryVesting.EARLY_BIRD_CATEGORY(), 1000e18);
        treasuryVesting.allocateTokens(user2, treasuryVesting.EARLY_BIRD_CATEGORY(), 2000e18);
        vm.stopPrank();

        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;

        vm.startPrank(admin);
        treasuryVesting.batchRelease(treasuryVesting.EARLY_BIRD_CATEGORY(), users);
        vm.stopPrank();
        assertEq(token.balanceOf(user1), 1000e18);
        assertEq(token.balanceOf(user2), 2000e18);
    }
```

**Output**:

![](https://halbornmainframe.com/proxy/audits/images/67b590a552e021e002221bbc)

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:H/D:N/Y:L (10.0)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:C/I:H/D:N/Y:L)

##### Recommendation

Combine the state updates and token transfers into a single loop to ensure that tokens are properly distributed:

```
function batchRelease(bytes32 category, address[] calldata users)
    external
    onlyRole(ADMIN_ROLE)
    nonReentrant
    whenNotPaused
{
    require(users.length > 0, "Empty users array");
    require(users.length <= MAX_BATCH_SIZE, "Batch too large");

    emit BatchReleaseStarted(category, users.length, block.timestamp);

    uint256 totalReleased;
    uint256 processed;

    for (uint256 i = 0; i < users.length; i++) {
        uint256 releasable = getReleasableAmount(users[i], category);
        if (releasable > 0) {
            userReleased[users[i]][category] += releasable;
            categoryVestings[category].released += releasable;
            totalReleased += releasable;
            processed++;
            bdagToken.safeTransferFrom(msg.sender, users[i], releasable);
        }
    }

    emit BatchReleaseCompleted(category, totalReleased, processed, block.timestamp);
}
```

##### Remediation

**SOLVED**: The suggested mitigation was implemented by the **BlockDAG team.**

##### Remediation Hash

V6
