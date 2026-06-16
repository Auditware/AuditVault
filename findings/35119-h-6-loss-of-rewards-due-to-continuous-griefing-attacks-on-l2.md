---
tags:
  - blockchain/evm
  - blockchain/evm/arbitrum
  - lang/solidity
  - sector/farm
  - sector/stable
  - sector/staking
  - sector/staking-pool
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/griefing
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Notional]]"
auditors:
  - "[[nirohgo]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-6: Loss of rewards due to continuous griefing attacks on L2 environment

- id: 35119
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report highlights a vulnerability in the L2 environment (such as Arbitrum) where low transaction fees allow malicious users to perform griefing attacks on reward features, resulting in a loss of rewards. The issue is caused by a rounding error in the code, which can lead to reward tokens being rounded down to zero and lost. This issue can be easily exploited by attackers, especially as the total value locked in the vault increases. The severity of this issue is considered high, as it can result in a definite loss of funds without extensive limitations. The bug has been escalated and resolved successfully.

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/61 

## Found by 
nirohgo, xiaoming90
## Summary

On the L2 environment (e.g., Arbitrum), due to low transaction fees, it is possible for malicious users to perform griefing attacks against the reward features, leading to a loss of rewards.

## Vulnerability Detail

#### Instance 1

Line 174 (`balanceAfter - balancesBefore[i]`) attempts to compute the number of reward tokens claimed.

Malicious users could call the permissionless `claimRewardTokens` function on every new block, which in turn calls the internal `_claimVaultRewards` function. This is feasible due to the low transaction fees on L2 (Arbitrum), leading to a small number of reward tokens being claimed each time.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L174

```solidity
File: VaultRewarderLib.sol
148:     function _claimVaultRewards(
149:         uint256 totalVaultSharesBefore,
150:         VaultRewardState[] memory state,
151:         RewardPoolStorage memory rewardPool
152:     ) internal {
153:         uint256[] memory balancesBefore = new uint256[](state.length);
154:         // Run a generic call against the reward pool and then do a balance
155:         // before and after check.
156:         for (uint256 i; i < state.length; i++) {
157:             // Presumes that ETH will never be given out as a reward token.
158:             balancesBefore[i] = IERC20(state[i].rewardToken).balanceOf(address(this));
159:         }
160: 
161:         _executeClaim(rewardPool);
162: 
163:         rewardPool.lastClaimTimestamp = uint32(block.timestamp);
164:         VaultStorage.setRewardPoolStorage(rewardPool);
165: 
166:         // This only accumulates rewards claimed, it does not accumulate any secondary emissions
167:         // that are streamed to vault users.
168:         for (uint256 i; i < state.length; i++) {
169:             uint256 balanceAfter = IERC20(state[i].rewardToken).balanceOf(address(this));
170:             _accumulateSecondaryRewardViaClaim(
171:                 i,
172:                 state[i],
173:                 // balanceAfter should never be less than balanceBefore
174:                 balanceAfter - balancesBefore[i],
175:                 totalVaultSharesBefore
176:             );
177:         }
178:     }
```

The `tokensClaimed` will be a very small value, as mentioned earlier. Assume that the precision of the reward token ($RT$) claimed is 6 decimals precision. The vault shares are denominated in 8 decimals precision (`Constants.INTERNAL_TOKEN_PRECISION`) in Notional.

Assume that the `totalVaultSharesBefore` is 10000000 shares, which is 10000000e8. If the number of reward tokens claimed is less than 10000000 (e.g., 9999999), it will round down to zero. As a result, the reward tokens claimed will be lost. 

$$
\begin{align*}
\frac{10000000e8}{1e8} > tokensClaimed \\ 
10000000 > tokensClaimed
\end{align*}
$$

The issue will get worse when the TVL of the vault grows, and the protocol attracts more liquidity, leading to bigger `totalVaultSharesBefore`, causing the rounding to zero error to be triggered more easily.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L340

```solidity
File: VaultRewarderLib.sol
332:     function _accumulateSecondaryRewardViaClaim(
333:         uint256 index,
334:         VaultRewardState memory state,
335:         uint256 tokensClaimed,
336:         uint256 totalVaultSharesBefore
337:     ) private {
338:         if (tokensClaimed == 0) return;
339: 
340:         state.accumulatedRewardPerVaultShare += (
341:             (tokensClaimed * uint256(Constants.INTERNAL_TOKEN_PRECISION)) / totalVaultSharesBefore
342:         ).toUint128();
343: 
344:         VaultStorage.getVaultRewardState()[index] = state;
345:     }
```

