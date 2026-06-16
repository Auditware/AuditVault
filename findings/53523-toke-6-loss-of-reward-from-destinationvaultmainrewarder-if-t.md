---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/hexens
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Tokemak]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md"
genome:
  - "[[reward-calculation]]"
  - "[[specific-token-type]]"
  - "[[reward-theft]]"
  - "[[debt-accrual-update]]"
  - "[[reward-accounting]]"
---
# [TOKE-6] Loss of Reward from DestinationVaultMainRewarder if the Destination is Empty After Rebalance

- id: 53523
- impact: HIGH
- protocol: [[Tokemak]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md

## Summary


A bug has been identified in the code that rebalances liquidity between two destination vaults. This bug can cause a loss of reward for the auto pool. The bug occurs when the underlying asset is withdrawn from one of the destination vaults during the rebalance process, but the accrued reward has not yet been claimed. This is because the code does not withdraw the reward before removing the destination from the array. The bug has been fixed and the code has been updated to withdraw the reward before removing the destination. 

## Details

**Severity:** High

**Path:** src/vault/libs/AutoPoolDestinations.sol#L137-L144, src/vault/DestinationVault.sol#L400-L408 

**Description:**

The function `AutoPoolETH::flashRebalance()` is used to rebalance liquidity between two destination vaults, `destinationIn` and `destinationOut`. Within this function, the internal function `AutopoolDestinations::_manageQueuesForDestination()` is invoked to ensure a destination is in the appropriate queues after a rebalance.

If there is no longer a balance in a destination, the corresponding destination is removed from the `debtReportQueue` based on the assumption that there will be nothing to update for that destination. However, this assumption is incorrect. When the underlying asset is withdrawn from `destinationIn` during the rebalance process, the reward accrued from the `DestinationVaultMainRewarder` has not yet been claimed. This is because in the `DestinationVault::_beforeTokenTransfer()` hook, the invocation of `_rewarder.withdraw` is called with the `claim` flag set to false, meaning no transfer of accrued reward is sent to the auto pool.

As a result, `destinationIn` won't be updated in the next call of `updateDebtReporting`, leading to a loss of `baseAsset` reward for the `totalIdle` of the auto pool.

```
// If we no longer have a balance we don't need to continue to report
// on it and we also have nothing to withdraw from it
debtReportQueue.popAddress(destination);
withdrawalQueue.popAddress(destination);


if (removalQueue.remove(destination)) {
    emit RemovedFromRemovalQueue(destination);
}
```
```
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
    if (from == to) {
        return;
    }


    if (from != address(0)) {
        _rewarder.withdraw(from, amount, false);
    }
}
```

**Remediation:**  Consider withdrawing the reward from the rewarder before removing the destination from the array. (Note that we need to update the autoPool’s totalIdle to correspond with the claimed rewards)

**Status:**  Fixed


- - -
