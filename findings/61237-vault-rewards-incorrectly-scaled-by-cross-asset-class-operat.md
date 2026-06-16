---
tags:
  - lang/solidity
  - sector/lending
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
# Vault rewards incorrectly scaled by cross-asset-class operator totals instead of asset class specific shares causing rewards leakage

- id: 61237
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The current vault reward distribution logic is causing a systematic under-distribution of rewards to vault stakers. This is due to a bug in the `Rewards::_calculateAndStoreVaultShares` function, which incorrectly uses the `operatorBeneficiariesShares` variable to scale rewards for individual vaults. This results in a leakage of rewards, where vault rewards are reduced by the operator's participation in other unrelated asset classes. This bug causes a dilution effect, leading to less rewards being distributed to vault stakers. The impact of this bug is systematic under-rewards in every epoch, which results in the excess rewards being reclaimed as undistributed rewards. A proof of concept has been provided, showing how the bug affects the distribution of rewards. The bug has been fixed in commit [f9bfdf7](https://github.com/suzaku-network/suzaku-core/pull/155/commits/f9bfdf7faa7023a0e662280a34cb41be145ba7ab).

## Details

**Description:** The current vault reward distribution logic causes systematic under-distribution of rewards to vault stakers. The issue stems from using cross-asset-class operator beneficiary share totals to scale individual vault rewards, instead of using asset-class-specific operator rewards. This causes a leakage of rewards in scenarios where operators have assymetric stake across different asset class IDs.

