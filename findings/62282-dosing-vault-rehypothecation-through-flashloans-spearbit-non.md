---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[dos-resistance]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
---
# DoSing vault rehypothecation through flashloans

- id: 62282
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report is about a high-risk security issue in the AToken contract which is used for flash loans. During a flash loan, the contract transfers tokens to the user through a function called `transferUnderlyingTo`. However, after the tokens are transferred back to the contract, a function called `_rebalance` is not triggered, which could lead to a situation where the vault is left without tokens. This could cause a denial of service (DOS) attack on the vault. The report recommends calling the `_rebalance` function only during flash loan operations to prevent this issue. The bug has been fixed by the Astera team and verified by the Spearbit team.

## Details

## Security Report

## Severity: High Risk

### Context
`AToken.sol#L388`

### Description
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

A full fuzzing test was provided by Cod3x team and can be found in the echidna branch.

### Recommendation
Consider calling the `_rebalance` function exclusively during flashloan operations, since triggering `_rebalance` during liquidation or repayment flows may cause another DOS if the vault is paused or has reached its deposit cap.

### Audits
- **Astera:** Fixed in commit `4605e906`.
- **Spearbit:** Fix verified.
