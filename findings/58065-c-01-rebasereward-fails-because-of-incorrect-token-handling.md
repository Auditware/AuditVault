---
tags:
  - lang/solidity
  - sector/governance
  - sector/options
  - sector/token
  - has/github
  - has/poc
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md"
genome:
  - "[[fot-slippage]]"
  - "[[specific-token-type]]"
---
# [C-01] `RebaseReward` fails because of incorrect token handling

- id: 58065
- impact: HIGH
- protocol: KittenSwap_2025-06-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md

## Summary


The report describes a bug in the `RebaseReward` contract, where rewards earned by a token ID are incorrectly deposited into the `VotingEscrow` contract. This occurs because the `incentivize()` function allows anyone to send rewards of any whitelisted token, whereas the `notifyRewardAmount()` function is only supposed to allow rewards for the Kitten token. As a result, some users may receive the Kitten rewards that belong to other users, while the token rewards get locked in the contract. The report suggests overriding the `incentivize()` function to only allow rewards for Kitten, or adapting the `_getReward()` function to handle rewards for other tokens correctly.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

`RebaseReward` deposits rewards earned by a token ID into the `VotingEscrow` contract.

```solidity
	if (reward > 0) {
		veKitten.deposit_for(_tokenId, reward);
		emit ClaimReward(_period, _tokenId, _token, _owner);
	}
```

While the `notifyRewardAmount()` function is overridden to only allow rewards for the Kitten token, `incentivize()` still allows anyone to send rewards of any whitelisted token.

As a result, rewards of tokens other than Kitten will incorrectly deposit Kitten in the `VotingEscrow` contract.

This will cause some users to receive the Kitten rewards that correspond to other users, while the token rewards deposited with the `incentivize()` function will get locked in the contract.

### Proof of concept

Add the following code to the file `TestRebaseReward.t.sol` and run `forge test -f https://rpc.hyperliquid.xyz/evm --mt test_audit_RebaseRewardBrokenRewards --mc TestRebaseReward`.

```solidity
function test_audit_RebaseRewardBrokenRewards() public {
	test_CreateGauge();
	CLGauge _gauge = CLGauge(gauge.get(poolList[0]));
	RebaseReward _rebaseReward = RebaseReward(voter.rebaseReward());
	address user1 = userList[0];
	address user2 = userList[1];
	uint256 kittenAmount = 1 ether;

	vm.startPrank(address(voter));
	// user1 votes
	uint256 tokenId1 = veKitten.tokenOfOwnerByIndex(user1, 0);
	_rebaseReward._deposit(1 ether, tokenId1);

	// user2 votes
	uint256 tokenId2 = veKitten.tokenOfOwnerByIndex(user2, 0);
	_rebaseReward._deposit(1 ether, tokenId2);
	vm.stopPrank();

	// user1 (or anyone else) sends 1e18 token0 as reward to RebaseReward
	deal(address(_gauge.token0()), user1, 1 ether);
	vm.startPrank(address(user1));
	_gauge.token0().approve(address(_rebaseReward), 1 ether);
	_rebaseReward.incentivize(address(_gauge.token0()), 1 ether);
	vm.stopPrank();

	// notify reward after epoch ends/star of next epoch
	vm.warp(ProtocolTimeLibrary.epochNext(block.timestamp));
	vm.startPrank(address(minter));
	kitten.mint(address(minter), kittenAmount);
	kitten.approve(address(_rebaseReward), kittenAmount);
	_rebaseReward.notifyRewardAmount(address(kitten), kittenAmount);
	vm.stopPrank();

	// user1 claims reward
	(int128 veKittenBalBefore, ) = veKitten.locked(tokenId1);
	vm.prank(user1);
	_rebaseReward.getRewardForTokenId(tokenId1);
	(int128 veKittenBalAfter, ) = veKitten.locked(tokenId1);

	// all Kitten rewards have been claimed by user1
	uint256 user1Claimed = uint256(uint128(veKittenBalAfter - veKittenBalBefore));
	assertEq(user1Claimed, kittenAmount);

	// user2 tries to claim reward, but it reverts, as there is no Kitten left
	vm.prank(user2);
	vm.expectRevert();
	_rebaseReward.getRewardForTokenId(tokenId2);
}
```

## Recommendations

Override the `incentivize()` function in `RebaseReward` to allow only rewards for Kitten.

Another option would be accepting rewards of any token and adapting `_getReward()` to handle the rewards for these tokens correctly.
