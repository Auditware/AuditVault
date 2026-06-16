---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/mev/frontrun
  - impact/privilege-escalation/ownership-transfer
  - sector/infra
protocol: "[[MUD]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/mud-audit"
genome:
  - "[[missing-modifier]]"
  - "[[frontrun]]"
  - "[[ownership-transfer]]"
  - "[[frontrun-exposure]]"
---
# Namespace Access Can Be Backdoored

- id: 32598
- impact: HIGH
- protocol: [[MUD]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/mud-audit

## Summary


The WorldRegistrationSystem contract is responsible for registering namespaces, which allow users to deploy systems and register tables. However, there is a bug that allows attackers to gain control over namespaces and perform critical operations. This is done by front-running the victim's attempt to register a system or table, and then granting themselves access and transferring ownership of the namespace. To fix this, it is suggested to remove the automatic namespace registration and make it mandatory for users to register the namespace beforehand. This would prevent front-running attacks. The bug has been resolved in a recent pull request.

## Details

The [`WorldRegistrationSystem` contract](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol) takes care of registering namespaces, among other things. A namespace sets the context for a user to deploy systems and register tables. Ownership of or access to this namespace allows for the performance of critical operations such as setting `Store` values or transferring balance. Access to a namespace also gives access to all resource-specific systems or tables.


However, there is a problem when it comes to the arbitrary options of registering namespaces. For instance, consider the following attack. It assumes that the victim initially registers something for a new namespace (so the namespace does not yet exist):


1. The user attempts to register a [system](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L133) or a [table](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/StoreRegistrationSystem.sol#L67), which would implicitly register the namespace.
2. The attacker front-runs the victim to:
	1. [Register the namespace](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L44) directly themselves
	2. [Grant access](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/AccessManagementSystem.sol#L23) to an account they control
	3. [Transfer ownership](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/AccessManagementSystem.sol#L51) of the namespace to the victim
3. The victim proceeds with (1). The [call succeeds](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L136) because while the namespace already exists, the victim is the legitimate owner.
4. The attacker has full control over anything that [requires access](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/AccessControl.sol#L35) such as [balance transfer](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/BalanceTransferSystem.sol#L63) or [`Store` writes](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/World.sol#L144).


Consider making the design more self-contained by removing the automatic namespace registration from the aforementioned functions. Instead, make it mandatory for a user to register the namespace beforehand such that a front-run would make the user's call fail due to the [existence check](https://github.com/latticexyz/mud/blob/12a9eb1afb18a7f7cb43d774cabb2d5af7c74e6b/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L51-L53).


***Update:** Resolved in [pull request #2007](https://github.com/latticexyz/mud/pull/2007).*
