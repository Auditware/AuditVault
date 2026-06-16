---
tags:
  - lang/solidity
  - sector/staking
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[NuCypher]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NuCypher/README.md#1-reentry-in-withdrawall"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# Reentry in `withdrawAll`

- id: 28530
- impact: HIGH
- protocol: [[NuCypher]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NuCypher/README.md#1-reentry-in-withdrawall

## Summary


A bug has been discovered in the Nucypher blockchain contract. The malicious token/workerOwner may have a reentry callback to the contract, which can allow them to use reentry. This is due to the state of the contract changing, allowing for the reentry. The recommendation is to put transfers as the last statements of the method, in order to prevent this bug from occurring.

## Details

##### Description
Malicious token/workerOwner may have a reentry callback to the contract here

https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L236

but the state of the contract changes here

https://github.com/nucypher/nucypher/blob/main/nucypher/blockchain/eth/sol/source/contracts/staking_contracts/PoolingStakingContractV2.sol#L247
it allows to use reentry.

##### Recommendation
Put transfers as the last statements of the method.