The `Rewards::_calculateAndStoreVaultShares` function incorrectly uses `operatorBeneficiariesShares[operator]` (which represents the operator's total rewards across ALL asset classes) to scale rewards for individual vaults that belong to specific asset classes. This creates an inappropriate dilution effect where vault rewards are scaled down by the operator's participation in other unrelated asset classes.

 First in `_calculateOperatorShare()` when calculating the operator's total share

```solidity
function _calculateOperatorShare(uint48 epoch, address operator) internal {
    // ... uptime calculations ...

    uint96[] memory assetClasses = l1Middleware.getAssetClassIds();
    for (uint256 i = 0; i < assetClasses.length; i++) {
        uint256 operatorStake = l1Middleware.getOperatorUsedStakeCachedPerEpoch(epoch, operator, assetClasses[i]);
        uint256 totalStake = l1Middleware.totalStakeCache(epoch, assetClasses[i]);
        uint16 assetClassShare = rewardsSharePerAssetClass[assetClasses[i]];

        uint256 shareForClass = Math.mulDiv(
            Math.mulDiv(operatorStake, BASIS_POINTS_DENOMINATOR, totalStake),
            assetClassShare, // @audit asset class share applied here
            BASIS_POINTS_DENOMINATOR
        );
        totalShare += shareForClass;
    }
    // ... rest of function
    operatorBeneficiariesShares[epoch][operator] = totalShare; //@audit this is storing cross-asset total
```


Again in `_calculateAndStoreVaultShares()`, `operatorBeneficiariesShares` which is a cross-asset operator share is used to calculate vault share for a specific vault:

```solidity
function _calculateAndStoreVaultShares(uint48 epoch, address operator) internal {
    uint256 operatorShare = operatorBeneficiariesShares[epoch][operator]; // @audit already includes asset class weighting

    for (uint256 i = 0; i < vaults.length; i++) {
        address vault = vaults[i];
        uint96 vaultAssetClass = middlewareVaultManager.getVaultAssetClass(vault);

        // ... vault stake calculation ...

        uint256 vaultShare = Math.mulDiv(vaultStake, BASIS_POINTS_DENOMINATOR, operatorActiveStake);
        vaultShare = Math.mulDiv(vaultShare, rewardsSharePerAssetClass[vaultAssetClass], BASIS_POINTS_DENOMINATOR);
        vaultShare = Math.mulDiv(vaultShare, operatorShare, BASIS_POINTS_DENOMINATOR);
        //@audit Uses cross-asset operator total instead of asset-class-specific share
        // This scales vault rewards by operator's participation in OTHER asset classes
        // ... rest of function
    }
}
```

Net effect is, even if a specific operator contributes 100% of the vault stake, it gets scaled by the global operator share causing a leakage in rewards for that specific asset class.

**Impact:** Systematic under-rewards in every epoch where vault stakes receive less than what they should, and this excess is being reclaimed as undistributed rewards. Effectively, the actual reward distribution doesn't match intended asset class allocations.

**Proof of Concept:** The test demonstrates that even when all fees are zero, the vault share is only 92.5% of the epoch rewards. The 7.5% is attributed to the reward leakage that becomes part of undistributed rewards.

```text
  In the POC below,
- Asset Class 1: 50% share (5000 bp), 1000 total stake
- Asset Class 2: 20% share (2000 bp), 100 total stake
- Asset Class 3: 30% share (3000 bp), 100 total stake
- Operator B: 700/100/100 stake in classes 1/2/3 respectively
- Operator B's cross-asset total: (700/1000×5000) + (100/100×2000) + (100/100×3000) = 8500 bp
- Vault Share of Asset ID 2:
    - vaultShare = (100/100) × 2000 × 8500 / (10000 × 10000)
    - vaultShare = 1 × 2000 × 8500 / 100,000,000 = 1700 bp

Vault 2 should get Operator B's Asset Class 2 rewards only (2000 bp)
Instead, it gets scaled by operator's total across all classes (8500 bp)

This causes a dilution of 300 bp

```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";

import {MockAvalancheL1Middleware} from "../mocks/MockAvalancheL1Middleware.sol";
import {MockUptimeTracker} from "../mocks/MockUptimeTracker.sol";
import {MockVaultManager} from "../mocks/MockVaultManager.sol";
import {MockDelegator} from "../mocks/MockDelegator.sol";
import {MockVault} from "../mocks/MockVault.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

import {Rewards} from "../../src/contracts/rewards/Rewards.sol";
import {IRewards} from "../../src/interfaces/rewards/IRewards.sol";
import {BaseDelegator} from "../../src/contracts/delegator/BaseDelegator.sol";
import {IVaultTokenized} from "../../src/interfaces/vault/IVaultTokenized.sol";

contract RewardsAssetShareTest is Test {
    // Contracts
    MockAvalancheL1Middleware public middleware;
    MockUptimeTracker public uptimeTracker;
    MockVaultManager public vaultManager;
    Rewards public rewards;
    ERC20Mock public rewardsToken;

    // Test addresses
    address constant ADMIN = address(0x1);
    address constant PROTOCOL_OWNER = address(0x2);
    address constant REWARDS_MANAGER = address(0x3);
    address constant REWARDS_DISTRIBUTOR = address(0x4);
    address constant OPERATOR_A = address(0x1000);
    address constant OPERATOR_B = address(uint160(0x1000 + 1));

    function setUp() public {
        // Deploy mock contracts - simplified setup for our POC
        vaultManager = new MockVaultManager();

        //Set up 2 operators
        uint256[] memory nodesPerOperator = new uint256[](2);
        nodesPerOperator[0] = 1; // Operator 0x1000 has 1 node
        nodesPerOperator[1] = 1; // Operator A has 1 node

        middleware = new MockAvalancheL1Middleware(
            2,
            nodesPerOperator,
            address(0),
            address(vaultManager)
        );

        uptimeTracker = new MockUptimeTracker();

        // Deploy Rewards contract
        rewards = new Rewards();
        rewardsToken = new ERC20Mock();

        // Initialize with no fees to match our simplified example
        rewards.initialize(
            ADMIN,
            PROTOCOL_OWNER,
            payable(address(middleware)),
            address(uptimeTracker),
            0, // protocolFee = 0%
            0, // operatorFee = 0%
            0, // curatorFee = 0%
            0  // minRequiredUptime = 0
        );

        // Set up roles
        vm.prank(ADMIN);
        rewards.setRewardsManagerRole(REWARDS_MANAGER);

        vm.prank(REWARDS_MANAGER);
        rewards.setRewardsDistributorRole(REWARDS_DISTRIBUTOR);

        // Set up rewards token
        rewardsToken.mint(REWARDS_DISTRIBUTOR, 1_000_000 * 10**18);
        vm.prank(REWARDS_DISTRIBUTOR);
        rewardsToken.approve(address(rewards), 1_000_000 * 10**18);
    }

    function test_AssetShareFormula() public {
        uint48 epoch = 1;

        // Set Asset Class 1 to 50% rewards share (5000 basis points)
        vm.prank(REWARDS_MANAGER);
        rewards.setRewardsShareForAssetClass(1, 5000); // 50%

        vm.prank(REWARDS_MANAGER);
        rewards.setRewardsShareForAssetClass(2, 2000); // 20%

        vm.prank(REWARDS_MANAGER);
        rewards.setRewardsShareForAssetClass(3, 3000); // 30%

        // Set total stake in Asset Class 1 = 1000 tokens across network
        middleware.setTotalStakeCache(epoch, 1, 1000);
        middleware.setTotalStakeCache(epoch, 2, 100);  // Asset Class 2: 0 tokens
        middleware.setTotalStakeCache(epoch, 3, 100);  // Asset Class 3: 0 tokens

        // Set Operator A stake = 300 tokens (30% of network)
        middleware.setOperatorStake(epoch, OPERATOR_A, 1, 300);

        // Set operator A node stake (for primary asset class calculation)
        bytes32[] memory operatorNodes = middleware.getOperatorNodes(OPERATOR_A);
        middleware.setNodeStake(epoch, operatorNodes[0], 300);

        // No stake in other asset classes for Operator A
        middleware.setOperatorStake(epoch, OPERATOR_A, 2, 0);
        middleware.setOperatorStake(epoch, OPERATOR_A, 3, 0);

        bytes32[] memory operatorBNodes = middleware.getOperatorNodes(OPERATOR_B);
        middleware.setNodeStake(epoch, operatorBNodes[0], 700); // Remaining Asset Class 1 stake
        middleware.setOperatorStake(epoch, OPERATOR_B, 1, 700);
        middleware.setOperatorStake(epoch, OPERATOR_B, 2, 100);
        middleware.setOperatorStake(epoch, OPERATOR_B, 3, 100);

        // Set 100% uptime for Operator A & B
        uptimeTracker.setOperatorUptimePerEpoch(epoch, OPERATOR_A, 4 hours);
        uptimeTracker.setOperatorUptimePerEpoch(epoch, OPERATOR_B, 4 hours);


        // Create a vault for Asset Class 1 with 300 tokens staked (100% of operator's stake)
        address vault1Owner = address(0x500);
        (address vault1, address delegator1) = vaultManager.deployAndAddVault(
            address(0x123), // collateral
            vault1Owner
        );
        middleware.setAssetInAssetClass(1, vault1);
        vaultManager.setVaultAssetClass(vault1, 1);

          // Create vault for Asset Class 2
        address vault2Owner = address(0x600);
        (address vault2, address delegator2) = vaultManager.deployAndAddVault(address(0x123), vault2Owner);
        middleware.setAssetInAssetClass(2, vault2);
        vaultManager.setVaultAssetClass(vault2, 2);

        // Create vault for Asset Class 3
        address vault3Owner = address(0x700);
        (address vault3, address delegator3) = vaultManager.deployAndAddVault(
            address(0x125), // different collateral
            vault3Owner
        );
        middleware.setAssetInAssetClass(3, vault3);
        vaultManager.setVaultAssetClass(vault3, 3);


        // Set vault delegation: 300 tokens staked to Operator A
        uint256 epochTs = middleware.getEpochStartTs(epoch);
        MockDelegator(delegator1).setStake(
            middleware.L1_VALIDATOR_MANAGER(),
            1, // asset class
            OPERATOR_A,
            uint48(epochTs),
            300 // stake amount
        );

        MockDelegator(delegator1).setStake(middleware.L1_VALIDATOR_MANAGER(),
                                            1,
                                            OPERATOR_B,
                                            uint48(epochTs),
                                            700);

        MockDelegator(delegator2).setStake(
            middleware.L1_VALIDATOR_MANAGER(), 2, OPERATOR_B, uint48(epochTs), 100
        );

        MockDelegator(delegator3).setStake(
            middleware.L1_VALIDATOR_MANAGER(), 3, OPERATOR_B, uint48(epochTs), 100
        );

        // Set rewards for the epoch: 100,000 tokens
        vm.prank(REWARDS_DISTRIBUTOR);
        rewards.setRewardsAmountForEpochs(epoch, 1, address(rewardsToken), 100_000);


        // Wait 3 epochs as required by contract
        vm.warp((epoch + 3) * middleware.EPOCH_DURATION());

        // Distribute rewards
        vm.prank(REWARDS_DISTRIBUTOR);
        rewards.distributeRewards(epoch, 2);

        // Get calculated shares
        uint256 operatorABeneficiariesShare = rewards.operatorBeneficiariesShares(epoch, OPERATOR_A);
        uint256 operatorBBeneficiariesShare = rewards.operatorBeneficiariesShares(epoch, OPERATOR_B);

        uint256 vault1Share = rewards.vaultShares(epoch, vault1);
        uint256 vault2Share = rewards.vaultShares(epoch, vault2);
        uint256 vault3Share = rewards.vaultShares(epoch, vault3);

        console2.log("=== RESULTS ===");
        console2.log("operatorBeneficiariesShares[OPERATOR_A] =", operatorABeneficiariesShare, "basis points");
        console2.log("vaultShares[vault_1] =", vault1Share, "basis points");
        console2.log("operatorBeneficiariesShares[OPERATOR_B] =", operatorBBeneficiariesShare, "basis points");
        console2.log("vaultShares[vault_2] =", vault2Share, "basis points");
        console2.log("vaultShares[vault_3] =", vault3Share, "basis points");

        // Expected: 30% stake * 50% asset class = 15% = 1500 basis points
        assertEq(operatorABeneficiariesShare, 1500,
            "Operator share should be 1500 basis points (15%)");
        assertEq(vault1Share, 5000,
            "Vault share should be 5000 basis points (7.5% + 42.5)");

        assertEq(operatorBBeneficiariesShare, 8500,
            "Operator share should be 9500 basis points (85%)"); //  (700/1000) × 50%  +  (100/100) × 20%  + (100/100) × 30% = 85%
        assertEq(vault2Share, 1700,
            "Vault share should be 1700 basis points (19%)");
            // vaultShare = (100 / 100) × 10,000 = 10,000 bp
            // vaultShare = 10,000 × 2,000 / 10,000 = 2,000 bp (vaultShare * assetClassShare / 10000)
            // vaultShare = 2,000 × 8,500 / 10,000 = 1,700 bp (vaultShare * operatorShare / 10000)

         assertEq(vault3Share, 2550,
            "Vault share should be 2550 basis points (28.5%)");
            // vaultShare = (100 / 100) × 10,000 = 10,000 bp
            // vaultShare = 10,000 × 3,000/10,000 = 3,000 bp (vaultShare * assetClassShare / 10000)
            // vaultShare = 3,000 × 8,500/10,000 = 2,550 bp (vaultShare * operatorShare / 10000)


    }
}
```

**Recommended Mitigation:** Consider implementing a per-asset class operator shares instead of total operator shares. The `operatorBeneficiariesShare` should be more granular and asset-id specific to prevent this leakage. Corresponding logic in `_calculateOperatorShare` and `_calculateAndStoreVaultShares` should be adjusted specific to each assetID.

```solidity
// Add per-asset-class tracking
mapping(uint48 epoch => mapping(address operator => mapping(uint96 assetClass => uint256 share)))
    public operatorBeneficiariesSharesPerAssetClass;
```

**Suzaku:**
Fixed in commit [f9bfdf7](https://github.com/suzaku-network/suzaku-core/pull/155/commits/f9bfdf7faa7023a0e662280a34cb41be145ba7ab).

**Cyfrin:** Verified.
