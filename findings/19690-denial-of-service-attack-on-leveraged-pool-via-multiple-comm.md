---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/options
protocol: "[[Tracer]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/tracer/tracer-2/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Denial-of-Service Attack on Leveraged Pool via Multiple Commits

- id: 19690
- impact: HIGH
- protocol: [[Tracer]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/tracer/tracer-2/review.pdf

## Summary


A malicious user is able to dilute the queue of pending commits in the PoolCommitter.sol contract, which is used to enable users to interact with their leveraged pool of choice by depositing and withdrawing their tokens. This is possible due to the lack of a minimum commit amount and an unbounded commit queue. This can prevent a pool keeper from performing its duties, as it may be unable to perform an upkeep within the given block gas limit.

To prevent this from happening, two strategies should be implemented. Firstly, a minimum commit size for all deposits and withdrawals should be required by the commit() function. Secondly, a maximum number of commits that can be executed in a given update interval should be enforced, either by bounding the iterative executeAllCommitments() function to a maximum size, or by restricting the number of commits that can be made through the commit() function. Note that the values for these two strategies need to be chosen such that the cost of a potential attack would be prohibitive.

## Details

## Description

Due to the iterative nature of how commits are executed, a malicious user is able to dilute the queue of pending commits and effectively prevent a pool keeper from performing its duties. This is made possible by the lack of a minimum commit amount and an unbounded commit queue.

The `PoolCommitter.sol` contract contains the functionality to enable users to interact with their leveraged pool of choice by depositing and withdrawing their tokens. To do this, users will commit to an action by taking a position consisting of one of the following types: **LongMint**, **LongBurn**, **ShortMint**, or **ShortBurn**.

The `commit()` function checks that the amount to be committed is a positive amount and proceeds to add the commit to a queue of pending commits. This check is found on line [40] of `PoolCommitter.sol`:

```solidity
require(amount > 0, "Amount must not be zero");
```

Pending commits are executed by the pool keeper on each eligible update interval by use of the `PoolKeeper.performUpkeepSinglePool()` function. It is possible for a malicious user to create multiple commits containing small amounts that satisfy the aforementioned check, thereby diluting the queue of pending commits. As a result, a pool keeper may be unable to perform an upkeep within the given block gas limit, ergo preventing all pool deposits and withdrawals.

## Recommendations

Consider enforcing an implementation of these two strategies:

- A minimum commit size for all deposits and withdrawals required by the `commit()` function.
- A maximum number of commits that can be executed in a given update interval. This can be applied by bounding the iterative `executeAllCommitments()` function to a maximum size, or by restricting the number of commits that can be made through the `commit()` function. Although, the latter option lacks frontrunning protection for users.

Note that the values for these two strategies need to be chosen such that the cost of a potential attack would be prohibitive.
