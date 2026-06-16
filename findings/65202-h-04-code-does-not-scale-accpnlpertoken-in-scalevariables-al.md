---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Ostium]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ostium-security-review_2025-09-14.md"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
---
# [H-04] Code does not scale `accPnlPerToken` in `scaleVariables()` always

- id: 65202
- impact: HIGH
- protocol: Ostium_2025-09-14
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ostium]]-security-review_2025-09-14.md

## Summary


The bug report discusses an issue with a function called `scaleVariables()`. This function is used to scale the value of a variable called `accPnlPerToken` in order to reflect changes in the balance. However, the bug report states that there is a problem with the code when `accPnlPerToken` is greater than 0. In this case, the code does not update the value, which results in an incorrect calculation of the accumulated profit and loss (PnL). This can lead to incorrect share prices and yield calculations over time. The report recommends that the value of `accPnlPerToken` should always be scaled in the `scaleVariables()` function.

## Details


_Acknowledged_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In function `scaleVariables()` code scales the value of `accPnlPerToken` to reflect the changed balance:
```solidity
        uint256 supply = totalSupply();

        if (accPnlPerToken < 0) {
            accPnlPerToken = accPnlPerToken * supply.toInt256()
                / (isDeposit ? (supply + shares).toInt256() : (supply - shares).toInt256());
        }
    }
```
The issue is that when `accPnlPerToken > 0`, code doesn't update the value, and as a result the implied accumulated PnL would be wrong. For example:
1. Suppose there are 100 token and 100 shares in the vault, and traders profit is 10 token so `accPnlPerToken`  would be 0.1, and share price would be 0.9.
2. User A deposits 90 token and would receive 100 shares, and code won't update `accPnlPerToken` because it's value is positive.
3. Now total share would be 200, and `accPnlPerToken` would be 0.1, and the implied accumulated PnL would be `200 * 0.1 = 20`, which wrong.

The impact is that code would use the wrong value for PnL, and the share price and yield calculations would be wrong over time.

## Recommendations
Always scale the value of the `accPnlPerToken` in the `scaleVariables()` functions.
