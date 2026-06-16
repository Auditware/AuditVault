---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - platform/cyfrin
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/reward-calculation]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# Not all reward token rewards are claimable

- id: 61238
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


The Rewards contract has a bug where it tracks the last epoch for which a staker, curator, or operator has claimed rewards, but it is not keyed by the reward token. This means that when a user claims rewards for one token, it updates the mapping for all tokens, preventing them from claiming rewards for other tokens. This leads to loss of rewards and breaks the expected behavior. A solution is proposed to change the mapping structure and update relevant logic to track claims separately for each token. The bug has been fixed in the Suzaku codebase.

## Details

**Description:** The `lastEpochClaimedStaker`, `lastEpochClaimedCurator` and `lastEpochClaimedOperator` mappings in the `Rewards` contract track the last epoch for which a staker/curator/operator has claimed rewards, but it is keyed only by the staker's/curator's/operator's address and not by the reward token. This means that when a staker/curator/operator claims rewards for a given epoch and reward token, the contract updates the mappings for all tokens, not just the one claimed. As a result, if a staker/curator/operator is eligible for rewards from multiple tokens for the same epoch(s), claiming rewards for one token will prevent them from claiming rewards for the others for those epochs.

**Impact:** Stakers/curators/operators who are eligible to receive rewards in multiple tokens for the same epoch(s) will only be able to claim rewards for one token. Once they claim for one token, the contract will mark all those epochs as claimed, making it impossible to claim the rewards for the other tokens. This leads to loss of rewards for stakers/curators/operators and breaks the expected behavior of multi-token reward distribution.

**Proof of Concept:**
1. Change the `_setupStakes` function in the `RewardsTest.t.sol` file:
```solidity
// Sets up stakes for all operators in a given epoch
function _setupStakes(uint48 epoch, uint256 uptime) internal {
	address[] memory operators = middleware.getAllOperators();
	uint256 timestamp = middleware.getEpochStartTs(epoch);

	// Define operator stake percentages (must sum to 100%)
	uint256[] memory operatorPercentages = new uint256[](10);
	operatorPercentages[0] = 10;
	operatorPercentages[1] = 10;
	operatorPercentages[2] = 10;
	operatorPercentages[3] = 10;
	operatorPercentages[4] = 10;
	operatorPercentages[5] = 10;
	operatorPercentages[6] = 10;
	operatorPercentages[7] = 10;
	operatorPercentages[8] = 10;
	operatorPercentages[9] = 10;

	uint256 totalStakePerClass = 3_000_000 ether;

	// Track total stakes for each asset class
	uint256[] memory totalStakes = new uint256[](3); // [primary, secondary1, secondary2]

	for (uint256 i = 0; i < operators.length; i++) {
		address operator = operators[i];
		uint256 operatorStake = (totalStakePerClass * operatorPercentages[i]) / 100;
		uint256 stakePerNode = operatorStake / middleware.getOperatorNodes(operator).length;

		_setupOperatorStakes(epoch, operator, operatorStake, stakePerNode, totalStakes);
		_setupVaultDelegations(epoch, operator, operatorStake, timestamp);
		uptimeTracker.setOperatorUptimePerEpoch(epoch, operator, uptime);
	}

	// Set total stakes in L1 middleware
	middleware.setTotalStakeCache(epoch, 1, totalStakes[0]);
	middleware.setTotalStakeCache(epoch, 2, totalStakes[1]);
	middleware.setTotalStakeCache(epoch, 3, totalStakes[2]);
}

// Sets up stakes for a single operator's nodes and asset classes
function _setupOperatorStakes(
	uint48 epoch,
	address operator,
	uint256 operatorStake,
	uint256 stakePerNode,
	uint256[] memory totalStakes
) internal {
	bytes32[] memory operatorNodes = middleware.getOperatorNodes(operator);
	for (uint256 j = 0; j < operatorNodes.length; j++) {
		middleware.setNodeStake(epoch, operatorNodes[j], stakePerNode);
		totalStakes[0] += stakePerNode; // Primary stake
	}
	middleware.setOperatorStake(epoch, operator, 2, operatorStake);
	middleware.setOperatorStake(epoch, operator, 3, operatorStake);
	totalStakes[1] += operatorStake; // Secondary stake 1
	totalStakes[2] += operatorStake; // Secondary stake 2
}

// Sets up vault delegations for a single operator
function _setupVaultDelegations(
	uint48 epoch,
	address operator,
	uint256 operatorStake,
	uint256 timestamp
) internal {
	for (uint256 j = 0; j < delegators.length; j++) {
		delegators[j].setStake(
			middleware.L1_VALIDATOR_MANAGER(),
			uint96(j + 1),
			operator,
			uint48(timestamp),
			operatorStake
		);
	}
}
```

