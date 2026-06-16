---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# [H12] Unresponsive service provider locks delegator stake

- id: 11323
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


This bug report is about the Audius Protocol, which is a decentralized music streaming platform. The bug is that if a service provider becomes unresponsive (e.g., by losing their keys, dying, etc.), the service provider will not call the `claimRewards` function. After one week, the `_claimPending` function will always return `true`, preventing delegators from undelegating their stake. 

The solution proposed is to refactor the `claimRewards` function to allow anyone to call it, passing in a service provider address as a parameter. This way, the rewards-claiming process can be moved forward by anyone, not just the service provider, protecting delegators from an unresponsive service provider. This bug has since been fixed in pull request #556.

## Details

A service provider may become unresponsive (e.g., by losing their keys, dying, etc.). If this happens, the service provider will not call the [`claimRewards` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L327). After one week the [`_claimPending` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L763) will always return `true`. So delegators will not be able to undelegate their stake because the [`undelegateStake` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L239) will revert [on line 252](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L252).


Consider refactoring the `claimRewards` function to allow anyone can call it - passing in a service provider address as a parameter. This way, the rewards-claiming process can be moved forward by anyone, not just the service provider. This would protect delegators from an unresponsive service provider.


***Update:** Fixed in [pull request #556](https://github.com/AudiusProject/audius-protocol/pull/556).*
