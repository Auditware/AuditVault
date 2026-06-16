---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - sector/nft
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-05-10.md"
genome:
  - "[[missing-allowance]]"
  - "[[indirect-loss]]"
  - "[[access-roles]]"
---
# [C-02] Missing packet ID in `finalizeOpen()` causes NFT loss

- id: 62593
- impact: HIGH
- protocol: RipIt_2025-05-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-05-10.md

## Summary


The bug report is about a critical flaw in the `Packet.sol` contract that causes all transactions to fail when the `burnType` is **INSTANT_OPEN_PACKET**. This happens because the function `finalizeOpen()` does not properly assign the packet ID to an array before calling `packetStore.addPacketsToInventory()`. This results in the user losing their packet NFT without receiving anything in return. The report recommends adding the missing assignment to store the packet ID in the array to fix the issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

In the `Packet.sol` contract, the `finalizeOpen()` function has a critical flaw that will cause all transactions to fail when the `burnType` is **INSTANT_OPEN_PACKET**.
When processing an **INSTANT_OPEN_PACKET** burn type, the function attempts to add the packet to inventory by calling `packetStore.addPacketsToInventory(packetIds)`. However, it creates a new array to hold the packet ID but never actually assigns the packet ID to the array:
```solidity
if (burnType == BurnType.INSTANT_OPEN_PACKET) {
    _transfer(ownerOf(packetId), address(this), packetId);
    this.approve(address(packetStore), packetId);

    uint256[] memory packetIds = new uint256[](1);
    // Missing: packetIds[0] = packetId;
    packetStore.addPacketsToInventory(packetIds);
}
```
As a result, the `packetIds` array contains only default values (zeros), not the actual packet ID, causing `addPacketsToInventory()` to attempt to process an invalid packet ID. This will lead to a revert in `addPacketsToInventory()` when it tries to validate a zero packet ID

```solidity
if (!_validatePacketTypeId(packetTypeId)) revert InvalidPacketType(packetTypeId);
```

This issue results in the user losing their packet NFT (as it's transferred to the contract) but not receiving anything in return, as the transaction fails during the call to `packetStore.addPacketsToInventory()`.

### Proof of Concept

Please copy the following POC in `CardAllocationPoolTest.t.sol`

```solidity
function testPOC() public {
        uint256 packetType = 1;
        uint256 packetId = 1;
        uint256[] memory cardIds = _mintCardsToAdmin(3);

        // Add bundle to pool
        vm.startPrank(admin);
        bytes32 bundleProvenance = keccak256(abi.encode(cardIds));
        pool.addCardBundlesToPacketPool(packetType, cardIds, cardIds, bundleProvenance);
        vm.stopPrank();

        // Setup packet
        vm.startPrank(admin);
        packet.registerPacketType(
            PacketStorage.PacketTypeParams({packetTypeName: "Test Pack", packetTypeMetadata: "Test Metadata"})
        );

        packet.mintTo(
            PacketStorage.PacketMintParams({
                packetTypeId: packetType,
                packetMetadata: "Test Packet",
                packetSerialNumber: "TEST-001"
            }),user
        );

        vm.stopPrank(); 

        // User initiates burn which will trigger instantOpenPacket
        
        vm.startPrank(user);
        vm.expectRevert(RipFunStore.InvalidPacketType.selector);
        packet.initiateBurn(
            PacketStorage.PacketBurnParams({packetId: packetId, burnType: PacketStorage.BurnType.INSTANT_OPEN_PACKET})
        );
        vm.stopPrank();

        // Verify request was made
        //assertTrue(coordinator.lastRequestId() == 0);
    }
```
## Recommendations

Add the missing assignment to store the packet ID in the array before calling `addPacketsToInventory()`
```diff
 function finalizeOpen(uint256 packetId, uint256[] memory selectedBundle, string memory openMetadata)
        external
        onlyRole(ALLOCATION_MANAGER_ROLE)
    {
       //...
        if (burnType == BurnType.INSTANT_OPEN_PACKET) {
            _transfer(ownerOf(packetId), address(this), packetId);
            this.approve(address(packetStore), packetId);

            uint256[] memory packetIds = new uint256[](1);
+           packetIds[0] = packetId;
            packetStore.addPacketsToInventory(packetIds);
        } else {
          //...
        }
        //...
    }
```
This will ensure that the correct packet ID is passed to the `addPacketsToInventory()` function, allowing the transaction to complete successfully.
