---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Bando]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-11-25-Bando.md"
genome:
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
---
# Lack of an implementation for withdrawing beneficiaries balance

- id: 45848
- impact: HIGH
- protocol: [[Bando]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-11-25-Bando.md

## Summary


A critical bug has been found in the BandoFulfillmentManagerV1.sol contract. This bug has been resolved, but it is important to understand what caused it and how to prevent it in the future. The bug was located in the beneficiaryWithdraw() function, which is only supposed to be called by the manager contract. However, the BandoFulfillmentManagerV1 contract does not have an implementation for withdrawing the beneficiaries' available balances. This means that beneficiaries are currently unable to withdraw their funds, which could cause significant issues. To fix this bug, it is recommended to add a function in the BandoFulfillmentManagerV1 contract that allows beneficiaries to withdraw their available balances.

## Details

**Severity**: Critical

**Status**: Resolved

**Location**: BandoFulfillmentManagerV1.sol

**Description**

The beneficiaryWithdraw() function in both BandoERC20FulfillableV1 and BandoFulfillableV1 contracts are only designed to be called by the manager contract but the BandoFulfillmentManagerV1 contract is missing an implementation for withdrawing the beneficiaries available balances.
```solidity
function beneficiaryWithdraw(uint256 serviceID, address token) public virtual nonReentrant {
        require(_manager == msg.sender, "Caller is not the manager");
        ...
}
```

**Recommendation**: 

Add a function to withdraw beneficiaries available balances in the BandoFulfillmentManagerV1 contract.
