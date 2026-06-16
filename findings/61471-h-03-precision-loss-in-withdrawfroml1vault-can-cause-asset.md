---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-26.md"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# [H-03] Precision loss in `_withdrawFromL1Vault()` can cause asset transfer reverts

- id: 61471
- impact: HIGH
- protocol: Blueberry_2025-03-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-26.md

## Summary


The report describes a bug in the `VaultEscrow::_withdrawFromL1Vault()` function where the withdrawal amount from the L1 vault can be less than the amount sent back to the EVM spot, causing a transaction on Hyperliquid L1 to revert. This means that although a redeem request has already succeeded, the user cannot withdraw their assets because they were not transferred to `VaultEscrow`. The bug occurs when there is a precision loss during the conversion of the withdrawal amount. To fix this, the recommendation is to modify the function to verify the converted amount or only send back the converted spot-decimal amount.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

In the `VaultEscrow::_withdrawFromL1Vault()` function, the withdrawal amount from the L1 vault can be **less than** the amount sent back to the EVM spot (when both are transformed to floating-point numbers). This discrepancy can cause the transaction on Hyperliquid L1, which sends assets back to the EVM spot, to revert, while the transaction on Hyper EVM to request redeem (`HyperEvmVault::requestRedeem()`) has already succeeded.  

As a result, the redeem request has already succeeded, but the user cannot withdraw assets because they were not transferred to `VaultEscrow`.

`VaultEscrow::_withdrawFromL1Vault()` function:
```solidity
function _withdrawFromL1Vault(uint64 assets_) internal {
    uint256 amountPerp = _scaleToPerpDecimals(assets_);
    // Withdraws assets from L1 vault
    L1_WRITE_PRECOMPILE.sendVaultTransfer(_vault, false, uint64(amountPerp));
    // Transfer assets to L1 spot
    L1_WRITE_PRECOMPILE.sendUsdClassTransfer(uint64(amountPerp), false);
    // Bridges assets back to escrow's EVM account
=>  L1_WRITE_PRECOMPILE.sendSpot(assetSystemAddr(), _assetIndex, assets_);
}
```

Specifically, the withdrawal amount from the L1 vault is `amountPerp`, the amount sent back to the EVM spot is `assets_` and the conversion is done as `amountPerp = _scaleToPerpDecimals(assets_)`.  If `_perpDecimals` is less than `_evmSpotDecimals`, precision loss occurs, which may lead to a revert when sending assets back to the EVM spot.  Example case:

Assume:  

- `_perpDecimals = 6`  
- `_evmSpotDecimals = 8`  
- `assets_ = 100001111`  

Then:  

- `amountPerp = assets_ / 10^2 = 1000011`  
- When `amountPerp` is transformed back to spot decimals, the transformed value is `100001100`, which is less than `100001111`.  
- As a result, the transaction on Hyperliquid L1 to send assets back to the EVM spot reverts.

## Recommendations

Modify the `VaultEscrow::_withdrawFromL1Vault()` function to verify that `amountPerp` when transformed back to spot decimals is equal to `assets_`, or only send back the transformed spot-decimal amount.

 ```diff
function _withdrawFromL1Vault(uint64 assets_) internal {
    uint256 amountPerp = _scaleToPerpDecimals(assets_);
    // Withdraws assets from L1 vault
    L1_WRITE_PRECOMPILE.sendVaultTransfer(_vault, false, uint64(amountPerp));
    // Transfer assets to L1 spot
    L1_WRITE_PRECOMPILE.sendUsdClassTransfer(uint64(amountPerp), false);
    // Bridges assets back to escrow's EVM account
-   L1_WRITE_PRECOMPILE.sendSpot(assetSystemAddr(), _assetIndex, assets_);
+   L1_WRITE_PRECOMPILE.sendSpot(assetSystemAddr(), _assetIndex, _scaleToSpotDecimals(amountPerp));
}
```
