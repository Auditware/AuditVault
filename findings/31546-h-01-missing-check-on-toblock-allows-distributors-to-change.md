---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Subsquid]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# [H-01] Missing check on `toBlock` allows distributors to change past rewards

- id: 31546
- impact: HIGH
- protocol: [[Subsquid]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report is about a function called `commit` in a file called `DistributedRewardDistribution.sol`. The function is used to save a reward commit, but it does not check if the `toBlock` is larger than the `fromBlock`. This means that distributors can set the `toBlock` to 0, which can cause problems in the `distribute` function. This can be fixed by enforcing a check that ensures the `toBlock` is greater than the `fromBlock`. This check can be added in either the `commit` or `distribute` function. A proof of concept has been provided to demonstrate the issue. 

## Details

**Severity**

**Impact**: High, Breaks sequential rewards, can reward same epoch multiple times

**Likelihood**: Medium, Requires malicious distributor/s

**Description**

The function `commit` in `DistributedRewardDistribution.sol` is used to save a reward commit. However this function does not check if the `toBlock` is larger than the `fromBlock`. Thus distributors can set `toBlock` to 0 even.

```solidity
require(
    recipients.length == workerRewards.length,
    "Recipients and worker amounts length mismatch"
);
require(
    recipients.length == _stakerRewards.length,
    "Recipients and staker amounts length mismatch"
);

require(currentDistributor() == msg.sender, "Not a distributor");
//@audit missing check on block span
require(toBlock < block.number, "Future block");
```

This creates further problems in the `distribute` function itself. There is a check there which tries to force distributions to be sequential.

```solidity
require(
    lastBlockRewarded == 0 || fromBlock == lastBlockRewarded + 1,
    "Not all blocks covered"
);
```

However, an user can set the `toBlock` to be lower than the `fromBlock` and this will break the sequence. In fact, if a user sets `toBlock` to 0, they can even set `lastBlockRewarded` to 0 since the assignment takes place in the next line.

```solidity
lastBlockRewarded = toBlock;
```

POC:

The test `test_RunsDistributionAfter3Approves` can be modified with the blockspan running from 1 to 0 to demonstrate the issue.

```solidity
function test_RunsDistributionAfter3Approves() public {
    (
        uint256[] memory recipients,
        uint256[] memory workerAmounts,
        uint256[] memory stakerAmounts
    ) = prepareRewards(1);
    rewardsDistribution.addDistributor(address(1));
    rewardsDistribution.addDistributor(address(2));
    rewardsDistribution.setApprovesRequired(3);
    vm.roll(10);
    rewardsDistribution.commit(
        1,
        0,
        recipients,
        workerAmounts,
        stakerAmounts
    );
    hoax(address(1));
    rewardsDistribution.approve(
        1,
        0,
        recipients,
        workerAmounts,
        stakerAmounts
    );
    hoax(address(2));
    rewardsDistribution.approve(
        1,
        0,
        recipients,
        workerAmounts,
        stakerAmounts
    );
}
```

Test passes with no issues.

**Recommendations**

Enforce the check

```solidity
require(toBlock > fromBlock, "Invalid block span");
```

Either in the `commit` function or in the `distribute` function.
