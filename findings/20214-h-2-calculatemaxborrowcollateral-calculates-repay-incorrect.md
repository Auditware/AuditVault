---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Index]]"
auditors:
  - "[[0x52]]"
report: "https://github.com/sherlock-audit/2023-05-Index-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# H-2: _calculateMaxBorrowCollateral calculates repay incorrectly and can lead to set token liquidation

- id: 20214
- impact: HIGH
- protocol: [[Index]]
- reporter: 0x52 (Sherlock)
- source: N/A

## Summary


This bug report is about an issue in the AaveLeverageStrategyExtension.sol contract, which is part of the IndexCoop smart contracts. This issue was found by 0x52 and reported on GitHub. The issue is that when calculating the amount to repay, the contract incorrectly applies the unutilizedLeveragePercentage when calculating the netRepayLimit. This means that if the borrowValue ever exceeds the liquidationThreshold, then all attempts to repay will revert, and the set token can't rebalance and will be liquidated. The code snippet provided in the report is from the AaveLeverageStrategyExtension.sol contract and the tool used to find the issue was manual review. The recommendation from 0x52 was to not adjust the max value by unutilizedLeveragPercentage, which was accepted and fixed in a PR.

## Details

Source: https://github.com/sherlock-audit/2023-05-Index-judging/issues/254 

## Found by 
0x52
## Summary

When calculating the amount to repay, `_calculateMaxBorrowCollateral` incorrectly applies `unutilizedLeveragePercentage` when calculating `netRepayLimit`. The result is that if the `borrowValue` ever exceeds `liquidationThreshold * (1 - unutilizedLeveragPercentage)` then all attempts to repay will revert. 

## Vulnerability Detail

[AaveLeverageStrategyExtension.sol#L1110-L1118](https://github.com/sherlock-audit/2023-05-Index/blob/main/index-coop-smart-contracts/contracts/adapters/AaveLeverageStrategyExtension.sol#L1110-L1118)

        } else {
            uint256 netRepayLimit = _actionInfo.collateralValue
                .preciseMul(liquidationThresholdRaw.mul(10 ** 14))
                .preciseMul(PreciseUnitMath.preciseUnit().sub(execution.unutilizedLeveragePercentage));

            return _actionInfo.collateralBalance
                .preciseMul(netRepayLimit.sub(_actionInfo.borrowValue))
                .preciseDiv(netRepayLimit);
        }

When calculating `netRepayLimit`, `_calculateMaxBorrowCollateral` uses the `liquidationThreshold` adjusted by `unutilizedLeveragePercentage`. It then subtracts the borrow value from this limit. This is problematic because if the current `borrowValue` of the set token exceeds `liquidationThreshold * (1 - unutilizedLeveragPercentage)` then this line will revert making it impossible to make any kind of repayment. Once no repayment is possible the set token can't rebalance and will be liquidated.

## Impact

Once the leverage exceeds a certain point the set token can no longer rebalance

## Code Snippet

[AaveLeverageStrategyExtension.sol#L1110-L1118](https://github.com/sherlock-audit/2023-05-Index/blob/main/index-coop-smart-contracts/contracts/adapters/AaveLeverageStrategyExtension.sol#L1110-L1118)

## Tool used

Manual Review

## Recommendation

Don't adjust the max value by `unutilizedLeveragPercentage`



## Discussion

**pblivin0x**

The outlined issue and fix LGTM. We need to loosen the performed `netRepayLimit` check to avoid the case where we have high leverage and can't submit repayment (`borrowValue > liquidationThreshold * (1 - unutilizedLeveragPercentage)`)

**ckoopmann**

Fixed in the below PR by removing the `unutilizedLeveragPercentage` adjustment as suggested:
https://github.com/IndexCoop/index-coop-smart-contracts/pull/142
