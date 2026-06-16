---
tags:
  - lang/solidity
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - impact/privilege-escalation/role-bypass
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[MUD]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/mud-audit"
genome:
  - "[[upgradeable-contract]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# Core System Can Be Disabled

- id: 32599
- impact: HIGH
- protocol: [[MUD]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/mud-audit

## Summary


The `CoreSystem` contract in the `World` contract does not have proper access control protections, allowing an attacker to register a system and bypass the `World` contract's access control checks. This could potentially lead to an attacker executing the `selfdestruct` opcode and disabling the `CoreSystem` for the `World` contract. The bug has been resolved in recent updates to the code.

## Details

The [`CoreSystem`](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/CoreSystem.sol#L18) contract is [registered in the `ROOT_NAMESPACE`](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/constants.sol#L20) in the `World` contract. This means that it is called [using `delegatecall`](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/SystemCall.sol#L64).


As a pure implementation contract, there are no access control protections when its functions are invoked directly (bypassing the `World`). In particular, an attacker can [register a system](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L110) for the `CORE_SYSTEM_ID` and pass in any `_msgSender` value in the calldata to bypass the [access control check](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L136). This is not an attack in itself because the contract storage of the `CoreSystem` contract is not relevant to the `World` contract. However, when the attacker invokes the `registerTable` function directly on the `CoreSystem`, it will make a [`delegatecall` to the attacker-controlled core system](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/StoreRegistrationSystem.sol#L66), which could execute the `selfdestruct` opcode. This will remove the `CoreSystem`, effectively disabling it for the `World` contract.


Consider removing the [namespace registration branch](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/StoreRegistrationSystem.sol#L62-L70) so that the `CoreSystem` will not execute a `delegatecall`. Alternatively (or in addition), consider protecting all `CoreSystem` functions with an [`onlyProxy` modifier](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/proxy/utils/UUPSUpgradeable.sol#L50).


***Update:** Resolved in [pull request #2111](https://github.com/latticexyz/mud/pull/2111), [pull request #2007](https://github.com/latticexyz/mud/pull/2007), and [pull request #2180](https://github.com/latticexyz/mud/pull/2180).*