#### Instance 2

Similarly, the issue mentioned in Issue 1 is also applicable to claiming the reward from emission.

Due to the low transaction fees on L2 (Arbitrum), malicious users could trigger the `_getAccumulatedRewardViaEmissionRate`  function on every new block. As a result, the `timeSinceLastAccumulation` in Line 373 below will be a very small value. 

The math that leads to rounding zero error is similar to Issue 1. When it round to zero, it will lead to a loss of emission rewards.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L373

```solidity
File: VaultRewarderLib.sol
347:     function _accumulateSecondaryRewardViaEmissionRate(
348:         uint256 index,
349:         VaultRewardState memory state,
350:         uint256 totalVaultSharesBefore
351:     ) private {
352:         state.accumulatedRewardPerVaultShare = _getAccumulatedRewardViaEmissionRate(
353:             state, totalVaultSharesBefore, block.timestamp
354:         ).toUint128();
355:         state.lastAccumulatedTime = uint32(block.timestamp);
356: 
357:         VaultStorage.getVaultRewardState()[index] = state;
358:     }
359: 
360:     function _getAccumulatedRewardViaEmissionRate(
361:         VaultRewardState memory state,
362:         uint256 totalVaultSharesBefore,
363:         uint256 blockTime
364:     ) private pure returns (uint256) {
365:         // Short circuit the method with no emission rate
366:         if (state.emissionRatePerYear == 0) return state.accumulatedRewardPerVaultShare;
367:         require(0 < state.endTime);
368:         uint256 time = blockTime < state.endTime ? blockTime : state.endTime;
369: 
370:         uint256 additionalIncentiveAccumulatedPerVaultShare;
371:         if (state.lastAccumulatedTime < time && 0 < totalVaultSharesBefore) {
372:             // NOTE: no underflow, checked in if statement
373:             uint256 timeSinceLastAccumulation = time - state.lastAccumulatedTime;
374:             // Precision here is:
375:             //  timeSinceLastAccumulation (SECONDS)
376:             //  emissionRatePerYear (REWARD_TOKEN_PRECISION)
377:             //  INTERNAL_TOKEN_PRECISION (1e8)
378:             // DIVIDE BY
379:             //  YEAR (SECONDS)
380:             //  INTERNAL_TOKEN_PRECISION (1e8)
381:             // => Precision = REWARD_TOKEN_PRECISION * INTERNAL_TOKEN_PRECISION / INTERNAL_TOKEN_PRECISION
382:             // => rewardTokenPrecision
383:             additionalIncentiveAccumulatedPerVaultShare =
384:                 (timeSinceLastAccumulation
385:                     * uint256(Constants.INTERNAL_TOKEN_PRECISION)
386:                     * state.emissionRatePerYear)
387:                 / (Constants.YEAR * totalVaultSharesBefore);
388:         }
389: 
390:         return state.accumulatedRewardPerVaultShare + additionalIncentiveAccumulatedPerVaultShare;
391:     }
```

## Impact

Loss of reward tokens, as shown in the scenarios above.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L174

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L340

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L373

## Tool used

Manual Review

## Recommendation

To reduce the impact of this issue, consider making the `claimRewardTokens` function permissioned and only allowing whitelisted bots to trigger it periodically.



## Discussion

**sherlock-admin3**

1 comment(s) were left on this issue during the judging contest.

**0xmystery** commented:
>  Low/QA at most due to dust amount loss



**xiaoming9090**

Escalate.

This should be a valid issue. If Notional is deployed only on the Mainnet, this issue does not pose a significant risk. However, Notional is also deployed on L2 (Arbitrum), thus the risk cannot be ignored. As mentioned in the report, this attack is feasible due to low transaction fees on L2. 

In addition, the loss is not a dust amount, as mentioned in the Judging comment. Under the right conditions (e.g., Vault with large TVL), and if malicious actors frequently perform griefing attacks against the reward features, the entire reward amount could be lost.

**sherlock-admin3**

