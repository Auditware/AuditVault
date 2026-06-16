---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[proposal-state-check]]"
---
# [H09] Slash process can be bypassed

- id: 11320
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


The bug report is about the Audius Protocol, which is a decentralized music streaming platform. The report states that there are two ways for any address to be slashed: by a governance proposal or by a transaction performed by the guardian. The `votingPeriod` establishes how long a governance proposal is open for voting, while the `decreaseStakeLockupDuration` establishes the minimum length of time a service provider must wait before removing their stake. 

The bug report states that if `decreaseStakeLockupDuration` is less than or equal to the `votingPeriod`, it will be possible for a malicious service provider to remove their stake before it can be slashed by the Governance protocol. It recommends setting the `decreaseStakeLockupDuration` so it is much greater than the `votingPeriod` to ensure that a malicious service provider can always be slashed via governance.

The bug has been fixed in pull request #657. The `_updateDecreaseStakeLockupDuration` function enforces that the `decreaseStakeLockupDuration` value is greater than the voting period plus an execution delay.

## Details

There are two ways for any address to be slashed. The first one is by a governance’s proposal, and the second one is by a transaction performed by the guardian.


For governance to decide to slash a service provider, a proposal must be submitted to the contract, stakers must vote on it and achieve a majority, and then it has to be executed. This process takes several blocks to complete.


[The `votingPeriod`](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/Governance.sol#L23) establishes how long a governance proposal is open for voting.


Similarly, the [`decreaseStakeLockupDuration` variable](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L17) establishes the minimum length of time a service provider must wait before removing their stake.


If `decreaseStakeLockupDuration` is less than or equal to the `votingPeriod`, it will be possible for a malicious service provider to remove their stake before it can be slashed by the Governance protocol.


Since the guardian is expected to be removed once the system is fully operational - meaning that slashing a malicious service provider using the guardian account will not be possible - consider setting the `decreaseStakeLockupDuration` so it is much greater than the `votingPeriod`. This would ensure that a malicious service provider can always be slashed via governance.


***Update**: Fixed in [pull request #657](https://github.com/AudiusProject/audius-protocol/pull/657). The `_updateDecreaseStakeLockupDuration` function enforces that the `decreaseStakeLockupDuration` value is greater than the voting period plus an execution delay.*
