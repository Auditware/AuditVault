---
tags:
  - blockchain/evm
  - blockchain/evm/optimism
  - lang/yul
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/infra
protocol: "[[ZK Stack]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/zk-stack-vm1.5-diff-audit"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Skipped Transaction Processing

- id: 36567
- impact: HIGH
- protocol: [[zkSync Era]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zk-stack-vm1.5-diff-audit

## Summary


A recent change in the code caused a function called `processL2Tx` to be accidentally removed. This function is important for the proper functioning of the bootloader, which is a system used for processing transactions on a certain type of network. As a result of this mistake, the bootloader will not be able to process any transactions on the network. To fix this issue, the developers are advised to restore the `processL2Tx` function. This problem has been resolved in a recent update to the code.

## Details

The audit commit inadvertently removed [the `processL2Tx` function invocation](https://github.com/matter-labs/era-contracts/blob/f29f2b72f999d6b91785accfb84eafb371620214/system-contracts/bootloader/bootloader.yul#L619-L621). If deployed, the bootloader would not process any L2 transactions. Consider restoring the invocation.


***Update:** Resolved in [pull request \#316](https://github.com/matter-labs/era-contracts/pull/316).*
