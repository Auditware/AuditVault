---
tags:
  - lang/solidity
  - sector/oracle
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/add-access-control
  - trigger/reentrancy-callback
protocol: "[[Trzn Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy attack is possible on `SellETH` function

- id: 37229
- impact: HIGH
- protocol: [[Trzn Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-12-TRZN Finance.md

## Summary


This bug report is about a high severity issue that has been resolved. The issue involves the `SellETH` function, which sends Ether to risk managers. If these risk managers are malicious contracts, there is a possibility of a reentrancy attack. The contract does have a guard against this, but it only applies to certain functions. To prevent this risk, it is recommended to use nonreentrant modifiers from openzeppelin and to place the Ether transfer operation at the end of the function to reduce the risk of reentrancy attacks.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The `SellETH` function sends Ether to risk managers, if these risk managers are contracts that have malicious code, there is a possibility of reentrancy attack. Even though this contract inherits ReentrancyGaurd, the guard will only apply to functions that have nonreentrant modifier.


**Recommendations**:

To mitigate this risk, it's generally a good practice to mark the function with nonreentrant modifiers from openzeppelin.

Also place Ether transfer operation at the end of function. By doing this, the transfer operation occurs after all state changes are completed, reducing the risk of reentrancy attacks.