2. Add the following tests to the `RewardsTest.t.sol` file:
```solidity
function test_claimRewards_multipleTokens_staker() public {
	// Deploy a second reward token
	ERC20Mock rewardsToken2 = new ERC20Mock();
	rewardsToken2.mint(REWARDS_DISTRIBUTOR_ROLE, 1_000_000 * 10 ** 18);
	vm.prank(REWARDS_DISTRIBUTOR_ROLE);
	rewardsToken2.approve(address(rewards), 1_000_000 * 10 ** 18);
	uint48 startEpoch = 1;
	uint48 numberOfEpochs = 3;
	uint256 rewardsAmount = 100_000 * 10 ** 18;

	// Set rewards for both tokens
	vm.startPrank(REWARDS_DISTRIBUTOR_ROLE);
	rewards.setRewardsAmountForEpochs(startEpoch, numberOfEpochs, address(rewardsToken2), rewardsAmount);
	vm.stopPrank();

	// Setup staker
	address staker = makeAddr("Staker");
	address vault = vaultManager.vaults(0);
	uint256 epochTs = middleware.getEpochStartTs(startEpoch);
	MockVault(vault).setActiveBalance(staker, 300_000 * 1e18);
	MockVault(vault).setTotalActiveShares(uint48(epochTs), 400_000 * 1e18);

	// Distribute rewards for epochs 1 to 3
	for (uint48 epoch = startEpoch; epoch < startEpoch + numberOfEpochs; epoch++) {
		_setupStakes(epoch, 4 hours);
		vm.warp((epoch + 3) * middleware.EPOCH_DURATION());
		address[] memory operators = middleware.getAllOperators();
		vm.prank(REWARDS_DISTRIBUTOR_ROLE);
		rewards.distributeRewards(epoch, uint48(operators.length));
	}

	// Warp to epoch 4
	vm.warp((startEpoch + numberOfEpochs) * middleware.EPOCH_DURATION());

	// Claim for rewardsToken (should succeed)
	vm.prank(staker);
	rewards.claimRewards(address(rewardsToken), staker);
	assertGt(rewardsToken.balanceOf(staker), 0, "Staker should receive rewardsToken");

	// Try to claim for rewardsToken2 (should revert)
	vm.prank(staker);
	vm.expectRevert(abi.encodeWithSelector(IRewards.AlreadyClaimedForLatestEpoch.selector, staker, numberOfEpochs));
	rewards.claimRewards(address(rewardsToken2), staker);
}

function test_claimOperatorFee_multipleTokens_operator() public {
	// Deploy a second reward token
	ERC20Mock rewardsToken2 = new ERC20Mock();
	rewardsToken2.mint(REWARDS_DISTRIBUTOR_ROLE, 1_000_000 * 10 ** 18);
	vm.prank(REWARDS_DISTRIBUTOR_ROLE);
	rewardsToken2.approve(address(rewards), 1_000_000 * 10 ** 18);

	uint48 startEpoch = 1;
	uint48 numberOfEpochs = 3;
	uint256 rewardsAmount = 100_000 * 10 ** 18;

	// Set rewards for both tokens
	vm.startPrank(REWARDS_DISTRIBUTOR_ROLE);
	rewards.setRewardsAmountForEpochs(startEpoch, numberOfEpochs, address(rewardsToken2), rewardsAmount);
	vm.stopPrank();

	// Distribute rewards for epochs 1 to 3
	for (uint48 epoch = startEpoch; epoch < startEpoch + numberOfEpochs; epoch++) {
		_setupStakes(epoch, 4 hours);
		vm.warp((epoch + 3) * middleware.EPOCH_DURATION());
		address[] memory operators = middleware.getAllOperators();
		vm.prank(REWARDS_DISTRIBUTOR_ROLE);
		rewards.distributeRewards(epoch, uint48(operators.length));
	}

	// Warp to epoch 4
	vm.warp((startEpoch + numberOfEpochs) * middleware.EPOCH_DURATION());

	address operator = middleware.getAllOperators()[0];

	// Claim for rewardsToken (should succeed)
	vm.prank(operator);
	rewards.claimOperatorFee(address(rewardsToken), operator);
	assertGt(rewardsToken.balanceOf(operator), 0, "Operator should receive rewardsToken");

	// Try to claim for rewardsToken2 (should revert)
	vm.prank(operator);
	vm.expectRevert(abi.encodeWithSelector(IRewards.AlreadyClaimedForLatestEpoch.selector, operator, numberOfEpochs));
	rewards.claimOperatorFee(address(rewardsToken2), operator);
}

function test_claimCuratorFee_multipleTokens_curator() public {
	// Deploy a second reward token
	ERC20Mock rewardsToken2 = new ERC20Mock();
	rewardsToken2.mint(REWARDS_DISTRIBUTOR_ROLE, 1_000_000 * 10 ** 18);
	vm.prank(REWARDS_DISTRIBUTOR_ROLE);
	rewardsToken2.approve(address(rewards), 1_000_000 * 10 ** 18);

	uint48 startEpoch = 1;
	uint48 numberOfEpochs = 3;
	uint256 rewardsAmount = 100_000 * 10 ** 18;

	// Set rewards for both tokens
	vm.startPrank(REWARDS_DISTRIBUTOR_ROLE);
	rewards.setRewardsAmountForEpochs(startEpoch, numberOfEpochs, address(rewardsToken2), rewardsAmount);
	vm.stopPrank();

	// Distribute rewards for epochs 1 to 3
	for (uint48 epoch = startEpoch; epoch < startEpoch + numberOfEpochs; epoch++) {
		_setupStakes(epoch, 4 hours);
		vm.warp((epoch + 3) * middleware.EPOCH_DURATION());
		address[] memory operators = middleware.getAllOperators();
		vm.prank(REWARDS_DISTRIBUTOR_ROLE);
		rewards.distributeRewards(epoch, uint48(operators.length));
	}

	// Warp to epoch 4
	vm.warp((startEpoch + numberOfEpochs) * middleware.EPOCH_DURATION());

	address vault = vaultManager.vaults(0);
	address curator = MockVault(vault).owner();

	// Claim for rewardsToken (should succeed)
	vm.prank(curator);
	rewards.claimCuratorFee(address(rewardsToken), curator);
	assertGt(rewardsToken.balanceOf(curator), 0, "Curator should receive rewardsToken");

	// Try to claim for rewardsToken2 (should revert)
	vm.prank(curator);
	vm.expectRevert(abi.encodeWithSelector(IRewards.AlreadyClaimedForLatestEpoch.selector, curator, numberOfEpochs));
	rewards.claimCuratorFee(address(rewardsToken2), curator);
}
```

**Recommended Mitigation:** Change the `lastEpochClaimedStaker`, `lastEpochClaimedCurator` and `lastEpochClaimedOperator` mappings to be keyed by both the user address and the reward token, for example:

```solidity
mapping(address staker => mapping(address rewardToken => uint48 epoch)) public lastEpochClaimedStaker;
mapping(address curator => mapping(address rewardToken => uint48 epoch)) public lastEpochClaimedCurator;
mapping(address operator => mapping(address rewardToken => uint48 epoch)) public lastEpochClaimedOperator;
```

Update all relevant logic in the `claimRewards` function and elsewhere to use this new mapping structure, ensuring that claims are tracked separately for each reward token.

**Suzaku:**
Fixed in commit [43e09e6](https://github.com/suzaku-network/suzaku-core/pull/155/commits/43e09e66272b72b89e329403b10b0160938ad3b0).

**Cyfrin:** Verified.
