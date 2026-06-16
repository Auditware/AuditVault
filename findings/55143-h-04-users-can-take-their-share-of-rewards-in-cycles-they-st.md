---
tags:
  - severity/high
  - has/github
  - sector/staking
  - sector/staking-pool
  - platform/shieldify
  - lang/solidity
protocol: "[[Surge]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md"
genome:
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-accounting]]"
  - "[[logic/reward-calculation]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[flash-loan]]"
  - "[[add-snapshot]]"
  - "[[precondition/flash-loan-available]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-04] Users Can Take Their Share of Rewards in Cycles They Stayed for Just a Couple of Seconds

- id: 55143
- impact: HIGH
- protocol: Surge
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md

## Summary


This bug report describes an issue with the distribution of rewards in a staking system. The report explains that users are able to claim rewards for cycles they have not fully participated in, due to the way the system calculates cycle start and end times. This means that users can claim rewards for cycles they have only been staked for a few seconds. The impact of this bug is that it is unfair for other users who have staked for longer periods of time. The recommendation is for the development team to consider implementing a more fair distribution of rewards. The team has acknowledged the issue.

## Details

## Severity

High Risk

## Description

Let's illustrate how cycles and reward retention function. Below we will see the distribution of rewards in cycles if we call `acceptPositionManagerRewards()` every 7 days with 1000 tokens.

```solidity
// # Rewards in cycles

//              pool 1      pool 2      pool 3      pool 4
// cycle 1      250         500         750         1000
// cycle 2      250         500         750         1000
// cycle 3      250         500         500
// cycle 4      250         500
// cycle 5      250         250
// cycle 6      250
// cycle 7      250
// cycle 8      250
// ...

// # Cycle durations

//          cycles
// Pool 1   [  1 ][  2 ][  3 ][  4 ][  5 ][  6 ][  7 ][  8 ][  9 ][ 10 ][ 11 ][ 12 ]
// Pool 2   [     1    ][     2    ][     3    ][     4    ][     5    ][     6    ]
// Pool 3   [        1       ][        2       ][        3       ][        4       ]
// Pool 4   [           1          ][           2          ][          3           ]
//                                ^                          ^
//                                |                          |
//                              stake                      unstake
```

The minimal lock duration is 28 days so if a user stakes for just 28 days & 1 minute and unstakes in the points in time shown above, he will be able to claim the rewards for cycles of pools he did not wait the full duration or stayed in such cycles for just a couple of seconds.

In this specific example the user will be able to claim the rewards for:

- Pool 1: 4 - 9 (where 4 and 9 he stays staked for some seconds)
- Pool 2: 2 - 5 (where 2 and 5 he stays staked for some seconds)
- Pool 3: 2 - 3
- Pool 4: 1 - 3 (where 1 and 3 he stays staked for some seconds)

This is possible because when a user stakes or unstakes, the `cycleStart` and `cycleEnd` are set to the current pool cycle, regardless of the cycle's progress. The user can then call `claimRewardsToOwed()` for all cycles that have already passed and for cycles like Pool 4 cycle 3 he can return when cycle 4 starts and take his share of all rewards that were deposited in the duration of cycle 3 after he already unstaked.

## Impact

Users can claim rewards for cycles they stayed for just a couple of seconds.

## Recommendation

Consider implementing logic that will distribute rewards in a more fair manner.

## Team Response

Acknowledged.
