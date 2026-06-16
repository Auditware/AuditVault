---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
  - sector/staking
protocol: "[[Euler]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Euler/HookTargetStakeDelegator/README.md#1-double-counting-of-the-migrated-stake"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/overflow]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Double-counting of the Migrated Stake

- id: 55523
- impact: HIGH
- protocol: Euler
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Euler/HookTargetStakeDelegator/README.md#1-double-counting-of-the-migrated-stake

## Summary


The bug report discusses an issue with the `_migrateStake` function in the `HookTargetStakeDelegator.sol` file. This function is used within the `_delegateStake` function to delegate stake from an account to the owner and return the delegated amount. However, the issue is that this delegated amount is then incorrectly added to the original `amount` value, leading to double-accounting. The severity of this bug is classified as high. The recommended solution is to change the logic inside the `_delegateStake` function to ensure that the migrated stake is not double-counted and to maintain a clear distinction between migration and new delegation. The bug has been fixed by the client in the GitHub repository.

## Details

##### Description
There is an issue with [how `_migrateStake` is used](https://github.com/euler-xyz/evk-periphery/blob/647866626fbceec678e3e11cdd9d7e5be9e5f6e5/src/HookTarget/HookTargetStakeDelegator.sol#L283) inside the `_delegateStake` function. `_migrateStake` internally delegates the stake from the account to the owner and returns the delegated amount. This amount is then added to the `amount` value originally passed to the `_delegateStake` function.

The issue is classified as **High** severity because it leads to double-accounting for the delegated value from the account to the owner address, which is incorrectly added to the original `amount`, which was subject to delegation.
<br/>
##### Recommendation
We recommend changing the logic inside the internal `_delegateStake` function to the following lines:

```solidity
function _delegateStake(
    address account, 
    uint256 amount) internal {
    address owner = evc.getAccountOwner(account);
    
    _migrateStake(owner, account);
    rewardVault.delegateStake(
        owner == address(0) ? account : owner, 
        amount);
}
```

This ensures that the migrated stake is not double-counted, and there is a maintained clear distinction between migration and new delegation.

> **Client's Commentary:**
> Fixed: https://github.com/euler-xyz/evk-periphery/pull/270/files

---
