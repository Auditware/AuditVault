---
tags:
  - lang/solidity
  - sector/nft
  - platform/pashov
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[RipIt]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/RipIt-security-review_2025-05-10.md"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[reentrancy-guard]]"
---
# [C-01] Reentrancy attack in `authorizedOpenPacket()` allows duplicates

- id: 62592
- impact: HIGH
- protocol: RipIt_2025-05-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-05-10.md

## Summary


This report discusses a bug that has been resolved in the `CardAllocationPool.sol` and `Packet.sol` contracts. The bug allows attackers to receive multiple sets of NFT cards for a single packet by exploiting a critical reentrancy vulnerability. This can happen when a manager calls the `authorizedOpenPacket()` function in `CardAllocationPool.sol` to open a packet with specific cards, which then triggers the `onERC721Received()` hook in the attacker's contract. The attacker can then manipulate the packet's state and receive the cards twice by calling `initiateBurn()` and `finalizeOpen()` in quick succession. To fix this issue, it is recommended to implement reentrancy protection and use a checks-effects-interactions pattern in the affected functions.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** High

## Description

There is a critical reentrancy vulnerability in the interaction between `CardAllocationPool.sol` and `Packet.sol` when handling **OPEN_PACKET** burn types. This vulnerability enables attackers to receive multiple sets of NFT cards for a single packet.

The attack scenario follows this sequence:

- Attacker initiates a burn with **OPEN_PACKET** type using `initiateBurn()` in `Packet.sol` for a packet they own.
- A manager calls `authorizedOpenPacket()` in `CardAllocationPool.sol` to open the packet with specific cards.
- The `authorizedOpenPacket()` function transfers cards to the attacker using `safeTransferFrom()`, which triggers the `onERC721Received()` hook on the attacker's contract.
- Within this callback, the attacker can:
   1) Call `cancelBurn()` to reset the burn state of the packet.
   2) Immediately call `initiateBurn()` again with **INSTANT_OPEN_PACKET** type for the same packet
-  If `packetTypeToCardBundles[packetType].length == 1` in `CardAllocationPool.sol`, the `instantOpenPacket()` function will:
   1) Transfer a set of NFTs cards to the attacker.
   2) Call `finalizeOpen()` in `Packet.sol` to transfer the packet to the inventory.
- When control returns to the original `authorizedOpenPacket()` function, it calls `finalizeOpen()` to burn the packet, but at this point, the packet is already in the inventory, causing a state inconsistency.

This attack leads to:

a. The attacker receives cards twice for a single packet.

b. The packet is added to inventory for resale but is also burned, causing future calls to the `PacketStore.sol` contract to fail when attempting to transfer the packet.

The root cause is that the `authorizedOpenPacket()` function doesn't protect against reentrancy and the burn type is not reset to **NONE**, allowing the packet's state to be manipulated during the callback from the `safeTransferFrom()` operation.

## Recommendations

Implement reentrancy protection and use a checks-effects-interactions pattern to prevent this attack in `Packet.sol` and `CardAllocationPool.sol` functions. 
