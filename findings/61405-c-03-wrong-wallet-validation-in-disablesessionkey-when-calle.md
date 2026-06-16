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
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[timestamp-dependence]]"
---
# [C-03] Wrong Wallet Validation in `disableSessionKey()` When Caller is `SESSION_KEY_DISABLER` Role

- id: 61405
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The report describes a bug in a function called `disableSessionKey()` which is used to disable a session key. The bug occurs when a `SESSION_KEY_DISABLER` calls the function, as it incorrectly checks the expiration time of the target session. This can cause active sessions to be disabled before their intended time and bypass certain security measures. The report recommends using the `targetWallet` instead of `msg.sender` in the check to fix the bug. The team has responded that the bug has been fixed.

## Details


## Severity

Critical Risk

## Description

When a `SESSION_KEY_DISABLER` calls `disableSessionKey()`, the function incorrectly checks `sessionData[_sessionKey][msg.sender].validUntil` (which is always 0 for disablers) rather than the target session's expiration time.

This causes the token claim validation to be effectively skipped for privileged callers, as the condition `0 >= block.timestamp` always evaluates to `false`.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L159](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L159)

```solidity
function disableSessionKey(address _sessionKey) external {
  // code
  if (sessionData[_sessionKey][msg.sender].validUntil >= block.timestamp && !isSessionClaimed(_sessionKey)) {
      revert CredibleAccountModule_LockedTokensNotClaimed(_sessionKey);
  }
  // code
}
```

## Impact

- Disable active sessions before their `validUntil` time
- Bypass the `LockedTokensNotClaimed` protection completely
- Sessions with unclaimed locked tokens can be forcibly closed

## Recommendation

Consider using the `targetWallet` instead of `msg.sender` in the check, as shown:

```diff
function disableSessionKey(address _sessionKey) external {
  // code
- if (sessionData[_sessionKey][msg.sender].validUntil >= block.timestamp && !isSessionClaimed(_sessionKey)) {
+ if (sessionData[_sessionKey][targetWallet].validUntil >= block.timestamp && !isSessionClaimed(_sessionKey)) {
      revert CredibleAccountModule_LockedTokensNotClaimed(_sessionKey);
  }
 // code
}
```

## Team Response

Fixed.
