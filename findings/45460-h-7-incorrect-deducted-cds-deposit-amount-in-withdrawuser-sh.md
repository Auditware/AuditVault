---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[0x37]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# H-7: Incorrect deducted cds deposit amount in withdrawUser

- id: 45460
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: 0x37 (Sherlock)
- source: N/A

## Summary


This bug report is about an issue with the calculation of a variable called `totalCdsDepositedAmount` in a function called `withdrawUser()` in a software project. The problem occurs when users withdraw their positions and have opted in for liquidations. This leads to incorrect calculations and affects other related calculations as well. The root cause of the issue is that the code is deducting the wrong amount from the `totalCdsDepositedAmount` variable. This is because the code is using the wrong variable to calculate the deduction. This results in incorrect values being returned to users and can impact the overall calculation of the variable. The report suggests a solution to fix the issue and prevent it from happening in the future. 

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/563 

## Found by 
0x37, valuevalk

### Summary

The calculation for `totalCdsDepositedAmount` in withdrawUser() is incorrect when the cds owners opt in liquidations. This will impact all calculations which are related with `omniChainData.totalCdsDepositedAmount`.

### Root Cause

When cds owners want to withdraw positions, we will try to deduct this position's cds deposit from the `omniChainData.totalCdsDepositedAmount`. If this cds deposit position is opt in the liquidation, one part of cds deposit has already been used in the liquidation process. So when cds owners want to withdraw, we should [deduct the left deposited amount](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/lib/CDSLib.sol#L728-L729 from `omniChainData.totalCdsDepositedAmount`.

The problem is that when we update `totalCdsDepositedAmount`, we calculate via `params.cdsDepositDetails.depositedAmount - params.cdsDepositDetails.liquidationAmount`. We should notice that `params.cdsDepositDetails.liquidationAmount` is not the used liquidation amount from the cds owner. It stands for left liquidation amount for this position.

We should deduct the left deposit amount: `depositedAmount - (initialLiquidationAmount - liquidationAmount)`
```solidity
    function withdrawUser(
        CDSInterface.WithdrawUserParams memory params,
        CDSInterface.Interfaces memory interfaces,
        uint256 totalCdsDepositedAmount,
        uint256 totalCdsDepositedAmountWithOptionFees,
        mapping(uint128 liquidationIndex => CDSInterface.LiquidationInfo)
            storage omniChainCDSLiqIndexToInfo
    ) public returns (CDSInterface.WithdrawResult memory) {
          CDSInterface.LiquidationInfo memory liquidationData = omniChainCDSLiqIndexToInfo[i];
          uint128 share = (liquidationAmount * 1e10) / uint128(liquidationData.availableLiquidationAmount);
          params.cdsDepositDetails.liquidationAmount -= getUserShare(liquidationData.liquidationAmount, share);
}
```
```solidity
      totalCdsDepositedAmount -= (params.cdsDepositDetails.depositedAmount - params.cdsDepositDetails.liquidationAmount);
      params.omniChainData.totalCdsDepositedAmount -= (params.cdsDepositDetails.depositedAmount - params.cdsDepositDetails.liquidationAmount);

```

### Internal pre-conditions

N/A

### External pre-conditions

N/A

### Attack Path

N/A

### Impact

`omniChainData.totalCdsDepositedAmount` will be updated incorrectly. This will cause incorrect cds cumulative value's calculation. 
Cds owners may get the incorrect return value.

### PoC

N/A

### Mitigation

```solidity
totalCdsDepositedAmount -= depositedAmount - (initialLiquidationAmount - liquidationAmount);
```
