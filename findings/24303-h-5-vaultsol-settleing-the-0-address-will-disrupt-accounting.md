---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Perennial]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://github.com/sherlock-audit/2023-07-perennial-judging"
genome:
  - "[[fee-calculation]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-5: Vault.sol: `settle`ing the 0 address will disrupt accounting

- id: 24303
- impact: HIGH
- protocol: [[Perennial]]
- reporter: WATCHPUG (Sherlock)
- source: N/A

## Summary


A bug has been found in the Vault.sol smart contract, which could result in wrong accounting of global assets and global shares. The bug is due to the ability of anyone to settle the 0 address, which results in lower keeper fees being deducted within the `_settle` function. The `_loadContext` function has the global account of the 0 address, while the context.local is the account of the address to be updated or settled. If a user settles the 0 address, the global account will be updated with wrong data. The `_settle` logic contains a `while` loop that updates the global account correctly, however, when the `if` statement is executed, the global account is updated with wrong data. This is because the `toAssetsGlobal` subtracts the globalKeeperFees from the global deposited assets, while `toAssetsLocal` subtracts globalKeeperFees/Checkpoint.count fees from the local account's assets. In the case of settling the 0 address, the global account is updated with wrong data. The impact of this bug is that the global account will be updated with wrong data, resulting in global assets and shares being higher than they should be. The bug was found by Emmanuel, WATCHPUG, bin2chen, and moneyversed. The bug was fixed by arjun-io with the pull request at https://github.com/equilibria-xyz/perennial-v2/pull/86.

## Details

Source: https://github.com/sherlock-audit/2023-07-perennial-judging/issues/62 

## Found by 
Emmanuel, WATCHPUG, bin2chen, moneyversed
Due to the ability of anyone to settle the 0 address, the global assets and global shares will be wrong because lower keeper fees were deducted within the `_settle` function.

## Vulnerability Detail
Within `Vault#_loadContext` function, the context.global is the account of the 0 address, while context.local is the account of the address to be updated or settled:

```solidity
function _loadContext(address account) private view returns (Context memory context) {
    ...
    context.global = _accounts[address(0)].read();
    context.local = _accounts[account].read();
    context.latestCheckpoint = _checkpoints[context.global.latest].read();
}
```

If a user settles the 0 address, the global account will be updated with wrong data.

Here is the \_settle logic:

```solidity
function _settle(Context memory context) private {
    // settle global positions
    while (
        context.global.current > context.global.latest &&
        _mappings[context.global.latest + 1].read().ready(context.latestIds)
    ) {
        uint256 newLatestId = context.global.latest + 1;
        context.latestCheckpoint = _checkpoints[newLatestId].read();
        (Fixed6 collateralAtId, UFixed6 feeAtId, UFixed6 keeperAtId) = _collateralAtId(context, newLatestId);
        context.latestCheckpoint.complete(collateralAtId, feeAtId, keeperAtId);
        context.global.processGlobal(
            newLatestId,
            context.latestCheckpoint,
            context.latestCheckpoint.deposit,
            context.latestCheckpoint.redemption
        );
        _checkpoints[newLatestId].store(context.latestCheckpoint);
    }

    // settle local position
    if (
        context.local.current > context.local.latest &&
        _mappings[context.local.current].read().ready(context.latestIds)
    ) {
        uint256 newLatestId = context.local.current;
        Checkpoint memory checkpoint = _checkpoints[newLatestId].read();
        context.local.processLocal(
            newLatestId,
            checkpoint,
            context.local.deposit,
            context.local.redemption
        );
    }
}
```

If settle is called on 0 address, \_loadContext will give context.global and context.local same data.
In the \_settle logic, after the global account(0 address) is updated with the correct data in the `while` loop(specifically through the processGlobal function),
the global account gets reupdated with wrong data within the `if` statement through the processLocal function.

Wrong assets and shares will be recorded.
The global account's assets and shares should be calculated with toAssetsGlobal and toSharesGlobal respectively, but now, they are calculated with toAssetsLocal and toSharesLocal.

toAssetsGlobal subtracts the globalKeeperFees from the global deposited assets, while toAssetsLocal subtracts globalKeeperFees/Checkpoint.count fees from the local account's assets.

So in the case of settling the 0 address, where global account and local account are both 0 address, within the while loop of \_settle function, depositedAssets-globalKeeperFees is recorded for address(0), but then, in the `if` statement, depositedAssets-(globalAssets/Checkpoint.count) is recorded for address(0)

And within the `Vault#_saveContext` function, context.global is saved before context.local, so in this case, context.global(which is 0 address with correct data) is overridden with context.local(which is 0 address with wrong data).

## Impact
The global account will be updated with wrong data, that is, global assets and shares will be higher than it should be because lower keeper fees was deducted.

## Code Snippet
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-vault/contracts/Vault.sol#L190
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-vault/contracts/Vault.sol#L315
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol#L99
https://github.com/sherlock-audit/2023-07-perennial/blob/main/perennial-v2/packages/perennial-vault/contracts/types/Checkpoint.sol#L119


## Tool used

Manual Review

## Recommendation
I believe that the ability to settle the 0 address is intended, so an easy fix is to save local context before saving global context:
Before:

```solidity
    function _saveContext(Context memory context, address account) private {
        _accounts[address(0)].store(context.global);
        _accounts[account].store(context.local);
        _checkpoints[context.currentId].store(context.currentCheckpoint);
    }
```

After:

```solidity
    function _saveContext(Context memory context, address account) private {
        _accounts[account].store(context.local);
        _accounts[address(0)].store(context.global);
        _checkpoints[context.currentId].store(context.currentCheckpoint);
    }
```



## Discussion

**sherlock-admin**

1 comment(s) were left on this issue during the judging contest.

**__141345__** commented:
> h



**arjun-io**

Great find - we'll fix this

**arjun-io**

Fixed: https://github.com/equilibria-xyz/perennial-v2/pull/86
