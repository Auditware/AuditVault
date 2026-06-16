---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Uniswap]]"
auditors:
  - "[[Philogy]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Uniswap-The-Compact-Spearbit-Security-Review-May-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
---
# Incorrect storage slot derivation breaks authorization

- id: 61280
- impact: HIGH
- protocol: [[Uniswap]]: The Compact
- reporter: Philogy (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Uniswap-The-Compact-Spearbit-Security-Review-May-2025.pdf

## Summary


The report describes a critical bug in the EmissaryLib.sol code, which can be exploited by attackers to steal funds from users. The problem lies in the function that computes the storage slot for the configuration of a given emissary. Due to a mistake in the code, the sponsor is not included in the slot derivation, allowing anyone to change the emissary of a user and potentially steal their funds. The impact of this bug is significant as it affects all users and their open resource locks. The report provides a proof of concept and recommends a fix to resolve the issue. The bug has been fixed by Uniswap Labs and verified by Spearbit.

## Details

## Severity: Critical Risk

## Context
EmissaryLib.sol#L65-L84

## Summary
The derivation for the emissary configuration storage slot fails to include the sponsor, which is necessary for authorization. As a result, attackers can arbitrarily set the emissaries of users, allowing them to steal funds from their resource locks by processing malicious claims.

## Finding Description
In `EmissaryLib._getEmissaryConfig`, we compute the storage slot for the configuration for a given emissary. This is done by closely packing the sponsor, `_EMISSARY_SCOPE`, and `lockTag` and hashing them to derive the storage slot to use:

```solidity
function _getEmissaryConfig(address sponsor, bytes12 lockTag)
    private
    pure
    returns (EmissaryConfig storage config)
{
    assembly ("memory-safe") {
        // Pack data for computing storage slot.
        mstore(0x14, sponsor) // Offset 0x14 (20 bytes): Store 20-byte sponsor address
        mstore(0, _EMISSARY_SCOPE) // Offset 0 (0 bytes): Store 4-byte scope value
        mstore(0x20, lockTag) // Offset 0x20 (12 bytes): Store 12-byte lock tag
      
        // Compute storage slot from packed data.
        // Start at offset 0x1c (28 bytes), which includes:
        // - The 4 bytes of _EMISSARY_SCOPE (which is stored at position 0x00)
        // - The entire 20-byte sponsor address (which starts at position 0x14)
        // - The entire 12-byte lock tag (which starts at position 0x34)
        // Hash 0x24 (36 bytes) of data in total
        config.slot := keccak256(0x1c, 0x24)
    }
}
```

However, the problem with this logic is that while placing everything in memory, we overwrite the sponsor with the lock tag. This occurs because we place the sponsor at `0x14` such that the relevant bytes of the address start at `0x20`, then we write to `0x20` again with the lock tag, completely overwriting the sponsor. 

We can take a look at the resulting memory in chisel:

```solidity
uint256 private constant _EMISSARY_SCOPE = 0x2d5c707;
bytes12 lockTag = 0xffffffffffffffffffffffff;
address sponsor = 0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5;
assembly {
    mstore(0x14, sponsor) // Offset 0x14 (20 bytes): Store 20-byte sponsor address
    mstore(0, _EMISSARY_SCOPE) // Offset 0 (0 bytes): Store 4-byte scope value
    mstore(0x20, lockTag) // Offset 0x20 (12 bytes): Store 12-byte lock tag
}
```

```plaintext
!memdump
[0x00:0x20]: 0x0000000000000000000000000000000000000000000000000000000002d5c707
[0x20:0x40]: 0xffffffffffffffffffffffff0000000000000000000000000000000000000000
[0x40:0x60]: 0x0000000000000000000000000000000000000000000000000000000000000080
```

As we can see in the above example, the resulting memory does not contain the sponsor address.

## Impact Explanation
We pass the `msg.sender` as the `sponsor` parameter so that users can only manipulate their own emissary configuration. Effectively, the sponsor being included in the slot derivation is an authorization mechanism. As a result, the sponsor not being included in the slot derivation allows anyone to arbitrarily set the emissary configuration of another user.

The emissary is an important role in the system as it has the power to sign a claim on behalf of the sponsor. Thus, by exploiting the unsafe emissary derivation, an attacker can execute claims on behalf of any user to steal funds from their resource locks.

## Likelihood Explanation
Since this incorrect slot derivation applies to every sponsor, every sponsor would be vulnerable to this attack and thus every open resource lock could potentially be stolen. The only resource locks that could be protected would be those with already assigned emissaries, in which case an attacker would have to schedule a new emissary assignment, and if noticed, anyone could protect that lock by re-scheduling until the lock can be force withdrawn.

## Proof of Concept
The following test should pass, as different users should be assigning different emissaries with the same `lockTag`. However, this fails with `EmissaryAssignmentUnavailable` because they are each assigning to the same emissary configuration slot.

```solidity
function test_differentPeopleAssigningEmissary() public {
    // Setup: register allocator
    ResetPeriod resetPeriod = ResetPeriod.TenMinutes;
    Scope scope = Scope.Multichain;
    vm.prank(allocator);
    uint96 allocatorId = theCompact.__registerAllocator(allocator, "");
    bytes12 lockTag = bytes12(bytes32((uint256(scope) << 255) | (uint256(resetPeriod) << 252) | (uint256(allocatorId) << 160)));
    
    // Create 2 emissaries
    address emissary1 = address(new AlwaysOKEmissary());
    address emissary2 = address(new AlwaysOKEmissary());
    
    // Assign emissary
    vm.prank(swapper);
    theCompact.assignEmissary(lockTag, emissary1);
    
    // Verify: emissary status of swapper
    (EmissaryStatus status, uint256 emissaryAssignableAt, address currentEmissary) = theCompact.getEmissaryStatus(swapper, lockTag);
    assertEq(uint256(status), uint256(EmissaryStatus.Enabled), "Status should be enabled");
    assertEq(emissaryAssignableAt, type(uint96).max, "AssignableAt should be max uint96");
    assertEq(currentEmissary, emissary1, "Current emissary should be emissary1");
    
    // Different swapper assigning a different emissary
    address swapper2 = makeAddr("swapper2");
    vm.prank(swapper2);
    theCompact.assignEmissary(lockTag, emissary2);
    
    // Verify: emissary status of swapper2
    (status, emissaryAssignableAt, currentEmissary) = theCompact.getEmissaryStatus(swapper2, lockTag);
    assertEq(uint256(status), uint256(EmissaryStatus.Enabled), "Status should be enabled");
    assertEq(emissaryAssignableAt, type(uint96).max, "AssignableAt should be max uint96");
    assertEq(currentEmissary, emissary2, "Current emissary should be emissary2");
}
```

## Recommendation
We can resolve this by adjusting the way that we pack the relevant values in memory to ensure memory safety in the process. This can be accomplished first by defining `_EMISSARY_SCOPE` as a `bytes4` constant, leading to it being right-padded with zero bytes:

```solidity
- uint256 private constant _EMISSARY_SCOPE = 0x2d5c707; // Note that this wasn't a full 4 bytes, hence the `e` added below
+ bytes4 private constant _EMISSARY_SCOPE = 0x2d5c707e;
```

Then this allows us to adjust the way we place memory such that we don't have overlapping bytes, while still staying within scratch space, adjusting the range to hash accordingly:

```solidity
assembly ("memory-safe") {
    // Pack data for computing storage slot.
    - mstore(0x14, sponsor) // Offset 0x14 (20 bytes): Store 20-byte sponsor address
    - mstore(0, _EMISSARY_SCOPE) // Offset 0 (0 bytes): Store 4-byte scope value
    - mstore(0x20, lockTag) // Offset 0x20 (12 bytes): Store 12-byte lock tag
    + mstore(0x00, _EMISSARY_SCOPE) // Offset 0 (0 bytes): Store 4-byte scope value
    + mstore(0x04, sponsor) // Offset 0x10 (16 bytes): Store 20-byte sponsor address
    + mstore(0x24, lockTag) // Offset 0x24 (36 bytes): Store 12-byte lockTag
    
    // Compute storage slot from packed data.
    - // Start at offset 0x1c (28 bytes), which includes:
    + // Start at offset 0x00 (0 bytes), which includes:
    // - The 4 bytes of _EMISSARY_SCOPE (which is stored at position 0x00)
    - // - The entire 20-byte sponsor address (which starts at position 0x14)
    - // - The entire 12-byte lock tag (which starts at position 0x34)
    - // Hash 0x24 (36 bytes) of data in total
    - config.slot := keccak256(0x1c, 0x24)
    + // - The entire 20-byte sponsor address (which starts at position 0x10)
    + // - The entire 12-byte lock tag (which starts at position 0x24)
    + // Hash 0x30 (48 bytes) of data in total
    + config.slot := keccak256(0x00, 0x30)
}
```

Uniswap Labs: Fixed in commit `3caea0b7`.  
Spearbit: Fix verified.
