---
tags:
  - lang/solidity
  - sector/governance
  - sector/options
  - sector/staking-pool
  - sector/vault
  - sector/yield-aggregator
  - platform/sherlock
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Notional]]"
auditors:
  - "[[DenTonylifer]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging"
genome:
  - "[[griefing]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[reward-accounting]]"
---
# H-7: Users can deny the vault from claiming reward tokens

- id: 35120
- impact: HIGH
- protocol: [[Notional]] Leveraged Vaults: Pendle PT and Vault Incentives
- reporter: DenTonylifer (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue where users can deny the vault from claiming reward tokens by front-running a specific function. This vulnerability can result in the loss of assets for the protocol and its users. The bug report includes code snippets and a discussion among the auditors, where they ultimately decide to escalate the severity of the issue from medium to high. They also note that this issue has been found in a previous audit and was judged as a high finding, so it should be consistently applied here. 

## Details

Source: https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/63 

## Found by 
DenTonylifer, xiaoming90
## Summary

Users can deny the vault from claiming reward tokens by front-running the `_claimVaultRewards` function.

## Vulnerability Detail

The `_claimVaultRewards` function will call the `_executeClaim` function to retrieve the reward tokens from the external protocols (e.g., Convex or Aura). The reward tokens will be transferred directly to the vault contract. The vault computes the number of reward tokens claimed by taking the difference of the before and after balance.

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L174

```solidity
File: VaultRewarderLib.sol
148:     function _claimVaultRewards(
..SNIP..
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
..SNIP..
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

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L181

```solidity
File: VaultRewarderLib.sol
181:     function _executeClaim(RewardPoolStorage memory r) internal {
182:         if (r.poolType == RewardPoolType.AURA) {
183:             require(IAuraRewardPool(r.rewardPool).getReward(address(this), true));
184:         } else if (r.poolType == RewardPoolType.CONVEX_MAINNET) {
185:             require(IConvexRewardPool(r.rewardPool).getReward(address(this), true));
186:         } else if (r.poolType == RewardPoolType.CONVEX_ARBITRUM) {
187:             IConvexRewardPoolArbitrum(r.rewardPool).getReward(address(this));
188:         } else {
189:             revert();
190:         }
191:     }
```

However, the `getReward` function of the external protocols can be executed by anyone. Refer to Appendix A for the actual implementation of the `getReward` function.

As a result, malicious users can front-run the `_claimVaultRewards` transaction and trigger the `getReward` function of the external protocols directly, resulting in the reward tokens to be sent to the vault before the `_claimVaultRewards` is executed.

When the `_claimVaultRewards` function is executed, the before/after snapshot will ultimately claim the zero amount. The code ` balanceAfter - balancesBefore[i]` at Line 174 above will always produce zero if the call to `_claimVaultRewards` is front-run.

As a result, reward tokens are forever lost in the contract.

## Impact

High as this issue is the same [this issue](https://github.com/sherlock-audit/2023-03-notional-judging/issues/200) in the past Notional V3 contest.

Loss of assets as the reward tokens intended for Notional and its users are lost.

## Code Snippet

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L174

https://github.com/sherlock-audit/2024-06-leveraged-vaults/blob/main/leveraged-vaults-private/contracts/vaults/common/VaultRewarderLib.sol#L181

## Tool used

Manual Review

## Recommendation

Consider using the entire balance instead of the difference between before and after balances.

## Appendix A - `getReward` of Convex and Aura's reward pool contract

**Aura's Reward Pool on Mainnet**

https://etherscan.io/address/0x44D8FaB7CD8b7877D5F79974c2F501aF6E65AbBA#code#L980 

```solidity
     function getReward(address _account, bool _claimExtras) public updateReward(_account) returns(bool){
        uint256 reward = earned(_account);
        if (reward > 0) {
            rewards[_account] = 0;
            rewardToken.safeTransfer(_account, reward);
            IDeposit(operator).rewardClaimed(pid, _account, reward);
            emit RewardPaid(_account, reward);
        }

        //also get rewards from linked rewards
        if(_claimExtras){
            for(uint i=0; i < extraRewards.length; i++){
                IRewards(extraRewards[i]).getReward(_account);
            }
        }
        return true;
    }
```

**Aura's Reward Pool on Arbitrum**

https://arbiscan.io/address/0x17F061160A167d4303d5a6D32C2AC693AC87375b#code#F15#L296

```solidity
  /**
     * @dev Gives a staker their rewards, with the option of claiming extra rewards
     * @param _account     Account for which to claim
     * @param _claimExtras Get the child rewards too?
     */
    function getReward(address _account, bool _claimExtras) public updateReward(_account) returns(bool){
        uint256 reward = earned(_account);
        if (reward > 0) {
            rewards[_account] = 0;
            rewardToken.safeTransfer(_account, reward);
            IDeposit(operator).rewardClaimed(pid, _account, reward);
            emit RewardPaid(_account, reward);
        }

        //also get rewards from linked rewards
        if(_claimExtras){
            for(uint i=0; i < extraRewards.length; i++){
                IRewards(extraRewards[i]).getReward(_account);
            }
        }
        return true;
    }
```

**Convex's Reward Pool on Arbitrum**

https://arbiscan.io/address/0x93729702Bf9E1687Ae2124e191B8fFbcC0C8A0B0#code#F1#L337

```solidity
    //claim reward for given account (unguarded)
    function getReward(address _account) external {
        //check if there is a redirect address
        if(rewardRedirect[_account] != address(0)){
            _checkpoint(_account, rewardRedirect[_account]);
        }else{
            //claim directly in checkpoint logic to save a bit of gas
            _checkpoint(_account, _account);
        }
    }
```

#### Convex for Mainnet

https://etherscan.io/address/0xD1DdB0a0815fD28932fBb194C84003683AF8a824#code#L980

```solidity
    function getReward(address _account, bool _claimExtras) public updateReward(_account) returns(bool){
        uint256 reward = earned(_account);
        if (reward > 0) {
            rewards[_account] = 0;
            rewardToken.safeTransfer(_account, reward);
            IDeposit(operator).rewardClaimed(pid, _account, reward);
            emit RewardPaid(_account, reward);
        }

        //also get rewards from linked rewards
        if(_claimExtras){
            for(uint i=0; i < extraRewards.length; i++){
                IRewards(extraRewards[i]).getReward(_account);
            }
        }
        return true;
    }
```



## Discussion

**DenTonylifer**

Disagree with severity

This should be high issue according to Sherlock rules:
- there is no limitations of external conditions - attack can be done for free by anyone and anytime 
- loss of rewards for users even up to 100% of reward amount
- loss for protocol as there is no ability to resque stuck tokens

Also look at similar high-severity issues from past audits:
https://github.com/sherlock-audit/2023-06-tokemak-judging/issues/738
https://github.com/sherlock-audit/2023-03-notional-judging/issues/168

**xiaoming9090**

Escalate.

This issue should be a High instead of Medium.

Malicious users can easily cause Notional and its users to lose rewards by triggering the `getReward` function of the external protocols as described in my report.

Note that this issue is exactly the same as the issue (https://github.com/sherlock-audit/2023-03-notional-judging/issues/200) found in the past Notional contest, which was judged as a High finding. Thus, it should be consistently applied here.

**sherlock-admin3**

> Escalate.
> 
> This issue should be a High instead of Medium.
> 
> Malicious users can easily cause Notional and its users to lose rewards by triggering the `getReward` function of the external protocols as described in my report.
> 
> Note that this issue is exactly the same as the issue (https://github.com/sherlock-audit/2023-03-notional-judging/issues/200) found in the past Notional contest, which was judged as a High finding. Thus, it should be consistently applied here.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**WangSecurity**

I agree the severity should be high, don't see any extensive constraints here, even though the attack is griefing. Planning to accept the escalation and upgrade the severity.

**WangSecurity**

Result:
High
Has duplicates

**sherlock-admin4**

Escalations have been resolved successfully!

Escalation status:
- [xiaoming9090](https://github.com/sherlock-audit/2024-06-leveraged-vaults-judging/issues/63/#issuecomment-2227178782): accepted
