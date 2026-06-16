---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/bridge
  - sector/governance
  - sector/oracle
protocol: "[[UMA]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/uma-audit-l2-bridges/"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
---
# [C01] Trapped Proposer Reward

- id: 10705
- impact: HIGH
- protocol: [[UMA]] Audit – L2 Bridges
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/uma-audit-l2-bridges/

## Summary


A bug was identified in the `LongShortPair` and `LongShortPairCreator` contracts of the UMA protocol. The `LongShortPair` contract was retrieving a proposer reward from whichever address triggered the expiration, to incentivize price proposals in the Optimistic Oracle. However, the `LongShortPairCreator` contract was also retrieving and forwarding funds from the deployer address, which were not passed to the Optimistic Oracle and were instead trapped within the `LongShortPair` contract.

This bug has now been fixed with the commit `9bab1ff353a417952ba8c96a098773f340d9da17` in PR3523, which removed the duplicate transfer.

## Details

The `LongShortPair` contract [retrieves a proposer reward](https://github.com/UMAprotocol/protocol/blob/d4e7ea22159b2eed8e39d5b86ce0026ea3b8b995/packages/core/contracts/financial-templates/long-short-pair/LongShortPair.sol#L369-L372) from whichever address triggers the expiration, which is used to incentivize price proposals in the Optimistic Oracle. However, the `LongShortPairCreator` contract also [retrieves and forwards the funds](https://github.com/UMAprotocol/protocol/blob/d4e7ea22159b2eed8e39d5b86ce0026ea3b8b995/packages/core/contracts/financial-templates/long-short-pair/LongShortPairCreator.sol#L112-L113) from the deployer address. These additional funds are not passed to the Optimistic Oracle, and instead remain trapped within the `LongShortPair` contract.


Consider removing the duplicate transfer.


**Update:** *Fixed as of commit [`9bab1ff353a417952ba8c96a098773f340d9da17`](https://github.com/UMAprotocol/protocol/pull/3523/commits/9bab1ff353a417952ba8c96a098773f340d9da17) in [PR3523](https://github.com/UMAprotocol/protocol/pull/3523).*
