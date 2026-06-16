---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[fee-accounting]]"
  - "[[decimal-mismatch]]"
  - "[[underflow]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
---
# [H-06] `payOff()` underflow in `OperationalTreasury` locks assets permanently

- id: 57743
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


The report highlights a bug in the `payOff()` function of the `OperationalTreasury` contract. This function calculates `feesUSD` based on the full position size and current price, without considering the actual profit (`pnl`). This can lead to situations where the calculated `feesUSD` may exceed the `pnl`, causing an underflow and preventing the closure of the position. The bug is marked as high severity and medium likelihood. The report recommends capping the fees to prevent underflow and allow for position closure.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `payOff()` function in the `OperationalTreasury` contract calculates `feesUSD` based on the full position size and current price, without considering the actual profit (`pnl`). Specifically:

- `feesUSD = positionAmount × FeePercentage × CurrentPrice`
- `pnl = positionAmount × (CurrentPrice - StrikePrice)`

This means that for positions where `CurrentPrice` is only slightly above `StrikePrice`, the calculated `feesUSD` may exceed the `pnl`. In such cases,the `netAmount = pnl - feesUSD` line will **underflow**:

```solidity
    function payOff(uint256 positionID, address account) external override nonReentrant whenNotPaused {
        --snip--
@2>     IPositionInteraction(baseSetUp.pool).exerciseOrLiquidatePosition(close);

        uint256 feesUSD = _calculateFeesUSD(uAsset, uint256(amount)).toDecimals(18, baseSetUp.token.decimals());
@1>     uint256 netAmount = pnl - feesUSD;

        // fees deduced from PnL
        strg.ledger.collectedFees[address(baseSetUp.token)] += feesUSD;
        --snip--
    }
```

When `payOff()` reverts due to the underflow at `@1>`, the call to `exerciseOrLiquidatePosition()` at `@2>` is not executed. As a result, the **underlying assets in the pool remain locked forever**.

## Recommendations

Cap the fees to be no greater than the actual pnl to prevent underflow and allow position closure:

```solidity
uint256 feesUSD = _calculateFeesUSD(...);
if (feesUSD > pnl) {
    feesUSD = pnl;
}
uint256 netAmount = pnl - feesUSD;
```
