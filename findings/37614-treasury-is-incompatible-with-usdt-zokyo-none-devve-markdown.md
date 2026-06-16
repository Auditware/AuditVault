---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/stable
  - sector/token
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[unchecked-return-value]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# Treasury is Incompatible with USDT

- id: 37614
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


This bug report discusses an issue with the Treasury.sol contract, which uses `transfer` and `transferFrom` functions to interact with USDT. However, the USDT token does not fully comply with the ERC-20 standard, which can lead to unexpected behaviors and incompatibility with the contract. The report recommends using the SafeERC20 library from OpenZeppelin to handle these inconsistencies and ensure compatibility with tokens like USDT. The bug has been resolved, but it is still advised to implement proper handling for maximum safety.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The Treasury.sol contract uses `transfer` and `transferFrom` functions to interact with USDT. However, USDT does not fully comply with the ERC-20 standard and may not revert on failure and it also doesn’t return a boolean. This makes the contract incompatible with USDT in Ethereum and may lead to unexpected behaviors.

Upon reviewing the implementation code of the USDT token on Polygon, it appears that the issue present on Ethereum is not present there. However, it is still advisable to implement proper handling to ensure maximum safety.

**Recommendation**: 

Use SafeERC20 library from OpenZeppelin, which handles these inconsistencies and ensures compatibility with tokens like USDT.
