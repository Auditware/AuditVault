---
tags:
  - lang/solidity
  - sector/staking
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Covalent]]"
auditors:
  - "[[Natalie Chin]]"
report: "https://code4rena.com/reports/2021-10-covalent"
genome:
  - "[[upgradeable-contract]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# [H-01] Usage of an incorrect version of `Ownbale` library can potentially malfunction all `onlyOwner` functions

- id: 42307
- impact: HIGH
- protocol: [[Covalent]]
- reporter: Natalie Chin (Code4rena)
- source: https://code4rena.com/reports/2021-10-covalent

## Summary


The `DelegatedStaking.sol` contract is designed to be upgradeable, but it is currently using a non-upgradeable version of the `Ownable` library. This means that when the contract is deployed as a proxy, there will be no owner and all `onlyOwner` functions will be inaccessible. To fix this, the contract should use the upgradeable version of the `Ownable` library and change the `initialize()` function to include the `__Ownable_init()` function. The issue has been confirmed by the Covalent team and the sponsor has already fixed it. 

## Details

_Submitted by WatchPug_

[`DelegatedStaking.sol` L62-L63](https://github.com/code-423n4/2021-10-covalent/blob/ded3aeb2476da553e8bb1fe43358b73334434737/contracts/DelegatedStaking.sol#L62-L63)

```solidity
// this is used to have the contract upgradeable
function initialize(uint128 minStakedRequired) public initializer {
```

Based on the context and comments in the code, the `DelegatedStaking.sol` contract is designed to be deployed as an upgradeable proxy contract.

However, the current implementation is using an non-upgradeable version of the `Ownbale` library: `@openzeppelin/contracts/access/Ownable.sol` instead of the upgradeable version: `@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol`.

A regular, non-upgradeable `Ownbale` library will make the deployer the default owner in the constructor. Due to a requirement of the proxy-based upgradeability system, no constructors can be used in upgradeable contracts. Therefore, there will be no owner when the contract is deployed as a proxy contract.

As a result, all the `onlyOwner` functions will be inaccessible.

##### Recommendation
Use `@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol` and `@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol` instead.

And change the `initialize()` function to:

```solidity
function initialize(uint128 minStakedRequired) public initializer {
    __Ownable_init();
    ...
}
```

**[kitti-katy (Covalent) confirmed](https://github.com/code-423n4/2021-10-covalent-findings/issues/45)**

**[GalloDaSballo (judge) commented](https://github.com/code-423n4/2021-10-covalent-findings/issues/45#issuecomment-955111019):**
 > Agree with the finding, when using Upgradeable Proxies it's important to use the adequate libraries that will be compatible with initializable contracts

**[GalloDaSballo (judge) commented](https://github.com/code-423n4/2021-10-covalent-findings/issues/45#issuecomment-955111738):**
 > The sponsor has mitigated the issue

**[kitti-katy (Covalent) patched](https://github.com/code-423n4/2021-10-covalent/pull/23)**
