---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
  - sector/multisig
protocol: "[[CloudWalk]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#1-double-approval-attack-by-malicious-owner"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
---
# Double-approval attack by malicious owner

- id: 27981
- impact: HIGH
- protocol: [[CloudWalk]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#1-double-approval-attack-by-malicious-owner

## Summary


This bug report describes an issue with the `_approvalCount` counter in the `MultiSigWalletBase.sol` contract. When the owners of the wallet are reconfigured using the `configureOwners()` function, the `_approvalCount` value for valid transactions remains positive, which can lead to a scenario where the minority of owners can execute a transaction. For example, in a wallet requiring the 2/3 of approvals, a malicious owner can create a transaction to withdraw all funds and approve it, and then claim their account has been hacked and ask the other owners to change their account address. After the address change, the malicious owner can approve the previously created transaction again, reaching the minimum required approvals and executing the transaction.

The recommendation is to remove the counter and check the approvals in `_execute()` by iterating through `_approvalStatus()` using the current owners, similar to the approach taken by the Gnosis MultiSigWallet.

## Details

##### Description

Pending transactions have the `_approvalCount` counter.

The `_approvalCount` for each transaction is simply incremented by 1 each time an owner approves it. However, when the owners are reconfigured using the `configureOwners()` function, the `_approvalCount` value for valid transactions remains positive. This can lead to a scenario where the minority of owners can execute a transaction.

- https://github.com/cloudwalk/brlc-multisig/blob/b5d6c2b6273162d5666d48649890b15a113df7a7/contracts/base/MultiSigWalletBase.sol#L345
- https://github.com/cloudwalk/brlc-multisig/blob/b5d6c2b6273162d5666d48649890b15a113df7a7/contracts/base/MultiSigWalletBase.sol#L370

For example, in a wallet requiring the 2/3 of approvals, a malicious owner can create a transaction to withdraw all funds and approve it. They can then claim their account has been hacked and ask the other owners to change their account address (using `configureOwners()`). After the address change, the malicious owner can approve the previously created transaction again reaching the minimum required approvals=2 and execute the transaction.

##### Recommendation

We recommend removing the counter and checking approvals in `_execute()` by iterating through `_approvalStatus()` using current owners.

Like here in Gnosis:
- https://github.com/gnosis/MultiSigWallet/blob/90639984c960d281bed3e0a5d56dd4adcb9407c4/contracts/MultiSigWallet.sol#L267-L279.
