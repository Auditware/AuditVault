---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[dos-resistance]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# Division by zero in rewards distribution can cause permanent lock of epoch rewards

- id: 61239
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The Rewards::_calculateOperatorShare() function in the Suzaku protocol is causing a bug where rewards are not being properly distributed. This is because the system is fetching the current list of asset classes, but attempting to calculate rewards for a historical epoch. This creates a mismatch where deactivated asset classes remain in the returned array, newly added asset classes are included but have no historical data, and asset classes with zero stake cause division by zero. This can lead to a situation where rewards are permanently denied for a specific epoch. A proof of concept has been provided and a recommended solution is to add division by zero checks and move to the next asset if the total stake is zero for a given asset class. This bug has been fixed in a recent commit.

## Details

**Description:** In the `Rewards::_calculateOperatorShare()` function, the system fetches the current list of asset classes but attempts to calculate rewards for a historical epoch:

```solidity
function _calculateOperatorShare(uint48 epoch, address operator) internal {
    // ... uptime checks ...

    uint96[] memory assetClasses = l1Middleware.getAssetClassIds(); // @audit Gets CURRENT asset classes
    for (uint256 i = 0; i < assetClasses.length; i++) {
        uint256 operatorStake = l1Middleware.getOperatorUsedStakeCachedPerEpoch(epoch, operator, assetClasses[i]);
        uint256 totalStake = l1Middleware.totalStakeCache(epoch, assetClasses[i]); // @audit past epoch
        uint16 assetClassShare = rewardsSharePerAssetClass[assetClasses[i]];

        uint256 shareForClass = Math.mulDiv(
            Math.mulDiv(operatorStake, BASIS_POINTS_DENOMINATOR, totalStake), // ← DIVISION BY ZERO
            assetClassShare,
            BASIS_POINTS_DENOMINATOR
        );
        totalShare += shareForClass;
    }
}
```

 This creates a mismatch where:

- Deactivated asset classes remain in the returned array but have zero total stake
- Newly added asset classes are included but have no historical stake data for past epochs
- Asset classes with zero stake for any reason cause division by zero

Consider following scenario:

```text
- Epoch N: Normal operations, operators earn rewards, rewards distribution pending
- Epoch N+1: Protocol admin legitimately adds a new asset class for future growth
- Epoch N+2: New asset class is activated and configured with rewards share
- Epoch N+3: When attempting to distribute rewards for Epoch N, the system:

- Fetches current asset classes (including the new one)
- Attempts to get totalStakeCache[N][newAssetClass] which is 0
- Triggers division by zero in Math.mulDiv(), causing transaction revert
```

Similar division by zero checks are also missing in `_calculateAndStoreVaultShares` when `operatorActiveStake == 0`.


**Impact:** Adding a new asset class ID, deactivating or migrating an existing asset class ID or simply having zero stake for a specific assetClassId (though unlikely with minimum stake requirement but this is not enforced actively) are all instances where reward distribution can be permanently DOSed for a specific epoch.


**Proof of Concept:** Note: Test needs following changes to `MockAvalancheL1Middleware.sol`:

```solidity
 uint96[] private assetClassIds = [1, 2, 3]; // Initialize with default asset classes

    function setAssetClassIds(uint96[] memory newAssetClassIds) external {
        // Clear existing array
        delete assetClassIds;

        // Copy new asset class IDs
        for (uint256 i = 0; i < newAssetClassIds.length; i++) {
            assetClassIds.push(newAssetClassIds[i]);
        }
    }

    function getAssetClassIds() external view returns (uint96[] memory) {
        return assetClassIds;
    }  //@audit this function is overwritten
```

Copy following test to `RewardsTest.t.sol`:

```solidity
    function test_RewardsDistribution_DivisionByZero_NewAssetClass() public {
    uint48 epoch = 1;
    _setupStakes(epoch, 4 hours);

    vm.warp((epoch + 1) * middleware.EPOCH_DURATION());

    // Add a new asset class (4) after epoch 1 has passed
    uint96 newAssetClass = 4;
    uint96[] memory currentAssetClasses = middleware.getAssetClassIds();
    uint96[] memory newAssetClasses = new uint96[](currentAssetClasses.length + 1);
    for (uint256 i = 0; i < currentAssetClasses.length; i++) {
        newAssetClasses[i] = currentAssetClasses[i];
    }
    newAssetClasses[currentAssetClasses.length] = newAssetClass;

    // Update the middleware to return the new asset class list
    middleware.setAssetClassIds(newAssetClasses);

    // Set rewards share for the new asset class
    vm.prank(REWARDS_MANAGER_ROLE);
    rewards.setRewardsShareForAssetClass(newAssetClass, 1000); // 10%

     // distribute rewards
     vm.warp((epoch + 2) * middleware.EPOCH_DURATION());
    assertEq(middleware.totalStakeCache(epoch, newAssetClass), 0, "New asset class should have zero stake for historical epoch 1");

    vm.prank(REWARDS_DISTRIBUTOR_ROLE);
    vm.expectRevert(); // Division by zero in Math.mulDiv when totalStake = 0
    rewards.distributeRewards(epoch, 1);
}
```

**Recommended Mitigation:** Consider adding division by zero checks and simply move to the next asset if `total stake == 0` for a given assetClassId. Also add zero checks to `operatorActiveStake == 0` when calculating `vaultShare`

**Suzaku:**
Fixed in commit [9ac7bf0](https://github.com/suzaku-network/suzaku-core/pull/155/commits/9ac7bf0dc8071b42e4621d453d52227cfc27a03f).

**Cyfrin:** Verified.
