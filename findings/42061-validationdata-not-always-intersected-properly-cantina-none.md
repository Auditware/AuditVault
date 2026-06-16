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
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# ValidationData not always intersected properly 

- id: 42061
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


This bug report discusses an issue in the codebase where the intersectValidationData() function is not being properly called in two locations. This results in previous ValidationData results being overwritten instead of being combined. This could lead to unexpected behavior and has been partially mitigated by a helper function. The recommendation is to update the logic in these two locations to properly intersect the return data. This issue has been fixed in PR 60 and has been verified by Cantina Managed.

## Details

## Policy Validation Data Issue

## Context
`PolicyLib.sol#L73-L79`

## Description
Throughout the codebase, there are calls to multiple policy contracts, and the `ValidationData` return values from these calls are intended to be combined using the `intersectValidationData()` function. However, there are currently two locations in the codebase where the `intersectValidationData()` function is not properly called, leading to previous `ValidationData` results being overwritten instead of combined. These two locations are:

1. **In `PolicyLib.sol`**, the `check()` function combines each policy's return value with itself instead of accumulating across the entire loop:
    ```solidity
    function check( /* ... */ ) internal returns (ValidationData vd) {
        // ....
        for (uint256 i; i < length; i++) {
            // ...
            uint256 validationDataFromPolicy = uint256(bytes32(policies[i].safeCall({ callData: callOnIPolicy })));
            vd = ValidationData.wrap(validationDataFromPolicy);
            // ...
            if (vd.isFailed()) revert ISmartSession.PolicyViolation(permissionId, policies[i]);
            // ...
            vd = vd.intersectValidationData(vd);
        }
    }
    ```

2. **In `SmartSession.sol`**, the `_enforcePolicies()` function overwrites the `userOp` policy return value with the action policy return value:
    ```solidity
    function _enforcePolicies( /* ... */ ) internal returns (ValidationData vd) {
        // ...
        vd = $userOpPolicies.check({ /* ... */ });
        // ...
        if (selector == IERC7579Account.execute.selector) {
            // ...
        } else if (callType == CALLTYPE_BATCH) {
            vd = $actionPolicies.actionPolicies.checkBatch7579Exec({ /* ... */ });
        }
        // DEFAULT EXEC & SINGLE CALL
        else if (callType == CALLTYPE_SINGLE) {
            // ...
            vd = $actionPolicies.actionPolicies.checkSingle7579Exec({ /* ... */ });
        }
        // ...
        else {
            // ...
            vd = $actionPolicies.actionPolicies[actionId].check({ /* ... */ });
        }
        // ...
    }
    ```

The consequences of this issue are partially mitigated by the `isFailed()` check, as this helper function reverts if any individual policy fails. However, unexpected behavior could arise if `intersectValidationData()` returns an intermediate error, or if a policy returns a `validAfter` or `validUntil` timestamp, since these values will sometimes be overwritten.

## Recommendation
Update the logic in the two locations mentioned above to properly intersect return data instead of overwriting it.

## Rhinestone
Fixed in PR 60.

## Cantina Managed
Verified.
