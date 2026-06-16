---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - sector/staking-pool
  - platform/shieldify
  - has/github
  - severity/high
  - vuln/logic/reward-calculation
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Csx]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md"
genome:
  - "[[reward-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# [H-01] Unclaimed User Staking Rewards Are Going to Get Lost on Each Call to `stake()` Function in `StakedCSX` Contract

- id: 44005
- impact: HIGH
- protocol: [[Csx]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/CSX-Security-Review.md

## Summary


The `stake()` function in `StakedCSX.sol` is causing users to lose their unclaimed rewards when they stake additional `CSX` tokens. This is because the function is incorrectly calling `_updateRewardRate()` for all three reward tokens, which only resets the reward rates for the caller. To fix this, the team recommends replacing the `_updateRewardRate()` calls with a single `_claimToCredit()` call, which both updates the reward rates and saves the rewards for later claiming. The team has already fixed this issue by changing the reward logic and removing the `_claimToCredit()` function.

## Details

## Severity

High Risk

## Description

The current implementation of the `stake()` function in `StakedCSX.sol` calls `_updateRewardRate()` internally for all three reward tokens. This is incorrect as it will just reset the reward rates of the caller, leading to the loss of all of their unclaimed staking rewards.

## Impact

Users are going to lose all of their unclaimed rewards whenever they stake additional `CSX` tokens.

## Location of Affected Code

File: [StakedCSX.sol#L92-L94](https://github.com/csx-protocol/csx-contracts/blob/4a066ae2229756518bfa3da1455c2ac646523a88/contracts/CSX/StakedCSX.sol#L92-L94)

```solidity
/**
* @notice Stakes the user's CSX tokens
* @dev Mints sCSX & Sends the user's CSX to this contract.
* @param _amount The amount of tokens to be staked
*/
function stake(uint256 _amount) external nonReentrant {
  if (_amount == 0) {
    revert AmountMustBeGreaterThanZero();
  }
  _updateRewardRate(msg.sender, address(TOKEN_WETH));
  _updateRewardRate(msg.sender, address(TOKEN_USDC));
  _updateRewardRate(msg.sender, address(TOKEN_USDT));
  _mint(msg.sender, _amount);
  TOKEN_CSX.safeTransferFrom(msg.sender, address(this), _amount);
  emit Stake(msg.sender, _amount);
}
```

## Recommendation

Replace the `_updateRewardRate()` calls with a single `_claimToCredit()` call, which both updates the reward rates of the user and saves their rewards to the credit mapping for later claiming:

```diff
function stake(uint256 _amount) external nonReentrant {
  if (_amount == 0) {
    revert AmountMustBeGreaterThanZero();
  }
- _updateRewardRate(msg.sender, address(TOKEN_WETH));
- _updateRewardRate(msg.sender, address(TOKEN_USDC));
- _updateRewardRate(msg.sender, address(TOKEN_USDT));
+ _claimToCredit(msg.sender);
  _mint(msg.sender, _amount);
  TOKEN_CSX.safeTransferFrom(msg.sender, address(this), _amount);
  emit Stake(msg.sender, _amount);
}
```

## Team Response

Fixed by changing the reward logic and removing the `_claimToCredit()`.
