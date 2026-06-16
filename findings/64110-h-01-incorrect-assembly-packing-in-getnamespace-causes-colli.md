---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/options
protocol: "[[Biconomy]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Biconomy-security-review_2025-11-26.md"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[integer-bounds]]"
---
# [H-01] Incorrect assembly packing in `getNamespace` causes collisions

- id: 64110
- impact: HIGH
- protocol: Biconomy_2025-11-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Biconomy]]-security-review_2025-11-26.md

## Summary


The bug report discusses a problem with the `getNamespace` function in a programming language called Solidity. This function has incorrect assembly code, which can cause issues with memory packing. This means that there can be conflicts with different parts of the code trying to use the same space in the computer's memory. This can lead to errors and crashes in the program.

The report explains that the incorrect code is causing collisions in the namespaces. A namespace is like a unique identifier for different parts of the code. The incorrect code means that two different parts of the code can end up with the same namespace, which can cause confusion and errors.

The report also offers two solutions to fix the problem. The first solution involves using a technique called bit-shifting in the assembly code. This will help prevent the memory overlap that is causing the issue. The second solution involves changing the way the memory is packed, so there is no overlap. Both options will ensure that the code works correctly and avoids any conflicts with namespaces.

It is important to fix this problem because it can impact the program's performance and cause errors. The severity of this bug is considered high, and the likelihood of it happening is medium. This means that it is essential to address this issue as soon as possible to avoid any potential problems.

In summary, the bug report explains a problem with the `getNamespace` function in Solidity, which can cause conflicts with memory packing and lead to errors in the code. The report offers two solutions to fix the issue and emphasizes the importance of addressing this bug.

## Details


_Resolved_

## Severity

**Impact:** High  

**Likelihood:** Medium

## Description

The `getNamespace` function contains incorrect assembly code that can lead to namespace collisions due to improper memory packing.

```solidity
function getNamespace(address account, address _caller) public pure returns (bytes32 result) {
    assembly {
        mstore(0x00, account)
        mstore(0x14, _caller)
        result := keccak256(0x0c, 0x28)
    }
}
```

**Memory Layout Analysis:**

`mstore(0x00, account)` writes 32 bytes:

- Positions 0x00-0x0b: 12 zero bytes (padding).
- Positions 0x0c-0x1f: 20 bytes of account address.

`mstore(0x14, _caller)` writes 32 bytes:

- Positions 0x14-0x1f: 12 zero bytes (padding) - **This overwrites the last 12 bytes of the account address!**
- Positions 0x20-0x33: 20 bytes of caller address.

`keccak256(0x0c, 0x28)` hashes 40 bytes starting at position 0x0c:

- Positions 0x0c-0x13: First 8 bytes of account address.
- Positions 0x14-0x1f: 12 zero bytes (not part of original account).
- Positions 0x20-0x33: 20 bytes of caller address.

**Result:** Only 8 bytes of the account address are included in the hash instead of the full 20 bytes. This creates namespace collisions where any two accounts sharing the same first 8 bytes will generate identical namespaces for the same caller.

Additionally, this affects external systems that compute namespaces correctly using `keccak256(abi.encodePacked(account, caller))`. When they call `readStorage()`, the call will revert with `SlotNotInitialized()` because the slot was never initialized with the correctly computed namespace.

## Recommendations

**Option 1: Use Bit-Shifting in Assembly**
```solidity
function getNamespace(address account, address _caller) public pure returns (bytes32 result) {
    assembly {
        mstore(0x00, account)
        mstore(0x20, shl(96, _caller))
        result := keccak256(0x0c, 0x28)
    }
}
```

**Option 2: Proper Memory Packing Without Overlap**
```solidity
function getNamespace(address account, address _caller) public pure returns (bytes32 result) {
    assembly {
        mstore(0x00, shl(96, account))
        mstore(0x14, shl(96, _caller))
        result := keccak256(0x00, 0x28)
    }
}
```

Both options ensure proper concatenation of the two addresses without padding zeros interfering with the hash computation.
