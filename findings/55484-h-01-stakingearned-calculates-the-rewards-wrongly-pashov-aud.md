---
tags:
  - lang/solidity
  - sector/gaming
  - sector/staking
  - has/github
  - severity/high
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-01] Staking.earned calculates the rewards wrongly

- id: 55484
- impact: HIGH
- protocol: Coinflip_2025-02-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md

## Summary


This bug report discusses a problem with the `Staking.giveReward()` function which is used to distribute rewards to users. The issue is that the function calls another function called `earned()` which calculates rewards for users, even if they have a negative balance. This means that users could potentially receive rewards even if the staking contract has lost money. The report recommends adding a check in the `earned()` function to return 0 if the staking contract has lost money, to prevent users from receiving rewards in this scenario.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`Staking.giveReward()` is called by the owner or manager to distribute rewards to users. The function calls `earned()`, which calculates rewards for the user even if the user is in deficit. The calculation is as such:

```
 function earned(address user, address token) public view returns (uint256) {
        require(acceptedTokens[token], "Token not supported");
        TokenInfo storage info = tokenInfo[token];
        if (info.totalStaked == 0) {
            return 0;
        }
        uint256 totalTokenBalance = IERC20(token).balanceOf(address(this));

        // Multiply by 1e18 first to maintain precision
>       uint256 userShare = (stakedBalances[token][user] * 1e18 / info.totalStaked) * totalTokenBalance / 1e18;

        // If contract has lost balance, return user share of remaining balance
        if (totalTokenBalance < info.totalStaked) {
            return userShare;
        }

        // Otherwise return the difference between user's share and their staked balance
        return userShare > stakedBalances[token][user] ? userShare - stakedBalances[token][user] : 0;
    }
```

`earned()` takes the totalToken balance, staked balance of the user, and totalStaked to calculate the rewards.

Let's say there are 100 tokens in the contract, and 100 staked. Alice stakes 10 tokens. Assume 6 decimal tokens.

There are two scenarios from here. First, the staking contract earns token (by users losing the game and the bet amount funneling into the staking contract)

There is now 120 tokens in the contract, with 100 totalStaked.

Alice userShare is now 12e6.

```
userShare = (stakedBalances[token][user] * 1e18 / info.totalStaked) * totalTokenBalance / 1e18;
userShare = 10e6 * 1e18 / 100e18 * 120e18 / 1e18 = 12e6
```

Since `totalTokenBalance (120) > totalStaked (100)`, `earned()` returns 2e6. Alice reward is 2e6 in this scenario

```
return userShare > stakedBalances[token][user] ? userShare - stakedBalances[token][user] : 0;
return 12e6 > 10e6 ? 12 - 10 = 2
```

Now, if the scenario is flipped and there is now 80 tokens in the contract with 100 totalStaked:

Alice userShare is now 8e6

```
userShare = (stakedBalances[token][user] * 1e18 / info.totalStaked) * totalTokenBalance / 1e18;
userShare = 10e6 * 1e18 / 100e18 * 80e18 / 1e18 = 8e6
```

Since `totalTokenBalance (80) < totalStaked (100)`, return `userShare` which is 8e6

Even though the staking contract lost tokens, Alice reward is now 8e6.

## Recommendations

Not sure what `giveReward()` does exactly or when it would be called, since it is access controlled, but if `giveReward()` is called, it will still reward users when the staking contract loses money.

Consider returning 0 if `totalTokenBalance < info.totalStaked`

```
        // If contract has lost balance, return user share of remaining balance
        if (totalTokenBalance < info.totalStaked) {
            return 0;
        }
```
