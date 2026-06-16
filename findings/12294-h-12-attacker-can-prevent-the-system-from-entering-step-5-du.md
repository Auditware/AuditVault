---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/stable
protocol: "[[Derby]]"
auditors:
  - "[[cergyk]]"
report: "https://github.com/sherlock-audit/2023-01-derby-judging"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# H-12: Attacker can prevent the system from entering step 5 during the rebalancing period

- id: 12294
- impact: HIGH
- protocol: [[Derby]]
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


This bug report is about an issue where an attacker can prevent the system from entering step 5 during the rebalancing period. This is done by calling the pushVaultAmounts function multiple times, which causes the vaultStage[_vaultNumber].fundsReceived to be greater than vaultStage[_vaultNumber].activeVaults. This prevents the system from entering step 5, meaning the rebalancing will not be completed. 

The issue was found by cergyk and nobody2018, and it was manually reviewed. To prevent the issue, the recommendation is to add a cache mark to each chain of each vault to indicate whether it has been sent. This check should be done at the beginning of pushVaultAmounts and the cache mark should be set at the end of pushVaultAmounts.

The issue has been accepted as a valid duplicate of #31, and the contestants' payouts and scores will be updated accordingly.

## Details

Source: https://github.com/sherlock-audit/2023-01-derby-judging/issues/98 

## Found by 
cergyk, nobody2018

## Summary

