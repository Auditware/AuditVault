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
  - "[[reward-accounting]]"
  - "[[reentrancy-guard]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [C-01] Decrease position can be abused to withdraw PnL twice

- id: 58127
- impact: HIGH
- protocol: GainsNetwork_2025-05-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md

## Summary


This bug report describes an issue in a code that handles decreasing user positions in a trading platform. The severity and likelihood of this bug are both high. The problem occurs when users decrease their position, which triggers a function called `executeDecreasePositionSizeMarket`. This function calculates various values that will be used to update the trade, but it does not consider previously withdrawn or realized profit and loss (PnL). This can cause users to withdraw PnL again, even though it has already been realized. The recommendation is to take into account the realized PnL when calculating the existing PnL.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

When users decrease their position, it will eventually trigger `executeDecreasePositionSizeMarket`.

```solidity
    function executeDecreasePositionSizeMarket(
        ITradingStorage.PendingOrder memory _order,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) external {
        // 1. Prepare vars
        ITradingStorage.Trade memory partialTrade = _order.trade;
        ITradingStorage.Trade memory existingTrade = _getMultiCollatDiamond().getTrade(
            partialTrade.user,
            partialTrade.index
        );
        IUpdatePositionSizeUtils.DecreasePositionSizeValues memory values;

        // 2. Refresh trader fee tier cache
        TradingCommonUtils.updateFeeTierPoints(
            existingTrade.collateralIndex,
            existingTrade.user,
            existingTrade.pairIndex,
            0
        );

        // 3. Base validation (trade open, market open)
        ITradingCallbacks.CancelReason cancelReason = _validateBaseFulfillment(existingTrade);

        // 4. If passes base validation, validate further
        if (cancelReason == ITradingCallbacks.CancelReason.NONE) {
            // 4.1 Prepare useful values (position size delta, closing fees, borrowing fees, etc.)
>>>         values = DecreasePositionSizeUtils.prepareCallbackValues(existingTrade, partialTrade, _answer);

            // 4.2 Further validation
            cancelReason = DecreasePositionSizeUtils.validateCallback(existingTrade, _order, values, _answer);

            // 5. If passes further validation, execute callback
            if (cancelReason == ITradingCallbacks.CancelReason.NONE) {
                // 5.1 Send collateral delta (partial trade value - fees) if positive or remove from trade collateral if negative
                // Then update trade collateral / leverage in storage, and reset trade borrowing fees
                DecreasePositionSizeUtils.updateTradeSuccess(existingTrade, values, _answer);

                // 5.2 Distribute closing fees
                TradingCommonUtils.processFees(existingTrade, values.positionSizeCollateralDelta, _order.orderType);
            }
        }

        // 6. If didn't pass validation and trade exists, charge gov fee and remove corresponding OI
        if (cancelReason != ITradingCallbacks.CancelReason.NONE)
            DecreasePositionSizeUtils.handleCanceled(existingTrade, cancelReason, _answer);

        // 7. Close pending decrease position size order
        _getMultiCollatDiamond().closePendingOrder(_answer.orderId);

        emit IUpdatePositionSizeUtils.PositionSizeDecreaseExecuted(
            _answer.orderId,
            cancelReason,
            existingTrade.collateralIndex,
            existingTrade.user,
            existingTrade.pairIndex,
            existingTrade.index,
            existingTrade.long,
            _answer.current,
            _getMultiCollatDiamond().getCollateralPriceUsd(existingTrade.collateralIndex),
            partialTrade.collateralAmount,
            partialTrade.leverage,
            values
        );
    }
```

Inside `executeDecreasePositionSizeMarket`, it will calculate all values that will be used to update the trade inside `DecreasePositionSizeUtils.prepareCallbackValues`.

