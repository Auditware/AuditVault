---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - impact/privilege-escalation/role-bypass
  - novelty/variant
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[missing-owner-check]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
---
# [C-02] Unauthorized Session Key Takeover via Missing Ownership Validation

- id: 61404
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The report is about a bug in the `enableSessionKey()` function in a code file called `CredibleAccountModule.sol`. This bug allows attackers to take control of a session key, which can then be used to claim tokens locked by the legitimate owner. The bug is marked as having a "Critical Risk" severity. The team has fixed the bug and recommends adding a validation check to prevent it from happening again.

## Details


## Severity

Critical Risk

## Description

The `enableSessionKey()` function fails to verify whether a session key is already registered to another wallet before assigning ownership.

This allows any attacker to:

- Submit a session key that's currently active for another user

- Overwrite `sessionKeyToWallet` mapping to point to their wallet

- Effectively hijack control of the session key

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L144](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L144)

```solidity
function enableSessionKey(bytes calldata _resourceLock) external {
  // code
  sessionKeyToWallet[rl.sessionKey] = msg.sender;
  emit CredibleAccountModule_SessionKeyEnabled(rl.sessionKey, msg.sender);
}
```

## Impact

- Attackers can steal any active session key by re-registering it to their wallet, bypassing all access controls.

- Since `lockedTokens` are tracked by session key (not wallet), hijacked sessions can claim tokens originally locked by the legitimate owner.

- Legitimate owners permanently lose access to their session keys after takeover, as there's no recovery mechanism.

## Recommendation

Consider adding the corresponding validation check:

```solidity
if (sessionKeyToWallet[rl.sessionKey] != address(0)) {
    revert();
}
```

## Team Response

Fixed.
