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
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[locked-funds]]"
---
# Prefunded contracts can permanently lose funds if account becomes dormant before code is de-

- id: 40984
- impact: HIGH
- protocol: [[Overprotocol]] vCISO
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf

## Summary


This bug report discusses a critical risk bug in the core/vm/evm.go#L891 code. The issue is related to contracts that receive funds before they are deployed and then become dormant. If a contract is deployed while the funds are dormant, there is no way to restore the funds. This is a common pattern for prefunding contracts with known addresses. The bug is caused by a check in the code that prevents restoration of the funds. The recommendation is to add support for restoring old balances to contracts and to document this in the Overprotocol documentation.

## Details

## Ployed

**Severity:** Critical Risk  
**Context:** core/vm/evm.go#L891  

**Description:**  
Contracts that receive funds before they are deployed can permanently lose the funds if the account goes dormant before the contract is deployed. It is not an uncommon pattern for people to prefund contracts whose addresses are known ahead of time (via CREATE2). The issue is that once the contract is deployed there is no way for a `restorationTX` to restore the account because of the `common.BytesToHash(account.CodeHash) != types.EmptyCodeHash` check in `(evm *EVM) verifyRestorationProof()`. If a `restorationTX` is made on behalf of the contract's address before it is deployed, then the funds will be saved. If any funds are dormant and are not restored prior to the contract deployment, then they will be forever lost.

**Recommendation:**  
Consider adding support for restoring old balances to a contract. At a minimum, clearly document this in the Overprotocol documentation.