> Escalate.
> 
> This should be a valid issue. If Notional is deployed only on the Mainnet, this issue does not pose a significant risk. However, Notional is also deployed on L2 (Arbitrum), thus the risk cannot be ignored. As mentioned in the report, this attack is feasible due to low transaction fees on L2. 
> 
> In addition, the loss is not a dust amount, as mentioned in the Judging comment. Under the right conditions (e.g., Vault with large TVL), and if malicious actors frequently perform griefing attacks against the reward features, the entire reward amount could be lost.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**mystery0x**

> Escalate.
> 
> This should be a valid issue. If Notional is deployed only on the Mainnet, this issue does not pose a significant risk. However, Notional is also deployed on L2 (Arbitrum), thus the risk cannot be ignored. As mentioned in the report, this attack is feasible due to low transaction fees on L2.
> 
> In addition, the loss is not a dust amount, as mentioned in the Judging comment. Under the right conditions (e.g., Vault with large TVL), and if malicious actors frequently perform griefing attacks against the reward features, the entire reward amount could be lost.

Will have sponsors look into this finding... but will `balanceAfter - balancesBefore[i]` not have the exploit circumvented when rolling over?

**WangSecurity**

Moreover, as I understand a completely possible scenario that there will be regular users claiming the rewards (e.g. Block 1 - Alice, block 2 - Bob, block 3 - Jack, etc.), so it even removes the need for the attack to be on L2 I believe.

Secondly, yes, the loss each time individually is very small, but if we take a broader picture, if the attacker repeats this attack for just one day, all the rewards for this day will be lost, which scales up, taking large TVL into account.

Planning to accept the escalation and validate the issue with high severity, since all the rewards can be lost. Yes, the attacker doesn't gain anything, but I believe there are no extensive constraints and a definite loss of funds.

**WangSecurity**

Are there additional duplicates except #90? @mystery0x 

**0502lian**

I can’t agree that this issue is high, based on three points:
- (1) I disagree with the example in the report where the precision of the Reward Token is 6(both scenarios 1 and 2). Based on the protocols mentioned (arb, cvx), it should be 18 and After Constants.INTERNAL_TOKEN_PRECISION is used by dev to expand to 1e8 before calculating shares.
For example, if the Reward Token precision is 18, even if the reward per block is only one token, i.e., 1e18 arb, then to round to 0, the required VaultShare would be 1e18 * 1e8 (not the 10000000e8 in reports), which is almost impossible to achieve.

    **Therefore, for a Reward Token with a precision of 18, causing the rounding to zero error is almost impossible.**

- (2) The attacker does not profit and actually incurs a gas loss.


**I suggest considering the sponsor’s opinion when judging whether this issue is high.**
@WangSecurity  @T-Woodward  @jeffywu


**xiaoming9090**

> I can’t agree that this issue is high, based on three points:
> 
> * (1) I disagree with the example in the report where the precision of the Reward Token is 6(both scenarios 1 and 2). Based on the protocols mentioned (arb, cvx), it should be 18 and After Constants.INTERNAL_TOKEN_PRECISION is used by dev to expand to 1e8 before calculating shares.
>   For example, if the Reward Token precision is 18, even if the reward per block is only one token, i.e., 1e18 arb, then to round to 0, the required VaultShare would be 1e18 * 1e8 (not the 10000000e8 in reports), which is almost impossible to achieve.
>   **Therefore, for a Reward Token with a precision of 18, causing the rounding to zero error is almost impossible.**
> * (2) The attacker does not profit and actually incurs a gas loss.
> 
> **I suggest considering the sponsor’s opinion when judging whether this issue is high.** @WangSecurity @T-Woodward @jeffywu

1) There is no part in the contest README stating that only ARB/CVX or reward tokens with 18 decimals will be accepted. Thus, it will be considered that reward tokens with 6 decimals (e.g., USDC, USDT) will also be accepted as reward tokens for the context of this audit contest. Also, the new contracts are meant to handle any reward tokens Notional might receive and would like to distribute to its users.

2)  Gas in L2 is insignificant compared to the loss of the reward tokens.

**jeffywu**

Looks like this issue is also a duplicate: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/115

Reward tokens with 6 decimals can be used so that part is valid.

