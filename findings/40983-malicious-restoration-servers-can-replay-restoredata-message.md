---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
  - sector/infra
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf"
genome:
  - "[[replay]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
---
# Malicious Restoration Servers can replay RestoreData messages and drain accounts

- id: 40983
- impact: HIGH
- protocol: [[Overprotocol]] vCISO
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf

## Summary


The bug report describes a critical risk in the code related to restoring data. Specifically, the RestoreData struct does not have a nonce and is not connected to the first RestorationTX that uses it. This can potentially allow malicious restoration servers to drain the account of any user who makes a request for restoration. The recommendation is to add a nonce, root the signature to a single RestorationTX, limit the number of RestorationTX per account, or implement another method to prevent replays of the RestoreData message. 

## Details

## Severity: Critical Risk

## Context
`core/types/restore_data.go#L10`

## Description
The `RestoreData` struct does not have a nonce and is not rooted to the first `RestorationTX` that uses it in any way. There is also nothing in the EVM that prevents successfully processing a `RestorationTX` for a non-dormant account. These factors contribute to a situation that allows for malicious restoration servers to make as many `RestorationTX` transactions as is needed to drain the account of any user that makes a `requestRestoration` API call.

## Recommendation
Either add a nonce to the `RestoreData` struct, have some other way of rooting the `RestoreData` message's signature to a single `RestorationTX`, allow only one `RestorationTX` per account per epoch, or implement some other method that prevents replays of the `RestoreData` message.
