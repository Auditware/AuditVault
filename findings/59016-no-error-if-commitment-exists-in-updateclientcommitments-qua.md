---
tags:
  - lang/solidity
  - sector/bridge
  - platform/quantstamp
  - severity/high
  - trigger/reorg
protocol: "[[Datachain IBC]]"
auditors:
  - "[[Andrei Stefan]]"
report: "https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html"
genome:
  - "[[missing-check]]"
  - "[[wrong-state]]"
  - "[[reorg]]"
  - "[[bridge-message-validation]]"
---
# No Error if Commitment Exists in `updateClientCommitments()`

- id: 59016
- impact: HIGH
- protocol: Datachain - IBC
- reporter: Andrei Stefan (Quantstamp)
- source: https://certificate.quantstamp.com/full/datachain-ibc/1e53ee14-4316-4cb1-9977-45753e49d5b2/index.html

## Summary


The client has reported a bug in the `IBCClient.sol` file where the `updateClientCommitments()` function does not properly check if the `commitments` mapping is zero for the `consensusStateCommitmentKey` that is being written. This goes against what is documented in ADR-001 by the Datachain team. The client recommends fixing this issue to ensure that updates to `consensusStateCommitmentKey` follow ADR-001 and function as intended. The bug has been marked as "Fixed" by the client and has been addressed in the code.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `877957b44b10420ff424b96cd6e349db4adcf375`.

**File(s) affected:**`IBCClient.sol`

**Description:**`IBCClient.updateClientCommitments()` does not enforce that the `commitments` mapping is zero for the `consensusStateCommitmentKey` that is trying to be written. This is directly contradictory to what is documented in ADR-001 by the Datachain team. Perhaps, if the key exists, and is equivalent to the consensus state we derived from the light client, it would make sense to continue. However, the existence of the key with a different consensus state should signal that there is something out of sync between the clients. For example, in the case of a reorg, there could be a consensus state written at that key that is from a malicious series of blocks, that can be accepted as valid state alongside valid blocks.

**Recommendation:** Ensures that updates to `consensusStateCommitmentKey` adhere to ADR-001, and that ADR-001 correctly specifies the intended functionality.
