---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Audius]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/audius-contracts-audit/"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[vote-delegation-loop]]"
---
# [H11] A service provider can prevent their delegators from undelegating their stake

- id: 11322
- impact: HIGH
- protocol: [[Audius]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/audius-contracts-audit/

## Summary


This bug report is about a vulnerability in the Audius Protocol in which a service provider can maliciously or unintentionally prevent their delegators from undelegating their stake. This is done by the service provider decreasing their stake by an amount that is equal to or less than the minimum amount of stake required for the service provider. This would result in the total stake for the service provider being equal to the minimum account stake, making it impossible for the delegators to undelegate their stake.

To fix this vulnerability, it was proposed that the minimum stake for a service provider must come from the service provider itself instead of using the delegators’ stake. However, this would not prevent malicious service providers from staking only the minimum account stake and then performing a malicious action that would be slashed, preventing the delegators from undelegating.

The vulnerability was partially fixed in pull request #577, and then fully fixed in pull request #657. The `undelegateStake` function was modified so that it no longer calls the `validateAccountStakeBalance` function. This ensures that delegators can undelegate their stake, even if the service provider’s stake is slashed.

## Details

A service provider can prevent their delegators from undelegating their stake. This may happen maliciously or unintentionally, as follows.


Suppose a service provider has registered one or more endpoints and has staked the minimum amount of required stake. Then suppose one or more delegators have collectively staked an additional `X` tokens for this service provider, where `X <= spDetails[_sp].minAccountStake - minDeployerStake`, so that `totalStakedFor(_sp) = spDetails[_sp].minAccountStake + X`.


Next, consider what happens if the service provider decreases its stake by `X`:


The service provider’s call to the [`requestDecreaseStake` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L364) will succeed, because the call to the [`_validateBalanceInternal` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L773) will not revert (all three `require` statements will be satisfied).


Their subsequent call to the [`decreaseStake` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L364) will succeed for the same reason.


At this point, `totalStakedFor(_sp) = spDetails[_sp].minAccountStake`. This means that any attempt by a delegator to undelegate a positive number of tokens via the [`undelegateStake` function](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L239) will revert [on line 311](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/DelegateManager.sol#L311), because [the first `require` statement](https://github.com/AudiusProject/audius-protocol/blob/6f3b31562b9d4c43cef91af0a011986a2580fba2/eth-contracts/contracts/ServiceProviderFactory.sol#L776) in the `_validateBalanceInternal` function will not be satisfied.


Consider requiring that `spDetails[_sp].deployerStake >= spDetails[_sp].minAccountStake` when validating balances. This would put the burden of maintaining the `minAccountStake` on the service provider, thus removing this vulnerability.


***Update**: Partially fixed in [pull request #577](https://github.com/AudiusProject/audius-protocol/pull/577). Now the minimum stake for a service provider must come from the service provider itself instead of using the delegators’ stake. Nevertheless, if governance decides to slash a service provider and its staked balance ends up between `0 < SPBalance < spDetails[_sp].minAccountStake`, the delegators for that service provider will not be able to undelegate their stake. That way, the malicious service provider could stake only `spDetails[_sp].minAccountStake`, handle a bigger delegated stake value, and perform a malicious action that will be slashed to prevent delegators from undelegating when [the new requirement](https://github.com/AudiusProject/audius-protocol/blob/mainnet-audit-feedback/eth-contracts/contracts/ServiceProviderFactory.sol#L907) reverts.*


***Update**: Fixed in [pull request #657](https://github.com/AudiusProject/audius-protocol/pull/657). The `undelegateStake` function no longer calls the `validateAccountStakeBalance` function.*
