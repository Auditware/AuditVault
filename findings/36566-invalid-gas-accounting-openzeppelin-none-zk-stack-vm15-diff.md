---
tags:
  - blockchain/evm
  - blockchain/evm/optimism
  - blockchain/evm/zksync
  - lang/yul
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/account
  - sector/token
protocol: "[[ZK Stack]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/zk-stack-vm1.5-diff-audit"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fee-accounting]]"
---
# Invalid Gas Accounting

- id: 36566
- impact: HIGH
- protocol: [[zkSync Era]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zk-stack-vm1.5-diff-audit

## Summary


There is a problem with the bootloader code that is causing transactions to fail when using a paymaster and consuming pubdata. This is due to the order in which parameters are being passed, causing an incorrect estimation of pubdata cost and gas limit. The issue has been identified and a solution has been proposed in a recent pull request.

## Details

The bootloader reverses the [last two parameters](https://github.com/matter-labs/era-contracts/blob/705a4c8946c1ddbd50dbc637010e6223b3865dab/system-contracts/bootloader/bootloader.yul#L1599-L1600) when calling `ZKSYNC_NEAR_CALL_callPostOp`. This causes the [pubdata allowance check](https://github.com/matter-labs/era-contracts/blob/705a4c8946c1ddbd50dbc637010e6223b3865dab/system-contracts/bootloader/bootloader.yul#L2340) to significantly overestimate the pubdata cost and underestimate the gas limit. Consequently, transactions that specify a paymaster and consume pubdata would likely fail this check, incorrectly reverting the `postTransaction` changes.


Consider correcting the parameter order.


***Update:** Resolved in [pull request \#316](https://github.com/matter-labs/era-contracts/pull/316).*
