---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - platform/shieldify
protocol: "[[Beraji Ko]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-04] Owner Cannot Claim Token Fees

- id: 49516
- impact: HIGH
- protocol: Beraji Ko
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Beraji-KO-Security-Review.md

## Summary


The bug report states that there is an issue with the `claimTokenFee()` function in the `StakingKo.sol` file of the StakingKo contract. This function allows the owner to claim fees from each lock that has a different `tokenFeeRate`. However, there is a bug that causes the `lock.tokenFeeBalance` to be reset to 0 before the transfer is made, resulting in the owner not being able to claim the fees. The bug has been classified as high risk. The recommended solution is to cache the `tokenFeeBalance` and use the cached value for the transfer. The team has responded that the bug has been fixed.

## Details

## Severity

High Risk

## Description

Each lock can have a different `tokenFeeRate` that takes from the staked amount. The owner can claim these amounts via `claimTokenFee()`.

The issue is that lock.tokenFeeBalance gets reset to 0 and then the transfer is made:

```solidity
lock.tokenFeeBalance = 0;
pool.stakingToken.safeTransfer(msg.sender, lock.tokenFeeBalance);
```

As a result, the owner cannot claim the fees.

## Location of Affected Code

File: [contracts/StakingKo.sol](https://github.com/Beraji-Labs/staking-ko/blob/290103f27365cc419fe0a934feaf5f18e6e12d3a/contracts/StakingKo.sol)

```solidity
function claimTokenFee(uint256 _poolId) external payable onlyOwner {
    Pool storage pool = pools[_poolId];
    PoolLock[] storage locks = mapPoolLocks[_poolId];

    for (uint256 lId = 0; lId < locks.length; lId++) {
        PoolLock storage lock = locks[lId];
        if (lock.tokenFeeBalance != 0) {
            lock.tokenFeeClaimed += lock.tokenFeeBalance;
@>          lock.tokenFeeBalance = 0;
@>          pool.stakingToken.safeTransfer(msg.sender, lock.tokenFeeBalance);
        }
    }
}
```

## Impact

The owner cannot claim the staking fees.

## Recommendation

Cache tokenFeeBalance and use the cached value for the transfer.

## Team Response

Fixed.
