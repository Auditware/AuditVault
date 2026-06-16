---
tags:
  - sector/token
  - has/github
  - severity/high
  - lang/solidity
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens"
genome:
  - "[[fot-slippage]]"
  - "[[fee-calculation]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# Incorrect Handling of Fee-on-Transfer Tokens

- id: 56840
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#1-incorrect-handling-of-fee-on-transfer-tokens

## Summary


The report describes a bug in the `receiveTokens` function of the `LOB` contract. This bug can cause incorrect token balances when dealing with tokens that have transfer fees or other mechanisms that change the expected transfer amount. It is classified as a high severity issue as it can lead to financial inconsistencies and loss. The recommendation is to add a check to ensure that the balances reflect the expected changes after the `safeTransferFrom` calls and revert the transaction if they do not match to prevent financial irregularities.

## Details

##### Description
The issue arises within the `receiveTokens`  function of the `LOB` contract .

There is a vulnerability related to the improper handling of fee-on-transfer tokens. The function does not verify that the balances have been adjusted as expected after the `safeTransferFrom` calls. This oversight can result in incorrect token balances, especially when dealing with tokens that impose transfer fees or employ other mechanisms that alter the expected transfer amount.

The issue is classified as **high** severity as it can lead to discrepancies in token balances, potentially causing financial inconsistencies and loss.
##### Recommendation
We recommend adding a check to ensure that the balances reflect the expected changes after the `safeTransferFrom` calls. If the balances do not match the expected change, the transaction should be reverted to safeguard against financial irregularities.
