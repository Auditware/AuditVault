---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
protocol: "[[Gains Network]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-July2.md"
genome:
  - "[[fee-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] Inconsistent spread and price impact charges

- id: 58121
- impact: HIGH
- protocol: GainsNetwork-security-July2
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-July2.md

## Summary


This bug report discusses an inconsistency in the spread and price impact charging mechanisms for trades in a protocol. The bug allows users to exploit trades opened before version 9.2 by avoiding full spread and price impact charges when modifying their positions. This occurs because when increasing position sizes, only 50% of the spread and price impact is charged regardless of when the trade was opened. However, when reducing position size or closing the trade, no spread or price impact is charged for trades opened before version 9.2. This allows users to increase their position size with reduced charges and then decrease their position or close the trade without any charges. The report recommends fixing this inconsistency by charging the full 100% spread and price impact for trades opened before version 9.2 when increasing position sizes.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The protocol implements different spread and price impact charging mechanisms for trades opened before and after v9.2. However, inconsistency in these mechanisms allows users to exploit pre-v9.2 trades to avoid full spread and price impact charges when modifying their positions.

When increasing position sizes, the spread and price impact percentage are charged 50% regardless of trade opened before or after v9.2.

```solidity
    function prepareCallbackValues(
        ITradingStorage.Trade memory _existingTrade,
        ITradingStorage.Trade memory _partialTrade,
        ITradingCallbacks.AggregatorAnswer memory _answer
    ) internal view returns (IUpdatePositionSizeUtils.IncreasePositionSizeValues memory values) {
        ...
        // 3. Calculate price impact values
        (, values.priceAfterImpact) = _getMultiCollatDiamond().getTradePriceImpact(
            TradingCommonUtils.getMarketExecutionPrice(_answer.price, _answer.spreadP, _existingTrade.long, true), // @audit charge half of spread and price impact regardless of trade opened before or after v9.2
            _existingTrade.pairIndex,
            _existingTrade.long,
            _getMultiCollatDiamond().getUsdNormalizedValue(
                _existingTrade.collateralIndex,
                values.positionSizeCollateralDelta
            ),
            false,
            true,
            0
        );
        ...
    }
```

However, when reducing position size or close trade, if the trade opened before v9.2, no spread or price impact is charged.

```solidity
function getTradeClosingPriceImpact(
        ITradingCommonUtils.TradePriceImpactInput memory _input
    ) external view returns (uint256 priceImpactP, uint256 priceAfterImpact, uint256 tradeValueCollateralNoFactor) {
        ITradingStorage.Trade memory trade = _input.trade;

        // 0. If trade opened before v9.2, return market price (no closing spread or price impact)
        if (_getMultiCollatDiamond().getTradeLiquidationParams(trade.user, trade.index).maxLiqSpreadP == 0) {
            return (0, _input.marketPrice, 0);
        }
        ...
    }
```

This inconsistency creates an exploit:

- Users with open trades from before v9.2 can increase their position size, paying only 50% of spread and price impact.
- They can then decrease their position size or close the trade without any spread or price impact charges.

## Recommendations

When increasing position sizes, charge the 100% spread and price impact percentage if the trade was opened before v9.2.
