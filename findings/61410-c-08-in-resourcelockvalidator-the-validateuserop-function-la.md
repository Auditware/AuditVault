---
tags:
  - lang/solidity
  - sector/account
  - sector/staking
  - sector/token
  - platform/shieldify
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[bridge-merkle-proof]]"
  - "[[frontrun-exposure]]"
---
# [C-08] In `ResourceLockValidator`, the `validateUserOp()` Function Lacks Sufficient Checks, Allowing Draining of `ModularEtherspotWallet` Balances

- id: 61410
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


This bug report highlights a critical risk in the `ResourceLockValidator` function used in the Modular wallet. This function is responsible for validating data before executing transactions on the wallet. However, the current implementation has several vulnerabilities that could allow attackers to drain the wallet's funds.

The main issue is with the way the function verifies the signature of the data. It only checks the `ResourceLock` without any further validation, making it possible for attackers to provide the same signature with different data that results in the same `ResourceLock` being signed. This allows them to pass the validation and execute their own malicious transactions.

There are also other vulnerabilities, such as not checking the target and value in single call executions, not checking the length of batch executions, and not verifying the selector of the `execTarget` in single execution mode.

The impact of these vulnerabilities is the potential draining of the Modular wallet's funds. To prevent this, it is recommended to improve the signature verification process by considering the overall `userOp` instead of just the `ResourceLock`. The team has acknowledged and fixed these issues.

## Details


## Severity

Critical Risk

## Summary

This is a collection of issues with different root causes, we grouped them in a single instance for better explanation.

## Description

The `validateUserOp()` function in `ResourceLockValidator` will be called by the Modular wallet `ResourceLockValidator`. This function will be called from the `EntryPoint`, and in case of validation success, the `EntryPoint` will call the `callData` on our wallet. Since the validation succeeded, this means the execution of `callData` is authorised.

If `validateUserOp()`, this means we are calling `callData` on our wallet. So the validity of the data should be correct, as any mistake can result in malicious data that ends up taking all the wallet's funds.

The Core problem in the implementation of `ResourceLockValidator` is the way we validate the data in case of MerkleTree.

File: [src/modules/validators/CredibleAccountModule.sol#L265](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L265)

```solidity
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) ... {
    // code
    // or if signature.length >= 65 (standard signature length + proof packing)
>>  ResourceLock memory rl = _getResourceLock(userOp.callData);
    // Nonce validation
    bytes memory ecdsaSignature = signature[0:65];
    bytes32 root = bytes32(signature[65:97]); // 32 bytes
    bytes32[] memory proof;
    ...
    if (!MerkleProofLib.verify(proof, root, _buildResourceLockHash(rl))) {
        revert RLV_ResourceLockHashNotInProof();
    }
    // check proof is signed
>>  if (walletOwner == ECDSA.recover(root, ecdsaSignature)) {
        return SIG_VALIDATION_SUCCESS;
    }
    bytes32 sigRoot = ECDSA.toEthSignedMessageHash(root);
    address recoveredMSigner = ECDSA.recover(sigRoot, ecdsaSignature);
    if (walletOwner != recoveredMSigner) return SIG_VALIDATION_FAILED;
    return SIG_VALIDATION_SUCCESS;
}
```

The recovery of the signer is done by validating the `root` against the `ecdsaSignature`. The issue is that the root validation is made by hashing `ResourceLock` only, without any further checks. So if attackers provide the same signature/proof but with different `userOp.callData` that results in the same `ResourceLock` signed by the signer, the attacker will be able to pass the validation check and force the Modular wallet to execute their transaction.

The attacker will simply listen to the tx mempool and once he sees the tx made by that signed for that `ResourceLock`, the attacker will front-run it, and call `EntryPoint` himself with his custom data (`userOp.callData`) that results in the same `ResourceLock` at the end. Letting him drain the Modular wallet. Here are all the instances that can occur

### Unchecking the target and value

Since we are using `EIP7579`, the function we execute is named `execute()` in the case of a single call. This includes the target (the address we are calling) and value (the amount of ETH we send). The attacker can simply crap the callData and pass his address and the amount of ETH of that modular wallet and call the `EntryPoint`. The final `ResourceLock` will be the same as that signed walletOwner, so this will end up transferring all the ETH in the Modular wallet to the attacker

- We should check if the value is `0` and the target is the `CredibleAccountModule`

### Unchecking the length of Batch execution

When making a batch call, we are not checking for the length of the `batchExecs`, we take the first one only and validate it.

File: [src/modules/validators/ResourceLockValidator.sol#L197](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/ResourceLockValidator.sol#L197)

```solidity
function _getResourceLock(bytes calldata _callData) internal view returns (ResourceLock memory) {
    if (bytes4(_callData[:4]) == IERC7579Account.execute.selector) {
        (CallType calltype,,,) = ModeLib.decode(ModeCode.wrap(bytes32(_callData[4:36])));
        if (calltype == CALLTYPE_SINGLE) { ... } else if (calltype == CALLTYPE_BATCH) {
            // NOTE: If batch call then it will should only contain a single UserOperation
            // so hardcoded values will hold here
>>          Execution[] calldata batchExecs = ExecutionLib.decodeBatch(_callData[100:]);
            for (uint256 i; i < batchExecs.length; ++i) {
              if (bytes4(batchExecs[i].callData[:4]) == bytes4(0x495079a0)) {
                    ...
>>                  return ResourceLock({ ... });
                }
                revert RLV_InvalidSelector();
            }
        } else {
            revert RLV_InvalidCallType();
        }
    }
}
```

So, since the validation of the `callData` is done using the first `execution`, the attacker can take the signed execution from the wallet owner, and make an array including other malicious executions to drain the `ModularEtherspotWallet`, like transferring ERC20 tokens to himself

- We should check that the length is exactly `1`

### Unchecking the selector of the `execTarget` to match `enableSessionKey()` in Single execution

`ResourceLockValidator` is intended to be used to enable sessions on `CredibleAccountModule`. The way of encoding and decoding data makes it only work for this. Even the Batch execution enforces the selector to be `0x495079a0`, which is the selector of the `enableSessionKey(bytes)` function.

But in Single execution mode, this selector is not checked. So this will allow consuming the signature in a different selector, putting random data like calling `CredibleAccountModule::onUninstall()` and forcing the uninstallation of the module.

- We should check that the selector of the function we are going to execute is `0x495079a0` same as in Batch execution.

## Impact

Draining of the Modular Wallets

## Recommendation

Each Sub-issue mitigation is written on it. But for better security. The signature verification should be made to the overall `userOp`, not just the `ResourceLock`, as the caller will be the `EntryPoint` that has access to call `execute()` on the wallet. and `userOp` is the structure that is hashed by `EntryPoint` that includes `chainId`, `nonce` and other parameters that ensure no such signature consumption can be made to drain the wallets

## Team Response

Fixed.
