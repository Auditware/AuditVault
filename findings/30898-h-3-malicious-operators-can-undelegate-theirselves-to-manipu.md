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
  - "[[g]]"
  - "[[giraffe]]"
  - "[[hash]]"
  - "[[mstpr-brainbot]]"
  - "[[zzykxx]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# H-3: Malicious operators can `undelegate` theirselves to manipulate the LRT exchange rate

- id: 30898
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: g (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in the Rio Network Core Protocol, specifically in the EigenLayer delegation manager contract. The issue was discovered by a team of researchers, and it involves malicious operators being able to manipulate the exchange rate of LRT by undelegating themselves. This can cause the ETH/LST to become stuck and unable to be claimed by the Rio Delegator Approver contract. 

The vulnerability occurs when operators "undelegate" themselves from any delegation forwarded to them. This can trigger two things: 1) the strategy shares delegated to the operator will be queued for withdrawal, and 2) the EigenPod shares will be removed. The first issue can be resolved by implementing functionality in the operator delegator contract, but the second issue is more serious. It can cause a significant decrease in the TVL and the LRT exchange rate, affecting deposits and withdrawals of LRT in different assets. 

A proof of concept was provided in the report, and the tool used for this analysis was a manual review. The recommendation is to address this vulnerability as it has a high impact on the protocol. The discussion among the researchers suggests that this should be considered a high severity issue due to the potential for direct manipulation of exchange rates and the lack of trust in operators within the Rio Protocol.

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/53 

## Found by 
g, giraffe, hash, mstpr-brainbot, zzykxx
## Summary
If a malicious operator undelegates itself in EigenLayer delegation manager contract, the exchange rate of LRT can significantly decrease, and ETH/LST can become stuck, unable to be claimed by the Rio Delegator Approver contract.
## Vulnerability Detail
Operators' delegator contracts delegate their balance to the operators. Operators can "undelegate" themselves from any delegation forwarded to them by triggering this function:
[DelegationManager.sol#L211-L258](https://github.com/Layr-Labs/eigenlayer-contracts/blob/6de01c6c16d6df44af15f0b06809dc160eac0ebf/src/contracts/core/DelegationManager.sol#L211-L258).

If the operator `undelegate` the delegator approver, then according to the strategy, there can be two things that happen:

1- Strategy shares:
When the operator undelegates, the strategy shares delegated to the operator will be queued for withdrawal to the stakee address. In this case, the `staker` is the RIO operator delegator contract, which has no implementation to withdraw the queued withdrawal request since the withdrawer must be the "msg.sender." Therefore, the operator delegator must implement that functionality in such cases. The only downside to this is that the accounting of strategy shares to operators is tracked internally and not relied upon the StrategyManager's actual shares in the EigenLayer contract.

2- EigenPod shares:
When EigenPod shares are `undelegate`, the EigenPod shares are removed. Unlike the strategy shares, the EigenPod shares are used to account for how much ETH is held by each operator. If an operator `undelegate`, then the entire EigenPod balance will be "0," and the RIO contracts are not prepared for this. This will erase a large amount of ETH TVL held by the Beacon Chain strategy, hence the LRT token exchange rate will change dramatically. Also, as with the above strategy shares issue, the `staker` is the operator delegator; hence, the operator delegator must implement the withdrawal functionality to be able to withdraw the ETH balance from the EigenPod.
## Impact
High because of the "EigenPod shares" issue can unexpectedly decrease the TVL, leading to a decrease in the LRT exchange rate without warning which would affect the deposits/withdrawals of the LRT in different assets aswell. 

**Coded PoC:**
```solidity
// forge test --match-contract RioLRTOperatorRegistryTest --match-test test_UndelegateRemovesEigenPodShares -vv
    function test_UndelegateRemovesEigenPodShares() public {
        uint8 operatorId =
            addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 10);
        
        // @review make a deposit
        reETH.coordinator.depositETH{value: 32 * 5 ether}();

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify validator withdrawal credentials.
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, operatorId, 5);

        // @review get the addresses 
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;
        RioLRTOperatorDelegator delegatorContract = RioLRTOperatorDelegator(payable(operatorDelegator));

        // @review all ether is in eigen pod shares 
        assertEq(uint256(delegatorContract.getEigenPodShares()), 32 * 5 * 1e18);
        // @review the TVL is the 32*5 ether and the initial deposit
        assertEq(reETH.assetRegistry.getTVLForAsset(ETH_ADDRESS), 160010000000000000000);

        // @review undelegate from the operator 
        vm.prank(address(uint160(0 + 1)));
        delegationManager.undelegate(operatorDelegator);

        // @review eigenpod shares are removed fully
        assertEq(uint256(delegatorContract.getEigenPodShares()), 0);
        // @review the TVL is only the initial deposit
        assertEq(reETH.assetRegistry.getTVLForAsset(ETH_ADDRESS), 10000000000000000);
    }
```
## Code Snippet
https://github.com/Layr-Labs/eigenlayer-contracts/blob/6de01c6c16d6df44af15f0b06809dc160eac0ebf/src/contracts/core/DelegationManager.sol#L211-L258

## Tool used

Manual Review

## Recommendation



## Discussion

**solimander**

Valid, but feels like it should be medium given precondition that you must be voted into the active operator set.

**nevillehuang**

Since operators are not trusted in the context of rio-protocol, I believe high severity to be appropriate since this allows direct manipulation of exchange rates and can cause stuck funds within rio contracts
