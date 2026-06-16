---
tags:
  - lang/solidity
  - sector/governance
  - sector/multisig
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Recall]]"
auditors:
  - "[[Daniel526]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[bridge-validator-threshold]]"
  - "[[quorum-supply-drift]]"
---
# [H-01] Missing signature duplication check in the `submitCheckpoint` function

- id: 65088
- impact: HIGH
- protocol: [[Recall]]
- reporter: Daniel526 (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


The checkpoint submission process has a bug that allows a single malicious validator to pass the validation on their own by duplicating their signature. This could potentially allow a small group of validators to pass the validation even if the majority did not participate. To fix this, the multi-signature verification logic needs to be modified to prevent duplicate validator addresses in the signatories array. This bug has been confirmed and steps are being taken to mitigate it.

## Details



The checkpoint submission process relies on a weighted multi-signature verification scheme, but due to the lack of signature duplication checks, a single malicious validator can pass the checkpoint validation on their own.

### Proof of Concept

The checkpoint submission process relies on a weighted multi-signature verification scheme to ensure that a quorum of active validators has signed the checkpoint. However, the implementation does not enforce the uniqueness of signatories. This allows a single validator to repeatedly provide multiple signatures, thereby accumulating their weight and potentially satisfying the threshold on their own.

This situation could allow a malicious validator (or a colluding minority) to pass the checkpoint validation with minimal participation from other validators.

In the [`SubnetActorCheckpointingFacet` contract](https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/subnet/SubnetActorCheckpointingFacet.sol# L38):
```

    function submitCheckpoint(
        BottomUpCheckpoint calldata checkpoint,
        address[] calldata signatories,
        bytes[] calldata signatures
    ) external whenNotPaused {
        ensureValidCheckpoint(checkpoint);

        bytes32 checkpointHash = keccak256(abi.encode(checkpoint));

        // validate signatures and quorum threshold, revert if validation fails
        validateActiveQuorumSignatures({signatories: signatories, hash: checkpointHash, signatures: signatures});
```

The critical issue is that the `validateActiveQuorumSignatures` function does not enforce that each validator appears only once in the signatories array. For example, consider a scenario where:

* The validator set comprises 10 validators with a combined total weight of 100.
* The quorum threshold is calculated as 51 (i.e. 51% of 100).
* If a single validator (with weight 6) signs the checkpoint multiple times (e.g., 10 times), the accumulated weight would be `6 × 10 = 60`, which exceeds the threshold of 51.

This means that only one validator, by duplicating its signature, could potentially satisfy the quorum requirement. This undermines the intended security of requiring a broad consensus among multiple independent validators.

A malicious validator (or a small colluding group) could repeatedly sign the same checkpoint, artificially inflating their weight and meeting the quorum threshold even if the majority of validators did not participate.

### Recommended mitigation steps

Modify the multi-signature verification logic to ensure that each validator address appears only once in the signatories array.

**Recall confirmed**

---
