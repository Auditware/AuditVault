---
tags:
  - blockchain/evm
  - blockchain/evm/linea
  - lang/solidity
  - sector/algo-stable
  - sector/bridge
  - sector/zk
  - platform/consensys
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Linea]]"
auditors:
  - "[[Rai Yang]]"
report: "https://consensys.net/diligence/audits/2024/01/linea-contracts-update/"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
---
# Malicious Operator Might Finalize Data From a Forked [[Linea]] Chain ✓ Fixed

- id: 30085
- impact: HIGH
- protocol: Linea Contracts Update
- reporter: Rai Yang
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2024/01/linea-contracts-update/

## Summary


The Linea team has found a bug in their system where a malicious operator (prover) can steal funds from the L1 by manipulating block data from a forked Linea chain. This can happen because the prover is able to set the forked chain's `chainId` as a constant in their circuit, making it difficult for the L1 contract to distinguish between data from the canonical chain and the forked one. This attack is unlikely to happen now because the operator is owned by the Linea team, but it could become more common once the operator is decentralized. To fix this issue, the Linea team recommends adding `chainId` as a public input in the verifier function to prevent mismatched `chainId`s from passing the verification.

## Details

#### Resolution



Linea team responded that `chainId` is hard coded in the prover’s circuit, the verifier key (verifier contract) would be different for different chainId, the proof won’t pass the verification unless the forked Linea chain has the same `chainId` as the canonical chain


#### Description


A malicious operator (prover) can add and finalize block data from a forked Linea chain, so transactions on the forked chain can be finalized, causing a loss of funds from the L1.


For example, a malicious operator forks the canonical chain, then the attacker sends the forked chain Ether to L1 with `sendMessage` from the forked L2. The operator then submits the block data to L1 and finalizes it with `finalizeCompressedBlocksWithProof`, using the finalization data and proof from the forked chain. (Note that the malicious prover sets the forked chain `chainId` in its circuit as a constant.) The L1 contract (`LineaRollup`) doesn’t know whether the data and the proof are from the canonical L2 or the forked one. The finalization succeeds, and the attacker can claim the bridged forked chain Ether and steal funds from L1.


As there is currently only one operator and it is owned by the Linea team, this kind of attack is unlikely to happen. However, when the operator and the coordinator are decentralized, the likelihood of this attack increases.


#### Examples


**contracts/LineaRollup.sol:L211-L222**



```
uint256 publicInput = uint256(
 keccak256(
 abi.encode(
 shnarf,
 \_finalizationData.parentStateRootHash,
 \_finalizationData.lastFinalizedTimestamp,
 \_finalizationData.finalBlockNumber,
 \_finalizationData.finalTimestamp,
 \_finalizationData.l1RollingHash,
 \_finalizationData.l1RollingHashMessageNumber,
 keccak256(abi.encodePacked(\_finalizationData.l2MerkleRoots))
 )

```
**contracts/LineaRollup.sol:L314**



```
\_addL2MerkleRoots(\_finalizationData.l2MerkleRoots, \_finalizationData.l2MerkleTreesDepth);

```
#### Recommendation


Add `chainId` in the `FinalizationData` as a public input of the verifier function `_verifyProof`, so the proof from the forked Linea chain will not pass the verification because the `chainId` won’t match.
