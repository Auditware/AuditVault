---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - novelty/variant
  - sector/gaming
protocol: "[[Dojo]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/dojo-security-review"
genome:
  - "[[missing-owner-check]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
---
# Inconsistent namespace separation

- id: 43622
- impact: HIGH
- protocol: [[Dojo]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/dojo-security-review

## Summary


The bug report discusses an issue with namespace consistency in the Dojo engine. When creating a new namespace, its identifier is the hash of its name. However, when registering or updating a model, the namespace and its hash are provided by the model contract and are not checked for consistency. This can lead to incorrect transcripts of events and mislead users of the indexer. Additionally, attackers can preempt model and contract deployments in order to claim selectors, preventing valid deployments. To address this, the report suggests enforcing consistency between all provided namespaces and their hashes, and ensuring that selectors are derived from the relevant name and namespace. The report also notes that models and contracts can change their namespace and tags, which may need to be considered in future updates to the namespace consistency requirements. The bug has been resolved in a recent pull request.

## Details

When a new namespace is created, its identifier [is the hash of its name](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L592). However, when registering or updating a model, the namespace and its hash are [provided by the model contract](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/model/model.cairo#L108-L109) and are not validated to be consistent with each other. Similarly, when deploying a new contract, the namespace and its hash are [provided by the contract](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L634-L636) and are not checked for consistency. Since the hash is used for access control while the name is used in the corresponding events, any discrepancy between the two would produce an incorrect transcript of the [`ModelRegistered`](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L527), [`ModelUpgraded`](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L578), or [`ContractDeployed`](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L650) events.


Moreover, when creating or upgrading a model, the selector is [provided by the new model](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/model/model.cairo#L107) and is not inherently dependent on the namespace. This means that if the caller has the appropriate permissions, the `ModelUpgraded` event can change the `name` and `namespace` of the model, which would create a nonsensical transcript. Although these examples do not corrupt the database directly, one of the design principles of the system is that the [Torii indexer](https://book.dojoengine.org/toolchain/torii) should be able to reconstruct and provide the state from events. Thus, any inconsistency would mislead users of the indexer.


Another consequence of this design is that well\-behaved models and contracts derive their selectors from their other properties (as demonstrated by the [metadata model](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/model/metadata.cairo#L117)). This means that they are determined at compile\-time and are resistant to change. However, attackers can preempt model and contract deployments in order to claim those selectors, thereby preventing (or at least complicating) valid deployments. This could occur in real time with front\-running attacks, or by simply reviewing or predicting selectors from open source code. A robust namespace mechanism should prevent this possibility.


To this end, consider enforcing consistency between all provided namespaces and their hashes, ensuring that the selectors are derived from the relevant name and namespace. The hashes could be cached when first derived to avoid recomputing them multiple times. It is worth noting that a model [provides its namespace hash](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L963) every time it is updated, which means it can arbitrarily change its namespace for the purpose of access control. A similar observation applies to contract and model tags which do not have to match their names or namespaces and can change over time. These would not affect event transcripts, but they might be worth considering in any potential updates to the namespace consistency requirements.


***Update:** Resolved in [pull request \#2](https://github.com/dojoengine/dojo-core/pull/2).*
