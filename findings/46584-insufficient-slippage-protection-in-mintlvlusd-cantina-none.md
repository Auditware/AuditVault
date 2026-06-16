---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/lending
protocol: "[[Level Money]]"
auditors:
  - "[[Mario Poneder]]"
report: "https://cdn.cantina.xyz/reports/cantina_level_money_october_2024.pdf"
genome:
  - "[[precision-loss]]"
  - "[[sandwich]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
---
# Insuﬃcient slippage protection in mintlvlUSD 

- id: 46584
- impact: HIGH
- protocol: [[Level Money]]
- reporter: Mario Poneder (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_level_money_october_2024.pdf

## Summary


The report discusses a bug in the mintlvlUSD method of the LevelBaseReserveManager contract. This method is responsible for creating and submitting a MINT order to the LevelMinting contract to mint lvlUSD tokens. The bug occurs when the minimum lvlUSDAmount, which serves as a slippage protection, is overwritten by the allowed slippage amount. This can lead to potential losses for the receiver or collateral provider. The bug has a high impact as it exposes the receiver or collateral provider to maximum slippage risk, potentially resulting in severe losses. The likelihood of the bug occurring is high, as every call to mintlvlUSD is subject to the full slippage risk. The recommended solution is to subtract the slippage amount from lvlUSDAmount to arrive at the desired minimum lvlUSDAmount. The bug has been fixed in PR 25 and has also been addressed by Cantina Managed.

## Details

## Issue Summary

## Context
**File**: LevelBaseReserveManager.sol  
**Line**: 215-L219

## Description
In the `mintlvlUSD` method, the minimum `lvlUSDAmount` (slippage protection) is overwritten by the allowed slippage amount leading to a negligibly low minimum `lvlUSDAmount`, which can cause potential losses for the receiver/collateral provider.

The `mintlvlUSD` method of the `LevelBaseReserveManager` contract is responsible for creating and submitting a MINT order to the `LevelMinting` contract to mint the appropriate amount of `lvlUSD` for the given amount of collateral. This order includes a minimum `lvlUSDAmount` which serves as a slippage parameter ensuring that the receiver/collateral provider is not at a loss due to an unexpectedly low amount of minted `lvlUSD`. 

Of course, one cannot always expect full 1:1 minting; therefore, an amount proportional to `maxSlippageThresholdBasisPoints` is intended to be the allowed slippage:

```solidity
// Apply max slippage threshold
lvlUSDAmount = lvlUSDAmount.mulDiv(
    maxSlippageThresholdBasisPoints,
    MAX_BASIS_POINTS
);
```

However, instead of subtracting the allowed slippage amount from the minimum `lvlUSDAmount`, it is overwritten by this small amount, effectively eliminating the slippage protection.

## Impact
Having a negligibly low minimum `lvlUSDAmount` exposes the receiver/collateral provider to a maximum slippage risk in terms of minted `lvlUSD` vs. provided collateral, which can turn out to be a severe loss.

## Likelihood
With `maxSlippageThresholdBasisPoints` initially being set to 5 (5 bps = 0.05%), every call to `mintlvlUSD` is subject to a full slippage risk.

## Recommendation
It is recommended to subtract the slippage amount from `lvlUSDAmount` to arrive at the desired minimum `lvlUSDAmount`:

```solidity
// Apply max slippage threshold
- lvlUSDAmount = lvlUSDAmount.mulDiv(
+ lvlUSDAmount -= lvlUSDAmount.mulDiv(
    maxSlippageThresholdBasisPoints,
    MAX_BASIS_POINTS
);
```

## Level
Fixed in PR 25.

## Cantina Managed
Fixed.
