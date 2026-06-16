---
tags:
  - lang/solidity
  - sector/lending
  - has/github
  - severity/high
protocol: "[[Gains Network]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# [H-04] Traders could lose assets when increasing counter trade position size

- id: 58131
- impact: HIGH
- protocol: GainsNetwork_2025-05-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md

## Summary


This bug report describes an issue where the amount of collateral returned to users is inaccurate when requesting an increase in position size. This can result in a loss of funds for users. The report suggests including the `counterTradeCollateralToReturn` value in the calculation when returning funds to users.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

When users request an increase in position size, it will eventually be executed, triggering `executeIncreasePositionSizeMarket`.

```solidity
    function executeIncreasePositionSizeMarket(
        ITradingStorage.PendingOrder memory _order,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) external {
        // 1. Prepare vars
        ITradingStorage.Trade memory partialTrade = _order.trade;
        ITradingStorage.Trade memory existingTrade = _getMultiCollatDiamond().getTrade(
            partialTrade.user,
            partialTrade.index
        );
        IUpdatePositionSizeUtils.IncreasePositionSizeValues memory values;
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
            // 4.1 Prepare useful values (position size delta, pnl, fees, new open price, etc.)
>>>         values = IncreasePositionSizeUtils.prepareCallbackValues(existingTrade, partialTrade, _answer);

            // 4.2 Further validation
>>>         cancelReason = IncreasePositionSizeUtils.validateCallback(
                existingTrade,
                values,
                _answer,
                partialTrade.openPrice,
                _order.maxSlippageP
            );

            // 5. If passes further validation, execute callback
            if (cancelReason == ITradingCallbacks.CancelReason.NONE) {
                // 5.1 Update trade collateral / leverage / open price in storage, and reset trade borrowing fees
                IncreasePositionSizeUtils.updateTradeSuccess(_answer.orderId, existingTrade, values, _answer);
                // 5.2 Distribute opening fees and store fee tier points for position size delta
                TradingCommonUtils.processFees(existingTrade, values.positionSizeCollateralDelta, _order.orderType);
            }
        }

        // 6. If didn't pass validation, charge gov fee (if trade exists) and return partial collateral (if any)
        if (cancelReason != ITradingCallbacks.CancelReason.NONE)
>>>         IncreasePositionSizeUtils.handleCanceled(existingTrade, partialTrade, cancelReason, _answer);

        // 7. Close pending increase position size order
        _getMultiCollatDiamond().closePendingOrder(_answer.orderId);

        emit IUpdatePositionSizeUtils.PositionSizeIncreaseExecuted(
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

Inside `executeIncreasePositionSizeMarket`, `prepareCallbackValues` is called to calculate all values required for increasing the position size, including `values.counterTradeCollateralToReturn` if the position has `isCounterTrade` set to true. In this case, `_partialTrade.collateralAmount` will also be decreased by `values.counterTradeCollateralToReturn`.

```solidity
    function prepareCallbackValues(
        ITradingStorage.Trade memory _existingTrade,
        ITradingStorage.Trade memory _partialTrade,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) internal view returns (IUpdatePositionSizeUtils.IncreasePositionSizeValues memory values) {
        // 1.1 Calculate position size delta
        bool isLeverageUpdate = _partialTrade.collateralAmount == 0;
        values.positionSizeCollateralDelta = TradingCommonUtils.getPositionSizeCollateral(
            isLeverageUpdate ? _existingTrade.collateralAmount : _partialTrade.collateralAmount,
            _partialTrade.leverage
        );

        // 1.2 Validate counter trade and update position size delta if needed
        if (_existingTrade.isCounterTrade) {
>>>         (values.isCounterTradeValidated, values.exceedingPositionSizeCollateral) = TradingCommonUtils
                .validateCounterTrade(_existingTrade, values.positionSizeCollateralDelta);

            if (values.isCounterTradeValidated && values.exceedingPositionSizeCollateral > 0) {
                if (isLeverageUpdate) {
                    // For leverage updates, simply reduce leverage delta to reach 0 skew
                    _partialTrade.leverage -= uint24(
                        (values.exceedingPositionSizeCollateral * 1e3) / _existingTrade.collateralAmount
                    );
                } else {
                    // For collateral adds, reduce collateral delta to reach 0 skew
                    values.counterTradeCollateralToReturn =
                        (values.exceedingPositionSizeCollateral * 1e3) /
                        _partialTrade.leverage;
>>>                 _partialTrade.collateralAmount -= uint120(values.counterTradeCollateralToReturn);
                }

                values.positionSizeCollateralDelta = TradingCommonUtils.getPositionSizeCollateral(
                    isLeverageUpdate ? _existingTrade.collateralAmount : _partialTrade.collateralAmount,
                    _partialTrade.leverage
                );
            }
        }

        // ...
    }
```

However, if `validateCallback` return non `CancelReason.NONE` and `handleCanceled` is triggered. it will only send `_partialTrade.collateralAmount` to the user and not considering `values.counterTradeCollateralToReturn`.

```solidity
    function handleCanceled(
        ITradingStorage.Trade memory _existingTrade,
        ITradingStorage.Trade memory _partialTrade,
        ITradingCallbacks.CancelReason _cancelReason,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) internal {
        // 1. Charge gov fee on trade (if trade exists)
        if (_cancelReason != ITradingCallbacks.CancelReason.NO_TRADE) {
            // 1.1 Distribute gov fee
            uint256 govFeeCollateral = TradingCommonUtils.getMinGovFeeCollateral(
                _existingTrade.collateralIndex,
                _existingTrade.user,
                _existingTrade.pairIndex
            );
            uint256 finalGovFeeCollateral = _getMultiCollatDiamond().realizeTradingFeesOnOpenTrade(
                _existingTrade.user,
                _existingTrade.index,
                govFeeCollateral,
                _answer.current
            );
            TradingCommonUtils.distributeExactGovFeeCollateral(
                _existingTrade.collateralIndex,
                _existingTrade.user,
                finalGovFeeCollateral
            );
        }

        // 2. Send back partial collateral to trader
        TradingCommonUtils.transferCollateralTo(
            _existingTrade.collateralIndex,
            _existingTrade.user,
>>>         _partialTrade.collateralAmount
        );
    }
```

This will cause the collateral amount returned to users to be inaccurate, resulting in a loss of funds.

## Recommendations

Also consider `values.counterTradeCollateralToReturn` when returning funds inside `handleCanceled`

```diff
//...
        // 2. Send back partial collateral to trader
        TradingCommonUtils.transferCollateralTo(
            _existingTrade.collateralIndex,
            _existingTrade.user,
-            _partialTrade.collateralAmount
+            _partialTrade.collateralAmount + values.counterTradeCollateralToReturn
        );
//...
```
