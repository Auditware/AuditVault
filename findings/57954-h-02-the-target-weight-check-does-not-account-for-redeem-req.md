---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Cove]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Cove-security-review_2024-12-30.md"
genome:
  - "[[integer-bounds]]"
  - "[[rounding-direction]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-02] The target weight check does not account for redeem request assets

- id: 57954
- impact: HIGH
- protocol: Cove_2024-12-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Cove-security-review_2024-12-30.md

## Summary


The report warns about a bug in the rebalance process of a financial system. It states that the system does not account for processed withdrawal requests when checking if the target balances are met. This means that if the total withdrawal value of the base asset exceeds 5% of the configured target weight, the rebalance process will fail and the current withdrawal request cannot be processed. The report recommends considering the total redeem request in the check to fix this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the rebalance process, target balances depend not only on the configured target weights but also on the withdraw requests processed within the rebalance epoch. However, when the `_isTargetWeightMet` check is performed within `proposeTokenSwap` and `completeRebalance`, it only considers the configured target weights and does not account for the processed withdraw requests.

```solidity
    function _isTargetWeightMet(
        BasketManagerStorage storage self,
        address[] calldata baskets,
        uint64[][] calldata basketsTargetWeights,
        address[][] calldata basketAssets,
        uint256[][] memory basketBalances,
        uint256[] memory totalValues
    )
        private
        view
        returns (bool)
    {
        // _isTargetWeightMet(self, baskets, basketTargetWeights, basketAssets, basketBalances, totalValues)
        // Check if total weight change due to all trades is within the _MAX_WEIGHT_DEVIATION threshold
        uint256 len = baskets.length;
        for (uint256 i = 0; i < len;) {
            // slither-disable-next-line calls-loop
            uint64[] calldata proposedTargetWeights = basketsTargetWeights[i];
            // nosemgrep: solidity.performance.state-variable-read-in-a-loop.state-variable-read-in-a-loop
            address[] calldata assets = basketAssets[i];
            // nosemgrep: solidity.performance.array-length-outside-loop.array-length-outside-loop
            uint256 proposedTargetWeightsLength = proposedTargetWeights.length;
            for (uint256 j = 0; j < proposedTargetWeightsLength;) {
                address asset = assets[j];
                uint256 assetValueInUSD =
                // nosemgrep: solidity.performance.state-variable-read-in-a-loop.state-variable-read-in-a-loop
                 self.eulerRouter.getQuote(basketBalances[i][j], asset, _USD_ISO_4217_CODE);
                // Rounding direction: down
                uint256 afterTradeWeight =
                    FixedPointMathLib.fullMulDiv(assetValueInUSD, _WEIGHT_PRECISION, totalValues[i]);
                if (MathUtils.diff(proposedTargetWeights[j], afterTradeWeight) > _MAX_WEIGHT_DEVIATION) {
                    return false;
                }
                unchecked {
                    // Overflow not possible: j is bounded by proposedTargetWeightsLength
                    ++j;
                }
            }
            unchecked {
                // Overflow not possible: i is bounded by len
                ++i;
            }
        }
        return true;
    }
```

This means that if the total withdrawal value of the base asset causes the base asset weight to deviate by more than `_MAX_WEIGHT_DEVIATION` (5%), the rebalance process will revert, and the current withdrawal request cannot be processed.

## Recommendations

Consider the total redeem request in the `_isTargetWeightMet` check.
