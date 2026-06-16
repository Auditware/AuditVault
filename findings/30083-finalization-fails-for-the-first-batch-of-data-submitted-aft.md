---
tags:
  - lang/solidity
  - platform/consensys
  - has/github
  - severity/high
  - sector/algo-stable
protocol: "[[Linea]]"
auditors:
  - "[[Rai Yang]]"
report: "https://consensys.net/diligence/audits/2024/01/linea-contracts-update/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Finalization Fails for the First Batch of Data Submitted After Migration to the Updated Contract ✓ Fixed

- id: 30083
- impact: HIGH
- protocol: [[Linea]] Contracts Update
- reporter: Rai Yang
 (ConsenSys)
- source: https://consensys.net/diligence/audits/2024/01/linea-contracts-update/

## Summary


The bug report discusses an issue with the migration and deployment strategy of Linea. When submitting the initial batch of compressed block data after a contract update, the finalization process fails. This is due to a check that requires the `parentStateRootHash` to match the `stateRootHash` of the current L2 block, which is not possible because the `startingDataParentHash` is empty. The recommendation is to set the correct initial value for `dataFinalStateRootHashes` to resolve this issue. The bug has been fixed in a pull request by wrapping the check in a condition that allows it to go through the first time after migration.

## Details

#### Resolution



Linea responded:



> 
> Our migration and deployment strategy is to have as close to zero downtime as possible. Because of this, implementing the recommendation of Set the correct initial value for dataFinalStateRootHashes for the initial batch of compressed block data. is going to be difficult as we won’t know it at the time (L2 block and state is indeterminable in advance) and would require a pausing of the contracts.
> 
> 
> 


The issue is fixed in [PR-24](https://github.com/Consensys/linea-contracts-audit/pull/24) by wrapping the check



```
if (startingParentFinalStateRootHash != _finalizationData.parentStateRootHash) {
          revert FinalStateRootHashDoesNotMatch(
            startingParentFinalStateRootHash,
            _finalizationData.parentStateRootHash
          );
 }

```
with `if (startingDataParentHash != EMPTY_HASH) {` to allow it go through the first time after migration, subsequent finalization will be checked.




#### Description


When submitting the initial batch of compressed block data after the contract update, the finalization will fail.


In function `_finalizeCompressedBlocks`, `startingDataParentHash = dataParents[_finalizationData.dataHashes[0]]` will be empty and, therefore, `startingParentFinalStateRootHash = dataFinalStateRootHashes[startingDataParentHash]` will be empty too. The check `_finalizationData.parentStateRootHash == stateRootHashes[currentL2BlockNumber]` requires `_finalizationData.parentStateRootHash == _initialStateRootHash`, which is not empty, so the condition `startingParentFinalStateRootHash != _finalizationData.parentStateRootHash` is true, and we revert with the error `FinalStateRootHashDoesNotMatch`:


**contracts/LineaRollup.sol:L199-L201**



```
if (stateRootHashes[currentL2BlockNumber] != \_finalizationData.parentStateRootHash) {
 revert StartingRootHashDoesNotMatch();
}

```
**contracts/LineaRollup.sol:L283-L294**



```
if (finalizationDataDataHashesLength != 0) {
 bytes32 startingDataParentHash = dataParents[\_finalizationData.dataHashes[0]];

 if (startingDataParentHash != \_finalizationData.dataParentHash) {
 revert ParentHashesDoesNotMatch(startingDataParentHash, \_finalizationData.dataParentHash);
 }

 bytes32 startingParentFinalStateRootHash = dataFinalStateRootHashes[startingDataParentHash];

 if (startingParentFinalStateRootHash != \_finalizationData.parentStateRootHash) {
 revert FinalStateRootHashDoesNotMatch(startingParentFinalStateRootHash, \_finalizationData.parentStateRootHash);
 }

```
#### Recommendation


Set the correct initial value for `dataFinalStateRootHashes` for the initial batch of compressed block data.
