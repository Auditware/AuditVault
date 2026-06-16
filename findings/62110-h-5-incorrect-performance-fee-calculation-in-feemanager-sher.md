---
tags:
  - lang/solidity
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Mellow]]"
auditors:
  - "[[0xapple]]"
  - "[[blockace]]"
  - "[[dan__vinci]]"
  - "[[davies0212]]"
  - "[[lodelux]]"
report: "https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
---
# H-5: Incorrect performance fee calculation in `FeeManager`

- id: 62110
- impact: HIGH
- protocol: [[Mellow]] Flexible Vaults
- reporter: dan\_\_vinci (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the performance fee calculation of the Mellow Flexible Vaults protocol. The current formula used in the FeeManager.calculateFee function is incorrect and leads to incorrect fee calculations. The root cause of the issue is that the formula assumes that the price difference can be directly multiplied by the total shares, which is not the case. This can result in incorrect performance fee calculations. The report also includes a suggested correction to the formula to properly convert the price difference to share amounts. The protocol team has fixed this issue in their code.

## Details


Source: https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults-judging/issues/207 

## Found by 
0xapple, blockace, dan\_\_vinci, davies0212, lodelux

### Summary

The performance fee calculation in `FeeManager.calculateFee` uses an incorrect formula that doesn't properly convert price differences to share amounts. The current implementation leads to incorrect fee calculations.

### Root Cause

The root cause is in the performance fee calculation formula in [`FeeManger.calculateFee`](https://github.com/sherlock-audit/2025-07-mellow-flexible-vaults/blob/main/flexible-vaults/src/managers/FeeManager.sol#L78) function :

```solidity
shares = Math.mulDiv(minPriceD18_ - priceD18, $.performanceFeeD6 * totalShares, 1e24);
```

This formula incorrectly assumes that the price difference `(minPriceD18_ - priceD18)` can be directly multiplied by the total shares to calculate fee shares.

Following formula comparison will be help to understand issue:
- definition of price: `share = price * asset`
- current formula: `feeShare = priceDifference * totalShare

Example1:
minPriceD18=100e18, priceD18=90e18, performanceFee=1e5(10%)
feeShare = 10e18 * 1e5 * totalShare / 1e24 = totalShare
This means that performance fee share is the same as total share. -> Incorrect result.

Example2:
Let's imagine that asset is USDC with decimal 6, and vault share price is $1.
In this case, `priceD18` for `USDC` is `1e30`, not `1e18` to ensure share decimal as 18.

### Internal Pre-conditions

.

### External Pre-conditions

.

### Attack Path

.

### Impact

Incorrect performance fees calculation.

### PoC

.

### Mitigation

The formula should be corrected to properly convert the price difference to share amounts by including `priceD18` in the denominator:

```solidity
shares = Math.mulDiv(minPriceD18_ - priceD18, $.performanceFeeD6 * totalShares, 1e6 * priceD18);
```


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/mellow-finance/flexible-vaults/pull/21/files
