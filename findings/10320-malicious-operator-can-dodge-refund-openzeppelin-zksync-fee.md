---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/yul
  - sector/bridge
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/known-pattern
protocol: "[[zkSync]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/zksync-fee-model-and-token-bridge-audit/"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Malicious Operator Can Dodge Refund

- id: 10320
- impact: HIGH
- protocol: [[zkSync]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-fee-model-and-token-bridge-audit/

## Summary


A bug was discovered in the `refundCurrentL2Transaction` function in the Matter Labs system contracts. This bug could have allowed a malicious operator to provide a very large amount of ergs that should be refunded, which would then be multiplied by the ergs price to determine the refund in ETH. This could have caused an overflow and lead to a very low refund, effectively stealing funds from the user. 

The bug was resolved in pull request #208 at commit 57ba2b1. The solution was to calculate the refund based on the bootloader and operator values individually and then picking the higher amount to protect the fee model against a malicious operator.

## Details

In the [`refundCurrentL2Transaction` function](https://github.com/matter-labs/system-contracts/blob/191246a878f1493a5ed5f0fa6d79af4ce3e7eb8f/bootloader/bootloader.yul#L1154), the user gets refunded for overpaying in ergs for their L2 transaction. The ETH amount to refund is dependent on the ergs amount and the ergs price. The ergs amount is the maximum value of the operator-provided value and the one calculated by the bootloader. The ergs amount multiplied by the ergs price determines the refund in ETH.


A malicious operator can provide a very large amount of ergs that should be refunded, which will therefore be the chosen [`refundInErgs` value](https://github.com/matter-labs/system-contracts/blob/191246a878f1493a5ed5f0fa6d79af4ce3e7eb8f/bootloader/bootloader.yul#L1204). However, when multiplied by the ergs price, `ethToRefund` can overflow and lead to a very low refund, effectively stealing funds from the user.


Consider calculating the refund based on the bootloader and operator values individually and then picking the higher amount to protect the fee model against a malicious operator.


***Update:** Resolved in [pull request #208](https://github.com/matter-labs/system-contracts/pull/208) at commit [57ba2b1](https://github.com/matter-labs/system-contracts/pull/208/commits/57ba2b120026ab6373505f362eebe6f640adb8b6).*
