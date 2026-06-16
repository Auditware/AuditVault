---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/staking
  - sector/staking-pool
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[Ack]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# [H-41] Rewards compounded in AaveStrategy are unredeemable

- id: 27531
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: Ack (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


This bug report is about the AaveStrategy contract, which is designed to receive ERC20 tokens from yieldBox and deposit them into an AAVE lending pool. The contract also allows users to call `compound()`, which is supposed to claim AAVE rewards from the `incentivesController` and staking rewards from the `stakingRewardToken` (stkAAVE). However, the `stakingRewardToken#redeem()` function, which is necessary to retrieve tokens once staked, is not present in the AaveStrategy contract. As a result, any rewards accumulated via the incentiveController would not be claimable.

The impact of this bug is high, as it could lead to the loss of funds. Unfortunately, it is difficult to prove this concept as the AAVE incentive/staking rewards do not accumulate properly in the fork tests, and the mocks do not exhibit the same behavior.

The recommended mitigation step is to include a call to redeem in `compound()`. This bug was confirmed by 0xRektora (Tapioca) via duplicate issue 243.

## Details


The AaveStrategy contract is designed to:

1.  Receive depositor's ERC20 tokens from yieldBox
2.  Deposit those tokens into an AAVE lending pool
3.  Allow anyone to call `compound()`, which:
    a. Claims AAVE rewards from the `incentivesController`
    b. Claims staking rewards from the `stakingRewardToken` (stkAAVE)
    c. Redeeming staking rewards is only possible within a certain cooldown window that is set by AAVE governance. The function resets the cooldown if either 12 days have passed since the cooldown was last initiated, or if the strategy has a stakedRewardToken balance
    d. Swaps any received `rewardToken` (&#36;AAVE) for `wrappedNative`
    e. Deposits the `wrappedNative` received in the swap into the lending pool

There are several issues with this flow, but this vulnerability report is specific to redeeming staked rewards. The incentives controller specified in the `mainnet.env` file is at address 0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5 (proxy). Its `claimRewards` function stakes tokens directly:

      function _claimRewards(
        ...
      ) internal returns (uint256) {
        ...
        uint256 accruedRewards = _claimRewards(user, userState);
        ...
        STAKE_TOKEN.stake(to, amountToClaim); //@audit claimed rewards are staked immediately
        ...
      }

The only way to retrieve tokens once staked is via a call to `stakingRewardToken#redeem()`, which is not present in the AaveStrategy contract. As a result, any rewards accumulated via the incentiveController would not be claimable.

### Impact

High - Loss of funds

### Proof of concept

This is unfortunately difficult to PoC as the AAVE incentive/staking rewards do not accumulate properly in the fork tests, and the mocks do not exhibit the same behavior.

### Recommended Mitigation Steps

Include a call to redeem in `compound()`.

**[0xRektora (Tapioca) confirmed via duplicate issue 243](https://github.com/code-423n4/2023-07-tapioca-findings/issues/243)**

***
