---
tags:
  - lang/solidity
  - sector/staking
  - platform/immunefi
  - has/github
  - has/poc
  - severity/high
  - impact/dos/permanent
protocol: "[[Shardeum]]"
auditors:
  - "[[usmannk]]"
report: "https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Shardeum%20Core/33277%20-%20%5BBC%20-%20Critical%5D%20Validators%20can%20be%20crashed%20via%20GET.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Validators can be crashed via GET

- id: 61110
- impact: HIGH
- protocol: [[Shardeum]]
- reporter: usmannk (Immunefi)
- source: https://github.com/immunefi-team/Past-Audit-Competitions/blob/main/Shardeum%20Core/33277%20-%20%5BBC%20-%20Critical%5D%20Validators%20can%20be%20crashed%20via%20GET.md

## Summary


Bug Type: Blockchain/DLT Network Shutdown

Target: https://github.com/shardeum/shardeum/tree/dev

Impact: Network unable to confirm new transactions.

Description:

The bug causes the network to shut down completely, preventing any new transactions from being confirmed. This is due to a flaw in the default endpoint `eth_getBlockByHash` which crashes and permanently disables a node when called without any parameters. This allows an attacker to exploit the bug and halt all transactions on the network.

Proof of Concept:

To replicate the bug, follow these steps:

1. Start a local cluster using `$ shardus start 10`.
2. Choose a node, for example, 9001.
3. Crash the node by accessing `http://localhost:9001/eth_getBlockByHash` without providing any parameters.
4. Check the node status on `http://127.0.0.1:4000/nodelist` and observe that it is offline.

## Details




Report type: Blockchain/DLT


Target: https://github.com/shardeum/shardeum/tree/dev

Impacts:
- Network not being able to confirm new transactions (total network shutdown)

## Description
## Brief/Intro

Simply calling the default endpoint `eth_getBlockByHash` **with no params** causes a node to crash and die permanently.

By looping this over the network, an attacker can halt all transactions.



## Proof of Concept

- Run a local cluster:
    - `$ shardus start 10`

- Pick a node, say, 9001.

- Crash the node by navigating to `http://localhost:9001/eth_getBlockByHash` and not providing parameters

- Go to `http://127.0.0.1:4000/nodelist` and observe that the node is offline
