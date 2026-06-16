---
tags:
  - lang/solidity
  - sector/streaming
  - sector/token
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[VTVL]]"
auditors:
  - "[[Robert Chen]]"
report: "https://vtvl.io/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timestamp-dependence]]"
---
# Locked Tokens In Milestone Contract

- id: 47910
- impact: HIGH
- protocol: [[VTVL]]
- reporter: Robert Chen (OtterSec)
- source: https://vtvl.io/

## Summary


The report discusses a bug in the BaseMilestone contract where the OnlyDeposited modifier is not functioning properly. This modifier allows a milestone to be marked as complete only if it is fully deposited. However, the way it checks the balance can cause a problem where the remaining balance intended for allocation becomes locked until more funds are deposited. The suggested solution is to remove the constant value and use the numTokensReservedForVesting variable instead. This will track all the tokens reserved for vesting and the check for completeness should occur in the setComplete function. The bug has been fixed in a recent commit by introducing the totalWithdrawnAmount variable to track withdrawn tokens and subtracting it from the locked tokens.

## Details

## Vulnerability Overview

In `BaseMilestone::setComplete`, the `OnlyDeposited` modifier allows a milestone to be marked as complete if and only if it is deposited fully. The problem arises from the modifier’s method of checking the balance, which checks if it is greater than or equal to `allocation * recipients.length`. As recipients withdraw tokens, the contract’s balance reduces. However, `allocation * recipients.length` remains constant. This may result in a situation where the remaining balance intended for allocation becomes locked until more funds are deposited to raise the balance above the limit. As a result, the additional deposited amount for raising the amount will be locked in the contract.

## Code Snippet

```solidity
modifier onlyDeposited() {
    uint256 balance = tokenAddress.balanceOf(address(this));
    require(balance >= allocation * recipients.length, "NOT_DEPOSITED");
    _;
}
```

## Remediation

Remove the constant value, and `numTokensReservedForVesting` should be utilized instead, which tracks all the tokens reserved for vesting in the contract. Also, as milestones complete, `numTokensReservedForVesting` increases with added tokens allocated for vesting. Thus the following check should occur in `setComplete`:

## Code Snippet

```solidity
function setComplete(
    address _recipient,
    uint256 _milestoneIndex
) public onlyOwner {
    Milestone storage milestone = milestones[_recipient][_milestoneIndex];
    require(balanceOf(address(this)) - numTokensReservedForVesting >= milestone.allocation, "NOT_DEPOSITED");
    require(milestone.startTime == 0, "ALREADY_COMPLETED");
    milestone.startTime = block.timestamp;
    numTokensReservedForVesting += milestone.allocation;
}
```

## VTVL Audit 04 | Vulnerabilities

## Patch

Fixed in commit `cdfa29d` by introducing the `totalWithdrawnAmount` variable to track the withdrawn tokens, which is then subtracted from `numTokensReservedForVesting` (locked tokens).
