---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[access-roles]]"
  - "[[access-control/broken-logic]]"
  - "[[dos/permanent]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [C-05] The users are not able to redeem their funds

- id: 53316
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The report describes a bug in the `OmoVault.sol` contract, which prevents users from redeeming their funds. The severity and likelihood of the bug are high. The cause of the bug is that the `topOff()` function only allows agents that are stored in the `agents[]` mapping in the `OmoAgent.sol` contract to call it, but it only checks for the zero ID, which does not exist. The recommendation is to pass the agent ID instead of a zero-value to fix the bug.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

Dynamic Accounts could have multiple agents, which are stored in `OmoAgent.sol` as library `OmoAgentStorage` under the `agents[]` mapping.

```solidity
File: OmoAgent.sol

18:     struct Data {
19:         address manager;
20:         mapping(uint256 => address) agents;

```

Each agent has a unique id.
However, in `OmoVault.sol` contract the `topOff()` function only agents that in `agents[]` can call it

```solidity
File: OmoVault.sol

430:         // Check if agent is registered for this account
431:         OmoAgent agent = OmoAgent(payable(userAccount));
432:         require(agent.agents(0) == msg.sender, "UNAUTHORIZED_AGENT");
```

But it checks only the zero ID (probably it does not exist).
With the current implementation, no agent can call `topOff()` and redeem the user's funds.

As a result, the users are not able to redeem their funds.

## Recommendations

You should pass the agent ID, not a zero-value.
