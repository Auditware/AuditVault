---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
  - sector/account
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[admin-takeover]]"
  - "[[reentrancy-guard]]"
---
# Installation reentrancy concerns 

- id: 42067
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The bug report describes an issue where a user installing a session may inadvertently give control to an untrusted contract. This can happen during the initialization process, which involves several steps and may involve external calls to other contracts. This can potentially be exploited by an attacker if they gain control during the installation process. The report recommends reordering the steps of the initialization process and documenting this behavior to mitigate the risk. The bug has been fixed in PR 102 and verified by Cantina Managed. The risk level is considered medium.

## Details

## Context
(No context files were provided by the reviewer)

## Description
When a user installs a session, several different storage locations are initialized sequentially. For example, consider the `enableSession()` implementation below:

```solidity
function enableSessions(Session[] calldata sessions) public returns (PermissionId[] memory permissionIds) {
    uint256 length = sessions.length;
    if (length == 0) revert InvalidData();
    permissionIds = new PermissionId[](length);
    for (uint256 i; i < length; i++) {
        Session calldata session = sessions[i];
        PermissionId permissionId = session.toPermissionId();
        // ...
        $enabledSessions.add({ /* ... */ });
        // ...
        $sessionValidators.enable({ /* ... */ });
        // ...
        $userOpPolicies.enable({ /* ... */ });
        // ...
        $erc1271Policies.enable({ /* ... */ });
        $enabledERC7739Content.enable( /* ... */ );
        // ...
        $actionPolicies.enable({ /* ... */ });
        // ...
    }
}
```

Note that any of these storage initialization steps may result in an external call, which would grant control flow to another contract. One low-risk example is with the external calls to `registry.checkForAccount()`. A higher-risk example is the `initializeWithMultiplexer()` function, which is invoked on each installed policy. While these calls are generally trusted (as the user chooses the policies they install), even a non-malicious policy could inadvertently give up control flow to an untrusted contract.

If an attacker does gain control flow during an installation, they could potentially exploit the unfinished installation state. For instance, in the above code, notice that `$sessionValidators.enable()` happens before `$erc1271Policies.enable()`. So, if an attacker gains control flow after `$sessionValidators.enable()` but before `$erc1271Policies.enable()`, they may be able to successfully call `isValidSignature()`, bypassing all of the `$erc1271Policies` that are yet to be installed.

## Recommendation
There are two recommendations to help mitigate this issue:

1. **Reorder the calls.** Moving the `$enabledSessions.add()` and `$sessionValidators.enable()` calls to be at the end of the installation process would be safer. These are the most important storage values, so if an attacker gains control flow while these are still unset, there is much less risk.
  
2. **Document this behavior,** especially in any documentation relating to `initializeWithMultiplexer()`. It would be ideal if policy developers minimized external calls during session installation.

## Rhinestone
Fixed in PR 102.

## Cantina Managed
Verified.
