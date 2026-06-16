---
tags:
  - lang/solidity
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# [H05] Rewards calculation is incorrect when the service provider has a pending “decrease stake” request

- id: 11316
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


A bug has been identified in the `DelegateManager` and `ServiceProviderFactory` contracts, which are part of the Audius protocol. When a service provider has a `DecreaseStakeRequest` pending, the `claimRewards` function from the `DelegateManager` contract computes the totalRewards value incorrectly, setting it too high. This results in the `ServiceProviderFactory` and `DelegateManager` contracts recording incorrect (too high) values for the `spDetails[_serviceProvider].deployerStake` and `delegateInfo[delegator][_serviceProvider]` variables, respectively. This could lead to the staking contract becoming insolvent, owing more tokens than it holds.

The issue was caused by how the `totalRewards` variable was computed. It was set equal to the total amount of rewards that were being paid out, plus the amount of any `DecreaseStakeRequest` the service provider had pending. This was done by first setting the `_totalBalanceInStaking` variable to the total amount of stake (locked + unlocked) that the service provider has staked, and then subtracting away the amount of the service provider’s locked stake. This resulted in the `totalRewards` variable being set to the amount of locked SP stake from before claimRewards was called, plus any rewards just paid out by ClaimsManager.processClaim.

The Audius team fixed the issue by adjusting the `processClaim` function so that it directly returns the amount of rewards that it paid out. This allowed the `totalRewards` variable to be set directly equal to the `processClaim` function’s return value instead of being computed indirectly. This also had the additional benefit of reducing gas costs.

## Details

When the service provider has no [`DecreaseStakeRequest`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L36) pending, the [`claimRewards` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L327) from the `DelegateManager` contract seems to work as intended. But when the service provider has a `DecreaseStakeRequest` pending, the `claimRewards` function computes the [`totalRewards` value](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L352) incorrectly (setting it too high). In particular, the `claimRewards` function sets the value of the `totalRewards` variable equal to the total amount of rewards that are being paid out *plus* the amount of any `DecreaseStakeRequest` the service provider has pending.


This makes the [`ServiceProviderFactory`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol) and the [`DelegateManager`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol) contracts record incorrect (too high) values for the [`spDetails[_serviceProvider].deployerStake`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L27) and [`delegateInfo[delegator][_serviceProvider]`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L61), respectively. As a result, the staking contract may become insolvent, owing more tokens than it holds.


To see that the [`DelegateManager.claimRewards()` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L327) computes `totalRewards` incorrectly, first consider [this code block](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L338-L342). The `totalRewards` variable is computed using these variables, so we begin here.


Looking at the [`_validateClaimRewards` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L705), one can see that it first [processes the claim](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L714), which mints into existence any rewards due, and stakes them for the service provider.


Then, the `_totalBalanceInStaking`, `_totalBalanceInSPFactory`, and `_totalBalanceOutsideStaking` variables are computed as follows:


The [`_totalBalanceInStaking` variable](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L720) gets set to `Staking(stakingAddress).totalStakedFor(_serviceProvider)`, which, in this context, is equal to:


`_totalBalanceInStaking =  

the amount of locked SP stake from before claimRewards was called  

+ the amount of unlocked SP stake from before claimRewards was called  

+ the amount of delegator stake from before claimRewards was called  

+ any rewards just paid out by ClaimsManager.processClaim`


Next, [`_totalBalanceInSPFactory` is initially set](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L724) to the total amount of stake (locked + unlocked) that the service provider has staked. Then [on line 727](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L727) it is updated by subtracting away the amount of the service provider’s locked stake. So `_totalBalanceInSPFactory` ends up being:


`_totalBalanceInSPFactory =  

the amount of unlocked SP stake from before claimRewards was called`


Finally, `_totalBalanceOutsideStaking` [gets set to](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L733) `_totalBalanceInSPFactory.add(spDelegateInfo[_serviceProvider].totalDelegatedStake)`. So we have:


`_totalBalanceOutsideStaking =  

the amount of unlocked SP stake from before claimRewards was called  

+ the amount of delegator stake from before claimRewards was called`


The [`totalRewards` variable](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L352) is computed as `totalBalanceInStaking.sub(totalBalanceOutsideStaking)`, which, by substituting the above values and simplifying, is equal to:


`totalRewards =  

the amount of locked SP stake from before claimRewards was called  

+ any rewards just paid out by ClaimsManager.processClaim`


So if the service provider has any locked stake, then `totalRewards` will not accurately represent the amount of rewards that were paid out during [the call to `processClaim`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L714).


Consider adjusting the [`processClaim` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ClaimsManager.sol#L227) so that it directly returns the amount of rewards that it paid out. Then the `totalRewards` variable can be set directly equal to the `processClaim` function’s return value instead of being computed indirectly. This has the additional benefit of reducing gas costs.


***Update**: Fixed in [pull request #562](https://github.com/AudiusProject/audius-protocol/pull/562). The Audius team noticed that, although there are two incorrect balance calculations when a stake decrease is pending, these two errors cancel each other out. The final comparison between what was minted and the internal record is correct. Consequently, we downgraded the severity of this issue to high. Now the `processClaim` function from the `ClaimManager` contract returns the minted rewards for the service provider directly. Note that the calculation is still complex and could be refactored for clarity. Audius’ statement for this issue:*



> Summary: During rewards calculation, a pending decrease stake request results in a value for totalRewards that is incorrect – by the amount of requested decrease in stake. Further analysis into the issue exposed an even more interesting behavior, confirming that value for totalRewards is incorrect but also showing that the final value set for a claimer in ServiceProviderFactory is not higher than expected. This is because our base value for the new Service Provider stake is also skewed but in the opposite direction during calculation of the new Service Provider stake.
> 
> 
> For this reason we would like to consider re-classifying the issue from Critical to High – rewards are neither minted incorrectly nor distributed incorrectly, but tracked incorrectly during the process of claiming.
> 
> 
> Interestingly enough, we already have a test case to cover reward distribution when a decrease stake request is pending. However this was passing due to the described condition above.
> 
>
