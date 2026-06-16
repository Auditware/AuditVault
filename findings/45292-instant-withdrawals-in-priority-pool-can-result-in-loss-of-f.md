---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/staking
  - sector/staking-pool
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Stake.Link]]"
auditors:
  - "[[0kage]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-01-20-cyfrin-stakedotlink-stakingproxy-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Instant withdrawals in priority pool can result in loss of funds for StakingProxy contract

- id: 45292
- impact: HIGH
- protocol: Stakedotlink Stakingproxy
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-01-20-cyfrin-stakedotlink-stakingproxy-v2.0.md

## Summary


This bug report describes an issue where users can lose their funds when using instant withdrawals in a priority pool. The problem occurs because the withdrawn amount is not properly updated in the priority pool's `_withdraw` function during instant withdrawals, causing the tokens to be stuck in the priority pool while users lose their LSTs. This can result in permanent loss of funds for users. A proof of concept test has been provided to demonstrate the issue. The recommended mitigation is to update the `withdrawn` variable in the `_withdraw` function when processing instant withdrawals. The bug has been fixed in the code and verified by Cyfrin.

## Details

**Description:** When instant withdrawals are enabled in the priority pool, `staker` can permanently lose funds when withdrawing through the `StakingProxy` contract. The issue occurs because the withdrawn amount is not properly updated in the priority pool's `_withdraw` function during instant withdrawals, causing the tokens to be stuck in the Priority Pool while users lose their LSTs.

`PriorityPool::_withdraw`

```solidity
function _withdraw(
    address _account,
    uint256 _amount,
    bool _shouldQueueWithdrawal,
    bool _shouldRevertOnZero,
    bytes[] memory _data
) internal returns (uint256) {
    if (poolStatus == PoolStatus.CLOSED) revert WithdrawalsDisabled();

    uint256 toWithdraw = _amount;
    uint256 withdrawn;
    uint256 queued;

    if (totalQueued != 0) {
        uint256 toWithdrawFromQueue = toWithdraw <= totalQueued ? toWithdraw : totalQueued;

        totalQueued -= toWithdrawFromQueue;
        depositsSinceLastUpdate += toWithdrawFromQueue;
        sharesSinceLastUpdate += stakingPool.getSharesByStake(toWithdrawFromQueue);
        toWithdraw -= toWithdrawFromQueue;
        withdrawn = toWithdrawFromQueue; // -----> @audit withdrawn is set here
    }

    if (
        toWithdraw != 0 &&
        allowInstantWithdrawals &&
        withdrawalPool.getTotalQueuedWithdrawals() == 0
    ) {
        uint256 toWithdrawFromPool = MathUpgradeable.min(stakingPool.canWithdraw(), toWithdraw);
        if (toWithdrawFromPool != 0) {
            stakingPool.withdraw(address(this), address(this), toWithdrawFromPool, _data);
            toWithdraw -= toWithdrawFromPool; // -----> @audit BUG withdrawn is not updated here
        }
    }
    // ... rest of the function
}
```

When processing instant withdrawals, the function fails to update the withdrawn variable after successfully withdrawing tokens from the staking pool. This leads to the following sequence:

1. Staker initiates withdrawal through `StakingProxy::withdraw`
2. `StakingProxy` burns LSTs
3. `PriorityPool` receives underlying tokens from Staking Pool
4. But `PriorityPool` doesn't transfer tokens because `withdrawn` wasn't updated
5. Tokens remain stuck in `PriorityPool` while `StakingProxy` loses access to its liquid staking tokens

**Impact:** `StakingProxy` permanently loses access to its liquid staking tokens when attempting instant withdrawals

**Proof of Concept:** Copy the following test into `staking-proxy.test.ts`

```typescript
 it('instant withdrawals from staking pool are not transferred to staker', async () => {
    const { stakingProxy, stakingPool, priorityPool, signers, token, strategy, accounts } = await loadFixture(deployFixture)

    // Enable instant withdrawals
    await priorityPool.setAllowInstantWithdrawals(true)

    // Deposit initial amount
    await token.approve(stakingProxy.target, toEther(1000))
    await stakingProxy.deposit(toEther(1000), ['0x'])

    // Setup for withdrawals
    await strategy.setMaxDeposits(toEther(2000))
    await strategy.setMinDeposits(0)

    // Track all relevant balances before withdrawal
    const preTokenBalance = await token.balanceOf(stakingProxy.target)
    const preLSTBalance = await stakingPool.balanceOf(stakingProxy.target)

    const prePPBalance = await token.balanceOf(priorityPool.target)

    const withdrawAmount = toEther(500)

    console.log('=== Before Withdrawal ===')
    console.log('Initial LST Balance - Proxy contract:', fromEther(preLSTBalance))
    console.log('Initial Token Balance - Poxy contract:', fromEther(preTokenBalance))


    // Perform withdrawal
    await stakingProxy.withdraw(
        withdrawAmount,
        0,
        0,
        [],
        [],
        [],
        ['0x']
    )

    // Check all balances after withdrawal
    const postTokenBalance = await token.balanceOf(stakingProxy.target)
    const postPPBalance = await token.balanceOf(priorityPool.target)
    const postLSTBalance = await stakingPool.balanceOf(stakingProxy.target)

    console.log('=== After Withdrawal ===')
    console.log('Priority Pool - token balance change:', fromEther(postPPBalance - prePPBalance))
    console.log('Staking Proxy - token balance change:', fromEther(postTokenBalance - preTokenBalance))
    console.log('Staking Proxy - LST balance change:', fromEther(postLSTBalance - preLSTBalance))

    const lstsRedeemed = fromEther(preLSTBalance - postLSTBalance)

    // Assertions

    // 1. Staking Proxy has redeeemed all his LSTs
    assert.equal(
      lstsRedeemed,
        500,
        "Staker redeemed 500 LSTs"
    )

    // 2. But staking proxy doesn't receive underlying tokens
    assert.equal(
      fromEther(postTokenBalance - preTokenBalance),
        0,
        "Staking Proxy didn't receive any tokens despite losing LSTs"
    )

    // 3. The tokens are stuck in Priority Pool
    assert.equal(
        fromEther(postPPBalance- prePPBalance),
        500,
        "Priority Pool is holding the withdrawn tokens"
    )
  })
```

**Recommended Mitigation:** Consider updating the `withdrawn` variable when processing instant withdrawals in `PriorityPool::_withdraw`

**[[Stake.Link]]:** Fixed in commit [5f3d282](https://github.com/stakedotlink/contracts/commit/5f3d2829f86bc74d6b9e805d7e61d9392d6b21b1)

**Cyfrin:** Verified.

\clearpage
