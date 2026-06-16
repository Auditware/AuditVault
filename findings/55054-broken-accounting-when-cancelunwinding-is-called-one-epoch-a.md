---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - platform/spearbit
  - sector/stable
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[fix/redesign-logic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Broken accounting when cancelUnwinding is called one epoch after startUnwinding

- id: 55054
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


This bug report highlights a high risk security issue in the code of the InfiniFi protocol. The issue is related to the `startUnwinding` and `cancelUnwinding` functions, where a user is able to cancel their unwinding process in a specific scenario. This results in an incorrect update to the global point, leading to an inconsistency in the slope data and a potential DoS of the protocol. The recommendation is to update the require check in the `cancelUnwinding` function to prevent users from canceling when `currentEpoch` is equal to `position.fromEpoch`. The bug has been fixed in the latest version of the code.

## Details

## Security Report

## Severity: High Risk

### Context
`UnwindingModule.sol#L189`

### Description
When a user calls `startUnwinding`, the positions mapping is updated as follows:

```solidity
positions[id] = UnwindingPosition({
    shares: newShares,
    fromEpoch: nextEpoch,
    toEpoch: endEpoch,
    fromRewardWeight: rewardWeight,
    rewardWeightDecrease: rewardWeightDecrease
});
```

For example, if a user calls `startUnwinding` in epoch 1000 with 10 as `_unwindingEpochs`, the positions mapping would be created as:

```solidity
positions[id] = UnwindingPosition({
    shares: newShares,
    fromEpoch: 1001,
    toEpoch: 1011,
    fromRewardWeight: rewardWeight,
    rewardWeightDecrease: rewardWeightDecrease
});
```

Moreover, these two mappings would also be updated:

```solidity
rewardWeightDecreases[1001] += rewardWeightDecrease;
rewardWeightIncreases[1011] += rewardWeightDecrease;
```

Then, once in epoch 1001, this user would be able to call `cancelUnwinding` as the require check would pass:

```solidity
// currentEpoch = 1001
// position.fromEpoch = 1001
require(currentEpoch >= position.fromEpoch, UserUnwindingNotStarted());
```

The `cancelUnwinding` function would execute the following logic:

```solidity
function cancelUnwinding(address _user, uint256 _startUnwindingTimestamp, uint32 _newUnwindingEpochs)
external
onlyCoreRole(CoreRoles.LOCKED_TOKEN_MANAGER)
{
    uint32 currentEpoch = uint32(block.timestamp.epoch());
    bytes32 id = _unwindingId(_user, _startUnwindingTimestamp);
    UnwindingPosition memory position = positions[id];
    require(position.toEpoch > 0 && currentEpoch < position.toEpoch, UserNotUnwinding());
    require(currentEpoch >= position.fromEpoch, UserUnwindingNotStarted());
    uint256 userBalance = balanceOf(_user, _startUnwindingTimestamp);
    uint256 elapsedEpochs = currentEpoch - position.fromEpoch;
    uint256 userRewardWeight = position.fromRewardWeight - elapsedEpochs * position.rewardWeightDecrease;

    {
        // scope some state writing to avoid stack too deep
        GlobalPoint memory point = _getLastGlobalPoint(); // <----------------------
---
        point.totalRewardWeightDecrease -= position.rewardWeightDecrease; // <----------------------
---
        point.totalRewardWeight -= userRewardWeight;
        _updateGlobalPoint(point); // <----------------------
---
        rewardWeightIncreases[position.toEpoch] -= position.rewardWeightDecrease;
        delete positions[id];
        totalShares -= position.shares;
        totalReceiptTokens -= userBalance;
    }

    uint32 remainingEpochs = position.toEpoch - currentEpoch;
    require(_newUnwindingEpochs >= remainingEpochs, InvalidUnwindingEpochs(_newUnwindingEpochs));
    IERC20(receiptToken).approve(msg.sender, userBalance);
    LockingController(msg.sender).createPosition(userBalance, _newUnwindingEpochs, _user);
}
```

Where `_getLastGlobalPoint` would iterate over previous epochs excluding the currentEpoch, which is where the `rewardWeightDecreases[1001] += rewardWeightDecrease` update was performed:

```solidity
function _getLastGlobalPoint() internal view returns (GlobalPoint memory) {
    GlobalPoint memory point = globalPoints[lastGlobalPointEpoch];
    // apply slope changes
    uint32 currentEpoch = uint32(block.timestamp.epoch());
    for (uint32 epoch = point.epoch; epoch < currentEpoch; epoch++) { // <<<
        point.totalRewardWeightDecrease -= rewardWeightIncreases[epoch];
        point.totalRewardWeightDecrease += rewardWeightDecreases[epoch];
        point.totalRewardWeight -= point.totalRewardWeightDecrease;
        point.epoch = epoch + 1;
        point.rewardShares = 0;
    }
    return point;
}
```

Despite that, `cancelUnwinding` still performs the following update incorrectly pushing this update into the global point:

```solidity
GlobalPoint memory point = _getLastGlobalPoint();
point.totalRewardWeightDecrease -= position.rewardWeightDecrease; // <<<
```

At this point:
1. `totalRewardWeightDecrease` is higher than it should be as the counterpart of this update (`rewardWeightDecreases[1001]`) was not yet processed.
2. Consequently, `totalRewardWeight` is lower than it should be.
3. This error is written permanently into the global point here: `_updateGlobalPoint(point)`.

Therefore, as the slope data is left in an inconsistent state, forcing an incorrect `totalRewardWeight` distribution for everyone else in the `UnwindingModule`, users whose balance is affected by this slope will receive a higher amount of receipt tokens than they should.

Another consequence is that this would cause a DoS of the InfiniFi protocol as the `UnwindingModule.totalRewardWeight` calls would revert due to underflow in the following line:

```solidity
point.totalRewardWeightDecrease -= rewardWeightIncreases[epoch];
```

### Recommendation
Consider updating the `cancelUnwinding` function require check to disallow users from canceling when `currentEpoch` is equal to `position.fromEpoch`:

```solidity
require(currentEpoch > position.fromEpoch, UserUnwindingNotStarted());
```

**infiniFi:** Fixed in `a765744`.  
**Spearbit:** Fix verified.
