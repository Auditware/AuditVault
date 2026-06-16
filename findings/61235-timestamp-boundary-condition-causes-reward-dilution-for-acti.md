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
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Timestamp boundary condition causes reward dilution for active operators

- id: 61235
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The report discusses a bug in the AvalancheL1Middleware::_wasActiveAt() function that causes disabled operators and vaults to be incorrectly treated as "active" at the exact timestamp when they are disabled. This leads to significant reward dilution for active operators. The bug is caused by the function using >= instead of > for the disabled time comparison. This affects the calcAndCacheStakes() function used for reward calculations and the getOperatorStake() function used when iterating through vaults. The inflated total stake is then used to calculate the operator's share of rewards. This bug has a significant impact on rewards distribution and has been fixed in the Suzaku commit 9bbbcfc.

## Details

**Description:** The `AvalancheL1Middleware::_wasActiveAt()` function contains a boundary condition bug that incorrectly treats operators and vaults as "active" at the exact timestamp when they are disabled. This causes disabled operators' stakes to be included in total stake calculations for reward distribution, leading to significant reward dilution for active operators.

The `_wasActiveAt()` function uses `>=` instead of `>` for the disabled time comparison:

```solidity
function _wasActiveAt(uint48 enabledTime, uint48 disabledTime, uint48 timestamp) private pure returns (bool) {
    return enabledTime != 0 && enabledTime <= timestamp && (disabledTime == 0 || disabledTime >= timestamp); //@audit disabledTime >= timestamp means an operator is active at a timestamp when he was disabled
 }
```

When `disabledTime == timestamp`, the operator is incorrectly considered active, even though they were disabled at that exact moment.


This bug affects the `calcAndCacheStakes()` function used for reward calculations. Note that if the operator was disabled exactly at epoch start, the `totalStake` returns an inflated value as it includes the stake of disabled operator.

```solidity
function calcAndCacheStakes(uint48 epoch, uint96 assetClassId) public returns (uint256 totalStake) {
    uint48 epochStartTs = getEpochStartTs(epoch);
    uint256 length = operators.length();

    for (uint256 i; i < length; ++i) {
        (address operator, uint48 enabledTime, uint48 disabledTime) = operators.atWithTimes(i);
        if (!_wasActiveAt(enabledTime, disabledTime, epochStartTs)) { // @audit: this gets skipped
            continue;
        }
        uint256 operatorStake = getOperatorStake(operator, epoch, assetClassId);
        operatorStakeCache[epoch][assetClassId][operator] = operatorStake;
        totalStake += operatorStake; // @audit -> this is inflated
    }
    totalStakeCache[epoch][assetClassId] = totalStake;
    totalStakeCached[epoch][assetClassId] = true;
}
```

The same `_wasActiveAt()` function is used in `getOperatorStake()` when iterating through vaults. If a vault is disabled exactly at epoch start, it's incorrectly included in the operator's stake calculation:

```solidity
function getOperatorStake(address operator, uint48 epoch, uint96 assetClassId) public view returns (uint256 stake) {
    uint48 epochStartTs = getEpochStartTs(epoch);
    uint256 totalVaults = vaultManager.getVaultCount();

    for (uint256 i; i < totalVaults; ++i) {
        (address vault, uint48 enabledTime, uint48 disabledTime) = vaultManager.getVaultAtWithTimes(i);

        // Skip if vault not active in the target epoch
        if (!_wasActiveAt(enabledTime, disabledTime, epochStartTs)) { // @audit: same boundary bug for vaults
            continue;
        }

        // Skip if vault asset not in AssetClassID
        if (vaultManager.getVaultAssetClass(vault) != assetClassId) {
            continue;
        }

        uint256 vaultStake = BaseDelegator(IVaultTokenized(vault).delegator()).stakeAt(
            L1_VALIDATOR_MANAGER, assetClassId, operator, epochStartTs, new bytes(0)
        );

        stake += vaultStake; // @audit -> inflated when disabled vaults are included
    }
}
```

In `Rewards::_calculateOperatorShare`, this inflated `totalStake` is then used to calculate operator share of rewards for that epoch.

```solidity
// In Rewards.sol - _calculateOperatorShare()
function _calculateOperatorShare(uint48 epoch, address operator) internal {
    // ...
    for (uint256 i = 0; i < assetClasses.length; i++) {
        uint256 operatorStake = l1Middleware.getOperatorUsedStakeCachedPerEpoch(epoch, operator, assetClasses[i]);
        uint256 totalStake = l1Middleware.totalStakeCache(epoch, assetClasses[i]); // @audit inflated value

        uint256 shareForClass = Math.mulDiv(
            Math.mulDiv(operatorStake, BASIS_POINTS_DENOMINATOR, totalStake), // @audit shares are diluted due to inflated total stake
            assetClassShare,
            BASIS_POINTS_DENOMINATOR
        );
        totalShare += shareForClass;
    }
    // ...
}
```

**Impact:** Rewards that were supposed to be distributed to active operators end up stuck in the Rewards contract. This leads to significant dilution of rewards for active operators and vaults.


