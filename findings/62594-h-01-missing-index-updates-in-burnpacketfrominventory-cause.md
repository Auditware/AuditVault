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
  - "[[missing-modifier]]"
  - "[[wrong-state]]"
  - "[[oracle-freshness]]"
---
# [H-01] Missing index updates in `burnPacketFromInventory()` cause failures

- id: 62594
- impact: HIGH
- protocol: RipIt_2025-05-10
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[RipIt]]-security-review_2025-05-10.md

## Summary


The bug report discusses a problem in the `PacketStore` function, where the `_packetInventoryIdx` mapping is not being updated correctly when a packet is burned. This leads to two issues: the moved packet's mapping still points to its old position and the burned packet's mapping remains. This creates a corrupted state where future operations on the moved packet will access the wrong array position and the burned packet's mapping becomes a dangling pointer. The report recommends updating the index mapping for the moved packet and deleting the burned packet's mapping to resolve the issue.

## Details


_Resolved_

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In `PacketStore`, the `_packetInventoryIdx` mapping tracks the position of each packet in its type's inventory array, `_packetInventory`. When burning a packet, the function moves the last packet to replace the burned one **but fails to update the `_packetInventoryIdx` mapping of packets**. 

```solidity
function addPacketsToInventory(uint256[] calldata packetIds) external onlyRole(INVENTORY_MANAGER_ROLE) {
    uint256 length = packetIds.length;
    for (uint256 i = 0; i < length; i++) {
        --- SNIPPED 
---

@>      _packetInventoryIdx[packetId] = _packetInventory[packetTypeId].length;
@>      _packetInventory[packetTypeId].push(packetId);

        emit PacketAddedToInventory(packetId, packetTypeId);
    }
}

function burnPacketFromInventory(uint256 packetId) external onlyRole(INVENTORY_MANAGER_ROLE) {
    --- SNIPPED 
---

    uint256 idx = _packetInventoryIdx[packetId];

    _packetInventory[packetTypeId][idx] = _packetInventory[packetTypeId][_packetInventory[packetTypeId].length - 1];
    _packetInventory[packetTypeId].pop();
}
```

This creates two issues:

1. The moved packet's index mapping still points to its old position (last index).

2. The burned packet's index mapping remains.

Consequently, this leads to a corrupted state where:

- Future operations on the moved packet will access the wrong array position:
    1) If no new packet is added to the inventory, it will point to an out-of-bounds index, causing subsequent burns of the moved packet to revert.
    2) Otherwise, there will be 2 packets pointing to the same index.

- The burned packet's index mapping becomes a dangling pointer.

Consider this illustrated sequence:

Initial state:
```bash
_packetInventory[typeId] = [P_1, P_2, P_3]
_packetInventoryIdx = {
  P_1 => 0,
  P_2 => 1,
  P_3 => 2
}
```

Burn packet `P_1`:
```solidity
function burnPacketFromInventory(uint256 packetId) external {
    uint256 idx = _packetInventoryIdx[packetId]; // idx = 0
    // Move P_3 to index 0
    _packetInventory[packetTypeId][idx] = _packetInventory[packetTypeId][2];
    _packetInventory[packetTypeId].pop();
}
```

Resulting corrupted state:
```bash
_packetInventory[typeId] = [P_3, P_2] // length =2 
_packetInventoryIdx = {
  P_1 => 0,  // Dangling
  P_2 => 1,
  P_3 => 2   // OOB, array length is 2 and actual position is at index 0
}
```

Attempting to burn `P_3` will revert due to index out of bounds or Adding a new packet creates an index collision.
```bash
_packetInventory[typeId] = [P_3, P_2, P_4] // length = 2 
_packetInventoryIdx = {
  P_1 => 0,  
  P_2 => 1,
  P_3 => 2  // Collision
  P_4 => 2  // Collision
}
```

## Recommendation

Update the index mapping for the moved packet and delete the burned packet's mapping.

```diff
function burnPacketFromInventory(uint256 packetId) external {
    uint256 idx = _packetInventoryIdx[packetId];

    uint256 lastPacketId = _packetInventory[packetTypeId][_packetInventory[packetTypeId].length - 1];
    _packetInventory[packetTypeId][idx] = lastPacketId;

+   _packetInventoryIdx[lastPacketId] = idx;
+   delete _packetInventoryIdx[packetId];
    _packetInventory[packetTypeId].pop();
}
```
