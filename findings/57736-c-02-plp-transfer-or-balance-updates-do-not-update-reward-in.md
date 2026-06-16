---
tags:
  - lang/solidity
  - sector/farm
  - has/github
  - severity/high
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[first-deposit]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [C-02] PLP transfer or balance updates do not update reward index

- id: 57736
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


This bug report discusses a problem with the reward calculation in the code of a protocol. The calculation depends on two factors, the user's PLP token balance and their reward index. However, the reward index is only updated in certain scenarios, which could lead to incorrect accounting for rewards when users make changes to their PLP token balance, such as through partial liquidity withdrawals. This could potentially allow malicious users to manipulate their rewards by transferring a large amount of PLP tokens to themselves before claiming rewards. The report recommends implementing a system to update the reward index whenever PLP token balances change. 

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

[Link](https://github.com/Hyperhyperfi/protocol/blob/212acfdcd4066334ff5ea06ce46b0bbca7ca212f/src/core/pool/facets/LiquidityFacet.sol#L397-L408)

The reward calculation in `_getPendingRewards` depends on two key factors: the user's PLP token balance and their reward index (`usrRwdIndexQ128`).

```solidity
    function _getPendingRewards(address token, address user) internal view returns (uint256) {
        RewardInfo storage rewards = PoolStorage.layout().ledger.state.rewardsByToken[token];
        ILPToken plp_ = ILPToken(PoolStorage.layout().setUp.base.plp);
        uint256 lpBalance = plp_.balanceOf(user);
        uint8 plpDecimals = IERC20Metadata(PoolStorage.layout().setUp.base.plp).decimals();
        uint8 tokenDecimals = IERC20Metadata(token).decimals();

        uint256 rewardIndexQ128 = PoolStorage.layout().ledger.state.usrRwdIndexQ128[token][user];
        rewardIndexQ128 = rewards.rewardsPerLPQ128 - rewardIndexQ128;

        return lpBalance.mulDiv(rewardIndexQ128, Q128).toDecimals(plpDecimals, tokenDecimals);
    }
```

While the PLP balance can change through various operations (`addLiquidity`, `withdrawLiquidity`, or direct token transfers), the reward index is only updated in specific scenarios. This could lead to incorrect accounting for the rewards during `PLP Token Transfers Or Other Balance Updates`(like `partial liquidity withdraw`).

```solidity
// Current update points for usrRwdIndexQ128:
// 1. First deposit (_initRewardIndex)
// 2. Full exit (_initRewardIndex)
// 3. Manual claim (_claimRewards)
function _updateLpRewardIndex(address token, address user) internal {
    PoolStorage.layout().ledger.state.usrRwdIndexQ128[token][user] =
        PoolStorage.layout().ledger.state.rewardsByToken[token].rewardsPerLPQ128;
}
```

In such cases, users can manipulate their rewards by transferring `PLP` tokens without updating their `usrRwdIndexQ128`:

- A malicious user could transfer a large amount of PLP tokens to themselves before claiming rewards.
- The calculation `lpBalance.mulDiv(rewardIndexQ128, Q128)` would use the inflated balance.

## Recommendations

Implement a hook/accounting system to update the reward index whenever PLP token balances change.
