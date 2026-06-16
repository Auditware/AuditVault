---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[circuit-dos-invalid-proof]]"
---
# Malicious request could burn restoration server gas fees

- id: 40985
- impact: HIGH
- protocol: [[Overprotocol]] vCISO
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf

## Summary


Summary:
The GetRestorationProof function is not checking if the target address is a contract address before generating a proof, which could allow a malicious actor to request restorations for a contract address and cause the restoration server to lose gas fees. The recommendation is to add a check for contract addresses before generating any proofs.

## Details

## Severity: Critical Risk

## Context 
- internal/ethapi/api.go#L800-L848 
- core/vm/evm.go#L891-L894

## Description 
The `GetRestorationProof` function does not check if it is creating a proof for a contract address, while the `Restore` transaction will fail to verify `RestorationProof` if `Target` is a contract address. Without this check, a malicious actor could request restorations for a contract address that the restoration server recognizes as valid, since `GetRestorationProof` would return a valid restoration proof without checking if it's a contract. The restoration server would then send `Restore` transactions to the EVM which would inevitably fail due to the `Target` being a contract. This would result in the restoration server losing its gas fees without any repercussions to the original requester. 

This would result in a scenario where a malicious actor could forcibly burn the entire balance on any restoration server.

## Recommendation 
`GetRestorationProof` should check if the target address is a contract address as soon as possible. Ideally, this happens before any proofs are generated to prevent any unnecessary computation. Right after `internal/ethapi/api.go#L801-L804` seems like a good spot if the target address exists within the returned statedb. Otherwise, you could mirror the check that happens in the EVM by checking in `internal/ethapi/api.go#L829-L834`.
