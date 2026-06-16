---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [C-01] Missing Session Key Uniqueness Validation in `ResourceLock` due to Key Data Overwrite

- id: 61403
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


This bug report describes a critical risk bug in the `enableSessionKey()` function of the `CredibleAccountModule.sol` file. The function does not check if the `sessionKey` is already being used by the sender, which can result in overwriting existing session data and causing data corruption. This can also lead to inconsistencies in the system's accounting and disrupt operations. The team has fixed the issue by adding a check to prevent overwriting existing session data.

## Details


## Severity

Critical Risk

## Description

The `enableSessionKey()` function accepts a `ResourceLock` input (`_resourceLock`) but does not validate whether the `sessionKey` is already in use for the given `msg.sender`. This leads to silent overwrites of existing session data when the same `sessionKey` is reused in multiple `ResourceLock` calls.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L136](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L136)

```solidity
function enableSessionKey(bytes calldata _resourceLock) external {
  // code
  sessionData[rl.sessionKey][msg.sender] = SessionData({
      sessionKey: rl.sessionKey,
      validAfter: rl.validAfter,
      validUntil: rl.validUntil,
      live: true
  });
}
```

## Impact

The main impact of this bug is silent data corruption and accounting inconsistencies. When a session key is reused, the contract overwrites existing `sessionData` without warning, leaving orphaned `lockedTokens` entries and potentially duplicating keys in `walletSessionKeys`.

This can break token claim functionality and allow attackers to disrupt operations by maliciously overwriting sessions. The system loses track of originally locked tokens while maintaining stale references, creating inconsistencies between storage mappings.

## Recommendation

Add a check if it is live or not:

```solidity
if (sessionData[rl.sessionKey][msg.sender].live) {
   revert();
}
```

## Team Response

Fixed.
