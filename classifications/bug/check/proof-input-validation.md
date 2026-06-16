---
tags:
  - check/proof-input-validation
  - sector/zk
  - sector/privacy
  - lang/solidity
---
Are public inputs to the on-chain verifier constructed and validated by the contract, not accepted as-is from the caller? Verify the contract builds the publicInputs array from its own state (commitments, roots, nullifiers) rather than forwarding a user-supplied array - accepting a user-constructed input array allows commitment duplication and proof replay.
