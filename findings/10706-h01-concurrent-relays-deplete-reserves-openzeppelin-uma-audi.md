---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[UMA]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/uma-audit-l2-bridges/"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
---
# [H01] Concurrent relays deplete reserves

- id: 10706
- impact: HIGH
- protocol: [[UMA]] Audit – L2 Bridges
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/uma-audit-l2-bridges/

## Summary


This bug report is about the `relayDeposit` function of the `BridgePool` contract. This function ensures that the contract has sufficient funds to execute the transfer, but it does not account for the pending reserves. This means that multiple simultaneous relays may rely on the same funds, and they may not all be settleable immediately. To solve this issue, it was suggested that the system should prevent relays that would cause the pending reserves to exceed the liquid reserves. 

The bug has been fixed as of commit `6290f3facbca8d878605a1d390ed59d4b6b6db02` in Pull Request 3501.

## Details

The `relayDeposit` function of the `BridgePool` contract [ensures the contract has sufficient funds](https://github.com/UMAprotocol/protocol/blob/4cbb0986d80dfbb351caaadf203d74f0c50b4db8/packages/core/contracts/insured-bridge/BridgePool.sol#L423-L426) to execute the transfer. However, it does not account for [the pending reserves](https://github.com/UMAprotocol/protocol/blob/f24ad501c8e813cf685f72217e7f13c8f3c366df/packages/core/contracts/insured-bridge/BridgePool.sol#L51), which tracks funds that are earmarked for active relays. Therefore, multiple simultaneous relays may rely on the same funds, and they may not all be settleable immediately. In particular, with a steady stream of transfers, instant relayer returns may be delayed indefinitely.


Consider preventing relays that would cause the pending reserves to exceed the liquid reserves.


**Update:** *Fixed as of commit [`6290f3facbca8d878605a1d390ed59d4b6b6db02`](https://github.com/UMAprotocol/protocol/pull/3501/commits/6290f3facbca8d878605a1d390ed59d4b6b6db02) in [PR3501](https://github.com/UMAprotocol/protocol/pull/3501).*
