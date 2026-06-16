---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/account
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf"
genome:
  - "[[signature-replay]]"
  - "[[role-bypass]]"
  - "[[permit-fork-replay]]"
---
# ERC-7739 does not use correct verifyingContract address 

- id: 42064
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The report is about a bug in the code for ERC-7739, which is designed to prevent signature replay for smart accounts that share signers. The current codebase sets the verifyingContract to the address of the SmartSession rather than the individual account, making all accounts vulnerable to signature replay. The recommendation is to change the function to use the smart account's address as the verifyingContract. The bug has been fixed in PR 64 and PR 77 and has been verified by Cantina Managed.

## Details

## Context
(No context files were provided by the reviewer)

## Description
ERC-7739 introduces a rehashing scheme designed to prevent signature replay across smart accounts that share signers. To accomplish this, the ERC-7739 logic wraps the hash provided to the ERC-1271 `isValidSignature()` function within a new EIP-712 typed struct. This struct differentiates the hashes verified by each account by using the account's own address as the `verifyingContract`, which ensures that signatures are unique to each account and cannot be replayed.

However, in the current codebase, the `verifyingContract` is set to the address of the SmartSession rather than the address of each individual account. This approach defeats the main purpose of using ERC-7739, as it causes all accounts to modify their hashes in the same predictable way. As a result, two smart accounts that share a signer could be vulnerable to signature replay.

## Recommendation
Change the `_erc1271IsValidSignatureViaNestedEIP712()` function to use an `eip712Domain()` that uses the smart account's address as the `verifyingContract` instead of the SmartSession address. For example:

```solidity
function _typedDataSignFields() private view returns (bytes32 m) {
    (
        bytes1 fields,
        string memory name,
        string memory version,
        uint256 chainId,
        - address verifyingContract,
        + ,
        bytes32 salt,
        uint256[] memory extensions
    ) = eip712Domain();
    + address verifyingContract = msg.sender;
    /// @solidity memory-safe-assembly
    assembly {
        m := mload(0x40) // Grab the free memory pointer.
        mstore(0x40, add(m, 0x120)) // Allocate the memory.
        // Skip 2 words for the ` typedDataSignTypehash ` and ` contents ` struct hash.
        mstore(add(m, 0x40), shl(248, byte(0, fields)))
        mstore(add(m, 0x60), keccak256(add(name, 0x20), mload(name)))
        mstore(add(m, 0x80), keccak256(add(version, 0x20), mload(version)))
        mstore(add(m, 0xa0), chainId)
        mstore(add(m, 0xc0), shr(96, shl(96, verifyingContract)))
        mstore(add(m, 0xe0), salt)
        mstore(add(m, 0x100), keccak256(add(extensions, 0x20), shl(5, mload(extensions))))
    }
}
```

## Rhinestone
Fixed in PR 64 and PR 77.

## Cantina Managed
Verified.
