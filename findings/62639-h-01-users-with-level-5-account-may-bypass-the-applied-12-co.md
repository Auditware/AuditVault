---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Terplayer]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BVT-Staking&Distribution-Security-Review.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# [H-01] Users with Level 5 Account May Bypass the Applied 12% Commissions

- id: 62639
- impact: HIGH
- protocol: [[Terplayer]] Bvt Staking&Distribution
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Terplayer-BVT-Staking&Distribution-Security-Review.md

## Summary


Summary: 

The bug report describes a high risk issue in the code where a user with a Level 5 account can exploit the system to pay only 2% commission instead of the required 12%. This results in the user stealing 12% of the commissions from the protocol. The affected code is in the deposit function and the team recommends not allowing new accounts to directly attach to Level 5 accounts to prevent this issue. The team has acknowledged the report.

## Details


## Severity

High Risk

## Description

When having a Level 5 account, a user is obligated to pay a 12% commission rate to the `recipientComission` address. Now, let's imagine the following scenario:

1. The user has such a Level 5 account, which is connected only to other Level 5 accounts or to accounts with a level equal to or lower than that of the child and makes a new account specifying the Level 5 account as his parent
2. The user deposits all of his assets from the newly created account, hence paying the 12% commission rate to his own Level 5 account, resulting in him practically paying only 2% commissions (if `fiveLevelRecipientComission` address is different from `address(0)`)
3. As a result of this, the Level 5 user robs the protocol of its commissions and generates 12% more assets than he should

## Location of Affected Code

File: [src/BvtRewardVault.sol#L96](https://github.com/batoshidao/berabtc-vault-token/blob/c68f412b3c7dfd99d3f6302a42bdf772ededb2a3/src/BvtRewardVault.sol#L96)

```solidity
function deposit(uint256 amount) external nonReentrant {
  // code
  for (uint256 i = 0; i < commissionParents.length; i++) {
      UserInfo memory parentInfo = commissionParents[i];
      if (parentInfo.user == address(0)) {
          continue;
      }
      uint256 commission = bondDealerContract.getCommission(
          uint256(parentInfo.level)
      );

      uint256 commissionAmount = (amount *
          (commission - totalHigherLevelCommissionAmountRate)) / 10000;
      if (commissionAmount > 0) {
          if (!isUserInDelegatedStakeList[msg.sender][parentInfo.user]) {
              isUserInDelegatedStakeList[msg.sender][
                  parentInfo.user
              ] = true;
              delegatedStakeUsers[msg.sender].push(parentInfo.user);
          }
          _delegateStake(msg.sender, parentInfo.user, commissionAmount);
          userAmount -= commissionAmount;
          totalHigherLevelCommissionAmountRate = commission;
      }
  }

  if (recipientComission != address(0)) {
      uint256 totalCommissionAmountRate = bondDealerContract
          .getTotalCommission();
      if (
          totalCommissionAmountRate > totalHigherLevelCommissionAmountRate
      ) {
          uint256 recipientCommissionAmount = (amount *
              (totalCommissionAmountRate -
                  totalHigherLevelCommissionAmountRate)) /
              MAX_COMMISSION_RATE;
          if (
              !isUserInDelegatedStakeList[msg.sender][recipientComission]
          ) {
              isUserInDelegatedStakeList[msg.sender][
                  recipientComission
              ] = true;
              delegatedStakeUsers[msg.sender].push(recipientComission);
          }
          _delegateStake(
              msg.sender,
              recipientComission,
              recipientCommissionAmount
          );
          userAmount -= recipientCommissionAmount;
      }
  }
  // code
}
```

## Impact

User steals the 12% commissions from the protocol

## Recommendation

Don't allow new accounts to directly attach to Level 5 accounts, as this is a possible outcome of the situation. Allow them to attach to accounts with 1-2 levels higher than their own.

## Team Response

Acknowledged.
