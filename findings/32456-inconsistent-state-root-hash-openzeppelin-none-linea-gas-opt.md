---
tags:
  - lang/solidity
  - sector/zk
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Linea]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/linea-gas-optimizations-audit"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
---
# Inconsistent State Root Hash

- id: 32456
- impact: HIGH
- protocol: [[Linea]] Gas Optimizations Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/linea-gas-optimizations-audit

## Summary


The bug report discusses an issue with the finalization process in a software called ZkEvmV2. During this process, certain data called "shnarfs" and "state root hashes" are provided to the operator. However, these data are not checked to make sure they match each other. This can lead to incorrect data being recorded and could cause problems with the software. The report suggests validating the final state root hash to ensure consistency. This issue has been resolved in a recent update.

## Details

During finalization, the operator provides the [previous](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/interfaces/l1/ILineaRollup.sol#L113) and [new](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/interfaces/l1/ILineaRollup.sol#L41) shnarfs, as well as the [previous](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/interfaces/l1/ILineaRollup.sol#L112) and [new](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/interfaces/l1/ILineaRollup.sol#L38) state root hashes. However, the shnarfs and state roots are not validated to match each other. In particular, the parent state root hash [must match the correct record](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/LineaRollup.sol#L464) in the `stateRootHashes` mapping, which is then updated to include [the final state root hash](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/LineaRollup.sol#L557-L559). It should be noted that this chain of state root hashes does not have to correspond to the actual L2 state root hashes that are validated through the shnarfs. Moreover, incorrect state root hashes would also cause invalid [`BlocksVerificationDone`](https://github.com/Consensys/zkevm-monorepo/blob/7f3614e59901402c804e72396afedb15263dcbe4/contracts/contracts/ZkEvmV2.sol#L63) events.


Consider validating that the final state root hash is consistent with the finalized shnarf.


***Update:** Resolved in [pull request #3183](https://github.com/Consensys/zkevm-monorepo/pull/3183/).*
