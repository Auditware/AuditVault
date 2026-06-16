---
tags:
  - check/merkle-tree-overflow
  - sector/zk
  - sector/privacy
  - lang/solidity
---
Does the Merkle tree implementation correctly handle near-full and overflow states? Verify: (1) insert() reverts when tree is full rather than wrapping or overwriting existing leaves, (2) root update logic executes for all fills including when tree exceeds half capacity, (3) insertMany() checks cumulative count against max leaves before inserting.
