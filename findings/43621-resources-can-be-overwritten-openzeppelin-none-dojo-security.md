---
tags:
  - blockchain/starknet
  - lang/cairo
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - impact/privilege-escalation/admin-takeover
  - sector/gaming
protocol: "[[Dojo]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/dojo-security-review"
genome:
  - "[[missing-owner-check]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
---
# Resources Can Be Overwritten

- id: 43621
- impact: HIGH
- protocol: [[Dojo]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/dojo-security-review

## Summary


The function `deploy_contract` allows an attacker to overwrite an existing resource record from any namespace by registering a malicious contract. While registering or upgrading a model, the selector is checked to make sure it is not already registered under another resource. However, this check is missing for the `deploy_contract` function, which could allow the attacker to become an owner of the `WORLD` resource and update any model. The bug has been fixed in a recent pull request.

## Details

The `deploy_contract` function [registers the system](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L644-L646) under a selector chosen by the contract. This means that an attacker can deploy a malicious contract in order to overwrite an existing resource record from any namespace.


When [registering](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L520) or [upgrading](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L554) a model, the selector is validated to not be registered under another resource. However, this check is missing for the `deploy_contract` function. There are several potential consequences but the most notable is that the attacker could become an owner of the [`WORLD` resource](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L132), allowing them to [update any model](https://github.com/dojoengine/dojo/blob/e1a349b2c4b1a836156e769a46f8fe3c87ae553f/crates/dojo-core/src/world/world_contract.cairo#L981).


Consider ensuring that the selector is unused before registering the new contract.


***Update:** Resolved in [pull request \#2](https://github.com/dojoengine/dojo-core/pull/2).*
