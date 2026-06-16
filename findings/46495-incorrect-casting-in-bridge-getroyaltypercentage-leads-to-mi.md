---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/bridge
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Sweep n Flip]]"
auditors:
  - "[[slowfi]]"
report: "https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[royalty-edge-cases]]"
---
# Incorrect casting in Bridge::_getRoyaltyPercentage leads to miscalculated royalty fees 

- id: 46495
- impact: HIGH
- protocol: [[Sweep n Flip]]
- reporter: slowfi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf

## Summary


The bug report is about an error in the Bridge contract's _getRoyaltyPercentage function. This function uses the ERC2981::royaltyInfo function to get royalty information, but it treats the returned royalty amount as a percentage instead of a numerical value. This causes problems when the function is used with an arbitrary and small sale price, as it does not accurately represent the royalty percentage. This can result in users overpaying royalties or project losing out on royalties. The recommendation is to refactor the function to properly calculate the royalty percentage based on the sale price. The bug has been fixed in the snf-bridge-contracts-v1 PR 12. However, there is a possibility of the function reverting in some situations if the NFT IDs start from one instead of zero.

## Details

## Bridge Contract - _getRoyaltyPercentage Function Issue

## Context
Bridge.sol#L248

## Description
The `_getRoyaltyPercentage` function in the Bridge contract attempts to get royalty information using the `ERC2981::royaltyInfo` function but incorrectly treats the returned royalty amount as a royalty percentage. 

Moreover, this function passes in an arbitrary and small sale price (10000) for royalty calculations, which doesn't provide accurate percentage representation. For example, if an NFT contract specifies a 1% royalty, `royaltyInfo(0, 1000)` returns 10 (1% of 1000). The returned value of 10 is treated as the `royaltyPercentage`. However, in the callback case, the function returns `1e15` (0.001 ether) for the same 1%. 

This discrepancy will result in unexpected behavior, where either the user will overpay royalties or the projects might lose royalties.

## Recommendation
Consider refactoring the `_getRoyaltyPercentage` function to return the proper `royaltyPercentage` based on the `salePrice` passed in.

## Additional Notes
- **Sweep n' Flip**: Fixed in PR 12 of `snf-bridge-contracts-v1`.
- **Cantina Managed**: Verified fix. Although the function operates correctly, the hardcoded tokenID: 0 may revert in some situations if the NFT IDs start from one instead of zero.