When the system is **in step 3 of the rebalancing period**, anyone can push amount to the specified vault on the specified chain by calling [[XChainController.pushVaultAmounts](https://github.com/sherlock-audit/2023-01-derby/blob/main/derby-yield-optimiser/contracts/XChainController.sol#L295-L324)]. Without checking whether it has been sent, attacker only needs to call this function again after the off-chain keeper calls it for each chain, causing `vaultStage[_vaultNumber].fundsReceived > vaultStage[_vaultNumber].activeVaults`. The condition for the system to enter step 5 is `vaultStage[_vaultNumber].fundsReceived == vaultStage[_vaultNumber].activeVaults`. Obviously, this will stop the system at step 5.

## Vulnerability Detail

Let's assume some states of the current system in step 3:

- No.1 usdc-Vault, No.1 chain(**mainnet**), No.2 chain and No.3 chain.
- The No. 1 chain needs to withdraw 10000 usdc from protocols.
- The No. 2 chain needs to deposit 5000 usdc to protocols, this message needs to be delivered by off-chain.
- The No. 3 chain needs to withdraw 2000 usdc from protocols, this message needs to be delivered by off-chain.

Off-chain keeper will call pushVaultAmounts for these chains in turn:

1.  Call `pushVaultAmounts(1, 1)` to immediately add 1 to vaultStage[_vaultNumber].fundsReceived.
2.  Call `pushVaultAmounts (1, 2)` to immediately add 1 to vaultStage[_vaultNumber].fundsReceived, because chain 2 does not need to withdraw funds from protocols.
3.  Call `pushVaultAmounts (1, 3)`, and the vaultStage[_vaultNumber].fundsReceived will be increased by 1 after receiving the response from usdc-Vault of chain 3.

Normally, the final `vaultStage[_vaultNumber].fundsReceived` is equal to 3, which is the value of `vaultStage[_vaultNumber].activeVaults`. However, attacker can call `pushVaultAmounts(1, 2)` once before or after any of the three calls, so that `vaultStage[_vaultNumber].fundsReceived` adds 1. Then the value of `vaultStage[_vaultNumber].fundsReceived` is equal to 4.

## Impact

This issue can prevent any vault from entering step 5, resulting in the system not working properly. **Rebalancing will not be completed**.

## Code Snippet

```solidity
function pushVaultAmounts(
    uint256 _vaultNumber,
    uint16 _chain
  ) external payable onlyWhenUnderlyingsReceived(_vaultNumber) {
    address vault = getVaultAddress(_vaultNumber, _chain);
    require(vault != address(0), "xChainController: not a valid vaultnumber");
    int256 totalAllocation = getCurrentTotalAllocation(_vaultNumber);
    uint256 totalWithdrawalRequests = getTotalWithdrawalRequests(_vaultNumber);
    uint256 totalUnderlying = getTotalUnderlyingVault(_vaultNumber) - totalWithdrawalRequests;
    uint256 totalSupply = getTotalSupply(_vaultNumber);

    uint256 decimals = xProvider.getDecimals(vault);
    uint256 newExchangeRate = (totalUnderlying * (10 ** decimals)) / totalSupply;

    if (!getVaultChainIdOff(_vaultNumber, _chain)) {
      int256 amountToChain = calcAmountToChain(
        _vaultNumber,
        _chain,
        totalUnderlying,
        totalAllocation
      );
      (int256 amountToDeposit, uint256 amountToWithdraw) = calcDepositWithdraw(
        _vaultNumber,
        _chain,
        amountToChain
      );

      sendXChainAmount(_vaultNumber, _chain, amountToDeposit, amountToWithdraw, newExchangeRate); //important
    }
  }
  
  function sendXChainAmount(
    uint256 _vaultNumber,
    uint32 _chainId,
    int256 _amountDeposit,
    uint256 _amountToWithdraw,
    uint256 _exchangeRate
  ) internal {
    address vault = getVaultAddress(_vaultNumber, _chainId);
    bool receivingFunds;
    uint256 amountToSend = 0;

    if (_amountDeposit > 0 && _amountDeposit < minimumAmount) {
      vaultStage[_vaultNumber].fundsReceived++;		
    } else if (_amountDeposit >= minimumAmount) {
      receivingFunds = true;
      setAmountToDeposit(_vaultNumber, _chainId, _amountDeposit);
      vaultStage[_vaultNumber].fundsReceived++;		
    }

    if (_amountToWithdraw > 0 && _amountToWithdraw < uint(minimumAmount)) {
      vaultStage[_vaultNumber].fundsReceived++;
    } else if (_amountToWithdraw >= uint(minimumAmount)) {
      amountToSend = _amountToWithdraw;
    }

    xProvider.pushSetXChainAllocation{value: msg.value}(
      vault,
      _chainId,
      amountToSend,
      _exchangeRate,
      receivingFunds
    );
    emit SendXChainAmount(vault, _chainId, amountToSend, _exchangeRate, receivingFunds);
  }
```

## Tool used

Manual Review

## Recommendation

Add a cache mark to each chain of each vault to indicate whether it has been sent. Check cache mark at the beginning of `pushVaultAmounts` and set cache mark at the end of `pushVaultAmounts`.



## Discussion

**securitygrid**

Escalate for 10 USDC
I think this is wrongly classified as a duplicate of #311. It should be a duplicate of #31. The reasons are as follows:

1. Calling `pushVaultAmounts` multiple times results in `vaultStage[_vaultNumber].fundsReceived > vaultStage[_vaultNumber].activeVaults`. **This prevents one vault from entering step 5**. Such a scenario is described in the Vulnerability Detail section of this report. 
2. The Recommendation of this report is to prevent pushVaultAmounts from being called multiple times. 

This is the same as #31. I think this report is better than #31.
The impact of #311 is that due to accumulation of withdrawal request amounts in the totalWithdrawalRequests variable, XChainController.pushVaultAmounts can be blocked. **In other words, it prevents the system from entering step 3**. Obviously, this report is different from #311.

**sherlock-admin**

 > Escalate for 10 USDC
> I think this is wrongly classified as a duplicate of #311. It should be a duplicate of #31. The reasons are as follows:
> 
> 1. Calling `pushVaultAmounts` multiple times results in `vaultStage[_vaultNumber].fundsReceived > vaultStage[_vaultNumber].activeVaults`. **This prevents one vault from entering step 5**. Such a scenario is described in the Vulnerability Detail section of this report. 
> 2. The Recommendation of this report is to prevent pushVaultAmounts from being called multiple times. 
> 
> This is the same as #31. I think this report is better than #31.
> The impact of #311 is that due to accumulation of withdrawal request amounts in the totalWithdrawalRequests variable, XChainController.pushVaultAmounts can be blocked. **In other words, it prevents the system from entering step 3**. Obviously, this report is different from #311.

You've created a valid escalation for 10 USDC!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**hrishibhat**

Escalation accepted

Valid duplicate of #31 

**sherlock-admin**

> Escalation accepted
> 
> Valid duplicate of #31 

This issue's escalations have been accepted!

Contestants' payouts and scores will be updated according to the changes made on this issue.
