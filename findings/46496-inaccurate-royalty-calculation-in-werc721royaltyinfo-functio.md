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
# Inaccurate royalty calculation in WERC721::royaltyInfo function 

- id: 46496
- impact: HIGH
- protocol: [[Sweep n Flip]]
- reporter: slowfi (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sweepnflip_bridge_november2024.pdf

## Summary


This bug report is about a mismatch in how two contracts, Bridge and WERC721, handle royalty percentages. The Bridge contract uses 0.001 ether to represent 1%, while WERC721 assumes 0.01 ether represents 1%. This results in royalties being significantly lower than intended. The impact example shows that while the intended royalty amount should be 1%, it is actually calculated as 0.1%. The recommendation is to align the percentage representations between the contracts to ensure accurate calculations. The bug has been fixed in the snf-bridge-contracts-v1 PR 11 and verified by Cantina Managed. The risk level is medium.

## Details

## Context
**File:** WERC721.sol#L70  
**Description:** A unit mismatch exists between how the Bridge and WERC721 contracts handle royalty percentages. The Bridge contract uses 0.001 ether to represent 1%, while WERC721's `royaltyInfo` calculates with the assumption that 0.01 ether represents 1%. This results in royalties being multiple times lower than intended.

## Bridge Contract Default Percentage
```solidity
function _getRoyaltyPercentage(address nftContract) internal view returns (uint256) {
    try IERC2981(nftContract).royaltyInfo(0, 10000) returns (address, uint256 royaltyAmount) {
        return royaltyAmount > 0 ? royaltyAmount : 0.001 ether; // 1% if undefined
    } catch {
        return 0.001 ether; // 1% default
    }
}
```

## WERC721 Royalty Calculation
```solidity
// In WERC721.sol
function royaltyInfo(uint256 tokenId_, uint256 salePrice_) public view override returns (address receiver, uint256 royaltyAmount) {
    uint256 percentage = s_royaltyInfo.originalPercentage + s_royaltyInfo.wrapperPercentage;
    console.log("percentage", percentage);
    return (s_royaltyInfo.receiver, salePrice_ * percentage / 1 ether);
}
```

## Impact Example
- **In Bridge:**
  - `defaultRoyalty = 0.001 ether` // Intended to be 1%
  
- **In WERC721:**
  - `salePrice = 1 ether`
  - `royaltyAmount = 1 ether * 0.001 ether / 1 ether = 0.001 ether` // Actually 0.1%
  
- **Expected:**
  - `royaltyAmount = 1 ether * 1 / 100 = 0.01 ether` // Should be 1%

## Recommendation
Consider aligning percentage representations between contracts to ensure the royalty calculations are accurate.

### Sweep n' Flip
Fixed in `snf-bridge-contracts-v1` PR 11.

### Cantina Managed
Verified fix. The constant for 1% is now updated to be 100, and the overall calculation works as expected in the `royaltyInfo` function.
