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
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[bridge-sender-auth]]"
---
# [H-03] The `pre/postCheck()` Is Not Authorizing the `wallet` Parameter with `msg.sender`

- id: 61413
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


This bug report describes a problem with the `CredibleAccountModule` in the `etherspot-modular-accounts` project. This module is used as a Hook and has a function called `preCheck()` that is supposed to check if the caller is the actual owner of the wallet. However, there is no check for this and any wallet can accumulate tokens from other wallets and change their state. This means that any wallet installed with this module can impersonate another wallet and change its data. The team has fixed this issue by checking that the caller is the actual sender in both `preCheck()` and `postCheck()`. This is a high-risk bug and should be fixed immediately.

## Details


## Severity

High Risk

## Description

When using `CredibleAccountModule` as a Hook, the wallet will call `preCheck()` before executing and `postCheck()`. They extract the wallet parameter from the data `sender` and accumulate the tokens for all session keys owned by that wallet

```solidity
function preCheck(address msgSender, uint256 msgValue, bytes calldata msgData) external override returns (bytes memory hookData) {
    (address sender,) = abi.decode(msgData, (address, bytes));
    return abi.encode(sender, _cumulativeLockedForWallet(sender));
}
```

The `sender` here is the wallet address; there is no check whether the caller `Modular wallet` is the actual `sender` that we use to cumulatively lock tokens from it. This allows any wallet to accumulate tokens from other wallets, and change their state, breaking the authorization mechanism of session Keys wallet ownership.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L542](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L542)

## Impact

Any wallet installed with the Hook module can impersonate using it on another wallet, changing `sesionKey` data

## Recommendation

We should check that the `sender` parameter in both `pre/postCheck()` is the `msg.sender`.

## Team Response

Fixed.
