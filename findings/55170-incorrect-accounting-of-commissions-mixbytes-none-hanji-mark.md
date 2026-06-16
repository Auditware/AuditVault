---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Hanji]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fot-slippage]]"
---
# Incorrect accounting of commissions

- id: 55170
- impact: HIGH
- protocol: [[Hanji]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#4-incorrect-accounting-of-commissions

## Summary


The bug report describes an issue in the `placeOrder` function of the `hanji-contracts` repository. The function is accounting for the `total_commission` value twice, which can cause incorrect commission calculations and potential contract malfunction. This can also allow the market maker to exploit the system for profit. The report recommends fixing the error to prevent discrepancies and potential exploitation. This issue is rated as critical severity.

## Details

##### Description
In the [`placeOrder`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol#L261) function, the `total_commission` value is accounted for twice: once as the commission and once as the `token_y` value of the trader. This duplication can lead to incorrect commission accounting and potential contract malfunction due to mismatched accounted and actual balances. Additionally, it may allow the market maker account to exploit the commission system for profit.

This issue is rated as critical severity as it may lead to malfunction due to contract state inconsistency and enable the market maker to gain undesired profit.
##### Recommendation
We recommend addressing the commission accounting error in the `placeOrder` function to prevent discrepancies in balance accounts and potential exploitation for profit.
