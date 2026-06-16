---
tags:
  - lang/solidity
  - sector/dex
  - sector/farm
  - sector/options
  - sector/stable
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - trigger/low-liquidity
protocol: "[[Ouroboros]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ouroboros-security-review_2025-06-30.md"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[trigger/low-liquidity]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# [H-01] Stakers may fail to claim all incentives

- id: 63445
- impact: HIGH
- protocol: Ouroboros_2025-06-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ouroboros]]-security-review_2025-06-30.md

## Summary


The report discusses a bug in the Uniswap v3 staker where the owner can create one type of incentive that only rewards LP holders who have a fixed tick range position. This is not ideal because most traders do not choose full range liquidity and it results in lower liquidity efficiency. This means that LP holders who choose to stake their positions in this incentive will miss out on potential swap fees and may not want to participate. The report recommends being careful when choosing a fixed range incentive and suggests that a more flexible option would be preferable for users. 

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In UniswapV3Staker, the owner can create one incentive. There is one kind of incentive that we have a fixed tick range position. LP holders can earn some incentives on condition that their position's range should match this fixed range. According to the readme, the common use is `full-range positions(-887220 - 887220)`.

In Uniswap v3, most traders will not choose the full range liquidity. Because full range liquidity will have very low liquidity efficiency.

As one LP holder, the possible profit with this v3 staker includes swap fees, incentive rewards, and possible Impermanent Loss. Compared with one full range liquidity, users prefer to provide liquidity with one proper liquidity range, because the same amount of assets will provide much higher liquidity than full range liquidity to earn more swap fees.

If we create one incentive with one full-range position, stakers have to give up lots of swap fees to earn the related incentive rewards. This will cause more users will not to choose to stake their positions. This will have some side effects for stakers.

For example:
1. The owner creates one full range incentive with 100 DAI rewards.
2. Alice deposits 1000 USDC/1000 USDT liquidity to USDC/USDT pool with full range
3. Bob deposits 1000 USDC/1000 USDT liquidity to USDC/USDT pool with a price range 0.98 - 1.02.
4. Alice stakes her position in the v3 staker.

Bob's liquidity will be around 100x than Alice. Let's assume the actual price is always in the range of 0.98 - 1.02. 
1. Alice's profit: less than 1% swap fees + less than 1 DAI.
2. Bob's profit: more than 99% swap fees.

```solidity
    function decreaseLiquidity(
        uint256 tokenId,
        uint128 liquidity,
        uint256 amount0Min,
        uint256 amount1Min,
        uint256 deadline
    ) external override returns (uint256 amount0, uint256 amount1) {
        // Only the position's owner can decrease liquidity.
        require(deposits[tokenId].owner == msg.sender, 'E020');
    
@>        require(!deposits[tokenId].buildsPOL, 'E024');
    }
    function withdrawToken(
        uint256 tokenId,
        address to,
        bytes memory data
    ) external override {
        // Tokens with POL cannot be withdrawn.
@>        require(!deposit.buildsPOL, 'E024');
    }
    function _calculateAndDistributeRewards(
        IncentiveKey memory key,
        Deposit memory deposit,
        bytes32 incentiveId,
        uint160 secondsPerLiquidityInsideInitialX128,
        uint32 secondsInsideInitial,
        uint128 liquidity
    ) private returns (uint256) {
        Incentive storage incentive = incentives[incentiveId];
        (, uint160 secondsPerLiquidityInsideX128, uint32 secondsInside) =
                                key.pool.snapshotCumulativesInside(deposit.tickLower, deposit.tickUpper);
        ...
    }
```

## Recommendations
Refer to uniswap v3 staker, anyone would like to join this incentive because users can choose their wished liquidity range, besides that, LP holders can have some extra incentive via v3 staker.

If we want to choose one fixed range incentive, we should choose this fixed range carefully. Full-range liquidity is not a proper one.
