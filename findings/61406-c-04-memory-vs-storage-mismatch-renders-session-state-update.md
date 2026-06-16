---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[reward-accounting]]"
---
# [C-04] Memory vs Storage Mismatch Renders Session State Update Failure in `validateUserOp()`

- id: 61406
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


This bug report is about a function called `validateUserOp()` which is not working correctly. This function is supposed to make sure that all session keys become inactive after a validation attempt. However, there is a problem with this function which causes all session keys to remain active forever. This means that even after a validation attempt, the session keys will still be considered active. This bug is located in a file called "CredibleAccountModule.sol" and it can have a big impact on the entire session expiration mechanism. The recommendation is to use a different type of storage called "storage" instead of "memory" to fix this bug. The team has responded by fixing the bug.

## Details


## Severity

Critical Risk

## Description

The `validateUserOp()` function incorrectly uses `SessionData memory` when updating the live status, causing all session keys to remain permanently active despite validation attempts:

```solidity
SessionData memory sd = sessionData[sessionKeySigner][msg.sender]; // Loads into MEMORY
sd.live = false; // Modifies memory copy only
// Storage remains UNCHANGED
```

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L276](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L276)

## Impact

All validated sessions never deactivate, and `Live = true` persists indefinitely in storage, leading to defeating the entire session expiration mechanism.

## Recommendation

Consider using `storage` instead of `memory`:

```diff
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (uint256) {
  // code
- SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
+ SessionData storage sd = sessionData[sessionKeySigner][msg.sender];
  sd.live = false;
}
```

## Team Response

Fixed.
