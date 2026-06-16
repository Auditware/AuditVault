---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/code4rena
  - has/github
  - severity/high
  - trigger/governance-vote
protocol: "[[Olas]]"
auditors:
  - "[[ZanyBonzy]]"
report: "https://code4rena.com/reports/2024-05-olas"
genome:
  - "[[precision-loss]]"
  - "[[governance-vote]]"
  - "[[permanent]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# [H-01] `pointsSum.slope` Not Updated After Nominee Removal and Votes Revocation

- id: 34920
- impact: HIGH
- protocol: [[Olas]]
- reporter: ZanyBonzy (Code4rena)
- source: https://code4rena.com/reports/2024-05-olas

## Summary


The `VoteWeighting.sol` smart contract has two functions, `removeNominee` and `revokeRemovedNomineeVotingPower`, that are used for the governance mechanism. However, when a nominee is removed, the `pointsSum.slope` is not updated, causing the voting weight logic to become inaccurate. This could potentially compromise the integrity of the governance mechanism. To fix this, the `pointsSum.slope` should be updated when a nominee is removed. This issue has been confirmed and marked as high severity, as it can break the core accounting of the `VoteWeighting` contract.

## Details


<https://github.com/code-423n4/2024-05-olas/blob/main/governance/contracts/VoteWeighting.sol#L586-L637><br><https://github.com/code-423n4/2024-05-olas/blob/main/governance/contracts/VoteWeighting.sol#L223-L249>

### Vulnerability details

The `removeNominee` and `revokeRemovedNomineeVotingPower` functions are part of the governance mechanism in the `VoteWeighting.sol` smart contract.

- The `removeNominee` function removes a nominee from the voting system.
- The `revokeRemovedNomineeVotingPower` function revokes the voting power that a user has delegated to a nominee who has been removed.

When a user votes for a nominee using the `voteForNomineeWeights` function, both `pointsSum.slope` and `pointsSum.bias` are updated to reflect the new voting weights:

```solidity
pointsWeight[nomineeHash][nextTime].bias = _maxAndSub(_getWeight(account, chainId) + newBias, oldBias);
pointsSum[nextTime].bias = _maxAndSub(_getSum() + newBias, oldBias);
if (oldSlope.end > nextTime) {
    pointsWeight[nomineeHash][nextTime].slope =
        _maxAndSub(pointsWeight[nomineeHash][nextTime].slope + newSlope.slope, oldSlope.slope);
    pointsSum[nextTime].slope = _maxAndSub(pointsSum[nextTime].slope + newSlope.slope, oldSlope.slope);
} else {
    pointsWeight[nomineeHash][nextTime].slope += newSlope.slope;
    pointsSum[nextTime].slope += newSlope.slope;
}
```

However, when a nominee is removed by the owner through the `removeNominee` function, only `pointsSum.bias` is updated. `pointsSum.slope` is not updated, nor is it updated when users revoke their votes through the `revokeRemovedNomineeVotingPower` function. As a result, the `pointsSum.slope` for the next timestamp will be incorrect as it still includes the removed nominee's slope.

When the `_getSum()` function is called later to perform a checkpoint, the incorrect slope will be used for the calculation, causing the voting weight logic to become inaccurate:

```solidity
function _getSum() internal returns (uint256) {
    // t is always > 0 as it is set in the constructor
    uint256 t = timeSum;
    Point memory pt = pointsSum[t];
    for (uint256 i = 0; i < MAX_NUM_WEEKS; i++) {
        if (t > block.timestamp) {
            break;
        }
        t += WEEK;
        uint256 dBias = pt.slope * WEEK;
        if (pt.bias > dBias) {
            pt.bias -= dBias;
            uint256 dSlope = changesSum[t];
            pt.slope -= dSlope;
        } else {
            pt.bias = 0;
            pt.slope = 0;
        }

        pointsSum[t] = pt;
        if (t > block.timestamp) {
            timeSum = t;
        }
    }
    return pt.bias;
}
```

### Impact

The voting weight logic will be inaccurate after a nominee is removed, potentially compromising the integrity of the governance mechanism.

### Tools Used

VS Code

### Recommended Mitigation

To address this issue, ensure that `pointsSum.slope` is updated when a nominee is removed. This can be done in either the `removeNominee` or `revokeRemovedNomineeVotingPower` functions to maintain correct accounting.

### Assessed type

Error

