---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/account
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[cross-contract-state-consistency]]"
  - "[[role-bypass]]"
---
# removeSession() doesn't remove data completely from installed policy modules 

- id: 42063
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The bug report is about a problem with the removeSession() function in the SmartSessionBase.sol code. This function is responsible for deleting data associated with a session when a smart account uninstalls the SmartSession module or removes a session. However, the function does not properly delete two things as required by the ERC7579 specifications. This can cause issues with compliance and may also cause problems if the module is re-installed for the smart account. The recommendation is to add code to properly disable the enabledActionIDs and sessionValidators associated with the permissionID of the session being removed. This bug has been fixed in a pull request and verified by Cantina Managed.

## Details

## SmartSession Module Uninstallation Issue

## Context
SmartSessionBase.sol#L235-L255

## Description 
When a smart account uninstalls the SmartSession module or removes a session, the `removeSession()` function is called, which is responsible for deleting all associated data from the policy modules, etc., connected with that session. According to ERC7579 specs, any uninstallation of a module should not leave remnant storage.

The problem with `removeSession()` is that it forgets to delete two things:
1. `$actionPolicies.enabledActionIds[permissionId]`
2. `$sessionValidators[permissionId][smartAccount]`

This breaks compliance with ERC7579 and, in some cases, could also lead to problems when the same module is re-installed for the smart account.

## Recommendation
Add code in `removeSession()` to disable the `enabledActionIDs` and `sessionValidators` associated with the `permissionID` of the session that is being removed.

## Rhinestone
Fixed in PR 62.

## Cantina Managed
Verified.
