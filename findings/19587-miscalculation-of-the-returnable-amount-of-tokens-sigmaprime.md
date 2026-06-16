---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/dex
  - sector/streaming
  - sector/token
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# Miscalculation of the Returnable Amount of Tokens

- id: 19587
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf

## Summary


This bug report is about an accounting error in the stopVesting() function that leads to the overstatement of returnAmount, resulting in the owner receiving more shares than they are owed. This is due to an edge case where the entire duration has passed and the recipient has claimed all of the tokens. This is caused by the code in stopVesting(), which includes the amount already claimed in addition to the amount left in the schedule.

The development team has recommended updating returnAmount such that it does not include the vest.claimed value. This was done by introducing a new variable, amountVested, which is equal to balanceOf(vest) - vest.claimed. This new logic was implemented in PR 17.

In conclusion, the bug report is about an accounting error in the stopVesting() function that leads to the overstatement of returnAmount, resulting in the owner receiving more shares than they are owed. This was fixed by implementing the recommended logic in PR 17.

## Details

## Description

An accounting error in `stopVesting()` leads to the overstatement of `returnAmount`, thereby transferring the owner more shares than they are owed.

The `returnAmount` represents the amount of tokens in the vesting schedule that have not vested. This value is overstated as it includes the amount already claimed in addition to the amount left in the schedule. The following snippet is from `stopVesting()`:

```solidity
uint256 canClaim = _balanceOf(vest) - vest.claimed;
uint256 returnAmount = (vest.cliffAmount + (vest.steps * vest.stepAmount)) - canClaim;
```

Consider the edge case where the entire duration has passed and the recipient has claimed all of the tokens:

```
balanceOf(vest) = vest.claimed = vest.cliffAmount + vest.steps * vest.stepAmount
```

From the code above we can calculate:

```
canClaim = balanceOf(vest) - vest.claimed = 0
returnAmount = vest.cliffAmount + vest.steps * vest.stepAmount - canClaim
```

Since `canClaim = 0`, we have:

```
returnAmount = vest.cliffAmount + vest.steps * vest.stepAmount
```

The owner is therefore overpaid by the amount that has already been claimed, that is `vest.claimed`.

## Recommendations

Consider updating `returnAmount` such that it does not include the `vest.claimed` value, as seen below:

```solidity
uint256 amountVested = _balanceOf(vest);
uint256 canClaim = amountVested - vest.claimed;
uint256 returnAmount = (vest.cliffAmount + (vest.steps * vest.stepAmount)) - amountVested;
```

## Resolution

The development team has fixed the issue by implementing the recommended logic. This is shown in PR 17.
