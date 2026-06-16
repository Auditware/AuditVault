---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/bridge
  - sector/lending
protocol: "[[RegnumAurum]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RegnumAurum-security-review_2025-08-12.md"
genome:
  - "[[price-calculation]]"
  - "[[wrong-state]]"
  - "[[debt-accrual-update]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Parameter change skews getters

- id: 63401
- impact: HIGH
- protocol: RegnumAurum_2025-08-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RegnumAurum]]-security-review_2025-08-12.md

## Summary


This bug report discusses an issue with the calculation of interest accrual in a program. The problem occurs when the program uses the last calculated variables for updating reserve state, which can result in incorrect values being returned in certain functions. This can have a significant impact on the program and is considered a high severity bug. The report recommends not calculating certain rates in specific functions and instead using a cached version to avoid this issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Interest accrual is always calculated using the last calculated variables for updating reserve state. For instance, if interest was 5% lastly and after 1 hour we call `deposit` function, it will use this 5% interest for the last 1 hour. However, `getNormalizedIncome` and `getNormalizedDebt` functions calculate these rates again return value according to that.

This will cause incorrect value to be returned in these functions. It's very critical because `getNormalizedIncome` and `getNormalizedDebt` are used in many important points in the codebase.

```solidity
// Reserve update

        reserve.liquidityIndex = calculateLiquidityIndex( 
            rateData.currentLiquidityRate,
            timeDelta,
            reserve.liquidityIndex
        );

        // Update usage index (debt index) using compounded interest
        reserve.usageIndex = calculateUsageIndex(
            rateData.currentUsageRate,
            timeDelta,
            reserve.usageIndex
        );
```

```solidity
// Normalized income

    function getLiquidityIndex(ReserveData storage reserve, ReserveRateData storage rateData) internal view returns (uint256) {
        uint256 timeDelta = block.timestamp - uint256(reserve.lastUpdateTimestamp);
        if(timeDelta < 1) {
            return reserve.liquidityIndex;
        }

        return calculateLiquidityIndex(
            calculateLiquidityRate(rateData.currentUtilizationRate, rateData.currentUsageRate, rateData.protocolFeeRate, reserve.totalUsage),
            timeDelta,
            reserve.liquidityIndex
        );
    }
```

As you can see, it calculates the liquidity rate again in here. Only `protocolFeeRate` can change and can have different actual value here. It means if protocol changes protocol fee, it will return an incorrect value for normalized income.

> Note: Same situation happens in debt for different parameter changes.


## Recommendations

Do not calculate liquidity rate or usage rate in `getNormalizedIncome` and `getNormalizedDebt` instead, use the cached version.
