---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions"
genome:
  - "[[fee-accounting]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect accounting of commissions

- id: 56839
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions

## Summary


The bug report describes an issue in the `placeOrder` function of the Hanji contract, where the `total_commission` value is being counted twice. This can cause incorrect commission accounting and may allow the market maker account to exploit the system for profit. It is a critical issue that needs to be fixed to prevent contract malfunction and potential exploitation. The recommendation is to address the commission accounting error in the function to prevent any discrepancies and exploitation.

## Details

##### Description
In the [`placeOrder`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L261) function, the `total_commission` value is accounted for twice: once as the commission and once as the `token_y` value of the trader. This duplication can lead to incorrect commission accounting and potential contract malfunction due to mismatched accounted and actual balances. Additionally, it may allow the market maker account to exploit the commission system for profit.

This issue is rated as critical severity as it may lead to malfunction due to contract state inconsistency and enable the market maker to gain undesired profit.
##### Recommendation
We recommend addressing the commission accounting error in the `placeOrder` function to prevent discrepancies in balance accounts and potential exploitation for profit.
