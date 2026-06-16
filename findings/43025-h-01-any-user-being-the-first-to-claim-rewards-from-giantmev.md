---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/staking
protocol: "[[Stakehouse Protocol]]"
auditors:
  - "[[clems4ever]]"
report: "https://code4rena.com/reports/2022-11-stakehouse"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [H-01] Any user being the first to claim rewards from `GiantMevAndFeesPool` can unexepectedly collect them all

- id: 43025
- impact: HIGH
- protocol: [[Stakehouse Protocol]]
- reporter: clems4ever (Code4rena)
- source: https://code4rena.com/reports/2022-11-stakehouse

## Summary


The bug report is about a potential issue in the code of a project called Stakehouse. The code in question is located in three specific lines and is related to the calculation and distribution of rewards. The report includes a proof of concept to demonstrate the issue and recommends reworking the way certain variables are used to mitigate the problem. The project team has confirmed the bug and is working on fixing it. 

## Details


<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/SyndicateRewardsProcessor.sol#L85><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/SyndicateRewardsProcessor.sol#L61><br>
<https://github.com/code-423n4/2022-11-stakehouse/blob/4b6828e9c807f2f7c569e6d721ca1289f7cf7112/contracts/liquid-staking/GiantMevAndFeesPool.sol#L203><br>

Any user being the first to claim rewards from GiantMevAndFeesPool, can get all the previously generated rewards whatever the amount and even if he did not participate to generate those rewards...

### Proof of Concept

<https://gist.github.com/clems4ever/c9fe06ce454ff6c4124f4bd29d3598de>

Copy paste it in the test suite and run it.

### Tools Used

forge test

### Recommended Mitigation Steps

Rework the way `accumulatedETHPerLPShare` and `claimed` is used. There are multiple bugs due to the interaction between those variables as you will see in my other reports.

**[vince0656 (Stakehouse) confirmed](https://github.com/code-423n4/2022-11-stakehouse-findings/issues/32)**



***
