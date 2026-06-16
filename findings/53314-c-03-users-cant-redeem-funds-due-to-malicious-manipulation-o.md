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
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[dos/permanent]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/privileged-caller]]"
  - "[[blast-radius/protocol-wide]]"
---
# [C-03] Users can't redeem funds due to malicious manipulation of `_totalAssets`

- id: 53314
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The bug report discusses a problem with the function `OmoVault.sol#topOff()`, which is only used by agents. This function transfers the entire asset balance from the agent to a designated receiver address. However, malicious users can manipulate the value of `agentBalance` by transferring assets directly to the agent address. This can cause the critical value `_totalAssets` to be decreased by the wrong value, resulting in an error when other users try to redeem their assets. The report recommends making changes to the code to prevent this issue from occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The function `OmoVault.sol#topOff()` is only used by agents.
It transfers the entire asset balance from the agent to the `record.receiver` address

```solidity
File: OmoVault.sol

449:         asset.safeTransferFrom(msg.sender, address(this), agentBalance);
450:         asset.safeTransfer(record.receiver, agentBalance);

```

Regardless of the fact that we need to trust the agent will set his balance to the exact value.
Malicious users can manipulate the value of `agentBalance` by transferring assets directly to the agent address (which will receive it back)
But the critical value will be decreased by the wrong value `_totalAssets`.

Take this scenario:
in case we have two users,
Bob and Alice,

- Both had a deposit 20$
- Bob redeems his 20$,
- Before the agent calls `topOff()` function, Bob transfers to agent 20$
- Agent calls `topOff()` function
- Bob will receive at least 40$ the `_totalAssets` will be 0
  Now, Alice will not be able to redeem her 20$ as `_totalAssets -= agentBalance;` will revert

## Recommendations

```diff
File: OmoVault.sol

-449:         asset.safeTransferFrom(msg.sender, address(this), agentBalance);
+449:         asset.safeTransferFrom(msg.sender, address(this), record.assets);
-450:         asset.safeTransfer(record.receiver, agentBalance);
+450:         asset.safeTransfer(record.receiver, record.assets);

```
