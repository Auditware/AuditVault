---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[LEND]]"
auditors:
  - FalseGenius
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-underwater]]"
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[redesign-logic]]"
---
# H-18: Incorrect `srcEid` check in `borrowWithInterest()`

- id: 58387
- impact: HIGH
- protocol: LEND
- reporter: FalseGenius (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `borrowWithInterest()` function in the `LendStorage.sol` file. The function incorrectly checks for `srcEid == currentEid` on the source chain, causing it to always return zero for existing cross-chain borrows on Chain A. This is because borrow records store `destEid` as the current chain ID, not `srcEid`. This mismatch causes the function to ignore valid borrows. As a result, cross-chain liquidations are not possible and the borrowed amount is seen as zero, leading to incorrect determinations of liquidation eligibility. No response or mitigation has been provided at this time. 

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/831 

## Found by 
FalseGenius, JeRRy0422, Kvar, Waydou, ggg\_ttt\_hhh, jokr, rudhra1749

### Summary

NOTE: This is a different issue from the one in the same function involving the line `if (collaterals[i].destEid == currentEid && collaterals[i].srcEid == currentEid)`. That issue concerns chain B, where repayments happen. The issue described here is about the other if statement, which affects chain A, where borrows originate.

`LendStorage.sol#borrowWithInterest()` incorrectly checks `borrows[i].srcEid == currentEid` on the source chain (Chain A), but borrow records store destEid as the current chain ID. This causes the function to always return zero for existing cross-chain borrows on Chain A.

### Root Cause

`LeadStorage.sol#borrowWithInterest()` uses the wrong chain ID field for filtering borrows on the source chain. It checks if `srcEid == currentEid`, which does not match how borrow records are stored. This condition will never be true on chain A (where `userBorrows` exist) because the borrow’s `destEid`  (not `srcEid`) equals the current chain ID. This mismatch causes the function to ignore valid borrows.

When a borrow is stored in `userBorrows`, the `srcEid` is set as Chain B and the `destEid` as Chain A. This happens on Chain A and can be seen [here](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CrossChainRouter.sol#L722). In this scenario, `srcEid` corresponds to Chain B while `currentEid` refers to Chain A.

### Internal Pre-conditions

N/A

### External Pre-conditions

N/A

### Attack Path

N/A

### Impact

Calling `borrowWithInterest()` on chain A will always return 0, making cross-chain liquidations impossible. Since `_checkLiquidationValid` is called on chain A, it sees the borrowed amount as zero and incorrectly determines the position is not liquidatable.

### PoC

_No response_

### Mitigation

_No response_
