---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - novelty/variant
  - sector/bridge
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[variant]]"
---
# Invalidated Block Hash in Cross Layer Communication

- id: 60332
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


The client has marked a bug as "Fixed" in the code. The bug affects the `OptimismRootCheckpointManager` and `PolygonChildCheckPointManager` files. The issue is that the `_processMessageFromRoot()` function in `OptimismChildCheckpointManager` does not check if the block hash is null, which allows any user to update the block value to zero. This can cause proofs to become invalid if enough blocks have been created. The same problem is also present in the `PolygonChildCheckPointManager` file. The recommendation is to add a requirement to prevent the execution of `PolygonChildCheckPointManager._processMessageFromRoot()` if the block hash is zero, and the same for `OptimismChildCheckpointManager._processMessageFromRoot()`.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `b88f59fae84ff99aa34302deef7514668cd3fcc2`.

**File(s) affected:**`OptimismRootCheckpointManager`, `PolygonChildCheckPointManager`

**Description:** the `_processMessageFromRoot()` function in `OptimismChildCheckpointManager` does not validate whether the provided block hash is null. As a result, the `optimismSendBlockInfo()` function can be invoked by any user, allowing them to update the block value to zero. This vulnerability can render any proof invalid if a sufficient number of blocks have been created. The same issue is also present in the `PolygonChildCheckPointManager` implementation.

**Recommendation:** Add a requirement to avoid executing `PolygonChildCheckPointManager._processMessageFromRoot()` if the block hash is equal to zero; the same is applicable to `OptimismChildCheckpointManager._processMessageFromRoot()`.
