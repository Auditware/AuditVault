---
tags:
  - lang/solidity
  - sector/bridge
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - impact/mev/backrun
protocol: "[[Mugen]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-01-01-Mugen.md"
genome:
  - "[[wrong-condition]]"
  - "[[backrun]]"
  - "[[frontrun-exposure]]"
---
# [H-01] Anyone can use or steal `ArbitrumSwaps` native asset balance

- id: 20422
- impact: HIGH
- protocol: [[Mugen]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-01-01-Mugen.md

## Summary


This bug report describes an issue with the `ArbitrumSwaps` native asset balance in which an attacker is able to steal the balance by calling the `arbitrumSwaps` method with steps `WETH_DEPOSIT` and `WETH_WITHDRAW`. This exploit is possible because the `_refundAddress` argument of the `swap` method call to the `stargateRouter` is `address(this)`, which means that all of the native asset that is refunded will be held by the `ArbitrumSwaps` contract. The likelihood of this issue is high, and the impact is medium, as value can be stolen, but it should be limited to gas refunds.

The recommendation to fix this issue is to change the refund address to `msg.sender` rather than `address(this)`. This way, the protocol won't be expected to receive native assets, so they can only be stolen if someone mistakenly sends them to the `ArbitrumSwaps` contract. This is an expected risk, but should be minimized by the change in the refund address.

## Details

**Likelihood:**
High, because this can easily be noticed and exploited

**Impact:**
Medium, because value can be stolen, but it should be limited to gas refunds

**Description**

An attacker can steal the `ArbitrumSwaps` native asset balance by doing a call to the `arbitrumSwaps` method with steps `WETH_DEPOSIT` and `WETH_WITHDRAW` - this will send over the whole contract balance to a caller-supplied address. This shouldn't be a problem, because the contract is a "swap router" and is not expected to hold any native asset balance at any time. Well this assumption does not hold, because in the `stargateSwap` method the `_refundAddress` argument of the `swap` method call to the `stargateRouter` is `address(this)`. This means that all of the native asset that is refunded will be held by the `ArbitrumSwaps` contract and an attacker can back-run this refund and steal the balance.

**Recommendations**

The refund address should be `msg.sender` and not `address(this)`. This way the protocol won't be expected to receive native assets, so they can be stolen only if someone mistakenly sends them to the `ArbitrumSwaps` contract which is an expected risk.
