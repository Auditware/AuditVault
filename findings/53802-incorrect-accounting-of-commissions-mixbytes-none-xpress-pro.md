---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions"
genome:
  - "[[fee-accounting]]"
  - "[[logic/fee-calculation]]"
  - "[[loss-of-funds/fee-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Incorrect accounting of commissions

- id: 53802
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions

## Summary


The report describes a bug in the `placeOrder` function of the Hanji contract. The bug causes the `total_commission` value to be accounted for twice, which can lead to incorrect commission accounting and potential contract malfunction. This can also allow the market maker to exploit the commission system for profit. The bug is rated as critical severity and it is recommended to fix it to prevent discrepancies in balance accounts and potential exploitation for profit.

## Details

##### Description
In the [`placeOrder`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L261) function, the `total_commission` value is accounted for twice: once as the commission and once as the `token_y` value of the trader. This duplication can lead to incorrect commission accounting and potential contract malfunction due to mismatched accounted and actual balances. Additionally, it may allow the market maker account to exploit the commission system for profit.

This issue is rated as critical severity as it may lead to malfunction due to contract state inconsistency and enable the market maker to gain undesired profit.
##### Recommendation
We recommend addressing the commission accounting error in the `placeOrder` function to prevent discrepancies in balance accounts and potential exploitation for profit.
