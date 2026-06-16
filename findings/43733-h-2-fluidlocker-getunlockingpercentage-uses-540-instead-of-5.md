---
tags:
  - lang/solidity
  - sector/streaming
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Superfluid]]"
auditors:
  - "[[0x73696d616f]]"
  - "[[Drynooo]]"
  - "[[merlinboii]]"
  - "[[zxriptor]]"
report: "https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging"
genome:
  - "[[underflow]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# H-2: `FluidLocker::_getUnlockingPercentage()` uses 540 instead of `540 days` leading to stuck funds as the unlocking percentage will be bigger than `100%` and underflow

- id: 43733
- impact: HIGH
- protocol: [[Superfluid]] Locking Contract
- reporter: Drynooo (Sherlock)
- source: N/A

## Summary


The report discusses a bug found in the Superfluid locking contract, where the function _getUnlockingPercentage() incorrectly uses the number 540 instead of 540 days, leading to a large error and potential underflow. This can result in users being unable to unlock their funds or being forced to take a penalty. The root cause is identified as using 540 instead of 540 days in line 388 of the contract. The impact is that users may have their funds stuck or be forced to take a penalty. A fix for this issue has been included in a pull request by the protocol team. 

## Details

Source: https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging/issues/21 

## Found by 
0x73696d616f, Drynooo, merlinboii, zxriptor
### Summary

[FluidLocker::_getUnlockingPercentage()](https://github.com/sherlock-audit/2024-11-superfluid-locking-contract/blob/main/fluid/packages/contracts/src/FluidLocker.sol#L384) calculates the amount to unlock when unvesting via the `FluidLocker`. It incorrectly uses `540` instead of `540 days`, yielding a massive error such that the unlocking percentage will be much bigger than `10_000` and underflow.
```solidity
function _getUnlockingPercentage(uint128 unlockPeriod) internal pure returns (uint256 unlockingPercentageBP) {
    unlockingPercentageBP = (
        _PERCENT_TO_BP
            * (
                ((80 * _SCALER) / Math.sqrt(540 * _SCALER)) * (Math.sqrt(unlockPeriod * _SCALER) / _SCALER)
                    + 20 * _SCALER
            )
    ) / _SCALER;
}
```

Note: due to other bugs in the calculation it will not revert.

### Root Cause

In `FluidLocker:388` it uses `540` instead of `540 days`.

### Internal pre-conditions

None.

### External pre-conditions

None.

### Attack Path

1. User unlocks their Fluid from the `FluidLocker`, but it reverts because of the mentioned underflow. The funds within the locker will be stuck unless the user instantly unlocks and takes a `80%` penalty.

### Impact

User is forced to take a `80%` penalty or have the funds stuck.

### PoC

The calculation is presented in the summary. Essentially, as `540` is used in the denominator, much smaller than the correct `540 days` (which is the maximum unlock period, when the percentage becomes `100%`), the value will be much bigger than `10_000`.

As the unlocking percentage is bigger than `10_000`, the unlock flow rate
```solidity
unlockFlowRate = (globalFlowRate * int256(_getUnlockingPercentage(unlockPeriod))).toInt96()
            / int256(_BP_DENOMINATOR).toInt96();
```
will be bigger than the global flow rate, so it reverts when calculating the tax flow rate `taxFlowRate = globalFlowRate - unlockFlowRate;`.

### Mitigation

Use `540 days` instead of `540`.



## Discussion

**0xPilou**

Fix for this issue is included in the following PR : https://github.com/superfluid-finance/fluid/pull/6

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/superfluid-finance/fluid/pull/6
