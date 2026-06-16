---
tags:
  - lang/solidity
  - sector/lending
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/reward-theft
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Notional]]"
auditors:
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[reward-theft]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# H-8: Malicious users can steal reward tokens via re-entrancy attack

- id: 35121
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability in which malicious users can steal reward tokens through a re-entrancy attack. The vulnerability is caused by a function that updates account rewards during the redemption of vault shares. The function does not properly check for re-entrancy, allowing an attacker to repeatedly claim reward tokens and receive more than they are entitled to. This can result in the theft of reward tokens from the vault and other shareholders. The vulnerability is valid and has been accepted for resolution with a high severity rating. 

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/64 

## Found by 
xiaoming90
## Summary

Malicious users can steal reward tokens via re-entrancy attack.

## Vulnerability Detail

During the redemption of vault shares, the `_updateAccountRewards` function will be triggered at the end of the function to update the account rewards.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/SingleSidedLPVaultBase.sol#L282

```solidity
File: SingleSidedLPVaultBase.sol
282:     function _redeemFromNotional(
283:         address account, uint256 vaultShares, uint256 /* maturity */, bytes calldata data
284:     ) internal override virtual whenNotLocked returns (uint256 finalPrimaryBalance) {
..SNIP..
316:         _updateAccountRewards({
317:             account: account,
318:             vaultShares: vaultShares,
319:             totalVaultSharesBefore: totalVaultSharesBefore,
320:             isMint: false
321:         });
322:     }
```

Assume that at T1

- Bob has 100 vault shares
- Current `rewardsPerVaultShare` is 1.0
- Bob's debt (`VaultStorage.getAccountRewardDebt()[rewardToken][Bob]`) is 100 (`100 shares * 1.0`)

Assume that at T2:

- Bob attempts to redeem 90 vault shares
- Current `rewardsPerVaultShare` is 2.0

When Line 211 below is executed, the `vaultSharesBefore` will be set to 100 vault shares. The `_claimAccountRewards` function will be executed in Line 212, and it will execute the `_claimRewardToken` function internally.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L211

```solidity
File: VaultRewarderLib.sol
202:     /// @notice Called by the vault during enter and exit vault to update the account reward claims.
203:     function updateAccountRewards(
204:         address account,
205:         uint256 vaultShares,
206:         uint256 totalVaultSharesBefore,
207:         bool isMint
208:     ) external {
209:         // Can only be called via enter or exit vault
210:         require(msg.sender == address(Deployments.NOTIONAL));
211:         uint256 vaultSharesBefore = _getVaultSharesBefore(account);
212:         _claimAccountRewards(
213:             account,
214:             totalVaultSharesBefore,
215:             vaultSharesBefore,
216:             isMint ? vaultSharesBefore + vaultShares : vaultSharesBefore - vaultShares
217:         );
218:     }
```

Within the `_claimRewardToken` function, the `_getRewardsToClaim` function will be executed to compute the number of reward tokens that Bob is entitled to. Based on the formula within the `_getRewardsToClaim` function, Bob is entitled 100 reward tokens.

```solidity
rewardToClaim = (vaultSharesBefore * rewardsPerVaultShare) - Bob's debt
rewardToClaim = (100 shares * 2.0) - 100 = 100
```

In Line 306 below, Bob's debt (`VaultStorage.getAccountRewardDebt()[rewardToken][Bob]`) will be updated to 20 ( `vaultSharesAfter * rewardsPerVaultShare = 10 shares * 2.0 = 20`). Note that `vaultSharesAfter` is 10 shares because Bob withdraws 90 shares from his initial 100 shares.

In Line 316 below, 100 reward tokens will be transferred to Bob.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L316

