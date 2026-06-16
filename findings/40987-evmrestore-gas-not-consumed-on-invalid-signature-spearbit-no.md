---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
  - sector/infra
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# EVM.Restore() gas not consumed on invalid signature

- id: 40987
- impact: HIGH
- protocol: [[Overprotocol]] vCISO
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf

## Summary


A bug has been found in the core/vm/evm.go#L803 code that could potentially cause a high-risk issue. The problem occurs when the Restore() function does not use up all the available gas when verifying signatures. This can be exploited by an attacker who can create very large restoration transactions that will use up a lot of resources on the node. If the signature fails, the cost of this verification will only be the intrinsic gas, making it a cheap way to cause a denial of service attack on the entire chain. It is recommended that the EVM consumes all the gas for restoration transactions to discourage this behavior.

## Details

## Severity: High Risk

## Context
`core/vm/evm.go#L803`

## Description
The `(evm *EVM) Restore()` function does not consume all gas on `RestoreData` signatures. An attacker can generate incredibly large `restorationTX` transactions that will consume the node's resources validating the restoration server's signature on a large data buffer (e.g., input/proof). If the `RestoreData` signature fails, then the cost of this large verification will only be the intrinsic gas, as the memory cost calculation will never be hit. This will allow for a chain-wide Denial of Service (DoS) vector that costs almost no gas to implement.

## Recommendation
An honest restoration server should never create a transaction out of a `requestRestoration` request if the signature is invalid. If this happens, the EVM should consume all of the `restorationTX` gas to disincentivize this behavior.
