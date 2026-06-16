---
tags:
  - sector/token
  - has/github
  - severity/high
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens"
genome:
  - "[[fot-slippage]]"
  - "[[fee-calculation]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Incorrect Handling of Fee-on-Transfer Tokens

- id: 53803
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens

## Summary


The bug report describes a problem in the `LOB` contract's `receiveTokens` function. There is a vulnerability that can cause incorrect token balances if the function does not properly handle tokens with transfer fees or other mechanisms. This can lead to financial inconsistencies and loss. The report recommends adding a check to ensure that balances are correctly adjusted after `safeTransferFrom` calls, and reverting the transaction if they do not match to prevent financial irregularities.

## Details

##### Description
The issue arises within the `receiveTokens`  function of the `LOB` contract .

There is a vulnerability related to the improper handling of fee-on-transfer tokens. The function does not verify that the balances have been adjusted as expected after the `safeTransferFrom` calls. This oversight can result in incorrect token balances, especially when dealing with tokens that impose transfer fees or employ other mechanisms that alter the expected transfer amount.

The issue is classified as **high** severity as it can lead to discrepancies in token balances, potentially causing financial inconsistencies and loss.
##### Recommendation
We recommend adding a check to ensure that the balances reflect the expected changes after the `safeTransferFrom` calls. If the balances do not match the expected change, the transaction should be reverted to safeguard against financial irregularities.
