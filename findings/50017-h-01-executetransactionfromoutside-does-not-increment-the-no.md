---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
protocol: "[[Clave]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Clave-security-review_2024-11-02.md"
genome:
  - "[[signature-malleability]]"
  - "[[auth/signature-replay]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[multi-tx]]"
  - "[[add-nonce]]"
  - "[[precondition/replayable-signature]]"
  - "[[misassumption/signature-is-unique]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] `executeTransactionFromOutside` does not increment the nonce

- id: 50017
- impact: HIGH
- protocol: Clave_2024-11-02
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Clave-security-review_2024-11-02.md

## Summary


This bug report describes an issue with the `executeTransactionFromOutside` function in the `ClaveImplementation` code. This function is used by the wallet owner to manually execute a transaction, but it does not increment the wallet's nonce. This means that if the execution operator is unresponsive and the wallet owner manually executes a transaction, the operator can still execute the same transaction when they become active again, potentially causing unintended double execution. The report recommends updating the code to increment the nonce within the `executeTransactionFromOutside` function.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

`ClaveImplementation` implements `executeTransactionFromOutside`, which can be called by the wallet owner to manually execute a transaction as a fallback. However, this execution doesn't increment the nonce of the wallet.

```solidity
    function executeTransactionFromOutside(
        Transaction calldata transaction
    ) external payable override {
        // Check if msg.sender is authorized
        if (!_k1IsOwner(msg.sender)) {
            revert Errors.UNAUTHORIZED_OUTSIDE_TRANSACTION();
        }

        // Extract hook data from transaction.signature
        bytes[] memory hookData = SignatureDecoder.decodeSignatureOnlyHookData(
            transaction.signature
        );

        // Get the hash of the transaction
        bytes32 signedHash = transaction.encodeHash();

        // Run the validation hooks
        if (!runValidationHooks(signedHash, transaction, hookData)) {
            revert Errors.VALIDATION_HOOK_FAILED();
        }

        _executeTransaction(transaction);
    }
```

Consider a scenario where the execution operator is unresponsive, and the wallet owner decides to manually execute the transaction. When the operator becomes active again and processes the request, it can still execute the transaction because the nonce is not incremented when `executeTransactionFromOutside` is called, potentially causing unintended double execution.

## Recommendations

Increment nonce inside `executeTransactionFromOutside` execution.
