---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - sector/staking
  - sector/staking-pool
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
# Incorrect summation of curator shares in `claimUndistributedRewards` leads to deficit in claimed undistributed rewards

- id: 61233
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The `claimUndistributedRewards` function is not calculating the total shares correctly, leading to an underestimation of the undistributed rewards. This is because the code is adding the total share of each curator multiple times, which artificially inflates the `totalDistributedShares` value. As a result, the `REWARDS_DISTRIBUTOR_ROLE` will claim a smaller amount of undistributed tokens than they are entitled to. To fix this, the code should track unique curators and iterate over them in the `claimUndistributedRewards` function to ensure that each curator's total share is counted only once. This bug has been fixed in the Suzaku project.

## Details

**Description:** The `claimUndistributedRewards` function is designed to allow a `REWARDS_DISTRIBUTOR_ROLE` to collect any rewards for a specific `epoch` that were not claimed by stakers, operators, or curators. To do this, it calculates `totalDistributedShares`, representing the sum of all share percentages (in basis points) allocated to various participants.

```solidity
// Calculate total distributed shares for the epoch
uint256 totalDistributedShares = 0;

// Sum operator shares
address[] memory operators = l1Middleware.getAllOperators();
for (uint256 i = 0; i < operators.length; i++) {
    totalDistributedShares += operatorShares[epoch][operators[i]];
}

// Sum vault shares
address[] memory vaults = middlewareVaultManager.getVaults(epoch);
for (uint256 i = 0; i < vaults.length; i++) {
    totalDistributedShares += vaultShares[epoch][vaults[i]];
}

// Sum curator shares
for (uint256 i = 0; i < vaults.length; i++) {
    address curator = VaultTokenized(vaults[i]).owner();
    totalDistributedShares += curatorShares[epoch][curator];
}
```

The code iterates through all `vaults` active in the epoch. For each `vault`, it retrieves the `curator` (owner) and adds `curatorShares[epoch][curator]` to `totalDistributedShares`. However, the `curatorShares[epoch][curator]` mapping already stores the *total accumulated share* for that specific `curator` for that `epoch`, aggregated from all vaults they own and all operators those vaults delegated to.

```solidity
// First pass: calculate raw shares and total
for (uint256 i = 0; i < vaults.length; i++) {
    address vault = vaults[i];
    uint96 vaultAssetClass = middlewareVaultManager.getVaultAssetClass(vault);

    uint256 vaultStake = BaseDelegator(IVaultTokenized(vault).delegator()).stakeAt(
        l1Middleware.L1_VALIDATOR_MANAGER(), vaultAssetClass, operator, epochTs, new bytes(0)
    );

    if (vaultStake > 0) {
        uint256 operatorActiveStake =
            l1Middleware.getOperatorUsedStakeCachedPerEpoch(epoch, operator, vaultAssetClass);

        uint256 vaultShare = Math.mulDiv(vaultStake, BASIS_POINTS_DENOMINATOR, operatorActiveStake);
        vaultShare =
            Math.mulDiv(vaultShare, rewardsSharePerAssetClass[vaultAssetClass], BASIS_POINTS_DENOMINATOR);
        vaultShare = Math.mulDiv(vaultShare, operatorShare, BASIS_POINTS_DENOMINATOR);

        uint256 operatorTotalStake = l1Middleware.getOperatorStake(operator, epoch, vaultAssetClass);

        if (operatorTotalStake > 0) {
            uint256 operatorStakeRatio =
                Math.mulDiv(operatorActiveStake, BASIS_POINTS_DENOMINATOR, operatorTotalStake);
            vaultShare = Math.mulDiv(vaultShare, operatorStakeRatio, BASIS_POINTS_DENOMINATOR);
        }

        // Calculate curator share
        uint256 curatorShare = Math.mulDiv(vaultShare, curatorFee, BASIS_POINTS_DENOMINATOR);
        curatorShares[epoch][VaultTokenized(vault).owner()] += curatorShare;

        // Store vault share after removing curator share
        vaultShares[epoch][vault] += vaultShare - curatorShare;
    }
}
```

If a single curator owns multiple vaults that were active in the epoch, their *total* share (from `curatorShares[epoch][curator]`) is added to `totalDistributedShares` multiple times-once for each vault they own. This artificially inflates the `totalDistributedShares` value.

**Impact:** The inflated `totalDistributedShares` leads to an underestimation of the actual `undistributedRewards`. The formula `undistributedRewards = totalRewardsForEpoch - Math.mulDiv(totalRewardsForEpoch, totalDistributedShares, BASIS_POINTS_DENOMINATOR)` will yield a smaller amount than what is truly undistributed.

