---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/lending
protocol: "[[GainsNetwork]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-July2.md"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[liquidation-underwater]]"
---
# [H-01] Inconsistent spread and price impact charges

- id: 40188
- impact: HIGH
- protocol: [[GainsNetwork]]-security-July2
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-July2.md

## Summary


This bug report discusses an inconsistency in the charging mechanisms for trades in a protocol. The bug allows users to exploit trades opened before a certain version to avoid full spread and price impact charges when modifying their positions. This can be done by increasing the position size, paying only 50% of the charges, and then decreasing the position size or closing the trade without any charges. To fix this, it is recommended to charge the full 100% spread and price impact percentage for trades opened before the specified version when increasing position sizes.

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
