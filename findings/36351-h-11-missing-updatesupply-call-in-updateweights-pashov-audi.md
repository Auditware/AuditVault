---
tags:
  - lang/solidity
  - lang/vyper
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
  - sector/vault
  - sector/yield-aggregator
protocol: "[[Lucidly]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[fot-slippage]]"
---
# [H-11] Missing `_updateSupply` Call in `updateWeights`

- id: 36351
- impact: HIGH
- protocol: [[Lucidly]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Lucidly-security-review.md

## Summary


This bug report discusses an issue with the `updateWeights` function in the virtual balance product (`vb_prod`). The function updates the weights and balances, but does not include a call to `_updateSupply`, resulting in a stale `supply` value. This can cause problems with the accuracy of swaps and liquidity adjustments within the pool. The recommendation is to incorporate a call to `_updateSupply` within the `updateWeights` function to ensure that the supply state is synchronized.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

The `updateWeights` function updates the virtual balance product (`vb_prod`) but does not include a call to `_updateSupply`. This inconsistency can result in the use of a stale `supply`, affecting the accuracy of swaps and liquidity adjustments within the pool.

The issue is that this function does not update the supply. Since the weights and balances are updated, the supply also needs to be updated to sync up the state of the pool. The supply update is present in the yETH pool here:
[link](https://github.com/yearn/yETH/blob/8d831fd6b4de9f004d419f035cd2806dc8d5cf7e/contracts/Pool.vy#L690)

**Recommendations**

Incorporate a call to `_updateSupply` within the `updateWeights` function to ensure that the supply state is synchronized:

```diff
function updateWeights() external returns (bool) {
    _checkIfPaused();
    bool _updated = false;
    (uint256 _virtualBalanceProd, uint256 _virtualBalanceSum) = _unpackPoolVirtualBalance(packedPoolVirtualBalance);
    (_virtualBalanceProd, _updated) = _updateWeights(_virtualBalanceProd);
    if (_updated && _virtualBalanceSum > 0) {
+        uint256 _supply;
+        (_supply, _virtualBalanceProd) = _updateSupply(supply, _virtualBalanceProd, _virtualBalanceSum);
        packedPoolVirtualBalance = _packPoolVirtualBalance(_virtualBalanceProd, _virtualBalanceSum);
    }
    return _updated;
}
```
