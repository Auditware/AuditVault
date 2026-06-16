---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Gains Network]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[logic/price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-02] `GetTradeSkewPriceImpactP` function ignores trade contract version

- id: 58129
- impact: HIGH
- protocol: GainsNetwork_2025-05-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review_2025-05-26.md

## Summary

The bug report states that there is a problem with the `PriceImpactUtils.getTradeSkewPriceImpactP` function. The function does not take into account the contract version, which causes the same skew price impact to be applied to all contract versions. This means that regardless of whether the skew price impact was applied when the trade was opened, half of the price impact will be applied when the trade is closed. The severity of this bug is medium and the likelihood of it occurring is high. The report recommends not applying the skew price impact at all when closing trades that were opened before the update, and applying the full size of the skew price impact when increasing positions for such trades.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `PriceImpactUtils.getTradeSkewPriceImpactP` does not take into account a trade contract version. This causes applying the same skew price impact to all contract versions.
So independent from whether the skew price impact was applied or not when the trade was opened, a half of the price impact will be applied during closing.

```solidity
    function getTradeSkewPriceImpactP(
        uint8 _collateralIndex,
        uint16 _pairIndex,
        bool _long,
        uint256 _tradeOpenInterestUsd, // 1e18 USD
        bool _open
    )
        internal
        view
        returns (
            int256 priceImpactP // 1e10 (%)
        )
    {
        IPriceImpact.PriceImpactValues memory v;

        v.tradePositiveSkew = (_long && _open) || (!_long && !_open);
        v.depth = _getStorage().pairSkewDepths[_collateralIndex][_pairIndex];
        v.tradeSkewMultiplier = v.tradePositiveSkew ? int256(1) : int256(-1);
>>      v.priceImpactDivider = int256(2); // so depth is on same scale as cumul vol price impact

        return
            _getTradePriceImpactP(
                TradingCommonUtils.getPairOiSkewCollateral(_collateralIndex, _pairIndex) *
                    int256(_getMultiCollatDiamond().getCollateralPriceUsd(_collateralIndex)),
                int256(_tradeOpenInterestUsd) * v.tradeSkewMultiplier,
                v.depth,
                ConstantsUtils.P_10,
                ConstantsUtils.P_10
>>          ) / v.priceImpactDivider;
    }
```

## Recommendations

Consider not applying the skew price impact at all when closing trades being opened before the update, i.e. contract version < 10 and applying the full size of the skew price impact when increasing positions for such trades.
