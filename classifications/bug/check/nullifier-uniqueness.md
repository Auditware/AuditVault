---
tags:
  - check/nullifier-uniqueness
  - sector/zk
  - sector/privacy
  - lang/solidity
---
Is every nullifier enforced as globally unique on-chain before processing a withdrawal or spend? Verify the contract checks `nullifierHashes[nullifier] == false` before execution and sets it to true atomically - missing or bypassable nullifier checks allow double-spend / double-withdrawal of the same note.