```solidity
File: VaultRewarderLib.sol
295:     function _claimRewardToken(
296:         address rewardToken,
297:         address account,
298:         uint256 vaultSharesBefore,
299:         uint256 vaultSharesAfter,
300:         uint256 rewardsPerVaultShare
301:     ) internal returns (uint256 rewardToClaim) {
302:         rewardToClaim = _getRewardsToClaim(
303:             rewardToken, account, vaultSharesBefore, rewardsPerVaultShare
304:         );
305: 
306:         VaultStorage.getAccountRewardDebt()[rewardToken][account] = (
307:             (vaultSharesAfter * rewardsPerVaultShare) /
308:                 uint256(Constants.INTERNAL_TOKEN_PRECISION)
309:         );
310: 
311:         if (0 < rewardToClaim) {
312:             // Ignore transfer errors here so that any strange failures here do not
313:             // prevent normal vault operations from working. Failures may include a
314:             // lack of balances or some sort of blacklist that prevents an account
315:             // from receiving tokens.
316:             try IEIP20NonStandard(rewardToken).transfer(account, rewardToClaim) {
317:                 bool success = TokenUtils.checkReturnCode();
318:                 if (success) {
319:                     emit VaultRewardTransfer(rewardToken, account, rewardToClaim);
320:                 } else {
321:                     emit VaultRewardTransfer(rewardToken, account, 0);
322:                 }
323:             // Emits zero tokens transferred if the transfer fails.
324:             } catch {
325:                 emit VaultRewardTransfer(rewardToken, account, 0);
326:             }
327:         }
```

Assume that the reward token contains a hook or callback. As a result, the control will be passed back to Bob. Note that there are no restrictions on the type of reward tokens in the context of this audit.

Bob can re-enter the vault and execute the `claimAccountRewards` function, which is not guarded against re-entrancy. When Line 197 is executed, the `totalVaultSharesBefore` will still remain 100 vault shares because the execution `_redeemFromNotional` function has not been completed yet. Thus, the number of vault shares has not been updated on Notional side yet. The `_claimRewardToken` function, followed by `_getRewardsToClaim` will be executed again internally.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L197

```solidity
File: VaultRewarderLib.sol
193:     /// @notice Callable by an account to claim their own rewards, we know that the vault shares have
194:     /// not changed in this transaction because the contract has not been called by Notional
195:     function claimAccountRewards(address account) external override {
196:         require(msg.sender == account);
197:         uint256 totalVaultSharesBefore = VaultStorage.getStrategyVaultState().totalVaultSharesGlobal;
198:         uint256 vaultSharesBefore = _getVaultSharesBefore(account);
199:         _claimAccountRewards(account, totalVaultSharesBefore, vaultSharesBefore, vaultSharesBefore);
200:     }
```

Based on the formula within the `_getRewardsToClaim` function, Bob is entitled 180 reward tokens.

```solidity
rewardToClaim = (vaultSharesBefore * rewardsPerVaultShare) - Bob's debt
rewardToClaim = (100 shares * 2.0) - 20 = 180
```

The vault will transfer an additional 180 reward tokens to Bob again, which is incorrect. In this case, Bob has stolen 180 reward tokens from the vault and other shareholders.

#### Instance 2

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L110

```solidity
File: WithdrawRequestBase.sol
109:     function _initiateWithdraw(address account, bool isForced) internal {
110:         uint256 vaultShares = Deployments.NOTIONAL.getVaultAccount(account, address(this)).vaultShares;
111:         require(0 < vaultShares);
```

Attackers can also call this function. Because Line 110 will still read the outdated vault share info, it will be the higher than expected number.

## Impact

Reward tokens can be stolen by malicious users.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/SingleSidedLPVaultBase.sol#L282

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L211

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L316

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L197

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/WithdrawRequestBase.sol#L110

## Tool used

Manual Review

## Recommendation

Add re-entrancy guard on the `claimAccountRewards` function to prevent anyone from re-entering the vault under any circumstance.



## Discussion

**sherlock-admin2**

1 comment(s) were left on this issue during the judging contest.

**0xmystery** commented:
>  Devoid of coded POC to substantiate exploit



**xiaoming9090**

Escalate.

This issue should be a valid High.