Consequently:
1.  The `REWARDS_DISTRIBUTOR_ROLE` will claim a smaller amount of undistributed tokens than they are entitled to.
2.  The difference between the actual undistributed amount and the incorrectly calculated (smaller) amount will remain locked in the contract (unless it's upgraded) .

**Proof of Concept:**
```solidity
// ─────────────────────────────────────────────────────────────────────────────
// PoC – Incorrect Sum-of-Shares
// Shows that the sum of operator + vault + curator shares can exceed 10 000 bp
// (100 %), proving that `claimUndistributedRewards` will mis-count.
// ─────────────────────────────────────────────────────────────────────────────
import {AvalancheL1MiddlewareTest} from "./AvalancheL1MiddlewareTest.t.sol";

import {Rewards}           from "src/contracts/rewards/Rewards.sol";
import {MockUptimeTracker} from "../mocks/MockUptimeTracker.sol";
import {ERC20Mock}         from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

import {VaultTokenized}    from "src/contracts/vault/VaultTokenized.sol";

import {console2}          from "forge-std/console2.sol";
import {stdError}          from "forge-std/Test.sol";

contract PoCIncorrectSumOfShares is AvalancheL1MiddlewareTest {
    // ── helpers & globals ────────────────────────────────────────────────────
    MockUptimeTracker internal uptimeTracker;
    Rewards          internal rewards;
    ERC20Mock        internal rewardsToken;

    address internal REWARDS_MANAGER_ROLE     = makeAddr("REWARDS_MANAGER_ROLE");
    address internal REWARDS_DISTRIBUTOR_ROLE = makeAddr("REWARDS_DISTRIBUTOR_ROLE");

    uint96 secondaryAssetClassId = 2;          // activate a 2nd asset-class (40 % of rewards)

    // --------------------------------------------------------------------
---
    //                      MAIN TEST ROUTINE
    // --------------------------------------------------------------------
---
    function test_PoCIncorrectSumOfShares() public {
        _setupRewardsAndSecondaryAssetClass();          // 1. deploy + fund rewards

        address[] memory operators = middleware.getAllOperators();

        // 2. Alice creates *two* nodes (same stake reused) ----------------
---
        console2.log("Creating nodes for Alice");
        _createAndConfirmNodes(alice, 2, 100_000_000_001_000, true);

        // 3. Charlie is honest – single big node --------------------------
---
        console2.log("Creating node for Charlie");
        _createAndConfirmNodes(charlie, 1, 150_000_000_000_000, true);

        // 4. Roll over so stakes are cached at epoch T ---------------------
---
        uint48 epoch = _calcAndWarpOneEpoch();
        console2.log("Moved to one epoch ");

        // Cache total stakes for primary & secondary classes
        middleware.calcAndCacheStakes(epoch, assetClassId);
        middleware.calcAndCacheStakes(epoch, secondaryAssetClassId);

        // 5. Give everyone perfect uptime so shares are fully counted -----
---
        for (uint i = 0; i < operators.length; i++) {
            uptimeTracker.setOperatorUptimePerEpoch(epoch,   operators[i], 4 hours);
            uptimeTracker.setOperatorUptimePerEpoch(epoch+1, operators[i], 4 hours);
        }

        // 6. Warp forward 3 epochs (rewards are distributable @ T-2) ------
---
        _calcAndWarpOneEpoch(3);
        console2.log("Warped forward for rewards distribution");

        // 7. Distribute rewards ------------------------------------------
---
        vm.prank(REWARDS_DISTRIBUTOR_ROLE);
        rewards.distributeRewards(epoch, uint48(operators.length));
        console2.log("Rewards distributed");

        // 8. Sum all shares and show bug (>10 000 bp) ---------------------
---
        uint256 totalShares = 0;

        // operator shares
        for (uint i = 0; i < operators.length; i++) {
            uint256 s = rewards.operatorShares(epoch, operators[i]);
            totalShares += s;
        }
        // vault shares
        address[] memory vaults = vaultManager.getVaults(epoch);
        for (uint i = 0; i < vaults.length; i++) {
            uint256 s = rewards.vaultShares(epoch, vaults[i]);
            totalShares += s;
        }
        // curator shares (may be double-counted!)
        for (uint i = 0; i < vaults.length; i++) {
            address curator = VaultTokenized(vaults[i]).owner();
            uint256 s = rewards.curatorShares(epoch, curator);
            totalShares += s;
        }
        console2.log("Total shares is greater than 10000 bp");

        assertGt(totalShares, 10_000);
    }

    // --------------------------------------------------------------------
---
    //                      SET-UP HELPER
    // --------------------------------------------------------------------
---
    function _setupRewardsAndSecondaryAssetClass() internal {
        uptimeTracker = new MockUptimeTracker();
        rewards       = new Rewards();

        // Initialise Rewards contract ------------------------------------
---
        rewards.initialize(
            owner,                                  // admin
            owner,                                  // protocol fee recipient
            payable(address(middleware)),           // middleware
            address(uptimeTracker),                 // uptime oracle
            1000,                                   // protocol fee 10%
            2000,                                   // operator fee 20%
            1000,                                   // curator  fee 10%
            11_520                                  // min uptime (s)
        );

        // Assign roles ----------------------------------------------------
---
        vm.prank(owner);
        rewards.setRewardsManagerRole(REWARDS_MANAGER_ROLE);
        vm.prank(REWARDS_MANAGER_ROLE);
        rewards.setRewardsDistributorRole(REWARDS_DISTRIBUTOR_ROLE);

        // Mint & approve mock reward token -------------------------------
---
        rewardsToken = new ERC20Mock();
        rewardsToken.mint(REWARDS_DISTRIBUTOR_ROLE, 1_000_000 ether);
        vm.prank(REWARDS_DISTRIBUTOR_ROLE);
        rewardsToken.approve(address(rewards), 1_000_000 ether);

        // Fund 10 epochs of rewards --------------------------------------
---
        vm.startPrank(REWARDS_DISTRIBUTOR_ROLE);
        rewards.setRewardsAmountForEpochs(1, 10, address(rewardsToken), 100_000 * 1e18);
        vm.stopPrank();
        console2.log("Reward pool funded");

        // Configure 60 % primary / 40 % secondary split ------------------
---
        vm.startPrank(REWARDS_MANAGER_ROLE);
        rewards.setRewardsShareForAssetClass(1,                     6000); // 60 %
        rewards.setRewardsShareForAssetClass(secondaryAssetClassId, 4000); // 40 %
        vm.stopPrank();
        console2.log("Reward share split set: 60/40");

        // Create a secondary asset-class + vault so split is in effect
        _setupAssetClassAndRegisterVault(
            secondaryAssetClassId, 0,
            collateral2, vault3,
            type(uint256).max, type(uint256).max, delegator3
        );
        console2.log("Secondary asset-class & vault registered\n");
    }
}
```
**Output:**
```bash
Ran 1 test for test/middleware/PoCIncorrectSumOfShares.t.sol:PoCIncorrectSumOfShares
[PASS] test_PoCIncorrectSumOfShares() (gas: 8309923)
Logs:
  Reward pool funded
  Reward share split set: 60/40
  Secondary asset-class & vault registered

  Creating nodes for Alice
  Creating node for Charlie
  Moved to one epoch
  Warped forward for rewards distribution
  Rewards distributed
  Total shares is greater than 10000 bp

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 6.20ms (2.58ms CPU time)

Ran 1 test suite in 129.02ms (6.20ms CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Recommended Mitigation:** To correctly sum curator shares, ensure each curator's total share for the epoch is counted only once. This can be achieved by:

1.  **Tracking Unique Curators:** During the initial share calculation (e.g., in `_calculateAndStoreVaultShares`), maintain a data structure (like `EnumerableSet.AddressSet`) that stores the unique addresses of curators who earned shares in that epoch.
    ```solidity
     // Example: Add to state variables
     mapping(uint48 epoch => EnumerableSet.AddressSet) private _epochUniqueCurators;

     // In _calculateAndStoreVaultShares, after calculating curatorShare for a vault's owner:
     if (curatorShare > 0) {
         _epochUniqueCurators[epoch].add(VaultTokenized(vault).owner());
     }
    ```

2.  **Iterating Unique Curators in `claimUndistributedRewards`:** Modify the curator share summation loop to iterate over this set of unique curators.
    ```solidity
     // In claimUndistributedRewards:
     ...
     // Sum curator shares
     EnumerableSet.AddressSet storage uniqueCurators = _epochUniqueCurators[epoch];
     for (uint256 i = 0; i < uniqueCurators.length(); i++) {
         address curator = uniqueCurators.at(i);
         totalDistributedShares += curatorShares[epoch][curator];
     }
     ...
    ```
This ensures that `curatorShares[epoch][curatorAddress]` is added to `totalDistributedShares` precisely once for each distinct curator who earned rewards in the epoch.

**Suzaku:**
Fixed in commit [8f4adaa](https://github.com/suzaku-network/suzaku-core/pull/155/commits/8f4adaaca91402b1bde166f2d02c3ac9d72fc96c).

**Cyfrin:** Verified.
