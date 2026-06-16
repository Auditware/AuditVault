---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Perennial]]"
auditors:
  - "[[0xGoodess]]"
  - "[[cergyk]]"
  - "[[roguereddwarf]]"
report: "https://github.com/sherlock-audit/2023-05-perennial-judging"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[dos-resistance]]"
---
# H-1: BalancedVault.sol: loss of funds + global settlement flywheel / user settlement flywheels getting out of sync

- id: 19152
- impact: HIGH
- protocol: [[Perennial]]
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


The BalancedVault.sol contract has an issue where users can experience a loss of funds and the global settlement flywheel and user settlement flywheel can get out of sync. This occurs when a user makes a deposit or redemption when the epoch has become “stale”. This means they won't get processed by the global settlement flywheel in the next epoch but one epoch later than that. A malicious user or user unknowingly can call the deposit function for a user and set the pendingEpochs to the current epoch + 1. This will push the processing of the deposit in the user settlement flywheel one epoch ahead. This can cause the global settlement flywheel and user settlement flywheel to get out of sync. An example of a loss of funds that can occur is when the PnL from epoch 3 to epoch 4 is positive. Thereby the user will get less shares than he is entitled to.

The impact of this issue is not limited to a single user but affects the calculations for all users. Important invariants are violated, such as the sum of user balances being equal to the total supply and the sum of unclaimed user assets being equal to total unclaimed assets. Additionally, users that deposit into the Vault are partially exposed to PnL in the underlying products.

The recommendation to fix this issue is to implement a queue for pending deposits and pending redemptions of a user. Pending deposits and redemptions can then be processed independently. Alternatively, it is suggested to restrict the ability to make deposits to the user himself and only allowing one pending deposit/redemption to exist at a time. The solution to implement depends on how flexible the sponsor wants the deposit/redemption functionality to be.

## Details

Source: https://github.com/sherlock-audit/2023-05-perennial-judging/issues/45 

## Found by 
0xGoodess, cergyk, roguereddwarf
## Summary
When an epoch has become "stale", the `BalancedVault` will treat any new deposits and redemptions in this epoch as "pending".
This means they won't get processed by the global settlement flywheel in the next epoch but one epoch later than that.

Due to the fact that anyone can push a pending deposit or redemption of a user further ahead by making an arbitrarily small deposit in the "intermediate epoch" (i.e. the epoch between when the user creates the pending deposit / redemption and the epoch when it is scheduled to be processed by the global settlement flywheel), the user can experience a DOS.

Worse than that, by pushing the pending deposit / pending redemption further ahead, the global settlement flywheel and the user settlement flywheel get out of sync.

Also users can experience a loss of funds.

## Vulnerability Detail
Let's assume we are currently in epoch `1` and it is `stale`.
User1 calls the `deposit` function and we set `_pendingEpochs[user1] = context.epoch + 1 = 2`
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L160-L164

We move one epoch ahead and are in epoch `2` now.
By looking at the global settlement flywheel we see that `_deposit = _pendingDeposit` and `_redemption = _pendingRedemption` which means that the deposit we made will be processed in the global settlement flywheel in the next epoch (epoch `3`).
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L378-L403

By looking into the user settlement flywheel we see that the `if (accountContext.epoch > _pendingEpochs[account])` condition to process the pending deposit is not fulfilled yet (`2 !> 2`). It will be fulfilled in epoch `3`.
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L413-L422

So far so good. The global settlement flywheel and the user settlement flywheel are in sync and will process the pending deposit in epoch `3`.

