---
tags:
  - lang/solidity
  - sector/nft
  - sector/nft-marketplace
  - platform/quantstamp
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[NiftyApes]]"
auditors:
  - "[[Michael Boyle]]"
report: "https://certificate.quantstamp.com/full/nifty-apes-seller-financing/edbc671f-08c9-44ab-b24c-c3807c9ef43d/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Locked Funds when Fulfilling Seaport Orders

- id: 60495
- impact: HIGH
- protocol: [[NiftyApes]] - Seller Financing
- reporter: Michael Boyle (Quantstamp)
- source: https://certificate.quantstamp.com/full/nifty-apes-seller-financing/edbc671f-08c9-44ab-b24c-c3807c9ef43d/index.html

## Summary


The client has marked a bug as "Fixed" in the file `SellerFinancing.sol`. The bug caused offerings that were not WETH to be locked forever after a Seaport order was fulfilled. This was because the `_validateSaleOrder()` function did not check if the length of `order.parameters.offer` was 1, allowing for offers to be accepted that received tokens outside of WETH. This resulted in additional funds being locked in the contract without a way to withdraw them. The recommendation is to add a check for the length of `order.parameters.offer` in the `_validateSaleOrder()` function to limit offers to only WETH.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `9640068555ab08295853e53a1bf1e4d47e21227a`. The client provided the following explanation: Add seaport order validation for only one `order.offer` item.

**File(s) affected:**`SellerFinancing.sol`

**Description:** Any offerings that are not WETH are locked forever after fulfilling a Seaport order. `_validateSaleOrder()` does not ensure that the length of `order.parameters.offer[]` is 1, meaning that there could be offers accepted that receive tokens outside of WETH. Since only WETH is transferred to the buyer, any additional funds would be locked in the contract without a method to withdraw them.

**Recommendation:** If offers are to be limited to WETH, ensure that the length of `order.parameters.offer` is 1 as an additional check in `_validateSaleOrder()`.
