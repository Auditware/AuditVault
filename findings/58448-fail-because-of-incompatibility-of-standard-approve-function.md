---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/bridge
  - sector/stable
  - sector/token
protocol: "[[Chainport]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-03-Chainport.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[frontrun-exposure]]"
---
# Fail because of incompatibility of Standard 'approve()` Function with USDT Token.

- id: 58448
- impact: HIGH
- protocol: [[Chainport]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-03-Chainport.md

## Summary


The report is about a bug in the Arbitrage Manager which affects the functionality of the contract. The bug is caused by the USDT token not returning a 'bool' value when executing the 'approve()' function, which is expected by ERC20 standards. This can cause transactions to fail when interacting with USDT. The recommendation is to either implement a function from OpenZeppelin's SafeERC20 library or confirm that the protocol will not use USDT or any other sub-standard token implementations. The bug has been resolved by replacing the usual 'approve()' function with 'safeApprove()' due to the contract using a lower version of Solidity.

## Details

**Description**

Arbitrage Manager: release OrMintAndSwap, swap, swapAnd Deposit OrBurn, _depositOrBurn.
It is known that the USDT implements an ERC20 version that does not return a 'bool' value from the 'approve() function, whereas the expected behavior for ERC20 tokens is to return true` upon successful execution of 'approve()`. This discrepancy leads to the possibility that standard 'approve()` calls may revert transactions when interacting with USDT. The issue is marked as High, as it blocks the work of the contract, and auditors confirmed the case with the appropriate test.

**Recommendation**

Implement the 'forceApprove() function from OpenZeppelin's SafeERC20 library, which accommodates such exceptions and ensures correct approve()` behavior for tokens with non-standard implementations. OR confirm that USDT (or any other sub-standard token implementations) will not be used within the protocol.

**Re-audit comment**

Resolved.

Post audit.
The usual approve has been replaced with safeApprove since contracts currently use a solidity version lower than 0.8.0.
