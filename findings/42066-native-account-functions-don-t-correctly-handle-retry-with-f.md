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
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[role-bypass]]"
---
# Native account functions don 't correctly handle RETRY_WITH_FALLBACK 

- id: 42066
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The report discusses a bug in the tryCheck() function where the system is not properly handling the RETRY_WITH_FALLBACK return value. This can lead to unexpected results when verifying native account functions. The recommendation is to evaluate whether native account functions should support this behavior and make necessary changes to the code. The bug has been fixed in PR 112 and has been verified by Cantina Managed.

## Details

## Context
(No context files were provided by the reviewer)

## Description
In the current implementation of the `tryCheck()` function, if the minimum policy threshold (`minPolicies`) is not met, the function returns `RETRY_WITH_FALLBACK` to indicate that the system should re-attempt the action policy check using the `FALLBACK_ACTIONID`. This can be seen in the following code snippets:

```javascript
function tryCheck( /* ... */ ) /* ... */ {
    // ...
    if (minPolicies > length) {
        return RETRY_WITH_FALLBACK;
    }
    // ...
}
```

```javascript
function checkSingle7579Exec( /* ... */ ) /* ... */ {
    // ...
    vd = $policies[actionId].tryCheck({ /* ... */ });
    // ...
    if (vd == RETRY_WITH_FALLBACK) {
        // If no policies were configured for FALLBACK_ACTIONID for this PermissionId, this will revert
        vd = $policies[FALLBACK_ACTIONID].check({ /* ... */ });
    }
    return vd;
}
```

This fallback behavior is not properly implemented in the `_enforcePolicies()` function. More specifically, when native account function calls are being verified, the `tryCheck()` function is used but the return value is passed directly into the `intersect()` function:

```javascript
vd = vd.intersect(
    $actionPolicies.actionPolicies[actionId].tryCheck({ /* ... */ })
);
```

As a result, any native account function that does not have an action policy will directly pass `RETRY_WITH_FALLBACK` into `intersect()`. Since `RETRY_WITH_FALLBACK` is defined as `Validation-Data.wrap(uint256(0x50FFBAAD))`, this can lead to unexpected results instead of a failure.

## Recommendation
Evaluate whether native account functions should support the `RETRY_WITH_FALLBACK` behavior. If not, consider replacing `tryCheck()` with `check()` in `_enforcePolicies()`. If so, consider adding logic to properly handle the `RETRY_WITH_FALLBACK` return value, similar to `checkSingle7579Exec()`.

## Rhinestone
Fixed in PR 112 by replacing `tryCheck()` with `check()`.

## Cantina Managed
Verified.
