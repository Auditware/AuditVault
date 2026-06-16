---
tags:
  - lang/solidity
  - sector/dex
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[BMX]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# H-8: `Voter::finalize()` incorrect rewards distribution due to transfering WETH before calling `distributor::setTokensPerInterval()`

- id: 62815
- impact: HIGH
- protocol: [[BMX]] Deli Swap
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


This bug report is about an incorrect order of operations in the Voter contract of the BMX Deli Swap protocol. The Voter contract transfers WETH and then calls a function called setTokensPerInterval, which sets the reward rate for the transferred WETH. This means that the previous reward rate is applied for the transferred WETH, resulting in an instantaneous increase in rewards that can be exploited and stolen. This is because the setTokensPerInterval function calls another function called updateRewards, which then calls a function called distribute. Since the WETH is already transferred before setTokensPerInterval is called, the rewards are instantly distributed and there won't be enough rewards for the next week. This allows attackers to steal rewards meant for honest stakers. The root cause of this bug is that the WETH is transferred before calling setTokensPerInterval. The impact of this bug is stolen rewards. The protocol team has fixed this issue in the latest code updates. To prevent this bug, the protocol team recommends calling setTokensPerInterval before transferring the WETH.

## Details


Source: https://github.com/sherlock-audit/2025-09-bmx-deli-swap-judging/issues/242 

## Found by 
0x73696d616f

### Summary

`Voter::finalize()` transfers the WETH, and then calls `distributor.setTokensPerInterval()`. However, this order of operations is incorrect and it will lead to the previous reward rate being applied for the transferred WETH, doing an instantaneous rewards increase that will be arbitraged and stolen.

As can be seen below, `RewardsDistributor::setTokensPerInterval()` calls `RewardTracker::updateRewards()`, which calls `RewardsDistributor::distribute()`. Now, if `pendingRewards()` will apply the last `tokensPerInterval`, accrue for the last time called, and send to users if there is enough balance. Due to having sent the WETH before calling `setTokensPerInterval()`, it will instantly distribute this rewards as soon as the function is called, and there won't be enough rewards for the next week. Thus, past stakers (and bots or attackers that knew about this) will steal instant rewards, and honest stakers will not collect them over the full week.

[**RewardsDistributor**](https://basescan.org/address/0x0259083181ae54730f4fbb1c174a53e21bce5266#code)
```solidity
    function setTokensPerInterval(uint256 _amount) external onlyAdmin {
        require(lastDistributionTime != 0, "RewardDistributor: invalid lastDistributionTime");
        IRewardTracker(rewardTracker).updateRewards();
        tokensPerInterval = _amount;
        emit TokensPerIntervalChange(_amount);
    }

    function pendingRewards() public view override returns (uint256) {
        if (block.timestamp == lastDistributionTime) {
            return 0;
        }

        uint256 timeDiff = block.timestamp.sub(lastDistributionTime);
        return tokensPerInterval.mul(timeDiff);
    }

    function distribute() external override returns (uint256) {
        require(msg.sender == rewardTracker, "RewardDistributor: invalid msg.sender");
        uint256 amount = pendingRewards();
        if (amount == 0) { return 0; }

        lastDistributionTime = block.timestamp;

        uint256 balance = IERC20(rewardToken).balanceOf(address(this));
        if (amount > balance) { amount = balance; }

        IERC20(rewardToken).safeTransfer(msg.sender, amount);

        emit Distribute(amount);
        return amount;
    }
```

[**RewardTracker**](https://basescan.org/address/0x38E5be3501687500E6338217276069d16178077E#code)
```solidity
    function updateRewards() external override nonReentrant {
        _updateRewards(address(0));
    }

    function _updateRewards(address _account) private {
        uint256 blockReward = IRewardDistributor(distributor).distribute();
    ...
```

### Root Cause

In `Voter.sol:262`, it transfers WETH before calling [setTokensPerInterval()](https://github.com/sherlock-audit/2025-09-bmx-deli-swap/blob/main/deli-swap-contracts/src/Voter.sol#L263).

### Internal Pre-conditions

None

### External Pre-conditions

None

### Attack Path

1. Admin finalizes an epoch, sends WETH and sets the tokens per interval to distribute this amount of WETH over 1 week.
2. Due to the logic above, part of this WETH, if not all, will be consumed instantly and rewards won't be distributed over the full week.

### Impact

Stolen rewards.

### PoC

_No response_

### Mitigation

First call setTokensPerInterval(), then transfer the WETH.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/morphex-labs/deli-swap-contracts/pull/20
