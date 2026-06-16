---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[BOB]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/BOB-Staking-security-review_2025-10-18.md"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[account-ownership]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Bonuses obtainable without proper locking due to flawed lock period

- id: 63719
- impact: HIGH
- protocol: [[BOB]]-Staking_2025-10-18
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/BOB-Staking-security-review_2025-10-18.md

## Summary


The report discusses a bug in the BonusWrapper function where users can receive a bonus without actually locking their tokens. This can be exploited by staking with a short lock period and then staking again with a longer lock period to receive the bonus without actually locking the tokens. This can also be used to withdraw tokens immediately while still receiving the bonus. To fix this, the code should be updated to check if the user has already staked and prevent them from changing the lock period. Additionally, the unlock timestamp should be updated or extended when a user adds to their existing stake to maintain a valid lock period for all tokens. A grace period can also be added for legitimate users to add to their stake without creating timing advantages.

## Details


_Resolved_

## Severity

**Impact:** High  

**Likelihood:** Medium

## Description

`stake()` in BonusWrapper allows users to lock their tokens for a specified duration in exchange for a staking bonus.
```solidity
function stake(uint256 amount, address receiver, uint80 lockPeriod) external nonReentrant {
        // If the bonus period has ended, the lock period must be 0
        if (lockPeriod != 0 && bonusEndTime < block.timestamp) {
            revert BonusPeriodEnded();
        }

        // First transfer the user's tokens to this contract
        uint256 balanceBefore = IERC20(stakingToken).balanceOf(address(this));
        IERC20(stakingToken).safeTransferFrom(msg.sender, address(this), amount);
        uint256 actualAmount = IERC20(stakingToken).balanceOf(address(this)) - balanceBefore;

        uint256 bonus = _calculateBonus(actualAmount, lockPeriod);
        uint256 totalAmount;
        if (bonus > 0) {
            // try to claim the bonus for the user from the reward owner, revert if it fails. Reward owner needs to top up their account
            IERC20(stakingToken).safeTransferFrom(rewardOwner, address(this), bonus);
            totalAmount = amount + bonus;
            emit TokensBonus(receiver, bonus);
        } else {
            totalAmount = amount;
        }

        //staking is BobStaking
        stakingToken.approve(address(staking), totalAmount);
        staking.stake(totalAmount, receiver, lockPeriod);
    }
````

This invokes the `stake()` in BobStaking.

```solidity
function stake(uint256 _amount, address receiver, uint80 lockPeriod) external nonReentrant {
        if (_amount == 0) revert ZeroTokenStake();
        // lock period must be valid
        //this needs to be sync with the lockPeriods in BonusWrapper
        if (!_contains(lockPeriods, lockPeriod)) {
            revert InvalidLockPeriod();
        }
        // If the user already has a lock period, the lock period supplied must be the same as the existing lock period
        if (stakers[receiver].lockPeriod != 0 && stakers[receiver].lockPeriod != lockPeriod) {
            revert InconsistentLockPeriod();
        }
        if (unbondEndTimes[receiver] != 0) {
            revert UnbondAlreadyStarted();
        }

        address _stakingToken = stakingToken;

        if (stakers[receiver].amountStaked > 0) {
            _updateUnclaimedRewardsForStaker(receiver);
        } else {
            stakers[receiver].timeOfLastUpdate = uint80(block.timestamp);
            stakers[receiver].conditionIdOflastUpdate = nextConditionId - 1;
            stakers[receiver].lockPeriod = lockPeriod;
            stakers[receiver].unlockTimestamp = uint80(block.timestamp) + lockPeriod;
        }

        IERC20(_stakingToken).safeTransferFrom(_stakeMsgSender(), address(this), _amount);

        stakers[receiver].amountStaked += _amount;
        stakingTokenBalance += _amount;

        emit TokensStaked(receiver, _amount);
    }
```

If it’s the first time the user stakes, their information is stored in the `stakers` mapping. For subsequent stakes, the provided `lockPeriod` must match the existing one. However, this condition can be bypassed if the user first stakes with `lockPeriod = 0` and later stakes with a different `lockPeriod`.

```solidity
if (stakers[receiver].lockPeriod != 0 && stakers[receiver].lockPeriod != lockPeriod) {
            revert InconsistentLockPeriod();
        }
```

A user can first stake with `lockPeriod = 0` and later stake again with a different `lockPeriod` (e.g. `21 * 30 days`). The contract accepts the new `lockPeriod` because `stakers[receiver].lockPeriod == 0`, the check never triggers, and the function does not revert.

Since `unlockTimestamp` is only set on the first stake, users will use the initial `lockPeriod` but still receive the bonus for locking, even though they are not actually locking their tokens, as `unlockTimestamp` is only initialized during the first stake.

An attacker can exploit this by first staking with `lockPeriod = 0`, then staking again with a long lock period to obtain the maximum bonus without actually locking their tokens.

They can still withdraw immediately via `instantWithdraw()` (subject only to the penalty), effectively gaining the bonus while avoiding the intended lock. Alternatively, they can call `unbond()` and wait for the unbonding period to withdraw, achieving the same advantage without ever truly locking their tokens.

Additionally, this flaw also allows other timing-related exploits observed in similar staking scenarios:

* A user can stake a minimal amount with the shortest lock period (e.g., 3 months) and near the end of this lock, stake a large amount for the same period. Since the unlock time is not updated, they can withdraw almost immediately while still receiving a large bonus.
* A user can stake a dust amount for a very long lock (e.g., 21 months), wait for it to expire, then stake a large amount again with the same `lockPeriod` and instantly withdraw, draining the `rewardOwner`.
* If the admin later uses `BonusWrapper::setBonusEndTime()`, attackers can deliberately keep small stakes active to remain eligible and time their large stakes to maximize bonuses unfairly.

To reproduce the main issue, copy the following POC into `BonusWrapper.t.sol`.

```solidity
function test_FreeBonusWithoutLockingTokens() public {
        vm.startPrank(staker);

        stakingToken.approve(address(bonusWrapper), type(uint256).max);

        //lockPeriod = 0
        bonusWrapper.stake(400 * 10 ** 18, staker, 0);

        //lockPeriod = 21 * 30 days
        vm.expectEmit();
        emit BonusWrapper.TokensBonus(staker, 800 * 10 ** 18);
        bonusWrapper.stake(400 * 10 ** 18, staker, 21 * 30 days);

        stakeContract.unbond();
    }
```

## Recommendations

To solve the problem, check if the user has `amountStaked > 0`, and if `lockPeriod == 0`, prevent setting a different `lockPeriod`.

```solidity
if (stakers[receiver].lockPeriod != 0 && stakers[receiver].lockPeriod != lockPeriod || stakers[receiver].amountStaked > 0 &&  stakers[receiver].lockPeriod != lockPeriod) {
            revert InconsistentLockPeriod();
        }
```

Additionally, ensure that when an existing staker deposits more with a non-zero `lockPeriod`, the `unlockTimestamp` is updated or extended to maintain a valid locking period for all staked tokens.
Optionally, a short grace period could be introduced for legitimate users to add to existing stakes without creating timing advantages.
