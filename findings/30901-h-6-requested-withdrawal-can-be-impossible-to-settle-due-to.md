---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/liquid-staking
  - sector/restaking
  - sector/staking
  - sector/token
  - sector/vault
protocol: "[[Rio Network]]"
auditors:
  - "[[g]]"
  - "[[mstpr-brainbot]]"
  - "[[zzykxx]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# H-6: Requested withdrawal can be impossible to settle due to EigenLayer shares value appreciate when there are idle funds in deposit pool

- id: 30901
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Rio Network Core Protocol that can make it impossible to settle a withdrawal request. This is due to the appreciation of EigenLayer shares, which are used to determine the value of the requested withdrawal, and idle funds in the deposit pool. The report includes a detailed explanation of how this vulnerability can occur and provides a code snippet that demonstrates the issue. The impact of this bug is considered high as it can prevent users from making further withdrawals. The report also mentions that the protocol team has fixed this issue in a recent PR/commit. 

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/109 

## Found by 
g, mstpr-brainbot, zzykxx
## Summary
When users request a withdrawal, the EigenLayer shares equivalent to their LRT's value are recorded. During settlement, these EigenLayer shares must be deducted to finalize the withdrawal epoch. However, in certain scenarios, the requested EigenLayer shares may be impossible to unwind due to funds idling in the deposit pool. 
## Vulnerability Detail
Let's assume that 1 LRT equals 1 EigenLayer-cbETH, which equals 1 cbETH initially.

Alice deposits 5e18 cbETH, and her deposits are allocated to operators after rebalancing. Now, Rio holds 5 EigenLayer-cbETH, which is worth 5 cbETH.

After some time, Bob deposits 100e18 cbETH to Rio and immediately withdraws it. At the time Bob requests this withdrawal, 100 cbETH is worth 100 EigenLayer-cbETH, so the shares owed are 100 EigenLayer-cbETH. At settlement, 100 EigenLayer-cbETH worth of cbETH has to be sent to the withdrawal queue to settle this epoch.

Now, assume that the value of EigenLayer-cbETH increases, meaning that 1 EigenLayer-cbETH is now worth more cbETH. This is an expected behavior because EigenLayer-cbETH is similar to an ERC4626 vault, and we expect its value to increase over time.

Let's say 1 EigenLayer-cbETH is now worth 1.1 cbETH.

Now, 100 cbETH sits idle in the deposit pool, and there are 5 EigenLayer-cbETH in the operators, which means there are a total of 90.9 + 5 = 95.9 EigenLayer-cbETH worth of cbETH in Rio. However, Bob's withdrawal request is for 100 EigenLayer-cbETH.

This would mean that Bob's withdrawal request will not be settled, and the entire withdrawal flow will be stuck because this epoch can't be settled.



**Coded PoC:**
```solidity
 // forge test --match-contract RioLRTDepositPoolTest --match-test test_InsufficientSharesInWithdrawal -vv
    function test_InsufficientSharesInWithdrawal() public {
        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 AMOUNT = 5e18;

        // Allocate to cbETH strategy.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        reLST.coordinator.deposit(CBETH_ADDRESS, AMOUNT);
        console.log("SHARES HELD", reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS));

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        assertEq(cbETH.balanceOf(address(reLST.depositPool)), 0);
        assertEq(reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS), AMOUNT);
        console.log("SHARES HELD", reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS));

        // @review before rebalance, deposit 100 * 1e18
        reLST.coordinator.deposit(CBETH_ADDRESS, 100e18);

        // @review request withdrawal 
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, 100e18);
        console.log("SHARES HELD", reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS));

        // @review donate, the idea is to make EigenLayer shares worth more
        uint256 donate = 10_000 * 1e18;
        address tapir = address(69);
        MockERC20(CBETH_ADDRESS).mint(tapir, donate);
        console.log("before rate", reLST.assetRegistry.convertFromSharesToAsset(address(cbETHStrategy), 1e18));

        // @review expecting the rate to be higher after donation
        vm.prank(tapir);
        MockERC20(CBETH_ADDRESS).transfer(address(cbETHStrategy), donate);
        console.log("after rate", reLST.assetRegistry.convertFromSharesToAsset(address(cbETHStrategy), 1e18));

        // @review rebalance, expect revert
        skip(reLST.coordinator.rebalanceDelay());
        vm.startPrank(EOA, EOA);
        vm.expectRevert(bytes4(keccak256("INCORRECT_NUMBER_OF_SHARES_QUEUED()")));
        reLST.coordinator.rebalance(CBETH_ADDRESS);
        vm.stopPrank();
    }
```
## Impact
High since the further and current withdrawals are not possible. 
## Code Snippet
https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTCoordinator.sol#L99-L151

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/utils/OperatorOperations.sol#L113-L134
## Tool used

Manual Review

## Recommendation



## Discussion

**solimander**

Seems unlikely to have a meaningful effect while rebasing tokens are not supported.

**sherlock-admin4**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/rio-org/rio-sherlock-audit/pull/13


**Czar102**

For a more severe impact, see #112.
