---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
protocol: "[[Bando]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-11-25-Bando.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# Fund locked due to lack of an implementation for withdrawing service fees

- id: 45849
- impact: HIGH
- protocol: [[Bando]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-11-25-Bando.md

## Summary


The BandoRouterV1 contract has a critical bug where the service fees paid by the caller are locked in the contract forever. This bug has been resolved, but it is important for beginners to understand that the bug was caused by the requestService() function not properly handling the payment of service fees. To fix this bug, a new function should be added to allow for the withdrawal of these locked service fees.

## Details

**Severity**: Critical

**Status**: Resolved

**Location**: BandoRouterV1.sol

**Description**

In the BandoRouterV1 contract, the requestService() function requires the caller to pay the sum of request.weiAmount and service.feeAmount.
```solidity
(bool success, uint256 total_amount) = request.weiAmount.tryAdd(service.feeAmount);
if (!success) {
    revert OverflowError();
}
       
if (msg.value != total_amount) {
    revert AmountMismatch();
}
```

But the function calls the _escrow.deposit() function with only request.weiAmount and service.feeAmount is locked in the contract.
```solidity
IBandoFulfillable(_escrow).deposit{value: request.weiAmount}(serviceID, request);
```

There is no implementation to withdraw this service fee in the contract and the fees are locked forever.

**Recommendation**: 

Add a function to withdraw the service fees locked in the contract.
