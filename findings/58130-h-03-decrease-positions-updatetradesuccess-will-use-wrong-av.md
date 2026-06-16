---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
protocol: "[[Gains Network]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md"
genome:
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Decrease position's `updateTradeSuccess` will use wrong `availableCollateralInDiamond`

- id: 58130
- impact: HIGH
- protocol: GainsNetwork_2025-05-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md

## Summary


The bug report discusses a problem where the closing fee is not properly considered when transferring collateral in a trading program. This can result in an incorrect amount of collateral being pulled from the vault. The report suggests including the closing fee when transferring collateral to fix the issue.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Inside the Decrease Position's `updateTradeSuccess`, the closing fee is deducted from the user. However, it is not considered when providing `_values.availableCollateralInDiamond` to the `handleTradeValueTransfer` operation.

```solidity
    function updateTradeSuccess(
        ITradingStorage.Trade memory _existingTrade,
        IUpdatePositionSizeUtils.DecreasePositionSizeValues memory _values,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) internal {
        // 1. Update trade in storage
        _getMultiCollatDiamond().updateTradePosition(
            ITradingStorage.Id(_existingTrade.user, _existingTrade.index),
            _values.newCollateralAmount,
            _values.newLeverage,
            _existingTrade.openPrice, // open price stays the same
            ITradingStorage.PendingOrderType.MARKET_PARTIAL_CLOSE, // don't refresh liquidation params
            _values.existingPnlCollateral > 0,
            _answer.current
        );
        // 2. Realize trading fees and negative pnl (leverage decrease)
>>>     _getMultiCollatDiamond().realizeTradingFeesOnOpenTrade(
            _existingTrade.user,
            _existingTrade.index,
            _values.closingFeeCollateral +
                (_values.collateralSentToTrader < 0 ? uint256(-_values.collateralSentToTrader) : 0), // reduces collateral available in diamond
            _answer.current
        );

        // 3. Handle collateral/pnl transfers
        TradingCommonUtils.handleTradeValueTransfer(
            _existingTrade,
            _values.collateralSentToTrader,
>>>         int256(_values.availableCollateralInDiamond)
        );
    }
```

This will cause `handleTradeValueTransfer` to process an incorrect amount of collateral that needs to be pulled from the vault.

## Recommendations

Consider including `closingFeeCollateral` when providing `availableCollateralInDiamond` to `handleTradeValueTransfer`.

```diff
// ...
        // 3. Handle collateral/pnl transfers
        TradingCommonUtils.handleTradeValueTransfer(
            _existingTrade,
            _values.collateralSentToTrader,
-            int256(_values.availableCollateralInDiamond)
+            int256(_values.availableCollateralInDiamond - _values.closingFeeCollateral)
        );
// ...
```
