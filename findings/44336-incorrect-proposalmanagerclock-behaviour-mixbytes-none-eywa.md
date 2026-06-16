---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/governance
protocol: "[[EYWA]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#2-incorrect-proposalmanagerclock-behaviour"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[proposal-state-check]]"
  - "[[timestamp-dependence]]"
---
# Incorrect `ProposalManager.CLOCK()` behaviour

- id: 44336
- impact: HIGH
- protocol: [[EYWA]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/EYWA/DAO/README.md#2-incorrect-proposalmanagerclock-behaviour

## Summary


The `ProposalManager` contract is having issues when interacting with the `EscrowManager` contract. This is because the `EscrowManager` contract does not have the necessary `CLOCK()` and `CLOCK_MODE()` methods implemented. This causes problems when trying to create a proposal using the `ProposalManager.propose()` function, as it calls the `clock()` method which fails and returns the `block.number` instead of the expected `block.timestamp`. This leads to incorrect values being returned in the `proposalSnapshot` and other related methods. To fix this, it is recommended to modify the catch block in the `CLOCK()` method to return `block.timestamp` instead of `block.number`. 

## Details

##### Description
The `ProposalManager` contract interacts with `EscrowManager` as a **token**, but the `EscrowManager` contract does not implement the `CLOCK()` and `CLOCK_MODE()` methods.

When attempting to create a proposal using `ProposalManager.propose()`, the `clock()` method is invoked. The call to this method fails within the **try** block, causing the execution to enter the **catch** block. In the **catch** block, **block.number** is returned.

https://gitlab.ubertech.dev/blockchainlaboratory/eywa-dao/-/blob/29465033f28c8d3f09cbc6722e08e44f443bd3b2/contracts/ProposalManager.sol#L161

The snapshot is calculated as **block.number + votingDelay**. With the current **votingDelay** set to 2 days, this results in a very small snapshot value, which is not aligned with expected behavior. The **proposalSnapshot** then used in `Governor.castVote()` and `ProposalManager.state()` methods returns incorrect values due to this miscalculation.
##### Recommendation
We recommend modifying the catch block in the `CLOCK()` method to return **block.timestamp** instead of **block.number**.

***
