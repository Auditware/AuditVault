---
tags:
  - lang/solidity
  - sector/lending
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
# Future epoch cache manipulation via `calcAndCacheStakes` allows reward manipulation

- id: 61230
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The `AvalancheL1Middleware::calcAndCacheStakes` function in the Suzaku network has a bug where it does not check if the epoch provided is in the future. This allows attackers to manipulate reward calculations by locking in current stake values for future epochs. This can lead to inflated reward shares and compromise critical node rebalancing operations. A proof of concept test has been provided and a recommended solution is to add epoch validation to prevent future epoch caching. The bug has been fixed in a recent commit.

## Details

**Description:** The `AvalancheL1Middleware::calcAndCacheStakes` function lacks epoch validation, allowing attackers to cache stake values for future epochs. This enables permanent manipulation of reward calculations by locking in current stake values that may become stale by the time those epochs arrive.

The `calcAndCacheStakes` function does not validate that the provided epoch is not in the future:

```solidity
function calcAndCacheStakes(uint48 epoch, uint96 assetClassId) public returns (uint256 totalStake) {
    uint48 epochStartTs = getEpochStartTs(epoch); // No validation of epoch timing
    // ... rest of function caches values for any epoch, including future ones
}
```

Once`totalStakeCached` flag is set, any subsequent call to `getOperatorStake` for that epoch and asset class will return the incorrect `operatorStakeCache` value, as shown below:

```solidity
function getOperatorStake(
    address operator,
    uint48 epoch,
    uint96 assetClassId
) public view returns (uint256 stake) {
    if (totalStakeCached[epoch][assetClassId]) {
        uint256 cachedStake = operatorStakeCache[epoch][assetClassId][operator];
        return cachedStake;
    }
    ...
}
```

When called with a future epoch, the function queries current stake values using checkpoint systems (upperLookupRecent) which return the latest available values for future timestamps

**Impact:** There are multiple issues with this, two major ones being:
- Attackers can inflate their reward shares by locking in high stake values before their actual stakes decrease. All subsequent deposits/withdrawals will not impact the cached stake once it gets updated for a given epoch.
- `forceUpdateNodes` mechanism can be compromised. Critical node rebalancing operations can be incorrectly skipped, leaving the system in an inconsistent state

**Proof of Concept:** Add the following test and run it:

```solidity
function test_operatorStakeOfTwoEpochsShouldBeEqual() public {
      uint256 operatorStake = middleware.getOperatorStake(alice, 1, assetClassId);
      console2.log("Operator stake (epoch", 1, "):", operatorStake);

      middleware.calcAndCacheStakes(5, assetClassId);
      uint256 newStake = middleware.getOperatorStake(alice, 2, assetClassId);
      console2.log("New epoch operator stake:", newStake);
      assertGe(newStake, operatorStake);

      uint256 depositAmount = 100_000_000_000_000_000_000;

      collateral.transfer(staker, depositAmount);

      vm.startPrank(staker);
      collateral.approve(address(vault), depositAmount);
      vault.deposit(staker, depositAmount);
      vm.stopPrank();

      vm.warp((5) * middleware.EPOCH_DURATION());

      middleware.calcAndCacheStakes(5, assetClassId);

      assertEq(
          middleware.getOperatorStake(alice, 4, assetClassId), middleware.getOperatorStake(alice, 5, assetClassId)
      );
  }
```

**Recommended Mitigation:** Consider adding epoch validation to prevent future epoch caching:
```solidity
function calcAndCacheStakes(uint48 epoch, uint96 assetClassId) public returns (uint256 totalStake) {
    uint48 currentEpoch = getCurrentEpoch();
    require(epoch <= currentEpoch, "Cannot cache future epochs"); //@audit added

    uint48 epochStartTs = getEpochStartTs(epoch);
    // ... rest of function unchanged
}
```
**Suzaku:**
Fixed in commit [32b1a6c](https://github.com/suzaku-network/suzaku-core/pull/155/commits/32b1a6c55c1ab436c557114939afb3163cc9ec8f).

**Cyfrin:** Verified.