Now here's the issue.
A malicious user2 or user1 unknowingly (depending on the specific scenario) calls `deposit` for user1 again in the current epoch `2` once it has become `stale` (it's possible to deposit an arbitrarily small amount).
By doing so we set `_pendingEpochs[user1] = context.epoch + 1 = 3`, thereby pushing the processing of the deposit in the user settlement flywheel one epoch ahead.

It's important to understand that the initial deposit will still be processed in epoch `3` in the global settlement flywheel, it's just being pushed ahead in the user settlement flywheel.

Thereby the global settlement flywheel and user settlement flywheel are out of sync now.

The total supply will be increased by an amount calculated based on the epoch `3` context:
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L379

The user balance will be increased by an amount calculated based on the epoch `4` context:
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L407

An example for a loss of funds that can occur as a result of this issue is when the PnL from epoch `3` to epoch `4` is positive. Thereby the user1 will get less shares than he is entitled to.

Similarly it is possible to push pending redemptions ahead, thereby the `_totalUnclaimed` amount would be increased by an amount that is different from the amount that `_unclaimed[account]` is increased by.

Coming back to the case with the pending deposit, I wrote a test that you can add to `BalancedVaultMulti.test.ts`:
```javascript
it('pending deposit pushed by 1 epoch causing shares difference', async () => {
      const smallDeposit = utils.parseEther('1000')
      const smallestDeposit = utils.parseEther('0.000001')

      await updateOracleEth() // epoch now stale
      // make a pending deposit
      await vault.connect(user).deposit(smallDeposit, user.address)
      await updateOracleBtc()
      await vault.sync()

      await updateOracleEth() // epoch now stale
      /* 
      user2 deposits for user1, thereby pushing the pending deposit ahead and causing the 
      global settlement flywheel and user settlement flywheel to get out of sync
      */
      await vault.connect(user2).deposit(smallestDeposit, user.address)
      await updateOracleBtc()
      await vault.sync()

      await updateOracle()
      // pending deposit for user1 is now processed in the user settlement flywheel
      await vault.syncAccount(user.address)

      const totalSupply = await vault.totalSupply()
      const balanceUser1 = await vault.balanceOf(user.address)
      const balanceUser2 = await vault.balanceOf(user2.address)

      /*
      totalSupply is bigger than the amount of shares of both users together
      this is because user1 loses out on some shares that he is entitled to
      -> loss of funds
      */
      console.log(totalSupply);
      console.log(balanceUser1.add(balanceUser2));

})
```

The impact that is generated by having one pending deposit that is off by one epoch is small.
However over time this would evolve into a chaotic situation, where the state of the Vault is significantly corrupted.

## Impact
The biggest impact comes from the global settlement flywheel and user settlement flywheel getting out of sync.
As shown above, this can lead to a direct loss of funds for the user (e.g. the amount of shares he gets for a deposit are calculated with the wrong context).

Apart from the direct impact for a single user, there is a subtler impact which can be more severe in the long term.
Important invariants are violated:
* Sum of user balances is equal to the total supply
* Sum of unclaimed user assets is equal to total unclaimed assets

Thereby the impact is not limited to a single user but affects the calculations for all users.

Less important but still noteworthy is that users that deposit into the Vault are partially exposed to PnL in the underlying products. The Vault does not employ a fully delta-neutral strategy. Therefore by experiencing a larger delay until the pending deposit / redemption is processed, users incur the risk of negative PnL.

## Code Snippet
https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L156-L175

https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L184-L205

https://github.com/sherlock-audit/2023-05-perennial/blob/main/perennial-mono/packages/perennial-vaults/contracts/balanced/BalancedVault.sol#L375-L424

## Tool used
Manual Review

## Recommendation
My recommendation is to implement a queue for pending deposits / pending redemptions of a user.
Pending deposits / redemptions can then be processed independently (without new pending deposits / redemptions affecting when existing ones are processed).

Possibly there is a simpler solution which might involve restricting the ability to make deposits to the user himself and only allowing one pending deposit / redemption to exist at a time.

The solution to implement depends on how flexible the sponsor wants the deposit / redemption functionality to be.



## Discussion

**KenzoAgada**

Also note duplicate issue #74 which mentions how a user can redeem more assets than he's entitled to.
