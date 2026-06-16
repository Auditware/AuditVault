---
tags:
  - lang/solidity
  - sector/account
  - sector/staking
  - platform/shieldify
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[missing-modifier]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# [H-02] In `CredibleAccountModule` the `validateUserOp()` Function Is Not Authenticating the Sender

- id: 61412
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The report describes a bug in the `ModularEtherSpotWallets` code that allows anyone to call the `CredibleAccountModule::validateUserOp()` function and change the state data, resulting in unauthorized actions and potential lock of funds. This is due to the function not checking whether the sender is activating the module or not. The location of the affected code is in the `src/modules/validators/CredibleAccountModule.sol` file. The impact of this bug is high risk as it can affect any Modular smart wallet using the module. The recommended solution is to check that the sender is a Modular wallet that has already installed the module. The team has responded that the issue has been fixed.

## Details


## Severity

High Risk

## Description

The `ModularEtherSpotWallets` will activate the `CredibleAccountModule`. By either allowing it as a validator or as a Hook. When working as a validator, it will be used to validate the transaction from that Smart Account by calling `validateUserOp()`. But since the function is not checking whether the sender is activating the module or not. This will result in anyone calling `CredibleAccountModule::validateUserOp()` and changing the state data.

In `ModularEtherspotWallet::validateUserOp()`, the validator we call should be a validator implemented by that account.

File: [src/modules/validators/CredibleAccountModule.sol#L265](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L265)

```solidity
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (uint256) {
    // code

    // check if validator is enabled. If not, terminate the validation phase.
    if (!_isValidatorInstalled(validator)) return VALIDATION_FAILED;

    // bubble up the return value of the validator module
    validSignature = IValidator(validator).validateUserOp(
        userOp,
        userOpHash
    );
}
```

In order for the validator to be installed, the wallet should call `installModule`, putting that validator as one of its validators, and installing a validator we call `onInstall()` on that validator. When calling `onInstall()`, we activate the sender's `Modular wallet` to be an active wallet to use that module.

File: [src/modules/validators/CredibleAccountModule.sol#L309](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L309)

```solidity
function onInstall(bytes calldata data) external override {
    ...
    if (moduleType == MODULE_TYPE_VALIDATOR) {
        ...
>>      moduleInitialized[msg.sender].validatorInitialized = true;
        emit CredibleAccountModule_ModuleInstalled(msg.sender);
    } else if (moduleType == MODULE_TYPE_HOOK) {
        ...
    } else { ... }
}
```

Since there is no check for the caller of `CredibleAccountModule::validateUserOp()`, any address can call it. this includes external addresses, or Modular wallets that implement it as a Hook not a validator, etc. resulting in changing the Module state for wallets that do not take the action throught the EIP4337 `EntryPoint`, making all tokens locked as in validating we increase the claimed tokens, and change other variables, that will lead to break of the module handlign of all Modular wallets use it.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L265](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L265)

```solidity
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (uint256) {
    if (userOp.signature.length < 65) return VALIDATION_FAILED;
    bytes memory sig = _digestSignature(userOp.signature);
    address sessionKeySigner = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), sig);
    if (!validateSessionKeyParams(sessionKeySigner, userOp)) {
        return VALIDATION_FAILED;
    }
    SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
    sd.live = false;
    return _packValidationData(false, sd.validUntil, sd.validAfter);
}
```

## Impact

- Unauthorised actions made affecting Modular smart wallets that are not made by the Modular wallet itself
- Lock of funds as it will be made as claimed when validating

## Recommendation

It should be checked that the `sender` is a Modular wallet that has already installed the module.

```diff
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash)
    external
    override
    returns (uint256)
{
+   if (!moduleInitialized[msg.sender].validatorInitialized) {
+      revert CredibleAccountModule_ModuleNotInstalled(msg.sender);
+   }
    // code
}
```

## Team Response

Fixed.
