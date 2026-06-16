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
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# [C-01] `instantWithdraw()` does not transfer `_amountForContract`, locking tokens

- id: 63717
- impact: HIGH
- protocol: [[BOB]]-Staking_2025-10-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/BOB-Staking-security-review_2025-10-18.md

## Summary


The bug report is about a function called `instantWithdraw()` that is used to withdraw tokens from a contract. The issue is that when a user delegates their tokens, the penalty for early withdrawal is transferred to the receiver, but the actual tokens are not transferred back to the contract. This means that the tokens become stuck in the delegation contract instead of being returned to the original contract. To fix this, the recommendation is to transfer the penalty tokens back to the original contract.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description
`instantWithdraw()` is used to immediately withdraw all staked tokens, applying a penalty for the early withdrawal.
```solidity
function instantWithdraw(address _receiver) external nonReentrant {
        if (stakers[_stakeMsgSender()].unlockTimestamp > block.timestamp) {
            revert TokensLocked();
        }

        if (unbondEndTimes[_stakeMsgSender()] != 0) {
            revert UnbondAlreadyStarted();
        }

        _claimRewards(_stakeMsgSender(), false);

        uint256 amount = stakers[_stakeMsgSender()].amountStaked;
        if (amount == 0) revert NotEnoughBalance();

        stakingTokenBalance -= amount;

        // Calculate the penalty amount to the user
        uint256 _amountForUser = (amount * instantWithdrawalRate) / 100;
        uint256 _amountForContract = amount - _amountForUser;

        rewardTokenBalance += _amountForContract;

@>      if (stakers[_stakeMsgSender()].governanceDelegatee != address(0)) {
            // If the user has a governance delegatee, the tokens are stored in the surrogate contract
            DelegationSurrogate surrogate = storedSurrogates[stakers[_stakeMsgSender()].governanceDelegatee];
            IERC20(stakingToken).safeTransferFrom(address(surrogate), _receiver, _amountForUser);
        } else {
            // If the user does not have a governance delegatee, the tokens are stored in this contract
            IERC20(stakingToken).safeTransfer(_receiver, _amountForUser);
        }

        delete stakers[_stakeMsgSender()];

        emit TokensWithdrawn(_stakeMsgSender(), _receiver, amount);
    }
```
If a user delegates their tokens, the `_amountForUser` is transferred from the surrogate to the receiver. The issue is that `_amountForContract` is not transferred from the surrogate to the `BobStaking` contract, causing those tokens to become permanently stuck in the surrogate.

Moreover, the penalty is added to `rewardTokenBalance` but never actually transferred to the contract, which causes `rewardTokenBalance` to reflect a higher value than the contract truly holds.


To better illustrate the issue, copy the following POC into `BobStaking.t.sol`.

For the test to run properly, set the `storedSurrogates` mapping to `public` and add the following import to the test file: `import {DelegationSurrogate} from "@tally/staker/DelegationSurrogate.sol"`.
```solidity
function test_PenaltyIsNotTransferedToBobStakingContracts() public {
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

        vm.prank(stakerOne);
        stakeContract.alterGovernanceDelegatee(delegatee);

        assertEq(stakingToken.getVotes(delegatee), stakedAmount);

        uint256 contractBalanceBefore = stakingToken.balanceOf(address(stakeContract));

        vm.prank(stakerOne);
        stakeContract.instantWithdraw(stakerOne);

        uint256 contractBalanceAfter = stakingToken.balanceOf(address(stakeContract));

        DelegationSurrogate surrogate = stakeContract.storedSurrogates(delegatee);

        uint256 surrogateBalance = stakingToken.balanceOf(address(surrogate));

        assertEq(contractBalanceBefore, contractBalanceAfter);
        assertEq(surrogateBalance, stakedAmount / 2);  
    }
```
## Recommendations
To solve the issue, transfer `_amountForContract` to the `BobStaking` contract.
```diff
function instantWithdraw(address _receiver) external nonReentrant {
        if (stakers[_stakeMsgSender()].unlockTimestamp > block.timestamp) {
            revert TokensLocked();
        }

        if (unbondEndTimes[_stakeMsgSender()] != 0) {
            revert UnbondAlreadyStarted();
        }

        _claimRewards(_stakeMsgSender(), false);

        uint256 amount = stakers[_stakeMsgSender()].amountStaked;
        if (amount == 0) revert NotEnoughBalance();

        stakingTokenBalance -= amount;

        // Calculate the penalty amount to the user
        uint256 _amountForUser = (amount * instantWithdrawalRate) / 100;
        uint256 _amountForContract = amount - _amountForUser;

        rewardTokenBalance += _amountForContract;

        if (stakers[_stakeMsgSender()].governanceDelegatee != address(0)) {
            // If the user has a governance delegatee, the tokens are stored in the surrogate contract
            DelegationSurrogate surrogate = storedSurrogates[stakers[_stakeMsgSender()].governanceDelegatee];
            IERC20(stakingToken).safeTransferFrom(address(surrogate), _receiver, _amountForUser);
+           IERC20(stakingToken).safeTransferFrom(address(surrogate), address(this), _amountForContract);
        } else {
            // If the user does not have a governance delegatee, the tokens are stored in this contract
            IERC20(stakingToken).safeTransfer(_receiver, _amountForUser);
        }

        delete stakers[_stakeMsgSender()];

        emit TokensWithdrawn(_stakeMsgSender(), _receiver, amount);
    }
```
