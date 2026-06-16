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
protocol: "[[Rio Network]]"
auditors:
  - "[[Aymen0909]]"
  - "[[KupiaSec]]"
  - "[[g]]"
  - "[[hash]]"
  - "[[kennedy1030]]"
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# H-2: Setting the strategy cap to "0" does not update the total shares held or the withdrawal queue

- id: 30897
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: kennedy1030 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the Rio Network Core Protocol, specifically with setting the strategy cap to "0". The bug was found by multiple individuals and it has been observed that when the strategy cap is set to "0", the total shares held in the system are not decreased and the withdrawal queue is not updated. This means that users can request withdrawals, but when rebalancing occurs, the withdrawals will exceed the allocated amount. The bug can be triggered by setting the strategy cap to "0" or by removing an operator. The vulnerability can result in double counting of shares and can have a high impact on users. The recommended solution is to update the withdrawal queue when the operator registry admin changes the EigenLayer shares amount. This issue has been identified through manual review and it has been noted that it is similar to other reported issues related to not zeroing out the strategy allocation when force exiting an operator. A proposed solution for this issue has been submitted for review.

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/10 

## Found by 
Aymen0909, KupiaSec, g, hash, kennedy1030, mstpr-brainbot
## Summary
Removing or setting the strategy cap to 0 will not decrease the shares held in the system. Additionally, it will not update the withdrawal queue, which means users can request withdrawals, and the withdrawals will exceed the allocated amount when rebalance occurs.
## Vulnerability Detail
Let's go over the issue with an example:

Assume there is 1 strategy and 2 operators active in an LSR with total strategy shares holding is 1000 * 1e18 where both operators shares 500-500 the assets. 

When the owner decides to inactivate or just simply sets one of the operators cap to "0" the operator will withdraw all its assets as follows:
```solidity
function setOperatorStrategyCap(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint8 operatorId,
        IRioLRTOperatorRegistry.StrategyShareCap memory newShareCap
    ) internal {
        . 
        // @review this "if" will be executed
        -> if (currentShareDetails.cap > 0 && newShareCap.cap == 0) {
            // If the operator has allocations, queue them for exit.
            if (currentShareDetails.allocation > 0) {
                -> operatorDetails.queueOperatorStrategyExit(operatorId, newShareCap.strategy);
            }
            // Remove the operator from the utilization heap.
            utilizationHeap.removeByID(operatorId);
        } else if (currentShareDetails.cap == 0 && newShareCap.cap > 0) {
            // If the current cap is 0 and the new cap is greater than 0, insert the operator into the heap.
            utilizationHeap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
        } else {
            // Otherwise, update the operator's utilization in the heap.
            utilizationHeap.updateUtilizationByID(operatorId, currentShareDetails.allocation.divWad(newShareCap.cap));
        }
        .
    }
```
```solidity
function queueOperatorStrategyExit(IRioLRTOperatorRegistry.OperatorDetails storage operator, uint8 operatorId, address strategy) internal {
        .
        // @review asks delegator to exit
        -> bytes32 withdrawalRoot = delegator.queueWithdrawalForOperatorExit(strategy, sharesToExit);
        emit IRioLRTOperatorRegistry.OperatorStrategyExitQueued(operatorId, strategy, sharesToExit, withdrawalRoot);
    }
```

Then the operator delegator contract calls the EigenLayer to withdraw all its balance as follows:
```solidity
function _queueWithdrawalForOperatorExitOrScrape(address strategy, uint256 shares) internal returns (bytes32 root) {
       . // @review jumps to internal function
        -> root = _queueWithdrawal(strategy, shares, address(depositPool()));
    }

function _queueWithdrawal(address strategy, uint256 shares, address withdrawer) internal returns (bytes32 root) {
        IDelegationManager.QueuedWithdrawalParams[] memory withdrawalParams = new IDelegationManager.QueuedWithdrawalParams[](1);
        withdrawalParams[0] = IDelegationManager.QueuedWithdrawalParams({
            strategies: strategy.toArray(),
            shares: shares.toArray(),
            withdrawer: withdrawer
        });
        // @review calls Eigen layer to queue all the balance and returns the root
        -> root = delegationManager.queueWithdrawals(withdrawalParams)[0];
    }
```

Which we can observe from the above snippet the EigenLayer is called for the withdrawal and then the entire function execution ends. The problem is `assetRegistry` still thinks there are 1000 * 1e18 EigenLayer shares in the operators. Also, the `withdrawalQueue` is not aware of this withdrawal request which means that users can call `requestWithdrawal` to withdraw up to 1000 * 1e18 EigenLayer shares worth LRT but in reality the 500 * 1e18 portion of it already queued in withdrawal by the owner of operator registry.

**Coded PoC:**
```solidity
function test_SettingStrategyCapZero_WithdrawalsAreDoubleCountable() public {
        IRioLRTOperatorRegistry.StrategyShareCap[] memory zeroStrategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](2);
        zeroStrategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: RETH_STRATEGY, cap: 0});
        zeroStrategyShareCaps[1] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: 0});

        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));

        uint256 AMOUNT = 111e18;

        // Allocate to cbETH strategy.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 lrtAmount = reLST.coordinator.deposit(CBETH_ADDRESS, AMOUNT);

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        vm.recordLogs();
        reLST.operatorRegistry.setOperatorStrategyShareCaps(operatorId, zeroStrategyShareCaps);

        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertGt(entries.length, 0);

        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].topics[0] == keccak256('OperatorStrategyExitQueued(uint8,address,uint256,bytes32)')) {
                uint8 emittedOperatorId = abi.decode(abi.encodePacked(entries[i].topics[1]), (uint8));
                (address strategy, uint256 sharesToExit, bytes32 withdrawalRoot) =
                    abi.decode(entries[i].data, (address, uint256, bytes32));

                assertEq(emittedOperatorId, operatorId);
                assertEq(strategy, CBETH_STRATEGY);
                assertEq(sharesToExit, AMOUNT);
                assertNotEq(withdrawalRoot, bytes32(0));

                break;
            }
            if (i == entries.length - 1) fail('Event not found');
        }

        // @review add these
        // @review all the eigen layer shares are already queued as we checked above, now user requestWithdrawal
        // of the same amount of EigenLayer share worth of LRT which there will be double counting when epoch is settled.
        uint256 queuedShares = reLST.coordinator.requestWithdrawal(address(cbETH), lrtAmount);
        console.log("Queued shares", queuedShares);
    }
```
## Impact
High, because the users withdrawals will never go through in rebalancing because of double counting of the same share withdrawals.
## Code Snippet
https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/utils/OperatorRegistryV1Admin.sol#L231-L270

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/utils/OperatorRegistryV1Admin.sol#L144-L165

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorDelegator.sol#L225-L227

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorDelegator.sol#L253-L258

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorDelegator.sol#L265-L273
## Tool used

Manual Review

## Recommendation
Update the withdrawal queue when the operator registry admin changes the EigenLayer shares amount by either removing an operator or setting its strategy cap to "0".



## Discussion

**solimander**

Largely sounds like a duplicate of https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/361.

**solimander**

While the duplicates linked in this issue all look valid, but are related to the failure to zero out the strategy allocation after setting the strategy cap to 0.

**solimander**

This PR fixes the linked duplicates: https://github.com/rio-org/rio-sherlock-audit/pull/14

**solimander**

@nevillehuang This issue seems to be a duplicate of https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/361, while all linked duplicates point to a slightly different issue where allocation is not zeroed out when force exiting an operator.
