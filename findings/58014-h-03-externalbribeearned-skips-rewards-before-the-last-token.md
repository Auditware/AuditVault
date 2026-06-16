---
tags:
  - has/github
  - severity/high
  - lang/solidity
  - sector/bridge
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-03] `ExternalBribe.earned` skips rewards before the last `tokenId` checkpoint

- id: 58014
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


This bug report highlights a problem in the code that calculates rewards for a specific token. The severity of this bug is high and it has a medium likelihood of occurring. The code loops through a specific range of checkpoints to determine the earned amount, but it is missing the last checkpoint in the range. This means that the last checkpoint will always be skipped and not counted as a reward. To fix this issue, the calculation logic needs to be changed to include the last checkpoint. A test file has been provided to replicate the issue and the log output shows that the last checkpoint is not being counted. The recommended solution is to modify the code to include the last checkpoint in the loop.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Inside `ExternalBribe.earned`, it first loops up to `_endIndex - 1` to determine whether to include previous rewards in the earned amount.

```solidity
    function earned(address token, uint tokenId) public view returns (uint) {
        uint _startTimestamp = lastEarn[token][tokenId];
        if (numCheckpoints[tokenId] == 0) {
            return 0;
        }

        uint _startIndex = getPriorBalanceIndex(tokenId, _startTimestamp);
        uint _endIndex = numCheckpoints[tokenId] - 1;

        uint reward = 0;
        // you only earn once per epoch (after it's over)
        RewardCheckpoint memory prevRewards;

        prevRewards.timestamp = _bribeStart(_startTimestamp);

        _prev._prevSupply = 1;

        console.log("END INDEX : ");
        console.log(_endIndex);

        if (_endIndex > 0) {
>>>         for (uint i = _startIndex; i <= _endIndex - 1; i++) {
                _prev._prevTs = checkpoints[tokenId][i].timestamp;
                _prev._prevBal = checkpoints[tokenId][i].balanceOf;
                uint _nextEpochStart = _bribeStart(_prev._prevTs);
                // check that you've earned it
                // this won't happen until a week has passed
>>>             if (_nextEpochStart > prevRewards.timestamp) {
                    console.log("REWARD ADDED : ");
                    console.log(prevRewards.balance);
                    reward += prevRewards.balance;
                }

                prevRewards.timestamp = _nextEpochStart;
                _prev._prevSupply = supplyCheckpoints[
                    getPriorSupplyIndex(_nextEpochStart + DURATION)
                ].supply;
                prevRewards.balance =
                    (_prev._prevBal *
                        tokenRewardsPerEpoch[token][_nextEpochStart]) /
                    _prev._prevSupply;
            }
        }

        Checkpoint memory _cp0 = checkpoints[tokenId][_endIndex];
        (_prev._prevTs, _prev._prevBal) = (_cp0.timestamp, _cp0.balanceOf);

        uint _lastEpochStart = _bribeStart(_prev._prevTs);
        uint _lastEpochEnd = _lastEpochStart + DURATION;

        if (
            block.timestamp > _lastEpochEnd && _startTimestamp < _lastEpochEnd
        ) {
            SupplyCheckpoint memory _scp0 = supplyCheckpoints[
                getPriorSupplyIndex(_lastEpochEnd)
            ];
            _prev._prevSupply = _scp0.supply;
            reward += (_prev._prevBal *
                    tokenRewardsPerEpoch[token][_lastEpochStart]) /
                _prev._prevSupply;
        }

        return reward;
    }
```

However, the logic should include `_endIndex`, as the checkpoint before it must be checked, otherwise, it will always be skipped and not counted as a reward.

Add the following test file to the repo: https://gist.github.com/said017/b96daba163bf2e1eb101589bc541ce06.

Run the test : 

```shell
forge test --match-test testEpochCalculationIssue -vvv
```

Log output : 

```shell
Logs:

  Earned at end of first epoch: 100000000000000000000

  Earned at end of second epoch: 0

  Earned at end of third epoch: 100000000000000000000
```


## Recommendations

Change the calculation logic to include `_endIndex`.

```diff
    function earned(address token, uint tokenId) public view returns (uint) {
        uint _startTimestamp = lastEarn[token][tokenId];
        if (numCheckpoints[tokenId] == 0) {
            return 0;
        }

        uint _startIndex = getPriorBalanceIndex(tokenId, _startTimestamp);
        uint _endIndex = numCheckpoints[tokenId] - 1;

        uint reward = 0;
        // you only earn once per epoch (after it's over)
        RewardCheckpoint memory prevRewards;

        prevRewards.timestamp = _bribeStart(_startTimestamp);

        _prev._prevSupply = 1;

        console.log("END INDEX : ");
        console.log(_endIndex);

        if (_endIndex > 0) {
-            for (uint i = _startIndex; i <= _endIndex - 1; i++) {
+            for (uint i = _startIndex; i <= _endIndex ; i++) {
                _prev._prevTs = checkpoints[tokenId][i].timestamp;
                _prev._prevBal = checkpoints[tokenId][i].balanceOf;
                uint _nextEpochStart = _bribeStart(_prev._prevTs);
                // check that you've earned it
                // this won't happen until a week has passed
                if (_nextEpochStart > prevRewards.timestamp) {
                    console.log("REWARD ADDED : ");
                    console.log(prevRewards.balance);
                    reward += prevRewards.balance;
                }
/ ...
}
```
