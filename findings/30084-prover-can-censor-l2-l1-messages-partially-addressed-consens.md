---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/zk
  - platform/consensys
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Linea]]"
auditors:
  - "[[Rai Yang]]"
report: "https://consensys.net/diligence/audits/2024/01/linea-contracts-update/"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[bridge-merkle-proof]]"
  - "[[dos-resistance]]"
---
# Prover Can Censor L2 → L1 Messages  Partially Addressed

- id: 30084
- impact: HIGH
- protocol: [[Linea]] Contracts Update
- reporter: Rai Yang
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2024/01/linea-contracts-update/

## Summary


This bug report discusses a potential issue with the messaging system in a specific software. Messages are grouped and added to a tree by a prover, but the prover can skip messages, leading to frozen funds for the user. The prover is currently owned by a single entity, but it is recommended to decentralize it to avoid this issue. The prover's code is not yet available for verification, so this needs to be done by the owner.

## Details

#### Resolution



Linea responded that the prover enforces all messages are included in the circuit, however with the circuit code is not opensourced yet, this still need to be verified


#### Description


In L2 → L1 messaging, messages are grouped and added to a Merkle tree by the prover. During finalization, the operator (coordinator) submits the Merkle root to L1, and the user SDK rebuilds the tree to which the message is added and generates a Merkle proof to claim against the root finalized on L1. However, the prover can skip messages when building the tree. Consequently, the user cannot claim the skipped message, which might result in frozen funds.


Currently, the prover is a single entity owned by Linea. Hence, this would require malice or negligence on Linea’s part.


#### Examples


**contracts/LineaRollup.sol:L314-L315**



```
\_addL2MerkleRoots(\_finalizationData.l2MerkleRoots, \_finalizationData.l2MerkleTreesDepth);
\_anchorL2MessagingBlocks(\_finalizationData.l2MessagingBlocksOffsets, lastFinalizedBlock);

```
#### Recommendation


Decentralize the prover, so messages can be included by different provers.
