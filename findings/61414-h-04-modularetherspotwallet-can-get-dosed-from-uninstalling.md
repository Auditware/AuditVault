---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - impact/dos/permanent
  - novelty/variant
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# [H-04] `ModularEtherspotWallet` Can Get DoS'ed from Uninstalling Modules

- id: 61414
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The `CredibleAccountModule` module has a bug that can cause a permanent denial of service (DoS) if it is installed as both a validator and a hook. This can happen if the wallet installs the module as a validator and then uninstalls the hook that is required for the module to function properly. The bug can be fixed by preventing the module from being installed as a hook if it is already a validator. The team has responded and fixed the bug. 

## Details


## Severity

High Risk

## Description

When installing the `CredibleAccountModule` module, it can be installed as a Validator or as a Hook. To install it as a Validator, the wallet should implement `hookMultiPlexer` as the Hook. And when installing it as a Hook, there are no restrictions.

```solidity
function onInstall(bytes calldata data) external override {
    // code
    if (moduleType == MODULE_TYPE_VALIDATOR) {
>>      if (IHookLens(msg.sender).getActiveHook() != address(hookMultiPlexer)) {
            revert CredibleAccountModule_HookMultiplexerIsNotInstalled();
        }
        if (!hookMultiPlexer.hasHook(msg.sender, address(this), HookType.GLOBAL)) {
            revert CredibleAccountModule_NotAddedToHookMultiplexer();
        }
        moduleInitialized[msg.sender].validatorInitialized = true;
        emit CredibleAccountModule_ModuleInstalled(msg.sender);
    } else if (moduleType == MODULE_TYPE_HOOK) {
>>      moduleInitialized[msg.sender].hookInitialized = true;
    } else {
        revert CredibleAccountModule_InvalidModuleType();
    }
}
```

When uninstalling the module, we do the same things. In order to uninstall it from a validator, the Wallet should implement `hookMultiPlexer` as the Hook. And when uninstalling it from a Hook. It should not be installed as a validator.

```solidity
function onUninstall(bytes calldata data) external override {
    // code
    if (moduleType == MODULE_TYPE_VALIDATOR) {
>>      if (IHookLens(sender).getActiveHook() != address(hookMultiPlexer)) {
            revert CredibleAccountModule_HookMultiplexerIsNotInstalled();
        }
        if (!hookMultiPlexer.hasHook(sender, address(this), HookType.GLOBAL)) {
            revert CredibleAccountModule_NotAddedToHookMultiplexer();
        }
        // code
    } else if (moduleType == MODULE_TYPE_HOOK) {
>>      if (moduleInitialized[sender].validatorInitialized == true) {
            revert CredibleAccountModule_ValidatorExists();
        }
        moduleInitialized[sender].hookInitialized = false;
    } else {
        revert CredibleAccountModule_InvalidModuleType();
    }
}
```

So here is the situation:

- To install as Validator/The Hook should be `hookMultiPlexer`
- To install as a Hook/nothing prevents you
- To uninstall, as Validator / The Hook should be `hookMultiPlexer`
- To uninstall as Hook/it should not exist as a validator

This case can put the wallet in a complete DoS state by removing the Hook and validator. Here is the scenario.

- Etherspot wallet installed `hookMultiPlexer` as Hook
- Etherspot wallet installed `CredibleAccountModule` as validator (succeeded as `hookMultiPlexer` is Hook)
- Etherspot wallet uninstalled `hookMultiPlexer` from Hooks
- Etherspot wallet installed `CredibleAccountModule` as a hook (succeeded as no check when setting it as a hook).

Now, if the wallet in this case, it will reach the DoS state as follows: it will activate `CredibleAccountModule` as both Hook and validator.

- In order to uninstall the validator, `hookMultiPlexer` should be the Hook, and the function should revert.
- In order to uninstall the Hook, it should not be activated as a validator.

The wallet is unable to uninstall the modules, resulting in a persistent, non-recoverable state.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol)

## Impact

Permanent DoS of `unInstall()` the `CredibleAccountModule` Module from being a validator or Hook.

## Recommendation

We should prevent installing the module as a Hook if it is already a validator in the `onInstall()` function.

## Team Response

Fixed.
