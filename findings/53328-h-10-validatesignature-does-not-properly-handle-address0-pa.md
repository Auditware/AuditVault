---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[signature-malleability]]"
  - "[[auth/signature-validation]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-10] `_validateSignature()` does not properly handle `address(0)`

- id: 53328
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report highlights a potential issue with the `_validateSignature()` function in a code implementation. The function uses `ECDSA.recover()` to extract the signer address, which can sometimes return `address(0)` for invalid signatures. However, the current code does not account for this possibility and may mistakenly accept invalid signatures as valid. To fix this, the code should be updated to explicitly check for `address(0)` in the recovered address and consider the signature invalid if it is found.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The current implementation of `_validateSignature()` uses `ECDSA.recover()` to extract the signer address, which can return `address(0)` for invalid signatures:

```solidity
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        bytes32 hash = ECDSA.toEthSignedMessageHash(userOpHash);
        address signer = ECDSA.recover(hash, userOp.signature);

        // Check if signer is admin (user wallet)
        if (isAdmin(signer)) return 0;

        // Check if signer is an authorized agent
        if (OmoAgent(payable(address(this))).agents(0) == signer) {
            return 0;
        }
        return SIG_VALIDATION_FAILED;
    }
```

However, if `agent(0)` is not set (i.e., `address(0)`), the function might incorrectly pass the signature validity check even though the signature is invalid. This is because it doesn't account for the possibility that the recovered address could be `address(0)` and mistakenly treats it as a valid signer. This could lead to security issues where invalid signatures are accepted.

## Recommendations

Explicitly check for `address(0)` in the recovered address and ensure that no invalid signatures are accepted. If the recovered address is `address(0)`, the signature should be considered invalid.

Update the `DynamicAccount._validateSignature()` function to check that the recovered signer is not `address(0)`:

```diff
function _validateSignature(
       UserOperation calldata userOp,
       bytes32 userOpHash
   ) internal virtual override returns (uint256 validationData) {
       bytes32 hash = ECDSA.toEthSignedMessageHash(userOpHash);
       address signer = ECDSA.recover(hash, userOp.signature);
+       if (signer == address(0)) return SIG_VALIDATION_FAILED;
       //...
   }
```