**[kupermind (Olas) confirmed](https://github.com/code-423n4/2024-05-olas-findings/issues/36#issuecomment-2191551133)**

**[0xA5DF (judge) increased severity to High and commented](https://github.com/code-423n4/2024-05-olas-findings/issues/36#issuecomment-2198226815):**
 > Marking as high, because this is going to break the core accounting of `VoteWeighting` every time a nominee is removed. The actual sum of the weights is going to be more than the declared sum.

**[Olas mitigated](https://github.com/valory-xyz/autonolas-governance/pull/146)**

**[Varun_05 (warden) commented](https://github.com/code-423n4/2024-05-olas-findings/issues/36#issuecomment-2253868156):**
> Partially fixed in revoke `revokeRemovedNomineeVotingPower` but the issue still remains if all the users who voted for a removed nominee doesn't revoke their voting power.
> 
> Elaborating the issues as follows. Nominee is removed due to which the following updation happens:
>
> ```solidity
> uint256 oldWeight = _getWeight(account, chainId);
>         uint256 oldSum = _getSum();
>         uint256 nextTime = (block.timestamp + WEEK) / WEEK * WEEK;
>         pointsWeight[nomineeHash][nextTime].bias = 0;
>         timeWeight[nomineeHash] = nextTime;
> 
>         // Account for the the sum weight change
>         uint256 newSum = oldSum - oldWeight;
>         pointsSum[nextTime].bias = newSum;
>         timeSum = nextTime;
> ```
>
> As seen, `pointsSum.bias` is updated by subtracted the left over weights of the removed nominee. Now, as `pointsSum.Slope` is not reduced by the amount contributed by the removed slope instantly.
> 
> For mitigating this issue, the following changes were done in the `revokeRemovedNomineeVotingPower` function:
>
> ```solidity
> if (oldSlope.end > nextTime) {
>             pointsWeight[nomineeHash][nextTime].slope =
>                 _maxAndSub(pointsWeight[nomineeHash][nextTime].slope, oldSlope.slope);
>             pointsSum[nextTime].slope = _maxAndSub(pointsSum[nextTime].slope, oldSlope.slope);
>         }
> ```
>
> The issue is if there is even a delay of a week from when the nominee was removed to when the users who voted for the nominee then the `pointsSum.bias` would be reduced by wrong amount thus it will break the core accounting of vote weighting.
> 
> Also, there is no loss of voting power for the user who voted for the removed nominee as he can call revoke removed nominee voting power any time and can get his voting power back thus they can even delay calling this function thus affecting vote accounting.
> 
> One of the mitigation can be as follows:
>
> <details>
>
> ```solidity
> function removeNominee(bytes32 account, uint256 chainId) external {
>         // Check for the contract ownership
>         if (msg.sender != owner) {
>             revert OwnerOnly(owner, msg.sender);
>         }
> 
>         // Get the nominee struct and hash
>         Nominee memory nominee = Nominee(account, chainId);
>         bytes32 nomineeHash = keccak256(abi.encode(nominee));
> 
>         // Get the nominee id in the nominee set
>         uint256 id = mapNomineeIds[nomineeHash];
>         if (id == 0) {
>             revert NomineeDoesNotExist(account, chainId);
>         }
> 
>         // Set nominee weight to zero
>         uint256 oldWeight = _getWeight(account, chainId);
>         uint256 oldSum = _getSum();
>         uint256 nextTime = (block.timestamp + WEEK) / WEEK * WEEK;
>         pointsWeight[nomineeHash][nextTime].bias = 0;
>   ++ pointsWeight[nomineeHash][nextTime].slope = 0
>         timeWeight[nomineeHash] = nextTime;
>   ++      uint256 totalSlope;
>   ++      for (uint256 i = 1; i =< MAX_NUM_WEEKS; i++) {
>   ++          uint256 time = nextTime + i * WEEK;
>   ++         if(changesWeight[nomineeHash][time]>0){
>   ++          totalSlope += changesWeight[nomineeHash][time];
>   ++          changesWeight[nomineeHash][time] = 0;
>   ++           changesSum[time] -= changesWeight[nomineeHash][time];
>            }
>             
>          }
>         
>         // Account for the the sum weight change
>         uint256 newSum = oldSum - oldWeight;
>         pointsSum[nextTime].bias = newSum;
> ++       pointsSum[nextTime].slope -= totalSlope;
>         timeSum = nextTime;
>          
>         // Add to the removed nominee map and set
>         mapRemovedNominees[nomineeHash] = setRemovedNominees.length;
>         setRemovedNominees.push(nominee);
> 
>         // Remove nominee from the map
>         mapNomineeIds[nomineeHash] = 0;
> 
>         // Shuffle the current last nominee id in the set to be placed to the removed one
>         nominee = setNominees[setNominees.length - 1];
>         bytes32 replacedNomineeHash = keccak256(abi.encode(nominee));
>         mapNomineeIds[replacedNomineeHash] = id;
>         setNominees[id] = nominee;
>         // Pop the last element from the set
>         setNominees.pop();
> 
>         // Remove nominee in dispenser, if applicable
>         address localDispenser = dispenser;
>         if (localDispenser != address(0)) {
>             IDispenser(localDispenser).removeNominee(nomineeHash);
>         }
> 
>         emit RemoveNominee(account, chainId, newSum);
>     }
> ``` 
> 
> </details>
> 
> Then, there is no need of the following logic in revoke removed nominee voting power function. They can be omitted.
>
> ```solidity
>  uint256 nextTime = (block.timestamp + WEEK) / WEEK * WEEK;
>         // Adjust weight and sum slope changes
>         if (oldSlope.end > nextTime) {
>             pointsWeight[nomineeHash][nextTime].slope =
>                 _maxAndSub(pointsWeight[nomineeHash][nextTime].slope, oldSlope.slope);
>             pointsSum[nextTime].slope = _maxAndSub(pointsSum[nextTime].slope, oldSlope.slope);
>         }
> 
>         // Cancel old slope changes if they still didn't happen
>         if (oldSlope.end > block.timestamp) {
>             changesWeight[nomineeHash][oldSlope.end] -= oldSlope.slope;
>             changesSum[oldSlope.end] -= oldSlope.slope;
>         }
> ```

***
