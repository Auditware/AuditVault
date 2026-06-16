---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/dex
  - sector/multisig
protocol: "[[CloudWalk]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#1-_execute-allows-you-to-execute-unsuccessful-tasks-in-the-future"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[fot-slippage]]"
---
# `_execute` allows you to execute unsuccessful tasks in the future

- id: 27982
- impact: HIGH
- protocol: [[CloudWalk]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#1-_execute-allows-you-to-execute-unsuccessful-tasks-in-the-future

## Summary


This bug report is about an issue concerning the code in the MultiSigWalletBase.sol file. The code is meant to revert a transaction if it is unsuccessful. However, if a condition allows the transaction to be executed later, it will be completed as a success. This could be dangerous for transactions that have an expiration time of 365 days, swaps with slippage, and the configureOwners method.

The recommendation is to disallow the use of the transaction after a revert, as the permission to execute remains with this transaction. This would prevent any potential issues that could arise from having a transaction complete as a success, even after it has been reverted.

## Details

##### Description

If the transaction is unsuccessful, then a revert will occur in the code (https://github.com/cloudwalk/brlc-multisig/blob/b5d6c2b6273162d5666d48649890b15a113df7a7/contracts/base/MultiSigWalletBase.sol#L378):

```
(bool success, bytes memory data) = transaction.to.call{ 
    value: transaction.value 
}(transaction.data);
if (!success) {
    revert InternalTransactionFailed(data);
}
```

However, if a condition allows the transaction to be executed later, it will be completed as success. This is especially dangerous for:
- `expirationTime` as `365 days`
- various swaps with a slippage
- `configureOwners` method and others. 

##### Recommendation
We recommend disallowing to use the transaction after `revert`, because the permission to execute remains with this transaction.
