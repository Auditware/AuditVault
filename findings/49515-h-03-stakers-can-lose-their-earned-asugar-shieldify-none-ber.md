---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - sector/token
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Beraji Ko]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-03] Stakers Can Lose Their Earned `aSugar`

- id: 49515
- impact: HIGH
- protocol: Beraji Ko
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md

## Summary


The bug report discusses a bug in the staking contract, where users who stake a second time without calling `fullyClaimReward()` will lose their accumulated unclaimed `aSugar`. This can also result in someone else staking on behalf of the user if there is an active allowance. The bug is caused by the `cheque.lastPrintedAt` variable being updated in the `deligateStake()` function, causing the accumulated aSugar from previous stakes to be lost. The impact of this bug is that stakers can lose their unclaimed aSugar rewards. The recommendation is to calculate the accumulated aSugar from previous stakes in the `deligateStake()` function and mint it together with the current stake. The team has confirmed that the bug has been fixed.

## Details

## Severity

High Risk

## Description

Users who stake a second time without calling `fullyClaimReward()` will lose their accumulated unclaimed `aSugar`. Furthermore, the second stake could be executed by somebody else via `deligateStake()` if there is an active allowance.

Example:

The user stakes 100e18 of a token. He gets minted X amount of aSugar based on lock leverage and stakeToken price.

`cheque.lastPrintedAt` gets updated to `block.timestamp`. This is very important since the accumulation of aSugar is based on the staked amount and the difference between the `block.timestamp` when calling `fullyClaimReward()` and `cheque.lastPrintedAt`.

Since `cheque.lastPrintedAt` gets updated in `deligateStake()` and the accumulated amount from previous stakes is not minted then the user loses this accumulation.

Flow:

1. User stakes
2. Time passes
3. User stakes again
4. Calls `fullyClaimReward()` but the aSugar generated between both stakes is lost.

## Location of Affected Code

File: [contracts/StakingKo.sol](https://github.com/Beraji-Labs/staking-ko/blob/290103f27365cc419fe0a934feaf5f18e6e12d3a/contracts/StakingKo.sol)

```solidity
function deligateStake(
    address _account,
    uint256 _poolId,
    uint256 _lockId,
    uint256 _amount,
    uint256 _stPrice,
    uint256 _expriedTime,
    bytes memory _sig
)
    public
    payable
    validPool(_poolId)
    poolIsActive(_poolId)
    validPoolLock(_poolId, _lockId)
    updatePoolPrice(_poolId, _stPrice, _expriedTime, _sig)
    updateReward(_poolId, _account)
    payNativeFee
    whenNotPaused
{
    require(_amount != 0, "amount = 0");
    Pool storage pool = pools[_poolId];
    pool.stakingToken.safeTransferFrom(_account, address(this), _amount);

    PoolLock memory lock = mapPoolLocks[_poolId][_lockId];

    uint256 stakeAmount = _payTokenFee(_poolId, _lockId, _amount);
    uint256 shares = _buffAmount(_poolId, _lockId, stakeAmount);

    TokenCheque storage cheque = userTokenCheques[_poolId][_lockId][_account];
    cheque.poolId = _poolId;
    cheque.lockId = _lockId;
    cheque.shares += shares;
    cheque.stakedBalance += stakeAmount;
    cheque.lastPrintedAt = block.timestamp;

    pool.totalShares += shares;
    pool.totalStaked += stakeAmount;
    if (lock.duration == 0) pool.totalStakedLimited += stakeAmount;

    uint256 stakingTokenDecimals = ERC20(pool.stakingToken).decimals();
    uint256 tvl = (stakeAmount * pool.stPrice) / PRECISION;
    uint256 asgAmount = (tvl * 10 ** 18) / 10 ** stakingTokenDecimals;
@>  uint256 totalASugar = _buffAmount(_poolId, _lockId, asgAmount);

    _mintASugar(_poolId, _lockId, _account, totalASugar);

    emit Staked(_poolId, _account, stakeAmount, _stPrice);
}
```

## Impact

Staker can lose aSugar unclaimed rewards if he stakes again before calling `fullyClaimReward()`.

## Recommendation

Calculate the accumulated aSugar of the staker from any previous stakes in `deligateStake()` and mint this amount together with the amount of aSugar tokens that will be minted for the current call of stake.

## Team Response

Fixed.
