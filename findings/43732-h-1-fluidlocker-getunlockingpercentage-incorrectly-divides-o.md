---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/streaming
protocol: "[[Superfluid]]"
auditors:
  - "[[056Security]]"
  - "[[0x73696d616f]]"
  - "[[Drynooo]]"
  - "[[IvanFitro]]"
  - "[[Kyosi]]"
  - "[[Z3R0]]"
  - "[[ke1caM]]"
  - "[[newspacexyz]]"
  - "[[redbeans]]"
  - "[[zhenyazhd]]"
report: "https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# H-1: `FluidLocker::_getUnlockingPercentage()` incorrectly divides one of the components of the formula by `S`, leading to always having `80%` penalty

- id: 43732
- impact: HIGH
- protocol: [[Superfluid]] Locking Contract
- reporter: IvanFitro (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the `FluidLocker::_getUnlockingPercentage()` function in the Superfluid locking contract. The function incorrectly divides one of the components of the formula by `S`, resulting in a `80%` penalty for users unlocking their Fluid. This bug was found by a group of security researchers and the root cause was identified in line 388 of the code. The bug can be exploited by a user unlocking their Fluid with a duration greater than 0, causing them to suffer a significant loss. A proof of concept was provided and the fix for this issue has been included in a pull request by the protocol team.

## Details

Source: https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging/issues/20 

## Found by 
056Security, 0x73696d616f, Drynooo, IvanFitro, Kyosi, Z3R0, ke1caM, newspacexyz, redbeans, zhenyazhd
### Summary

[FluidLocker::_getUnlockingPercentage()](https://github.com/sherlock-audit/2024-11-superfluid-locking-contract/blob/main/fluid/packages/contracts/src/FluidLocker.sol#L384) calculates the percentage to unlock, which is the amount given to the user, while the remaining goes to other stakers. The formula incorrectly divides `Math.sqrt(unlockPeriod * _SCALER)` by `SCALER`:
```solidity
function _getUnlockingPercentage(uint128 unlockPeriod) internal pure returns (uint256 unlockingPercentageBP) {
    unlockingPercentageBP = (
        _PERCENT_TO_BP
            * (
                ((80 * _SCALER) / Math.sqrt(540 * _SCALER)) * (Math.sqrt(unlockPeriod * _SCALER) / _SCALER //@audit this _SCALER should not be here)
                    + 20 * _SCALER
            )
    ) / _SCALER;
}
```

### Root Cause

In `FluidLocker:388`, it incorrectly divides the term `(Math.sqrt(unlockPeriod * _SCALER)` by `_SCALER`.

### Internal pre-conditions

None.

### External pre-conditions

None.

### Attack Path

1. User unlocks their Fluid from the locker with a duration bigger than 0, unvesting it through the fountain.

### Impact

User suffers a big loss, even if they unlock with the maximum period, they will still get `80%` penalty.

### PoC

The component `(Math.sqrt(unlockPeriod * _SCALER) / _SCALER) <= sqrt(540 * 24 * 3600 * 1e18) / 1e18 = 0` is always null, so only `20*_SCALER` is left, which always yields a `20%` unlocking percentage.

### Mitigation

Remove the extra `_SCALER`.
```solidity
function _getUnlockingPercentage(uint128 unlockPeriod) internal pure returns (uint256 unlockingPercentageBP) {
    unlockingPercentageBP = (
        _PERCENT_TO_BP
            * (
                ((80 * _SCALER) / Math.sqrt(540 * _SCALER)) * (Math.sqrt(unlockPeriod * _SCALER))
                    + 20 * _SCALER
            )
    ) / _SCALER;
}
```



## Discussion

**0xPilou**

Fix for this issue is included in the following PR : https://github.com/superfluid-finance/fluid/pull/6

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/superfluid-finance/fluid/pull/6
