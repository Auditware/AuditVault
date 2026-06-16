---
tags:
  - lang/solidity
  - sector/dex
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[dos-resistance]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
---
# [C-04] Funds get locked in the vault

- id: 53315
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The bug report describes a high severity issue where a user is unable to redeem shares for assets if the user has requested to set a receiver for another person. This is caused by a current implementation that reverts in this case. The report recommends a change in the code to fix this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

In case:

- User X requests to redeem shares for assets and set `receiver` for Y
- Agent Z registered in the Dynamic Account of user X will remove liquidity from Uniswap V3
- Agent Z calls `OmoVault.sol#topOff()` function.

But the current implementation will revert in the above case.
Because `topOff()` checks if agent is authorized in the `record.receiver` Dynamic Account.

```solidity
File: OmoVault.sol

427:         address userAccount = userToAccount[record.receiver];
428:         require(userAccount != address(0), "NO_REGISTERED_ACCOUNT");
429:
430:         // Check if agent is registered for this account
431:         OmoAgent agent = OmoAgent(payable(userAccount));
432:         require(agent.agents(0) == msg.sender, "UNAUTHORIZED_AGENT");

```

There is a high chance that the `userAccount` is a zero address or it is not registered.
As a result, funds get locked in the vault until `record.receiver` creates a Dynamic Account. and add that the agent

## Recommendations

```diff
File: OmoVault.sol

-427:         address userAccount = userToAccount[record.receiver];
+427:         address userAccount = userToAccount[record.owner];
428:         require(userAccount != address(0), "NO_REGISTERED_ACCOUNT");


```
