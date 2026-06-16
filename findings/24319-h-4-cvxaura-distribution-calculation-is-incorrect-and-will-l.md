---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/farm
  - sector/staking
protocol: "[[Blueberry]]"
auditors:
  - "[[0x52]]"
report: "https://github.com/sherlock-audit/2023-07-blueberry-judging"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# H-4: CVX/AURA distribution calculation is incorrect and will lead to loss of rewards at the end of each cliff

- id: 24319
- impact: HIGH
- protocol: [[Blueberry]]
- reporter: 0x52 (Sherlock)
- source: N/A

## Summary


A bug was found in the CVX/AURA distribution calculation which could lead to users losing rewards at the end of each cliff. The bug is caused by the code in the WAuraPools.sol and WConvexPools.sol contracts which calculates the amount of AURA owed to the user. This calculation is accurate if the AURA hasn't been minted yet, however when a user withdraws, AURA is claimed for all vault participants and this leads to a loss of rewards at the end of each cliff. 

The bug was found by 0x52, who used manual review as a tool to identify the issue. The code snippet of the bug can be found in the WAuraPools.sol#L209-L249 and WConvexPools.sol#L149-L172. 

The impact of the bug is that all users will lose rewards at the end of each cliff due to miscalculation. To prevent this from happening, 0x52 recommended a hybrid approach. When rewards are claimed upon withdrawal, the reward per token should be cached to prevent loss of tokens that have already been received by the contract. Only unminted AURA should be handled this way. 

The bug was discussed by 0x52, sherlock-admin2, Shogoki, Gornutz and hrishibhat. After further review, it was determined that the bug should be classified as high risk.

## Details

Source: https://github.com/sherlock-audit/2023-07-blueberry-judging/issues/109 

## Found by 
0x52

When calculating the amount of pending AURA owed to a user _getAuraPendingReward uses the current values for supply. This leads to incorrect calculation across cliffs which leads to loss of rewards for users.

## Vulnerability Detail

