---
tags:
  - lang/solidity
  - sector/account
  - sector/infra
  - sector/staking
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[replay]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[bridge-merkle-proof]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
---
# [C-07] In `ResourceLockValidator` the `validateUserOp()` Function Is Not Consuming the Signature Proof

- id: 61409
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


The bug report describes a critical risk bug in the Modular Wallet's `ResourceLockValidator` module. This module is responsible for validating user operations, but it does not have a mechanism in place to prevent replay attacks. This means that an attacker can reuse a signature to force the wallet to execute a transaction multiple times. This bug can be exploited by an attacker by increasing the nonce and using the same `callData`. The report recommends implementing a Nonce management system or treating the signature as consumed to prevent this issue. The team has fixed the bug.

## Details


## Severity

Critical Risk

## Description

When calling `validateUserOp()`, it is called by the Modular wallet from the `EntryPoint` in the beginning, then on our wallet, we call `validateUserOp()` in the `ResourceLockValidator` module.

In case of authenticating `userOp` as that in EIP4337, `EntryPoint` has its own Nonce Mechanism, which validates the tx from replay attacks. But in case of validating against `callData` only, by extracting the `ResourceLock`. There is no Nonce mechanism implemented to only use the signature once.

```solidity
struct ResourceLock {
    uint256 chainId;
    address smartWallet;
    address sessionKey;
    uint48 validAfter;
    uint48 validUntil;
    bytes32 bidHash;
    TokenData[] tokenData;
}
```

This will allow anyone to reuse the Proof Signature again, as they can simply increase the Nonce and call `EntryPoint` directly. The `EntryPoint` will not revert as the nonce is increasing, and the validator will only construct the hash from the `callData`, so the attacker can reuse the signature again and again.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L265](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L265)

```solidity
function validateUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash) external override returns (uint256) {
    bytes calldata signature = userOp.signature;
    address walletOwner = validatorStorage[msg.sender].owner;
    // Standard signature length - no proof packing
    if (signature.length == 65) { ... }
    // or if signature.length >= 65 (standard signature length + proof packing)
    ResourceLock memory rl = _getResourceLock(userOp.callData);
    // Nonce validation
>>  bytes memory ecdsaSignature = signature[0:65];
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
>>  if (walletOwner != recoveredMSigner) return SIG_VALIDATION_FAILED;
    return SIG_VALIDATION_SUCCESS;
}
```

## Impact

Attackers can reuse the signature and force the wallet to execute the transaction again and again.

## Proof of Concept

- The Modular Wallet owner installed `ResourceLockValidator`
- The wallet owner made a signature as a Merkle tree
- He submitted a Blob transaction, and `EntryPoint` executed the tx
- Attacker took the `callData` and made another call from the `EntryPoint`, increasing the nonce, and putting the same `callData`
- The `EntryPoint` calls `validateUserOp()` on the sender, which is our Modular wallet in this case
- The validation success
- Nonce check in the `EntryPoint` succeeded
- The `EntryPoint` will call `execute()` on the wallet

## Recommendation

- There should be a mechanism to prevent re-executing the tx, in case it is built as `ResourceLock`.
- There should be a Nonce management in `ResourceLockValidator`
- Or the Signature should be treated as Consumed (stored in mapping and should not be used again)

## Team Response

Fixed.
