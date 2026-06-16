---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[StakeDAO]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/StakeDAO-security-review_2025-07-21.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [C-01] Missing update of extra reward per token during deposit

- id: 63598
- impact: HIGH
- protocol: StakeDAO_2025-07-21
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[StakeDAO]]-security-review_2025-07-21.md

## Summary


The report is about a bug in the `StrategyWrapper._deposit()` function which is used to update reward per token paid for extra rewards at the time of deposit. The bug causes the extra rewards to be unfairly distributed to new depositors, while existing depositors do not receive their fair share. The bug can be reproduced by running a specific test in the `StrategyWrapper.t.sol` file. The report recommends adding the `_updateExtraRewardState()` function to fix the bug.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

`StrategyWrapper._deposit()` updates the reward per token paid for extra rewards at the time of deposit.

```solidity
		// 3. Keep track of the Extra reward tokens checkpoints at deposit time
		address[] memory rewardTokens = REWARD_VAULT.getRewardTokens();
		for (uint256 i; i < rewardTokens.length; i++) {
	@>		checkpoint.rewardPerTokenPaid[rewardTokens[i]] = extraRewardPerToken[rewardTokens[i]];
		}
```

However, the extra reward per token is not updated during the deposit, so the value of `extraRewardPerToken` corresponds to the last time extra rewards were claimed.

As a result, extra rewards accumulated since the last claim will be unfairly distributed to new depositors, while the existing depositors will not receive their fair share of the additional rewards.

### Proof of concept

Add the following code to the file `StrategyWrapper.t.sol` and run `forge test --mt test_audit_extraRewardsUnfairDistribution`.

```solidity
function test_audit_extraRewardsUnfairDistribution() public {
	// Setup
	address firstUser = makeAddr("firstUser");
	address secondUser = makeAddr("secondUser");

	(RewardVault[] memory vaults,) = deployRewardVaults();
	RewardVault rewardVault = vaults[0];

	wrapper = new RestrictedStrategyWrapper(rewardVault, address(new MorphoMock()), address(this));

	vm.mockCall(
		address(protocolController),
		abi.encodeWithSelector(IProtocolController.isRegistrar.selector, address(this)),
		abi.encode(true)
	);
	rewardVault.addRewardToken(Common.WETH, address(this));

	// 1. First user deposits to the vault
	_depositIntoWrapper(rewardVault, firstUser, 1e18);

	// 2. Deposit some extra reward token into the reward vault
	uint128 extraRewardAmount = 1e20;
	deal(Common.WETH, address(this), extraRewardAmount);
	IERC20(Common.WETH).approve(address(rewardVault), extraRewardAmount);
	rewardVault.depositRewards(Common.WETH, extraRewardAmount);

	// 3. Second user deposits to the vault after 1 week
	skip(7 days);
	_depositIntoWrapper(rewardVault, secondUser, 100_000e18);

	// 4. Second user withdraws immediately after depositing
	_withdrawFromWrapper(secondUser, 100_000e18);

	// 5. First user claims extra rewards
	_claimExtraRewardsFromWrapper(firstUser);

	// The second user received most of the extra rewards, while they should have been
	// all distributed to the first user
	assertApproxEqRel(
		IERC20(Common.WETH).balanceOf(firstUser),
		extraRewardAmount * 1 / 100_001,
		1e15 // 0.1% (rounding)
	);
	assertApproxEqRel(
		IERC20(Common.WETH).balanceOf(secondUser),
		extraRewardAmount * 100_000 / 100_001,
		1e15 // 0.1% (rounding)
	);
}
```

## Recommendations

```diff
        // 3. Keep track of the Extra reward tokens checkpoints at deposit time
        address[] memory rewardTokens = REWARD_VAULT.getRewardTokens();
+       _updateExtraRewardState(rewardTokens);
        for (uint256 i; i < rewardTokens.length; i++) {
            checkpoint.rewardPerTokenPaid[rewardTokens[i]] = extraRewardPerToken[rewardTokens[i]];
        }
```
