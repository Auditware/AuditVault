---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/token
protocol: "[[FactoryDAO]]"
auditors:
  - "[[IllIllI]]"
report: "https://code4rena.com/reports/2022-05-factorydao"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# [H-02] DoS: Blacklisted user may prevent `withdrawExcessRewards()`

- id: 42551
- impact: HIGH
- protocol: [[FactoryDAO]]
- reporter: IllIllI (Code4rena)
- source: https://code4rena.com/reports/2022-05-factorydao

## Summary


The bug report discusses a potential issue in the code of a contract called PermissionlessBasicPoolFactory. If one user is unable to receive funds in any of the reward tokens or the deposit token, they will not be able to withdraw their funds. This could lead to the owner of the contract being unable to claim any excess rewards. The report suggests implementing a solution to allow the owner to withdraw excess rewards after a certain period of time. The issue has been confirmed and resolved by the team working on the contract. 

## Details

_Submitted by AuditsAreUS_

<https://github.com/code-423n4/2022-05-factorydao/blob/db415804c06143d8af6880bc4cda7222e5463c0e/contracts/PermissionlessBasicPoolFactory.sol#L242-L256>

<https://github.com/code-423n4/2022-05-factorydao/blob/db415804c06143d8af6880bc4cda7222e5463c0e/contracts/PermissionlessBasicPoolFactory.sol#L224-L234>

### Impact

If one user becomes blacklisted or otherwise cannot be transferred funds in any of the rewards tokens or the deposit token then they will not be able to call `withdraw()` for that token.

The impact of one user not being able to call `withdraw()` is that the owner will now never be able to call `withdrawExcessRewards()` and therefore lock not only the users rewards and deposit but also and excess rewards attributed to the owner.

Thus, one malicious user may deliberately get them selves blacklisted to prevent the owner from claiming the final rewards. Since the attacker may do this with negligible balance in their `deposit()` this attack is very cheap.

### Proof of Concept

It is possible for `IERC20(pool.rewardTokens[i]).transfer(receipt.owner, transferAmount);` to fail for numerous reasons. Such as if a user has been blacklisted (in certain ERC20 tokens) or if a token is paused or there is an attack and the token is stuck.

This will prevent `withdraw()` from being called.

```solidity
        for (uint i = 0; i < rewards.length; i++) {
            pool.rewardsWeiClaimed[i] += rewards[i];
            pool.rewardFunding[i] -= rewards[i];
            uint tax = (pool.taxPerCapita * rewards[i]) / 1000;
            uint transferAmount = rewards[i] - tax;
            taxes[poolId][i] += tax;
            success = success && IERC20(pool.rewardTokens[i]).transfer(receipt.owner, transferAmount);
        }

        success = success && IERC20(pool.depositToken).transfer(receipt.owner, receipt.amountDepositedWei);
        require(success, 'Token transfer failed');
```

Since line 245 of `withdrawExcessRewards()` requires that `require(pool.totalDepositsWei == 0, 'Cannot withdraw until all deposits are withdrawn');`, if one single user is unable to withdraw then it is impossible for the owner to claim the excess rewards and they are forever stuck in the contract.

### Recommended Mitigation Steps

Consider allowing `withdrawExcessRewards()` to be called after a set period of time after the pool end if most users have withdrawn or some similar criteria.

**[illuzen (FactoryDAO) confirmed, disagreed with severity and commented](https://github.com/code-423n4/2022-05-factorydao-findings/issues/57#issuecomment-1122022055):**
 > Kind of a duplicate, but I like this angle better. However, malicious token contracts are explicitly considered in the contract as an acceptable risk. Will probably just wrap transfers in a try catch

**[illuzen (FactoryDAO) resolved](https://github.com/code-423n4/2022-05-factorydao-findings/issues/57#issuecomment-1145530196):**
 > https://github.com/code-423n4/2022-05-factorydao/pull/2

**[Justin Goro (judge) commented](https://github.com/code-423n4/2022-05-factorydao-findings/issues/57#issuecomment-1154659729):**
 > Maintaining severity as deposit tokens at risk.



***
