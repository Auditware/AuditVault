---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[vote-delegation-loop]]"
---
# [H10] A service provider can deceive its delegators

- id: 11321
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


This bug report is about the `deployerCut` variable in the Audius Protocol. The `deployerCut` value establishes the percentage of rewards that the service provider collects from the delegators’ rewards after each round. Service providers can modify the `deployerCut` variable by calling the `updateServiceProviderCut` function at any time. This means that if a service provider updates the `deployerCut` variable just before executing the `claimRewards` function from the `DelegateManager` contract, delegators may receive fewer or no rewards from that round. 

To prevent this, the bug report suggests requiring that a change to the `deployerCut` variable undergoes a timelock for a period of time greater than the `fundingRoundBlockDiff` value. This would give delegators enough time to move their stake to another service provider. The bug has since been fixed in pull request #657, where adjusting the `deployerCut` value now requires waiting for a timelock.

## Details

Service providers can earn AUD tokens by allowing delegators to delegate their stake into its account. The [`deployerCut` value](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L28) establishes the percentage of the rewards that the service provider collects from the delegators’ rewards after each round.


A service provider can modify the `deployerCut` variable by calling the [`updateServiceProviderCut` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L546-L559) at any time. It is also possible for them to even set it as 100, which would mean that delegators will not get rewards after the funding round has been completed.


If a service provider makes use of this function just before executing the [`claimRewards` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L327) from the `DelegateManager` contract, delegators will receive fewer or no rewards from that round, contrary to what they initially expected.


Consider requiring that a change to the `deployerCut` variable undergoes a timelock for a period of time greater than the [`fundingRoundBlockDiff` value](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ClaimsManager.sol#L28). This would allow delegators to have enough time to move their stake to another service provider.


***Update**: Fixed in [pull request #657](https://github.com/AudiusProject/audius-protocol/pull/657). Adjusting the `deployerCut` value now requires waiting for a timelock.*