The lead judge mentioned that the issue was "Devoid of coded POC to substantiate exploit" and marked it as invalid. However, the POC in the report is already sufficient to demonstrate that the vulnerability mentioned in the report could lead to a loss of assets. Thus, it should be valid.

**sherlock-admin3**

> Escalate.
> 
> This issue should be a valid High.
> 
> The lead judge mentioned that the issue was "Devoid of coded POC to substantiate exploit" and marked it as invalid. However, the POC in the report is already sufficient to demonstrate that the vulnerability mentioned in the report could lead to a loss of assets. Thus, it should be valid.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**mystery0x**

> Escalate.
> 
> This issue should be a valid High.
> 
> The lead judge mentioned that the issue was "Devoid of coded POC to substantiate exploit" and marked it as invalid. However, the POC in the report is already sufficient to demonstrate that the vulnerability mentioned in the report could lead to a loss of assets. Thus, it should be valid.

Will have the sponsors look into this finding to decide whether or not their reward tokens will have hook entailed. It seems to me the sponsors would have specified any of these weird tokens requiring non-reentrant visibility in the 2nd question of the contest readme `Details` if they had been adopted.

**WangSecurity**

The protocol didn't specify which tokens will be used as rewards, so we have to assume only the standard tokens without any weird traits will be used. Hence, we should assume tokens with hooks or callbacks allowing for reentrancy won't be used. Planning to reject the escalation and leave the issue as it is.

**xiaoming9090**

> The protocol didn't specify which tokens will be used as rewards, so we have to assume only the standard tokens without any weird traits will be used. Hence, we should assume tokens with hooks or callbacks allowing for reentrancy won't be used. Planning to reject the escalation and leave the issue as it is.

@WangSecurity The contracts are meant to handle tokens that Notional protocol will receive from other protocols or projects (e.g., grants). Thus, it is not possible for Notional to predict what kind of tokens they will receive in the future. To be on the safe side, we should assume the worst-case scenario where it might be possible that some of the reward tokens might contain hook or callback, and necessary measures should be implemented to guard against potential re-entrancy attack.

@jeffywu You might want to have a look at this. Thanks.

**jeffywu**

I agree with @xiaoming9090's assessment, this is a valid issue. Some reward tokens may hold callback hooks that we are unaware of.

**0502lian**

In my opinion, even if there is reentrancy, there won’t be any loss. If my understanding is incorrect, please correct me. 
@xiaoming9090 @jeffywu 
Thank you!

The loss due to reentrancy is based on the description by @xiaoming9090 , ‘When Line 197 is executed, the totalVaultSharesBefore will still remain 100 vault shares because the execution of the _redeemFromNotional function has not been completed yet. Thus, the number of vault shares has not been updated on the Notional side yet.’

However, after research, I found that totalVaultSharesBefore is updated first and then _redeemFromNotional() is called.

