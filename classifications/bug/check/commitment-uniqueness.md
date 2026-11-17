---
tags:
  - check/commitment-uniqueness
  - web3-sector/zk
  - web3-sector/privacy
  - lang/solidity
---
Can the same commitment be submitted twice or at different indices? Verify the on-chain commitment store rejects duplicates (nullifier or index map) and that the input array fed to the Circom verifier is constructed by the contract, not supplied raw by the caller.
