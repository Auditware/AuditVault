---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Cove]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Cove-security-review_2024-12-30.md"
genome:
  - "[[fee-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[integer-bounds]]"
---
# [H-01] Incorrect basket USD value will cause incorrect results

- id: 57953
- impact: HIGH
- protocol: Cove_2024-12-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Cove]]-security-review_2024-12-30.md

## Summary


The report describes a bug in a token swap function that causes the total value of a basket to be inaccurate due to fees being applied during the internal trades process. This results in the deviation weight check being inaccurate and potentially causing errors in the swap. The recommendation is to provide the total values array during the internal trades process and account for the fees applied.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Upon proposing a token swap, we have the following sequence of function calls:

```solidity
uint256[] memory totalValues = new uint256[](numBaskets);
// 2d array of asset balances for each basket
uint256[][] memory basketBalances = new uint256[][](numBaskets);
_initializeBasketData(self, baskets, basketAssets, basketBalances, totalValues);
// NOTE: for rebalance retries the internal trades must be updated as well
_processInternalTrades(self, internalTrades, baskets, basketBalances);
_validateExternalTrades(self, externalTrades, baskets, totalValues, basketBalances);
if (!_isTargetWeightMet(self, baskets, basketTargetWeights, basketAssets, basketBalances, totalValues)) {
         revert TargetWeightsNotMet();
}
```

The `totalValues` array is the total USD value of a basket, a basket per element of the array. It is populated upon calling `_initialBasketData()`, then it is provided in `_validateExternalTrades()` where the array is manipulated based on the trades. Afterwards, it is used upon checking the deviation in `_isTargetWeightMet()`:

```solidity
uint256 afterTradeWeight = FixedPointMathLib.fullMulDiv(assetValueInUSD, _WEIGHT_PRECISION, totalValues[i]);
if (MathUtils.diff(proposedTargetWeights[j], afterTradeWeight) > _MAX_WEIGHT_DEVIATION) {
         return false;
}
```

The code functions correctly assuming that the USD value of a basket stays stationary during the `_processInternalTrades()` during the call. However, that is not actually the case due to the fact that there is a fee upon processing the internal trades:

```solidity
if (swapFee > 0) {
                info.feeOnSell = FixedPointMathLib.fullMulDiv(trade.sellAmount, swapFee, 20_000);
                self.collectedSwapFees[trade.sellToken] += info.feeOnSell;
                emit SwapFeeCharged(trade.sellToken, info.feeOnSell);
            }
if (swapFee > 0) {
                info.feeOnBuy = FixedPointMathLib.fullMulDiv(initialBuyAmount, swapFee, 20_000);
                self.collectedSwapFees[trade.buyToken] += info.feeOnBuy;
                emit SwapFeeCharged(trade.buyToken, info.feeOnBuy);
            }
```

This results in the USD value of both the `fromBasket` and the `toBasket` going down based on the fee amount, thus the deviation weight check will be inaccurate as the `totalValues` array is not changed during the internal trades processing, it is out-of-sync.

## Recommendations

Provide the total values array upon processing the internal trades and account for the fees applied.

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
