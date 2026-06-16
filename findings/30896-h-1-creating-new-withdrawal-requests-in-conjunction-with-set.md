---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[Rio Network]]"
auditors:
  - "[[0xkaden]]"
  - "[[AuditorPraise]]"
  - "[[Aymen0909]]"
  - "[[Bauer]]"
  - "[[ComposableSecurity]]"
  - "[[Drynooo]]"
  - "[[HSP]]"
  - "[[KupiaSec]]"
  - "[[Stiglitz]]"
  - "[[Thanos]]"
  - "[[Tricko]]"
  - "[[almurhasan]]"
  - "[[aslanbek]]"
  - "[[bhilare_]]"
  - "[[cu5t0mPe0]]"
  - "[[deth]]"
  - "[[eeshenggoh]]"
  - "[[fnanni]]"
  - "[[g]]"
  - "[[giraffe]]"
  - "[[hash]]"
  - "[[iamandreiski]]"
  - "[[jovi]]"
  - "[[kennedy1030]]"
  - "[[klaus]]"
  - "[[lemonmon]]"
  - "[[lil.eth]]"
  - "[[monrel]]"
  - "[[mstpr-brainbot]]"
  - "[[mussucal]]"
  - "[[peanuts]]"
  - "[[popular]]"
  - "[[sakshamguruji]]"
  - "[[shaka]]"
  - "[[thec00n]]"
  - "[[zraxx]]"
  - "[[zzykxx]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[vote-delegation-loop]]"
---
# H-1: Creating new withdrawal requests in conjunction with `settleEpochFromEigenLayer` will render system unusable

- id: 30896
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: mussucal (Sherlock)
- source: N/A

## Summary


The bug report describes an issue where users can create new withdrawal requests for funds while the system is in the process of withdrawing funds from a separate layer. This can lead to a locking of the system and loss of user funds. The vulnerability was discovered by a group of auditors and can be triggered by a specific set of conditions. The impact of this bug is critical and there is currently no access control in place to prevent it. The auditors recommend incrementing the current epoch as soon as the withdrawal process is initiated to avoid this issue. The bug has been fixed by the protocol team in a recent commit.

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/4 

## Found by 
0xkaden, AuditorPraise, Aymen0909, Bauer, ComposableSecurity, Drynooo, HSP, KupiaSec, Stiglitz, Thanos, Tricko, almurhasan, aslanbek, bhilare\_, cu5t0mPe0, deth, eeshenggoh, fnanni, g, giraffe, hash, iamandreiski, jovi, kennedy1030, klaus, lemonmon, lil.eth, monrel, mstpr-brainbot, mussucal, peanuts, popular, sakshamguruji, shaka, thec00n, zraxx, zzykxx
## Summary
This issue pertains to the flow where a user requests to withdraw more funds than are currently present in the `depositPool` and the system must withdraw from Eigenlayer. 

Users are able to create new withdrawal requests for the current epoch while the Eigenlayer withdrawal request is pending, as well as after the epoch has been marked `settled` in `settleEpochFromEigenLayer()`. This is due to the fact that `settleEpochFromEigenLayer()` does not increment the current epoch, as well as that there is no way to fulfill withdrawal requests submitted after the 7 day waiting period has been initiated. Submitting a withdrawal request will result in an inability to progress epochs and a locking of the system. 

