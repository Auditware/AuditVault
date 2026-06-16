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
  - "[[reward-accounting]]"
---
# [C-06] Anyone Can Uninstall the Validator Module from Any Wallet

- id: 61408
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


A bug has been found in the CredibleAccountModule module, which can allow anyone to uninstall the module from any wallet without proper authentication. This poses a critical risk and needs to be fixed. The affected code can be found in the file "CredibleAccountModule.sol" at line 327. The team has fixed the issue and recommends ensuring that the sender is the same as msg.sender to prevent this bug from occurring.

## Details


## Severity

Critical Risk

## Description

When uninstalling the module, there is no authentication made to the `msg.sender`, the sender parameter is extracted from the data, and we deal with it as if it is the actual sender.

This will allow anyone to call `CredibleAccountModule` directly and `onInstall()` the module (validator/Hook) from any wallet.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L327](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L327)

```solidity
function onUninstall(bytes calldata data) external override {
    if (data.length < 32) {
        revert CredibleAccountModule_InvalidOnUnInstallData(msg.sender);
    }
    uint256 moduleType;
    address sender;
    assembly {
        moduleType := calldataload(data.offset)
>>      sender := calldataload(add(data.offset, 32))
    }
    bytes memory uninstallData = data[32:];
    ...
}
```

## Impact

Anyone can uninstall a module from any wallet.

## Recommendation

It should be ensured that the `sender` is the same as `msg.sender`.

## Team Response

Fixed.
