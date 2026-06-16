---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-05-10.md"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[chainlink-round-completeness]]"
  - "[[weak-randomness]]"
---
# [H-02] Packet burn state not reset in `finalizeOpen()` causes failure

- id: 62595
- impact: HIGH
- protocol: RipIt_2025-05-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-05-10.md

## Summary


This bug report is about an issue in the `Packet.sol` contract that results in transaction failures when a user initiates a burn with the **INSTANT_OPEN_PACKET** type. The sequence of events that lead to this issue are described, and the key problem is identified in the `transferFrom()` function which checks for a specific burn type and reverts the transaction if it is not present. The recommendation is to modify the `finalizeOpen()` function in the `Packet.sol` contract to reset the burn state before transferring the packet.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the `Packet.sol` contract, when a user initiates a burn with **INSTANT_OPEN_PACKET** type, an issue occurs in the execution flow that leads to transaction failures.
The sequence occurs as follows:
- User calls `initiateBurn()` with **INSTANT_OPEN_PACKET** burn type in `Packet.sol`.
- This sets the packet's burn state to **INSTANT_OPEN_PACKET** and calls `instantOpenPacket()` in `CardAllocationPool.sol`.
- When only one card bundle is available, `CardAllocationPool` directly transfers NFTs and calls `finalizeOpen()` (the issue still exist if the contract request randomness from Chainlink VRF).
- The `finalizeOpen()` function in `Packet.sol` attempts to transfer the packet to the contract sing directly the `_transfer()` function and then call `addPacketsToInventory()` on PacketStore.sol.
- The `addPacketsToInventory()` function tries to transfer the packet using `safeTransferFrom()`.
- However, this transfer fails because the packet's burn type is still **INSTANT_OPEN_PACKET**.
The key issue is in the `transferFrom()` function which has a check:
```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual override {
    if (_packetBurnType[tokenId] != BurnType.NONE) revert PacketFrozen();
    super.transferFrom(from, to, tokenId);
}
```
This function reverts with `PacketFrozen()` error when the burn type is not **NONE,** but the burn type is never reset to **NONE** during the `finalizeOpen()` process for **INSTANT_OPEN_PACKET** burn type.

## Recommendations

Modify the `finalizeOpen()` function in  `Packet.sol` contract to reset the burn state to **NONE** before transferring the packet:
```solidity
if (burnType == BurnType.INSTANT_OPEN_PACKET) {
        // Reset burn state to NONE before transfer
        _packetBurnType[packetId] = BurnType.NONE;
        
        _transfer(ownerOf(packetId), address(this), packetId);
        this.approve(address(packetStore), packetId);

        uint256[] memory packetIds = new uint256[](1);
        packetStore.addPacketsToInventory(packetIds);
    } else {
```