## Vulnerability Detail
Consider the system in the following state:
- We are in epoch 0
- A user submitted a withdrawal request for an amount greater than what is currently in `depositPool`
- `rebalance() --> withdrawalQueue_.queueCurrentEpochSettlement()` has been called
- The system made a request to Eigenlayer for the necessary amount and the withdrawal request is ready to be claimed
- The next step is to call `RioLRTWithdrawalQueue:settleEpochFromEigenLayer()` [link](https://github.com/sherlock-audit/2024-02-rio-vesting-core-protocol/blob/main/rio-sherlock-audit/contracts/restaking/RioLRTWithdrawalQueue.sol#L216)

The function `settleEpochFromEigenLayer()` performs several important tasks - completing pending withdrawals from Eigenlayer, accounting for the amounts received, burning the appropriate amount of LRTs, and marking the epoch as settled. It does NOT increment the epoch counter for the asset - the only way to do that is in `settleCurrentEpoch()`, which is only called in `rebalance()` when there is enough present in the `depositPool` to cover withdrawals. 

After calling `settleEpochFromEigenLayer()`, the system is in a state where the current epoch has been marked as settled. However, while waiting for the 7 day Eigenlayer delay it is possible that more users sent withdrawal requests. These withdrawal requests would be queued for epoch 0 (and increment `sharesOwed` for epoch 0) , but were not considered when performing the withdrawal from Eigenlayer. There is no way to process these requests, as the epoch has already been settled + we can only call `queueCurrentEpochSettlement` once per epoch due to the `if (epochWithdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();` check

Notably, users that requested withdrawals have already sent the LRT amount to be burned and are unable to reclaim their funds. 

Also note that there is no access control on `settleEpochFromEigenLayer()`, so as long as the provided withdrawal parameters are correct anybody can call the function. 

## Impact
Critical - system no longer operates, loss of users funds

## Code Snippet
The following test can be dropped into `RioLRTWithdrawalQueue.t.sol`
```solidity
 function test_lockAsset() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, and verify the validator withdrawal credentials.
        uint256 depositAmount = (ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance);
        uint256 withdrawalAmount = 10 ether;
        assertGt(depositAmount, withdrawalAmount * 2); // We will be withdrawing twice
        reETH.coordinator.depositETH{value: depositAmount}();
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal and rebalance to kick off the Eigenlayer withdrawal process
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Ensure no reETH has been burned yet and process withdrawals.
        assertEq(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch. This marks the epoch as settled and
        // makes the requested withdrawal amount available to be claimed.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: withdrawalAmount.toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        // Epoch is settled
        assertTrue(epochSummary.settled);

        // However, the epoch has not been incremented - we're still in epoch 0 even after settlement
        assertEq(reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS), 0);

        // We can still create new withdrawal requests for this epoch and increase sharesOwed
        uint256 sharesOwedBefore = epochSummary.sharesOwed;
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        epochSummary = reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        // Shares owed has increased
        assertGt(epochSummary.sharesOwed, sharesOwedBefore);

        // We've received one withdrawalAmount worth of assets from Eigenlayer
        assertEq(epochSummary.assetsReceived, withdrawalAmount);
        assertEq(epochSummary.shareValueOfAssetsReceived, withdrawalAmount);

        // Claim what was received from Eigenlayer (== one withdrawalAmount)
        uint256 balanceBefore = address(this).balance;
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        // The user has been marked as Claimed for this epoch, even though only one withdrawalAmount worth was claimed
        assertTrue(userSummary.claimed);
        assertEq(amountOut, withdrawalAmount);
        assertEq(address(this).balance - balanceBefore, withdrawalAmount);
        // sharesOwed for this epoch is 2 withdrawals worth (we're sitll missing one)
        assertEq(epochSummary.sharesOwed, withdrawalAmount * 2);

        // We can't rebalance because withdrawals have already been queued for this epoch
        // If we can't rebalance, we can't ever get to settleCurrentEpoch() to progress to the next epoch
        skip(reETH.coordinator.rebalanceDelay());
        vm.prank(EOA, EOA);
        vm.expectRevert(0x9a641da5); // WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Current epoch is still 0
        assertEq(reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS), 0);

        // Reverts in pre-checks because the epoch has been marked as settled
        vm.expectRevert(0xad29946a); // EPOCH_ALREADY_SETTLED
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));
    }
```
## Tool used

Manual Review

## Recommendation
Consider incrementing the current epoch as soon as the withdrawal process has been initiated, such that user withdrawal requests sent after an epoch has been queued for settlement will be considered a part of the next epoch



## Discussion

**solimander**

Valid bug - `currentEpochsByAsset[asset] += 1;` should be called in `queueCurrentEpochSettlement`.

**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/rio-org/rio-sherlock-audit/pull/1.
