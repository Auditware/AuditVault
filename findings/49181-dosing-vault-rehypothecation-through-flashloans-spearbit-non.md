---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
---
# DoSing vault rehypothecation through flashloans

- id: 49181
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


The bug report describes a high-risk issue in the AToken contract, specifically in the transferUnderlyingTo function. During a flash loan, the contract transfers the underlying amount to the user, but after the receiver logic is executed, the underlying tokens are not transferred back to the contract. This could lead to a situation where the vault is left without tokens, causing a denial of service (DOS) in vault rehypothecation. A full fuzzing test was performed and a recommendation is made to call the _rebalance function exclusively during flash loan operations to prevent further DOS issues. The bug has been fixed in a recent commit by the Cod3x team and verified by Spearbit.

## Details

## Severity: High Risk

## Context
AToken.sol#L388

## Description
During a flash loan, the AToken contract transfers the underlying amount to the user through the `transferUnderlyingTo` function, which withdraws tokens from the vault when using it:

```solidity
function transferUnderlyingTo(address target, uint256 amount)
external
override
onlyLendingPool
returns (uint256)
{
    _rebalance(amount);
    _underlyingAmount = _underlyingAmount - amount;
    IERC20(_underlyingAsset).safeTransfer(target, amount);
    return amount;
}
```

After executing the receiver logic, the underlying tokens are transferred back to the AToken contract, but the rebalance is not triggered. This could lead to a situation where the vault is left without tokens, causing a DOS in vault rehypothecation:

```solidity
function handleRepayment(address user, address onBehalfOf, uint256 amount)
external
override
onlyLendingPool
{
    _underlyingAmount = _underlyingAmount + amount;
}
```

A full fuzzing test was provided by the Cod3x team and can be found in the echidna branch.

## Recommendation
Consider calling the `_rebalance` function exclusively during flashloan operations, since triggering `_rebalance` during liquidation or repayment flows may cause another DOS if the vault is paused or has reached its deposit cap.

**Cod3x:** Fixed in commit `4605e906`.  
**Spearbit:** Fix verified.
