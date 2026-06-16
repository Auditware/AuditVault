---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/vault
protocol: "[[Superform]]"
auditors:
  - "[[MiloTruck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# Cancelled redeem requests make shares permanently unredeemable

- id: 63081
- impact: HIGH
- protocol: [[Superform]] v2 Periphery
- reporter: MiloTruck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Superform-v2-periphery-Spearbit-Security-Review-June-2025.pdf

## Summary


This bug report is about a problem in the `SuperVaultStrategy.sol` code, specifically in lines 609, 612, and 951. When a user cancels a request to redeem their shares, it deletes important information that is needed for future redeem requests. This means that the user will not be able to successfully redeem their shares later on. This bug can happen if a user cancels their request for any reason. The recommendation is to store the details of the cancelled request separately so that the important information can be restored when needed. 

## Details

## Severity: High Risk

## Context
- `SuperVaultStrategy.sol#L609`
- `SuperVaultStrategy.sol#L612`
- `SuperVaultStrategy.sol#L951`

## Summary
When a user cancels a pending redeem request, the deletion of the entire `superVaultState[controller]` struct removes properties that are required for subsequent redeem requests. When the user later tries to redeem their shares again, the fulfillment of the request will always fail.

## Description
When a user initially deposits assets, the shares and the assets associated with the deposit are stored in:
- `superVaultState[controller].accumulatorShares`
- `superVaultState[controller].accumulatorCostBasis`

These values can only be updated by way of `SuperVaultStrategy`'s `_handleDeposit` function.

If the user creates a redeem request and then cancels it, `_handleCancelRedeem` deletes the entire `superVaultState[controller]` struct before returning the shares back to the user from `SuperVaultEscrow`. This is a problem, because subsequent calls to `fulfillRedeemRequests` to process this user's shares will revert with the `INSUFFICIENT_SHARES()` error after checking if `requestedShares > state.accumulatorShares`. Even if a partial fix restored `accumulatorShares` alone, the zeroed-out `accumulatorCostBasis` would break the cost basis calculation, leading to incorrect fee and asset distribution.

## Impact Explanation
The only way for a user to redeem their shares is by way of this asynchronous `requestRedeem` process. Users will be permanently unable to redeem their shares after having cancelled a previous request to redeem them.

## Likelihood Explanation
This will happen for any cancelled redeem request, so it's as likely to occur as users are likely to cancel a request for any reason.

## Recommendation
Consider storing a separate struct with the details of the pending request, so that `_handleCancelRedeem` can easily restore:
- `superVaultState[controller].accumulatorShares`
- `superVaultState[controller].accumulatorCostBasis`
- `superVaultState[controller].averageWithdrawPrice`

with the values they held prior to the redeem request. This pending struct can be deleted when the request is fulfilled.
