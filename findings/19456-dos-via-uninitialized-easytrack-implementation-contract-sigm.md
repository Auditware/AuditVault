---
tags:
  - lang/solidity
  - sector/governance
  - sector/liquid-staking
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/mev/frontrun
  - precondition/uninitialized
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Lido]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/lido/lido-easy-track/review.pdf"
genome:
  - "[[upgradeable-contract]]"
  - "[[frontrun]]"
  - "[[data/uninitialized]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[initializer-auth]]"
  - "[[upgrade-safety]]"
---
# DOS via Uninitialized EasyTrack Implementation Contract

- id: 19456
- impact: HIGH
- protocol: [[Lido]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/lido/lido-easy-track/review.pdf

## Summary


The EasyTrack implementation contract was left uninitialized during deployment, allowing an attacker to exploit a vulnerability in the OpenZeppelin upgrade mechanism to destroy the implementation and render the Easy Track system unusable. It was found that when changes to the implementation’s storage have no effect on the proxy contract’s state, the OpenZeppelin UUPSUpgradeable contract contains a vulnerability that enables the DEFAULT_ADMIN_ROLE to destroy the contract via selfdestruct(). This exploit can be identified by a reasonably skilled attacker and, if not mitigated, can cause disruption and incur costs in needing to re-deploy the system.

To mitigate this issue, the Lido development team removed the upgradability functionality from EasyTrack and deployed and used it directly (rather than as the implementation for a ContractProxy). This removed any vulnerabilities associated with the feature. The EVMScriptExecutor was also introduced to allow the Lido DAO to change the address of the EasyTrack contract approved to execute scripts.

In addition, it is recommended to ensure __EasyTrackStorage_init() has been called on any existing deployments of the EasyTrack contract, upgrade OpenZeppelin to v4.3.2 or later, and ensure the EasyTrack implementation contract is initialized during deployment. A suitable constructor could be added to EasyTrackStorage to protect against any risk of an attacker front-running the initialize should the deployment script deploy and execute in separate transactions.

## Details

## Description

The EasyTrack implementation contract is left uninitialized during deployment, allowing an attacker to execute **EasyTrackStorage_init()** to take control of the underlying implementation contract and exploit a vulnerability in the OpenZeppelin upgrade mechanism to destroy the implementation and render the Easy Track system unusable.

It is considered best practice to initialize the implementation, but it can often be left uninitialized without issue. While an attacker could then initialize the implementation, changes to the implementation’s storage have no effect on the proxy contract’s state.

In this case, however, the OpenZeppelin UUPSUpgradeable contract contains a vulnerability that enables the **DEFAULT_ADMIN_ROLE** to destroy the contract via **selfdestruct()**. When exploited on the underlying implementation, an attacker who initialized the contract to assume the **DEFAULT_ADMIN_ROLE** can then destroy it to render the proxy contract unusable.

Given the publicly announced advisory, this exploit can be readily identified by a reasonably skilled attacker. As such, this issue has been deemed exploitable with a fairly high likelihood (provided it is not mitigated).

While an exploit would render the current EasyTrack system unusable, this would not halt the functioning of the Lido protocol as a whole. To recover, the Lido ecosystem could continue to operate as it does currently (via Aragon DAO voting) and deploy a fresh Easy Track system with the implementation properly initialized and exploit resolved. Although not critical, this attack would likely cause reasonable disruption and incur costs in needing to re-deploy the system.

## Recommendations

- Ensure **EasyTrackStorage_init()** has been called on any existing deployments of the EasyTrack contract.
- Upgrade OpenZeppelin to v4.3.2 or later. While this is sufficient to protect against the current vulnerability, it is preferable to disable functionality on the underlying implementation to prevent this class of issues.
- Ensure the EasyTrack implementation contract is initialized during deployment. Preferably, add a constructor that executes **EasyTrackStorage_init()**, so the implementation is deployed and initialized in the same transaction. This protects against any risk of an attacker front-running the initialize should the deployment script deploy and execute in separate transactions.

A suitable constructor could be added to EasyTrackStorage as follows:

```solidity
constructor () {
    __EasyTrackStorage_init(address(0), address(0));
}
```

Though this could reasonably be added to EasyTrack, keeping it in the same contract as top-level initializer leaves less room for error.

## Resolution

In PR #7, the Lido development team entirely removed the upgradability functionality from EasyTrack. That is, the EasyTrack contract is no longer derived from UUPSUpgradeable and will be deployed and used directly (rather than as the implementation for a ContractProxy).

This removes any vulnerabilities associated with the feature, resolving this issue.

Future upgrades will involve deployment of a new version of the EasyTrack contract, with the Lido DAO voting to replace the old one. Functionality has been introduced to the EVMScriptExecutor to allow the Lido DAO to change the address of the EasyTrack contract approved to execute scripts.

## Resolution Details

The testing team noted some interesting details arising from the implemented resolution that have no bearing with regards to the correctness or validity of the resolution:

- The new upgrade process involves some complications and increased gas costs. The replacement contract will need to have all relevant storage changes made prior to being proposed to the DAO as a replacement (such as the AccessControl roles, factory permissions).
- There is no potential for bugs involved with inconsistent storage layouts across upgrades.
- Although upgrades are more gas expensive, normal use of the EasyTrack contract should involve less gas (as EasyTrack function calls no longer involve the layer of indirection provided by passing through a ContractProxy).
