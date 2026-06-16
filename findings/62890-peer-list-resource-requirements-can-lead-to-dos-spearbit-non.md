---
tags:
  - lang/rust
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Peer list resource requirements can lead to DoS

- id: 62890
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report describes a problem where a network participant can send a ping to a node and be added to the peer list, even if the IP address they declare is not valid. This can potentially be exploited by an attacker, who can create fake nodes and flood the network, causing it to become overloaded. The report recommends putting a limit on the size of the peer list and keeping validators and full nodes in the list to maintain network functionality. The bug has been fixed in a recent commit.

## Details

## Severity: High Risk

## Context
discovery.rs#L309-L314

## Description
A network participant can ping a node and be added to the peer list (discovery.rs#L74). However, there are a few issues:
- The node accepts whatever IP address the peer declares, regardless of the source of the packet.
- There is no restriction on the size of the peer list.
- Each ping triggers a signature check.

An attacker could spin up a single fake node implementation, or several, which only handles pings and pongs, and flood the network, filling up peer lists and overloading honest nodes.

## Recommendation
Put a hard limit on the size of the peer list. It is separate from the dedicated full nodes and epoch validators list, and thus not critical to consensus. Keep validators and full nodes in the peer list and do not eject them, so that network discovery can reasonably be expected to function.

## Category Labs
Fixed in commit 261a8893.

## Spearbit
Fix verified.
