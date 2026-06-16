---
tags:
  - lang/solidity
  - sector/stable
  - sector/staking
  - sector/staking-pool
  - has/github
  - severity/high
protocol: "[[Coinflip]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[use-reentrancy-guard]]"
---
# [H-03] Users can potentially steal other user's staking rewards

- id: 55486
- impact: HIGH
- protocol: Coinflip_2025-02-05
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Coinflip-security-review_2025-02-05.md

## Summary


This bug report describes an issue with the `Staking` function in a smart contract. The severity of the bug is considered high, with a medium likelihood of occurrence. 

The issue occurs when a user calls the `stake()` function, which is supposed to deposit a certain amount of tokens and update the user's `stakedBalance` accordingly. However, the code does not properly update the `stakedBalance` and can lead to incorrect calculations when the user decides to `unstake()` their tokens. 

For example, if a user named Alice deposits 100 USDC, her `stakedBalance` should be 100 and the total contract balance should also be 100. However, if the contract balance increases to 200 and Alice decides to unstake, she will receive 200 USDC instead of the intended 100 USDC. This is because the code calculates the `userShare` based on the total contract balance, which can be manipulated by later stakers. 

To fix this issue, it is recommended to calculate the `userShare` when staking to ensure that later stakers do not receive the rewards of earlier stakers. For example, if Bob stakes 400 USDC when the contract balance is 200, his `userShare` should be 200 instead of 400 to prevent him from receiving Alice's rewards. When Bob unstakes, his `userShare` will be calculated correctly and he will receive the correct amount of tokens. 

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When a user calls `Staking.stake()`, `stakedBalance` of the user is equal to the amount deposited.

```
function stake(address token, uint256 amount) external nonReentrant {
        require(acceptedTokens[token], "Token not supported");
        require(amount > 0, "Cannot stake 0");

        TokenInfo storage info = tokenInfo[token];
        info.totalStaked += amount;
>       stakedBalances[token][msg.sender] += amount;
        lastStakeTime[token][msg.sender] = block.timestamp;
>       require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Stake transfer failed");
        emit Staked(msg.sender, token, amount);
    }
```

When the user `unstakes()`, the `stakedBalance` is subtracted by calculating `userShares`:

```
 uint256 totalTokenBalance = IERC20(token).balanceOf(address(this));

>       uint256 userShare = (userStaked * totalTokenBalance) / info.totalStaked;
        require(amount <= userShare, "Cannot unstake more than share");
        uint256 fraction = (amount * 1e18) / userShare;

        // Decrease user's staked balance proportionally
>       uint256 sharesToBurn = (userStaked * fraction) / 1e18;
>       stakedBalances[token][msg.sender] -= sharesToBurn;
>       info.totalStaked -= sharesToBurn;

        // Transfer amount to user
        require(IERC20(token).transfer(msg.sender, amount), "Unstake transfer failed");
```

For example, if Alice deposits 100 USDC, her `stakedBalance` will be 100 and the total contract balance will be 100. Let's say the total contract balance of USDC increases to 200, when Alice calls `unstake()`, she will get back 200 USDC since her `userShare` will become 200e6:

```
Alice calculation
userShare = 100e6 * 200e6 / 100e6 = 200e6
amount = 200e6
fraction = 200e6 * 1e18 / 200e6 = 1e18
sharesToBurn = 100e6 * 1e18 / 1e18 = 100e6
stakedBalance = 100e6 - 100e6 = 0
totalStaked = 100e6 - 100e6 = 0

amount transferred = 200e6
```

However, if alice decides not to unstake and someone calls `stake()` when the contract balance increases to 200, they can steal Alice rewards.

Let's say totalStaked is now 100e6 and total USDC balance is now 200e6. Bob decides to stake 400 USDC. Assuming Alice doesn't call `unstake()` or the cooldown time to unstake is low, when Bob calls unstake, he can get Alice rewards. When bob stakes 400 USDC, bob stakedBalance = 400e6, totalStaked = 500e6 and total USDC balance is 600e6

```
Bob's calculation
userShare = 400e6 * 600e6 / 500e6 = 480e6
amount = 480e6
fraction = 1e18
sharesToBurn = 400e6 * 1e18 / 1e18 = 400e6
stakedBalance = 400e6 - 400e6 = 0
totalStaked = 500e6 - 400e6 = 100e6

amount transferred = 480e6
```

Bob gets 480e6 from his 400e6 stake, and Alice stake is now worth 120e6 instead of 200e6.

## Recommendations

When staking, consider calculating the `userShare` as well to ensure that the later stakers does not gain the rewards of the earlier ones.

One example would be when Bob stakes his 400e6 USDC, the ratio is at 2:1 (totalTokenBalance / totalStakedBalance), so Bob should only get 200 stakedBalance.

When Bob unstakes, his `userShare` will be `200e6 * 600e6 / 300e6 = 400e6`