```solidity
    function prepareCallbackValues(
        ITradingStorage.Trade memory _existingTrade,
        ITradingStorage.Trade memory _partialTrade,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) internal view returns (IUpdatePositionSizeUtils.DecreasePositionSizeValues memory values) {
        // 1. Calculate position size delta and existing position size
        bool isLeverageUpdate = _partialTrade.leverage > 0;
        values.positionSizeCollateralDelta = TradingCommonUtils.getPositionSizeCollateral(
            isLeverageUpdate ? _existingTrade.collateralAmount : _partialTrade.collateralAmount,
            isLeverageUpdate ? _partialTrade.leverage : _existingTrade.leverage
        );
        values.existingPositionSizeCollateral = TradingCommonUtils.getPositionSizeCollateral(
            _existingTrade.collateralAmount,
            _existingTrade.leverage
        );

        // 2. Calculate partial trade closing fees
        values.closingFeeCollateral = TradingCommonUtils.getTotalTradeFeesCollateral(
            _existingTrade.collateralIndex,
            _existingTrade.user,
            _existingTrade.pairIndex,
            values.positionSizeCollateralDelta,
            _existingTrade.isCounterTrade
        );

        // 3. Calculate new collateral amount and leverage
        values.newCollateralAmount = _existingTrade.collateralAmount - _partialTrade.collateralAmount;
        values.newLeverage = _existingTrade.leverage - _partialTrade.leverage;

        // 4. Apply spread and price impact to answer.current
        (values.priceImpact, ) = TradingCommonUtils.getTradeClosingPriceImpact(
            ITradingCommonUtils.TradePriceImpactInput(
                _existingTrade,
                _answer.current,
                values.positionSizeCollateralDelta,
                _answer.current
            )
        );

        // 5. Calculate existing trade pnl
>>>     values.existingPnlCollateral =
            (TradingCommonUtils.getPnlPercent(
                _existingTrade.openPrice,
                uint64(values.priceImpact.priceAfterImpact),
                _existingTrade.long,
                _existingTrade.leverage
            ) * int256(uint256(_existingTrade.collateralAmount))) /
            100 /
            int256(ConstantsUtils.P_10);

        // 6. Calculate value sent to trader
>>>     int256 partialTradePnlCollateral = (values.existingPnlCollateral * int256(values.positionSizeCollateralDelta)) /
            int256(values.existingPositionSizeCollateral);

        values.availableCollateralInDiamond = TradingCommonUtils.getTradeAvailableCollateralInDiamond(_existingTrade);
        values.availableCollateralInDiamond = _partialTrade.collateralAmount > values.availableCollateralInDiamond
            ? values.availableCollateralInDiamond
            : _partialTrade.collateralAmount;
        // @audit - should this consider pnl withdrawal
>>>     values.collateralSentToTrader = int256(uint256(_partialTrade.collateralAmount)) + partialTradePnlCollateral;

        // 7. Calculate existing and new trade liquidation price
        values.existingLiqPrice = TradingCommonUtils.getTradeLiquidationPrice(_existingTrade, _answer.current);
        values.newLiqPrice = TradingCommonUtils.getTradeLiquidationPrice(
            _existingTrade,
            _existingTrade.openPrice,
            values.newCollateralAmount,
            values.newLeverage,
            values.closingFeeCollateral +
                uint256(values.collateralSentToTrader < 0 ? -values.collateralSentToTrader : int256(0)),
            _getMultiCollatDiamond().getTradeLiquidationParams(_existingTrade.user, _existingTrade.index),
            _answer.current
        );
    }
```

When calculating `existingPnlCollateral`, it uses `_existingTrade.collateralAmount`. Then, when calculating `partialTradePnlCollateral`, it uses a portion of `existingPnlCollateral` based on `values.positionSizeCollateralDelta` and `values.existingPositionSizeCollateral`. However, none of these calculations consider withdrawn or realized PnL.

This will cause users to withdraw again PnL after previously already realized.

## Recommendations

Consider `realizedPnlCollateral` when calculating `values.existingPnlCollateral `.
