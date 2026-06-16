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
report: "https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#2-a-transaction-doesnt-have-the-sequence-information"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# A transaction doesn't have the sequence information

- id: 27983
- impact: HIGH
- protocol: [[CloudWalk]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/CloudWalk/README.md#2-a-transaction-doesnt-have-the-sequence-information

## Summary


This bug report is about the ordering of transactions in a multi-signature wallet. Currently, the owner of the wallet is able to choose the sequence of transactions and this can lead to additional benefits. However, this wallet only allows one target call per transaction which is not enough for complex DeFi interactions.

The recommendation proposed is to add nonce information in transactions and allow for a list of targets. This would help to prevent any further benefits from sequencing and would make complex DeFi interactions possible.

## Details

##### Description

In case of multiple transactions are approved any owner is able to choose the sequense of transactions. In some cases this owner can extract additional benefits from choosing the ordering.

In addition, transactions allow only one target call per transaction - it may be not enough for DeFi interactions. Complex DeFi interactions require making a few approved transactions, so benefits from sequencing can arise.

- https://github.com/cloudwalk/brlc-multisig/blob/b5d6c2b6273162d5666d48649890b15a113df7a7/contracts/base/IMultiSigWallet.sol#L11-L18
- https://github.com/cloudwalk/brlc-multisig/blob/b5d6c2b6273162d5666d48649890b15a113df7a7/contracts/base/MultiSigWalletBase.sol#L378

##### Recommendation

We recommend adding the nonce information in transactions and allowing a list of targets.