[WAuraPools.sol#L233-L248](https://github.com/sherlock-audit/2023-07-blueberry/blob/main/blueberry-core/contracts/wrapper/WAuraPools.sol#L233-L248)

        if (cliff < totalCliffs) {
            /// e.g. (new) reduction = (500 - 100) * 2.5 + 700 = 1700;
            /// e.g. (new) reduction = (500 - 250) * 2.5 + 700 = 1325;
            /// e.g. (new) reduction = (500 - 400) * 2.5 + 700 = 950;
            uint256 reduction = ((totalCliffs - cliff) * 5) / 2 + 700;
            /// e.g. (new) amount = 1e19 * 1700 / 500 =  34e18;
            /// e.g. (new) amount = 1e19 * 1325 / 500 =  26.5e18;
            /// e.g. (new) amount = 1e19 * 950 / 500  =  19e17;
            mintAmount = (mintRequestAmount * reduction) / totalCliffs;

            /// e.g. amtTillMax = 5e25 - 1e25 = 4e25
            uint256 amtTillMax = emissionMaxSupply - emissionsMinted;
            if (mintAmount > amtTillMax) {
                mintAmount = amtTillMax;
            }
        }

The above code is used to calculate the amount of AURA owed to the user. This calculation is perfectly accurate if the AURA hasn't been minted yet. The problem is that each time a user withdraws, AURA is claimed for ALL vault participants. This means that the rewards will be realized for a majority of users before they themselves withdraw. Since the emissions decrease with each cliff, there will be loss of funds at the end of each cliff.

Example:
Assume for simplicity there are only 2 cliffs. User A deposits LP to WAuraPools. After some time User B deposits as well. Before the end of the first cliff User A withdraw. This claims all tokens owed to both users A and B which is now sitting in the contract. Assume both users are owed 10 tokens. Now User B waits for the second cliff to end before withdrawing. When calculating his rewards it will give him no rewards since all cliffs have ended. The issue is that the 10 tokens they are owed is already sitting in the contract waiting to be claimed.

## Impact

All users will lose rewards at the end of each cliff due to miscalculation

## Code Snippet

[WAuraPools.sol#L209-L249](https://github.com/sherlock-audit/2023-07-blueberry/blob/main/blueberry-core/contracts/wrapper/WAuraPools.sol#L209-L249)

[WConvexPools.sol#L149-L172](https://github.com/sherlock-audit/2023-07-blueberry/blob/main/blueberry-core/contracts/wrapper/WConvexPools.sol#L149-L172)

## Tool used

Manual Review

## Recommendation

I would recommend a hybrid approach. When rewards are claimed upon withdrawal, the reward per token should be cached to prevent loss of tokens that have already been received by the contract. Only unminted AURA should be handled this way.



## Discussion

**IAm0x52**

Escalate

This was wrongly excluded and causes a significant problem. Whenever a position is burned it calls the following line:

https://github.com/sherlock-audit/2023-07-blueberry/blob/7c7e1c4a8f3012d1afd2e598b656010bb9127836/blueberry-core/contracts/wrapper/WAuraPools.sol#L379

        IAuraRewarder(auraRewarder).withdraw(amount, true);

Which withdraws the LP and claims rewards because of the `true` input. Digging into the rewarder contract:

https://etherscan.io/address/0x1204f5060be8b716f5a62b4df4ce32acd01a69f5#code#F18#L229

    function withdraw(uint256 amount, bool claim)
        public
        updateReward(msg.sender)
        returns(bool)
    {
        require(amount > 0, 'RewardPool : Cannot withdraw 0');

        //also withdraw from linked rewards
        for(uint i=0; i < extraRewards.length; i++){
            IRewards(extraRewards[i]).withdraw(msg.sender, amount);
        }

        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);

        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
     
        if(claim){
            getReward(msg.sender,true);
        }

        emit Transfer(msg.sender, address(0), amount);

        return true;
    }

Here we see that if claim == true then we call `getReward`

https://etherscan.io/address/0x1204f5060be8b716f5a62b4df4ce32acd01a69f5#code#F18#L296

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

Here we see that the ENTIRE reward balance is claimed for the vault. This presents the problem as outlined in my issue above. Let's assume that the reward for the current round is 1:1 (i.e. that each claimed BAL gives 1 AURA). Assume we have 2 users, each with half the pool. Now 100 tokens are claimed in this round, which means each user is owed 50 AURA. After some amount of rounds, the reward is now 1:0.5 (i.e. that each claimed BAL gives 1 AURA). Now when user A withdraws instead of being paid 100 AURA for that round they will instead only be paid 50 AURA and they will lose the other 50 since it won't be claimable. This is because it always uses the most recent exchange rate instead of the rate at which it was claimed.



**sherlock-admin2**

 > Escalate
> 
> This was wrongly excluded and causes a significant problem. Whenever a position is burned it calls the following line:
> 
> https://github.com/sherlock-audit/2023-07-blueberry/blob/7c7e1c4a8f3012d1afd2e598b656010bb9127836/blueberry-core/contracts/wrapper/WAuraPools.sol#L379
> 
>         IAuraRewarder(auraRewarder).withdraw(amount, true);
> 
> Which withdraws the LP and claims rewards because of the `true` input. Digging into the rewarder contract:
> 
> https://etherscan.io/address/0x1204f5060be8b716f5a62b4df4ce32acd01a69f5#code#F18#L229
> 
>     function withdraw(uint256 amount, bool claim)
>         public
>         updateReward(msg.sender)
>         returns(bool)
>     {
>         require(amount > 0, 'RewardPool : Cannot withdraw 0');
> 
>         //also withdraw from linked rewards
>         for(uint i=0; i < extraRewards.length; i++){
>             IRewards(extraRewards[i]).withdraw(msg.sender, amount);
>         }
> 
>         _totalSupply = _totalSupply.sub(amount);
>         _balances[msg.sender] = _balances[msg.sender].sub(amount);
> 
>         stakingToken.safeTransfer(msg.sender, amount);
>         emit Withdrawn(msg.sender, amount);
>      
>         if(claim){
>             getReward(msg.sender,true);
>         }
> 
>         emit Transfer(msg.sender, address(0), amount);
> 
>         return true;
>     }
> 
> Here we see that if claim == true then we call `getReward`
> 
> https://etherscan.io/address/0x1204f5060be8b716f5a62b4df4ce32acd01a69f5#code#F18#L296
> 
>     function getReward(address _account, bool _claimExtras) public updateReward(_account) returns(bool){
>         uint256 reward = earned(_account);
>         if (reward > 0) {
>             rewards[_account] = 0;
>             rewardToken.safeTransfer(_account, reward);
>             IDeposit(operator).rewardClaimed(pid, _account, reward);
>             emit RewardPaid(_account, reward);
>         }
> 
>         //also get rewards from linked rewards
>         if(_claimExtras){
>             for(uint i=0; i < extraRewards.length; i++){
>                 IRewards(extraRewards[i]).getReward(_account);
>             }
>         }
>         return true;
>     }
> 
> Here we see that the ENTIRE reward balance is claimed for the vault. This presents the problem as outlined in my issue above. Let's assume that the reward for the current round is 1:1 (i.e. that each claimed BAL gives 1 AURA). Assume we have 2 users, each with half the pool. Now 100 tokens are claimed in this round, which means each user is owed 50 AURA. After some amount of rounds, the reward is now 1:0.5 (i.e. that each claimed BAL gives 1 AURA). Now when user A withdraws instead of being paid 100 AURA for that round they will instead only be paid 50 AURA and they will lose the other 50 since it won't be claimable. This is because it always uses the most recent exchange rate instead of the rate at which it was claimed.
> 
> 

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**Shogoki**

@Gornutz What do you think about it? 
I think it is a valid Medium.

**Gornutz**

Seems directionally correct and valid from the parts of the POC provided. 

**IAm0x52**

The current AURA APR for pools are high double digit to triple digit returns. Additionally AURA is distributed over [~8 years](https://docs.aura.finance/aura/usdaura/distribution) and there are [500 cliffs](https://etherscan.io/address/0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF#code#F1#L25) over that period. This makes the average cliff ~6 days. Unless every single user withdraws and redeposits each 6 day period (which is prohibitively expensive due to gas costs) this loss cannot be avoided. Given the almost certainty of the loss and the substantial amount these users stand to lose due to the high APRs and leveraged nature of the system, I believe this should be high risk rather than medium.

**hrishibhat**

Result:
High
Unique 
After further review considering this to be a high based on the comments above 

**sherlock-admin2**

Escalations have been resolved successfully!

Escalation status:
- [IAm0x52](https://github.com/sherlock-audit/2023-07-blueberry-judging/issues/109/#issuecomment-1694743790): accepted