**Proof of Concept:**
```solidity
   function test_wasActiveAtBoundaryBug() public {
        // create nodes for alice and charlie
        // Add nodes for Alice
        (bytes32[] memory aliceNodeIds,,) = _createAndConfirmNodes(alice, 1, 0, true);
        console2.log("Created", aliceNodeIds.length, "nodes for Alice");

        // Add nodes for Charlie
        (bytes32[] memory charlieNodeIds,,) = _createAndConfirmNodes(charlie, 1, 0, true);
        console2.log("Created", charlieNodeIds.length, "nodes for Charlie");

        // move to current epoch so that nodes are active
        // record next epoch start time stamp and epoch number
        uint48 currentEpoch = _calcAndWarpOneEpoch();
        uint48 nextEpoch = currentEpoch + 1;
        uint48 nextEpochStartTs = middleware.getEpochStartTs(nextEpoch);


        // Setup rewards contract (simplified version)
        address admin = makeAddr("admin");
        address protocolOwner = makeAddr("protocolOwner");
        address rewardsDistributor = makeAddr("rewardsDistributor");

        // Deploy rewards contract
        Rewards rewards = new Rewards();
        MockUptimeTracker uptimeTracker = new MockUptimeTracker();

        // Initialize rewards contract
        rewards.initialize(
            admin,
            protocolOwner,
            payable(address(middleware)),
            address(uptimeTracker),
            1000, // 10% protocol fee
            2000, // 20% operator fee
            1000, // 10% curator fee
            11520 // min required uptime
        );

        // Setup roles
        vm.prank(admin);
        rewards.setRewardsDistributorRole(rewardsDistributor);

        // Create rewards token and set rewards
        ERC20Mock rewardsToken = new ERC20Mock();
        uint256 totalRewards = 100 ether;
        rewardsToken.mint(rewardsDistributor, totalRewards);

         vm.startPrank(rewardsDistributor);
        rewardsToken.approve(address(rewards), totalRewards);
        rewards.setRewardsAmountForEpochs(nextEpoch, 1, address(rewardsToken), totalRewards);
        vm.stopPrank();

        // Set rewards share for primary asset class
        vm.prank(admin);
        rewards.setRewardsShareForAssetClass(1, 10000); // 100% for primary asset class

        // Record initial stake
        uint256 aliceInitialStake = middleware.getOperatorStake(alice, currentEpoch, assetClassId);
        uint256 charlieInitialStake = middleware.getOperatorStake(charlie, currentEpoch, assetClassId);

        // Verify they have nodes
        bytes32[] memory aliceCurrentNodes = middleware.getActiveNodesForEpoch(alice, currentEpoch);
        bytes32[] memory charlieCurrentNodes = middleware.getActiveNodesForEpoch(charlie, currentEpoch);
        console2.log("Alice current nodes:", aliceCurrentNodes.length);
        console2.log("Charlie current nodes:", charlieCurrentNodes.length);

        console2.log("=== INITIAL STATE ===");
        console2.log("Alice initial stake:", aliceInitialStake);
        console2.log("Charlie initial stake:", charlieInitialStake);
        console2.log("Total initial:", aliceInitialStake + charlieInitialStake);


        // Move to exact epoch boundary and disable Alice
        vm.warp(nextEpochStartTs);
        vm.prank(validatorManagerAddress);
        middleware.disableOperator(alice);

        // Set uptime alice - 0, charlie - full
        uptimeTracker.setOperatorUptimePerEpoch(nextEpoch, alice, 0 hours);
        uptimeTracker.setOperatorUptimePerEpoch(nextEpoch, charlie, 4 hours);

        // Calculate stakes for the boundary epoch
        uint256 aliceBoundaryStake = middleware.getOperatorStake(alice, nextEpoch, assetClassId);
        uint256 charlieBoundaryStake = middleware.getOperatorStake(charlie, nextEpoch, assetClassId);
        uint256 totalBoundaryStake = middleware.calcAndCacheStakes(nextEpoch, assetClassId);

        console2.log("=== BOUNDARY EPOCH ===");
        console2.log("Epoch start timestamp:", nextEpochStartTs);
        console2.log("Alice disabled at timestamp:", nextEpochStartTs);
        console2.log("Alice boundary stake:", aliceBoundaryStake);
        console2.log("Charlie boundary stake:", charlieBoundaryStake);
        console2.log("Total boundary stake:", totalBoundaryStake);


       // Distribute rewards using actual Rewards contract
        vm.warp(nextEpochStartTs + 3 * middleware.EPOCH_DURATION()); // Move past distribution window

        vm.prank(rewardsDistributor);
        rewards.distributeRewards(nextEpoch, 10); // Process all operators

        // Move to claiming period
        vm.warp(nextEpochStartTs + 4 * middleware.EPOCH_DURATION());

        // Record balances before claiming
        uint256 rewardsContractBalance = rewardsToken.balanceOf(address(rewards));
        uint256 charlieBalanceBefore = rewardsToken.balanceOf(charlie);

        console2.log("=== UNDISTRIBUTED REWARDS TEST ===");
        console2.log("Total rewards in contract:", rewardsContractBalance);

        // Charlie claims his rewards
        vm.prank(charlie);
        rewards.claimOperatorFee(address(rewardsToken), charlie);

        uint256 charlieRewards = rewardsToken.balanceOf(charlie) - charlieBalanceBefore;
        console2.log("Charlie claimed:", charlieRewards);

        // Alice cannot claim (disabled/no uptime)
        vm.expectRevert();
        vm.prank(alice);
        rewards.claimOperatorFee(address(rewardsToken), alice);

        // Charlie should get 100% of operator rewards
        // Deduct protocol share - and calculate operator fees
        uint256 charliExpectedRewards = totalRewards * 9000 * 2000 / 100_000_000; // (total rewards - protocol share) * operator fee
        assertGt(charliExpectedRewards, charlieRewards);
    }
```

**Recommended Mitigation:** Consider changing the boundary condition in `_wasActiveAt()` to exclude operators disabled at exact timestamp.

**Suzaku:**
Fixed in commit [9bbbcfc](https://github.com/suzaku-network/suzaku-core/pull/155/commits/9bbbcfce7bedd1dd4e60fdf55bb5f13ba8ab4847).

**Cyfrin:** Verified.