https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/external/actions/VaultAccountAction.sol#L215
```javascript
function exitVault(
        address account,
        address vault,
        address receiver,
        uint256 vaultSharesToRedeem,
        uint256 lendAmount,
        uint32 minLendRate,
        bytes calldata exitVaultData
    ) external payable override nonReentrant returns (uint256 underlyingToReceiver) {
       //---------skip---
---
---
          //update here    
    @>>    vaultState.exitMaturity(vaultAccount, vaultConfig, vaultSharesToRedeem);

        if (vaultAccount.tempCashBalance > 0) {
            Emitter.emitTransferPrimeCash(
                vault, receiver, vaultConfig.borrowCurrencyId, vaultAccount.tempCashBalance
            );

            underlyingToReceiver = VaultConfiguration.transferFromNotional(
                receiver, vaultConfig.borrowCurrencyId, vaultAccount.tempCashBalance, vaultConfig.primeRate, false
            );

            vaultAccount.tempCashBalance = 0;
        }

        // If insufficient strategy tokens are redeemed (or if it is set to zero), then
        // redeem with debt repayment will recover the repayment from the account's wallet
        // directly.
         // call _redeemFromNotional() in redeemWithDebtRepayment()
    @>>  underlyingToReceiver = underlyingToReceiver.add(vaultConfig.redeemWithDebtRepayment(
            vaultAccount, receiver, vaultSharesToRedeem, exitVaultData
        ));

        // Set the vault state after redemption completes
        vaultState.setVaultState(vaultConfig);

       //---skip----
---
---
    }
```
update storage
```javascript
function exitMaturity(
        VaultState memory vaultState,
        VaultAccount memory vaultAccount,
        VaultConfig memory vaultConfig,
        uint256 vaultSharesToRedeem
    ) internal {
        require(vaultAccount.maturity == vaultState.maturity);
        mapping(address => mapping(uint256 => VaultStateStorage)) storage store = LibStorage.getVaultState();
        VaultStateStorage storage s = store[vaultConfig.vault][vaultState.maturity];

        // Update the values in memory
        vaultState.totalVaultShares = vaultState.totalVaultShares.sub(vaultSharesToRedeem);
        vaultAccount.vaultShares = vaultAccount.vaultShares.sub(vaultSharesToRedeem);

        // Update the global value in storage
 @>>       s.totalVaultShares = vaultState.totalVaultShares.toUint80();
    }

```
redeemWithDebtRepayment  calls _redeem, then calls redeemFromNotional, then calls _redeemFromNotional
```javascript
/// @notice Redeems without any debt repayment and sends profits back to the receiver
    function redeemWithDebtRepayment(
        VaultConfig memory vaultConfig,
        VaultAccount memory vaultAccount,
        address receiver,
        uint256 vaultShares,
        bytes calldata data
    ) internal returns (uint256 underlyingToReceiver) {
        uint256 amountTransferred;
        uint256 underlyingExternalToRepay;
        {
            //-----------skip-------
---
---
            (amountTransferred, underlyingToReceiver, /* primeCashRaised */) = _redeem(
                vaultConfig,
                underlyingToken,
                vaultAccount.account,
                receiver,
                vaultShares,
                vaultAccount.maturity,
                underlyingExternalToRepay,
                data
            );
        }

      // ------skip--
---
---
    }
```
```javascript

function _redeem(
        VaultConfig memory vaultConfig,
        Token memory underlyingToken,
        address account,
        address receiver,
        uint256 vaultShares,
        uint256 maturity,
        uint256 underlyingExternalToRepay,
        bytes calldata data
    ) private returns (
        uint256 amountTransferred,
        uint256 underlyingToReceiver,
        int256 primeCashRaised
    ) {
            //-----skip--
---
        {
            uint256 balanceBefore = underlyingToken.balanceOf(address(this));
   @>>         underlyingToReceiver = IStrategyVault(vaultConfig.vault).redeemFromNotional(
                account, receiver, vaultShares, maturity, underlyingExternalToRepay, data
            );
    }

//--------skip
---
---
```

Because all data is updated before token transfer,  There is nothing can be done in re-entrancy.

**xiaoming9090**

During the re-entrancy, Bob's vault shares should have decreased from 100 vault shares to 10 vault shares since he withdraws 90 vault shares. However, it remains at 100 vault shares. This is because vault account shares are not updated in storage until the vault complete its exit [here](https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/external/actions/VaultAccountAction.sol#L278). Thus, the reward calculation in the re-entrancy will be incorrect.

There is a minor typo in this paragraph. Refer to the update below. Apart from that, the rest, including the math calculation, is correct.
```diff
- Line 197 is executed, the totalVaultSharesBefore will still remain 100 vault shares because the execution _redeemFromNotional function has not been completed yet. 
+ Line 198 is executed, the vaultSharesBefore will still remain 100 vault shares because the execution _redeemFromNotional function has not been completed yet. 
```



**0502lian**