I think there are some similar issues in severity where we would consider this valid and fix it, but in reality someone doing this seems unlikely without some sort of profit motivation. I'd consider this a valid medium severity issue.

**novaman33**

I also think medium is more appropriate as it is a costly attack with no incentive for the attacker. However from the readMe tokens with 6 decimals were not in scope in this audit so it might be invalid.


**xiaoming9090**

> I also think medium is more appropriate as it is a costly attack with no incentive for the attacker. 

In L2 environment, the cost of attack is significantly lower than on Ethereum. Thus, as stated earlier, this type of griefing attack is only relevant in the L2 environment in which Notional resides. The maximum impact is that all reward tokens will be lost.

Note that all DOS/griefing issues, by nature, do not directly benefit the attackers but cause a loss of assets for the victim (users or protocols). However, these issues have been consistently judged as High in Sherlock as long as the issues demonstrate a definite loss of assets to the victims with no extensive constraints.

> However from the readMe tokens with 6 decimals were not in scope in this audit so it might be invalid.

The contest's README does not state that tokens with 6 decimals are not in scope. As a whole, Notional protocol only explicitly disallows tokens that are less than 6 decimals or more than 18 decimals.



**0502lian**

I agree with the sponsor’s opinion.

Assuming on Arbitrum, with an average of 0.25s per block, considering the complexity of the claimRewardTokens function, the gas cost for each transaction is reasonably estimated to be 0.01 USD - 0.1 USD.
The estimated number of transactions per day is 4 * 3600 * 24 = 345600.
If it continues for one day, the attacker’s cost is: 345600 * (0.01 USD ~ 0.1 USD) = 3456 USD ~ 34560 USD.

**And the attacker’s profit is 0.**

Considering that Notional has many staking vaults, assuming the value of one vault is 1M USD and the annual reward rate is 10%, which is a reasonable estimate, then the daily loss of funds from the vault is:
1000000 * 10% / 365 = 273.97 USD.

**notN000B**


```
additionalIncentiveAccumulatedPerVaultShare  = (timeSinceLastAccumulation * 1e8 * emissionRate) / (31536000 * totalVaultSharesBefore)

```

The `additionalIncentiveAccumulatedPerVaultShare` will be zero if `(t * 1e8 * rate) < 31536000 * totalSharesBefore`, which is achievable.

 For instance, with `totalSharesBefore` being 1,000,000,000 shares, this equates to `1,000,000,000 * 1e8`. To prevent reward accumulation, an attacker needs to ensure` t * rate *1e8 < 31536000 * 1,000,000,000 * 1e8`. Even with a high emission rate of 1e6 reward tokens (which is very unlikely), the attacker would need to call functions just before `t < 31536 seconds (approximately 8.76 minutes`). 

With such a high emission rate, there would be roughly 9 minutes to DOS the function, even on the mainnet. As totalShares increase and the emission rate decreases(Which will be the case in reality), DOSing the function becomes even easier

Issuse should be HIGH. This was my first contest I can't escalate my issue but This issue seems sames as mine
https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/115

**0502lian**

For instance, with totalSharesBefore being 1,000,000,000 shares, this equates to 1,000,000,000 * 1e8. 
---------That means you need 1 billion ETH in a vault(eg PendlePTEtherFiVault). The total circulating supply of Ethereum (ETH) is currently approximately 0.12 billion ETH

**WangSecurity**

Firstly, about the reward tokens. The reason why they weren't specified in the README is because they're not set by the admins of Notional. The reward tokens are the tokens that other protocols, which Notional integrates with, use to pay out the rewards/grants. Hence, I believe it's enough contextual evidence that the protocol indeed needs to work with any type of reward tokens.

Secondly, I see that there is no impact for the attacker and on mainnet the cost is significant. As I've said in my previous comment, it can happen without a malicious intent, when different users will claim rewards in every block. That is why I believe it qualifies for High severity:
> Definite loss of funds without (extensive) limitations of external conditions

Planning to accept the escalation and validate the issue with high severity. Duplicates are #90. #115 is not a duplicate, check my comment under it.

**WangSecurity**

Result:
High
Has duplicates

**sherlock-admin4**

Escalations have been resolved successfully!

Escalation status:
- [xiaoming9090](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/61/#issuecomment-2227180243): accepted
