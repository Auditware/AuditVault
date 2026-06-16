---
tags:
  - lang/solidity
  - sector/dex
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[Vagner]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [H-05] Incorrect calculation of the remaining `updatedRewards` leads to possible underflow error

- id: 20073
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: Vagner (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


This bug report is about a problem in the `RewardsManager.sol` contract of the Ajna project. The contract keeps track of the total number of rewards collected per epoch for all pools in the system. The bug occurs when the total rewards claimed in an epoch exceeds the rewards cap, which is a percentage of the tokens burned in the pool. This leads to an underflow error and results in a transaction fail, which blocks users from withdrawing their NFTs and rewards from the affected pools.

The bug can be triggered in two ways: when `_calculateNewRewards` or `_updateBucketExchangeRates` are called. The issue is caused by the fact that the rewards claimed in an epoch can be higher than the rewards cap, and the code does not account for this possibility.

The risk of this issue is high, as it can lead to direct blocking of funds on the contract. Moreover, it is not a theoretical situation, as it can occur in reality, for example when there is a large pool and several small ones.

The recommended mitigation steps are to add additional requirements that if `rewardsClaimedInEpoch > rewardsCap`, `updatedRewards_` should be zero, not need calculate remaining difference. This solution was confirmed by MikeHathaway (Ajna) and the severity of the issue was upgraded from Medium to High.

## Details


<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/RewardsManager.sol#L549><br>
<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/RewardsManager.sol#L725>

`RewardsManage.sol` keeps track of the **total number of rewards collected per epoch** for all pools:

```c
File: 2023-05-ajna\ajna-core\src\RewardsManager.sol
73:    /// @dev `epoch => rewards claimed` mapping.
74:    mapping(uint256 => uint256) public override rewardsClaimed;
75:    /// @dev `epoch => update bucket rate rewards claimed` mapping.
76:    mapping(uint256 => uint256) public override updateRewardsClaimed;
```

And the `rewardsCap` calculation when calculating the reward applies only to the pool, which leads to a situation when the condition is fulfilled `rewardsClaimedInEpoch + updatedRewards_ >= rewardsCap`, **But `rewardsCap` is less than `rewardsClaimedInEpoch`**:

```diff
File: 2023-05-ajna\ajna-core\src\RewardsManager.sol

-543:         uint256 rewardsCapped = Maths.wmul(REWARD_CAP, totalBurnedInPeriod);
545:         // Check rewards claimed - check that less than 80% of the tokens for a given burn event have been claimed.
-546:         if (rewardsClaimedInEpoch_ + newRewards_ > rewardsCapped) {
548:             // set claim reward to difference between cap and reward
-549:             newRewards_ = rewardsCapped - rewardsClaimedInEpoch_; // @audit rewardsCapped can be less then  rewardsClaimedInEpoch_
550:         }

719:         uint256 rewardsCap            = Maths.wmul(UPDATE_CAP, totalBurned); // @audit in one pool
-720:        uint256 rewardsClaimedInEpoch = updateRewardsClaimed[curBurnEpoch];
722:         // update total tokens claimed for updating bucket exchange rates tracker
723:         if (rewardsClaimedInEpoch + updatedRewards_ >= rewardsCap) {
724:              // if update reward is greater than cap, set to remaining difference
-725:             updatedRewards_ = rewardsCap - rewardsClaimedInEpoch; // @audit rewardsCap can be less then rewardsClaimedInEpoch
726:         }
728:         // accumulate the full amount of additional rewards
-729:        updateRewardsClaimed[curBurnEpoch] += updatedRewards_; // @audit increase per epoch
```

Which causes an `underflow` erorr in the result `updatedRewards_ = rewardsCap - rewardsClaimedInEpoch` where `rewardsCap < rewardsClaimedInEpoch`, this error **leads to a transaction fail**, which will further temporarily/permanently block actions with NFT as `unstake/claimRewards` for pools in which `rewardsCap` will fail less than the total `rewardsClaimedInEpoch`.

We have 2 instances of this problem::

1.  during the call `_calculateNewRewards`
2.  during the call `_updateBucketExchangeRates`

A failure in any of these will result in users of certain pools being unable to withdraw their NFTs as well as the reward.

### Proof of Concept

Let's take a closer look at the problem and why this is possible:

1.  We have a general calculation of rewards taken per epoch:

```javascript
File: ajna-core\src\RewardsManager.sol

71:     /// @dev `epoch => rewards claimed` mapping.
72:     mapping(uint256 => uint256) public override rewardsClaimed;
73:     /// @dev `epoch => update bucket rate rewards claimed` mapping.
74:     mapping(uint256 => uint256) public override updateRewardsClaimed;
```

2.  The state is updated for the epoch by the amount calculated for each pool:

```javascript
File: ajna-core\src\RewardsManager.sol

_calculateAndClaimRewards
396:         for (uint256 epoch = lastClaimedEpoch; epoch < epochToClaim_; ) {

410:             // update epoch token claim trackers
411:             rewardsClaimed[epoch]           += nextEpochRewards;

413:         }

_updateBucketExchangeRates
676:         uint256 curBurnEpoch = IPool(pool_).currentBurnEpoch();

728:                 // accumulate the full amount of additional rewards
729:                 updateRewardsClaimed[curBurnEpoch] += updatedRewards_;
```

3.  At the time of calculation of the reward for the update:

```diff
File: 2023-05-ajna\ajna-core\src\RewardsManager.sol

526:         (
527:             ,
528:             // total interest accumulated by the pool over the claim period
+529:             uint256 totalBurnedInPeriod,
530:             // total tokens burned over the claim period
531:             uint256 totalInterestEarnedInPeriod
532:         ) = _getPoolAccumulators(ajnaPool_, nextEpoch_, epoch_);
533:
534:         // calculate rewards earned
                ...
542:
+543:         uint256 rewardsCapped = Maths.wmul(REWARD_CAP, totalBurnedInPeriod);
544:
545:         // Check rewards claimed - check that less than 80% of the tokens for a given burn event have been claimed.
546:         if (rewardsClaimedInEpoch_ + newRewards_ > rewardsCapped) {
547:
548:             // set claim reward to difference between cap and reward
+549:             newRewards_ = rewardsCapped - rewardsClaimedInEpoch_; // @audit
550:         }
```

We have a situation where `rewardsClaimedInEpoch_` has been updated by other pools to something like `100e18`,
and `rewardsCapped` for the other pool was `30e18`, resulting in:<br>
`  rewardsClaimedInEpoch_ + newRewards_ > rewardsCapped `<br>
and of course we catch the underflow at the time of calculating the remainder, `30e18 - 100e18`, since there is no remainder
`newRewards_ = rewardsCapped - rewardsClaimedInEpoch_`.

To check the problem, you need to raise `rewardsClaimedInEpoch_` more than the `rewardsCap` of a certain pool, with the help of other pools, `rewardsCap` is a percentage of burned tokens in the pool... so it's possible.

### Tools Used

*   Manual review
*   Foundry

### Recommended Mitigation Steps

*   Add additional requirements that if `rewardsClaimedInEpoch > rewardsCap` that `updatedRewards_` should be zero, not need calculate remaining difference.

**[MikeHathaway (Ajna) confirmed](https://github.com/code-423n4/2023-05-ajna-findings/issues/440#issuecomment-1555156243)**

**[Picodes (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2023-05-ajna-findings/issues/440#issuecomment-1569154687):**
 > Giving Medium severity for "Assets not at direct risk, but the function of the protocol or its availability could be impacted"

**[Haipls (warden) commented](https://github.com/code-423n4/2023-05-ajna-findings/issues/440#issuecomment-1573707899):**
 > Hi @Picodes - I would like to ask you to reconsider the severity of the issue. You've classified it as `Med` - `Assets not at direct risk, but the function of the protocol or its availability could be impacted`.
> 
> Upon review, in my opinion, this issue leans more towards HIGH - `Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals)`. 
> 
> Below, I will attempt to present my reasoning and why I think this way:
> 
> I've considered `2` metrics to determine severity:
> 
> 1. Consequences
> 2. The likelihood of it happening
> 
> And came up with the following results:
> 
> 1. Consequences
>    
>     The consequence of this issue is that in the event of it happening, NFTs are blocked on the RewardsManager.sol contract with no possibility of their further withdrawal. This is critical and falls under: `Assets can be stolen/lost/compromised directly`. Moreover, these are not just NFTs, they are LP positions.
>     
>     When this problem occurs, the ability for `stake/unstake/claimRewards` of the affected pools is closed due to a mathematical error, leading to a simple blockage of interaction with these pools. As it becomes impossible to process the reward update for a given epoch. For pools that weren't affected and managed to process before, they will be able to operate further until the situation repeats.
> 
> 2. The main point in deciding whether it's `Medium/High` is how likely this problem is to occur. 
>    
>     Here I looked at the dependence in calculations on the number of pools
>     ```c
>       uint256 rewardsCapped = Maths.wmul(REWARD_CAP, totalBurnedInPeriod);
> 
>         // Check rewards claimed - check that less than 80% of the tokens for a given burn event have been claimed.
>         if (rewardsClaimedInEpoch_ + newRewards_ > rewardsCapped) {
> 
>             // set claim reward to difference between cap and reward
>             newRewards_ = rewardsCapped - rewardsClaimedInEpoch_; 
>         }
>     ```
> 
>     `rewardsClaimedInEpoch_` is a value that sums up across all pools
> 
>     `rewardsCapped` is a value related to the calculation of a single pool and depends on the number of coins burned in the epoch in the selected pool
> 
>     And there arises a situation when `n1 - (n2 + n3...+ nn)` by pools. In reality, it's all more complex and depends on the number of burned coins in the pools, but the essence is that the more pools we have, the higher the chances that this condition simply reverts. And this is no longer an unlikely situation.
> 
> **Also an example of a highly probable situation:**
> 
> When there's a HUGE pool and several small ones in the middle. It's enough for only the HUGE pool to update the epoch's reward. This will cause a problem with the condition's execution for all other small pools
> 
> 
> This can also be a vector of an attacker who purposely burns an extra amount of coins to increase the reward update on the pool. And causes positions blocking in the contract.
> 
> After these considerations, I would like you to reconsider the severity of the problem, as we have two points:
> 
> 1. Direct blocking of funds on the contract.
> 2. The situation is not theoretical.
> 
> I hope my thoughts will be useful. I understand that I can be wrong and I hope you can clarify if I am not understanding something correctly. Thank you.

**[Picodes (judge) increased severity to High and commented](https://github.com/code-423n4/2023-05-ajna-findings/issues/440#issuecomment-1574940585):**
 > Hi @Haipls - thanks for your comment. Upon review, I agree with your take and will upgrade to High.



***