> During the re-entrancy, Bob's vault shares should have decreased from 100 vault shares to 10 vault shares since he withdraws 90 vault shares. However, it remains at 100 vault shares. This is because vault account shares are not updated in storage until the vault complete its exit [here](https://github.com/notional-finance/contracts-v3/blob/b664c157051d256ce583ba19da3e26c6cf5061ac/contracts/external/actions/VaultAccountAction.sol#L278). Thus, the reward calculation in the re-entrancy will be incorrect.
> 
> There is a minor typo in this paragraph. Refer to the update below. Apart from that, the rest, including the math calculation, is correct.
> 
> ```diff
> - Line 197 is executed, the totalVaultSharesBefore will still remain 100 vault shares because the execution _redeemFromNotional function has not been completed yet. 
> + Line 198 is executed, the vaultSharesBefore will still remain 100 vault shares because the execution _redeemFromNotional function has not been completed yet. 
> ```


Then I think you are right.  User's vault account shares  indeed updates  after _redeemFromNotional(). If the reward token is ERC777 , it could be a re-entrancy attack.

**novaman33**

How are these in scope since the answer of the question in readMe is:
`
If you are integrating tokens, are you allowing only whitelisted tokens to work with the codebase or any complying with the standard? Are they assumed to have certain properties, e.g. be non-reentrant? Are there any types of [weird tokens](https://github.com/d-xo/weird-erc20) you want to integrate?

EtherFi: weETH, eETH
Ethena: USDe, sUSDe
Pendle: PT tokens
Kelp: rsETH
`

**xiaoming9090**

> How are these in scope since the answer of the question in readMe is: ` If you are integrating tokens, are you allowing only whitelisted tokens to work with the codebase or any complying with the standard? Are they assumed to have certain properties, e.g. be non-reentrant? Are there any types of [weird tokens](https://github.com/d-xo/weird-erc20) you want to integrate?
> 
> EtherFi: weETH, eETH Ethena: USDe, sUSDe Pendle: PT tokens Kelp: rsETH `

Note that there are two areas where ERC20 tokens will be used:

1) Vault's assets
2) Reward tokens

The above-listed tokens (weETH, USDe, sUSDe, rsETH) are the vault's asset tokens. Anyone who reviews the vault code will clearly understand it. Thus, it is understandable from the sponsor's point of view that this information refers only to the vault's asset tokens, and not the reward tokens.

As mentioned in my [earlier comments](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/64#issuecomment-2229898997), the reward-related contracts meant to handle tokens that Notional protocol will receive from other protocols or projects (e.g., grants). Thus, it is not possible for Notional to predict what kind of tokens they will receive in the future. Thus, it makes sense for the protocol not to narrow down the reward tokens accepted at this point.

In addition, in the sponsor's [earlier comment](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/64#issuecomment-2230224433), they already shared the view that some reward tokens might contain callback hooks that they are unaware of.



**novaman33**

The question is regarding any strange ERC20 tokens. Their answer is a list of tokens that does include some rebasing tokens. I agree that there are two areas where ERC20 tokens are used, but I do not agree that by any means this means that all the other tokens are supported(from this answer).  Given Sherlock's hierarchy of truth, both this and #61 should be invalid, as sponsors comments in judging cannot change the scope.

**WangSecurity**

About the reward tokens. The reason why they weren't specified in the README is because they're not set by the admins of Notional. The reward tokens are the tokens that other protocols, which Notional integrates with, use to pay out the rewards/grants. Hence, I believe it's enough contextual evidence that the protocol indeed needs to work with any type of reward tokens.

Therefore, I believe this issue is valid. Even though it's only possible with tokens with hooks, the report shows how the attacker gets almost 200% more shares than they should've got. Hence, I believe high severity is appropriate, planning to accept the escalation.

**WangSecurity**

Result:
High
Unique

**sherlock-admin4**

Escalations have been resolved successfully!

Escalation status:
- [xiaoming9090](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/64/#issuecomment-2227179096): accepted

**WangSecurity**

@xiaoming9090 @mystery0x @brakeless-wtp are there any duplicates?
