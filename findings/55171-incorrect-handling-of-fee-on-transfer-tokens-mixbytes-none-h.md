---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - precondition/specific-token-type
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Hanji]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens"
genome:
  - "[[fee-calculation]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# Incorrect Handling of Fee-on-Transfer Tokens

- id: 55171
- impact: HIGH
- protocol: [[Hanji]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens

## Summary


The `receiveTokens` function in the `LOB` contract has a problem with handling fee-on-transfer tokens. This means that the function does not check if the token balances are correct after a `safeTransferFrom` call. This can cause incorrect balances and potential financial loss. It is important to add a check to make sure the balances are correct and revert the transaction if they are not. 

## Details

##### Description
The issue arises within the `receiveTokens`  function of the `LOB` contract .

There is a vulnerability related to the improper handling of fee-on-transfer tokens. The function does not verify that the balances have been adjusted as expected after the `safeTransferFrom` calls. This oversight can result in incorrect token balances, especially when dealing with tokens that impose transfer fees or employ other mechanisms that alter the expected transfer amount.

The issue is classified as **high** severity as it can lead to discrepancies in token balances, potentially causing financial inconsistencies and loss.
##### Recommendation
We recommend adding a check to ensure that the balances reflect the expected changes after the `safeTransferFrom` calls. If the balances do not match the expected change, the transaction should be reverted to safeguard against financial irregularities.
