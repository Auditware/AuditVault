---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/account
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_external_policies_aug2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[direct-drain]]"
---
# UniActionPolicy does not persist usages 

- id: 42095
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_external_policies_aug2024.pdf

## Summary


The UniActionPolicy, a policy that sets limits on certain values in data, is not properly enforcing these limits. This is because the only function that updates the usage amount is a view function, which does not persist the change. This could potentially allow for more tokens to be withdrawn from an account than intended. To fix this, the check() function should be modified to accept a storage variable instead of memory. This issue has been fixed in PR 76 and verified by Cantina Managed. It is classified as a high risk bug.

## Details

## UniActionPolicy: Universal Action Policy

## Context
(No context files were provided by the reviewer)

## Description
The `UniActionPolicy` is an action policy that inspects certain sections of calldata and enforces limits on the inspected values. This policy also allows thresholds to be set and gradually filled over time, so that each call contributes to the total usage across all calls.

```solidity
/**
* @title UniActionPolicy: Universal Action Policy
* @dev A policy that allows defining custom rules for actions based on function signatures.
* Also, rules feature usage limits for arguments.
* For example, you can limit not just max amount for a transfer,
* but also limit the total amount to be transferred within a permission.
*/
```

However, the current implementation does not properly enforce these limits. To see this, notice that the only function that increments the `rule.usage.used` value is a view function which is not used in a way that persists the change:

```solidity
function checkAction( /* ... */ ) external returns (uint256) {
    // ...
    for (uint256 i = 0; i < length; i++) {
        if (!config.paramRules.rules[i].check(data)) return VALIDATION_FAILED;
    }
    // ...
}

function check(ParamRule memory rule, bytes calldata data) internal view returns (bool) {
    // ...
    if (rule.isLimited) {
        if (rule.usage.used + uint256(param) > rule.usage.limit) {
            return false;
        }
        rule.usage.used += uint256(param);
    }
    // ...
}
```

As a result, usage amounts will never accumulate as intended. This behavior could allow, for example, more tokens to be withdrawn from an account than was originally intended.

## Recommendation
To ensure usages are persisted across multiple calls, modify the `check()` function to accept a storage variable instead of memory and remove the view modifier.

## Rhinestone
Fixed in PR 76.

## Cantina Managed
Verified.
