---
tags:
  - lang/solidity
  - sector/governance
  - sector/multisig
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/ownership-transfer
protocol: "[[Smoothly]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-08-01-Smoothly.md"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[ownership-transfer]]"
  - "[[account-ownership]]"
  - "[[dos-resistance]]"
  - "[[timelock-timestamp-bypass]]"
---
# [H-01] Large centralization attack surface

- id: 26462
- impact: HIGH
- protocol: [[Smoothly]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-08-01-Smoothly.md

## Summary


This bug report describes a vulnerability in the PoolGovernance smart contract that can be exploited to steal funds. It involves the owner of PoolGovernance, who can add a large number of operators, resulting in a block gas limit DoS of proposeEpoch. Operators can group their voting and claim all of SmoothlyPool's balance as a fee, and allow an unregistered account to claim rewards. The owner can also transfer ownership of SmoothlyPool to an account they control and withdraw the whole contract balance as the fee.

To address the vulnerability, it is recommended that the owner of PoolGovernance be a multi-sig wallet behind a Timelock contract. This will allow users to monitor what transactions are about to be executed and take action if necessary. It is also suggested to add a limit on the max number of operators, for example 50. Additionally, extra security mechanisms should be added to protect against centralization.

## Details

**Severity**

**Impact:**
High, as multiple authorized actors can act maliciously to steal funds

**Likelihood:**
Medium, as it requires malicious or compromised actors, but it's not just the protocol `owner`

**Description**

1. The `owner` of `PoolGovernance` can add a big number of operators, resulting in a block gas limit DoS of `proposeEpoch`, because the method loops over all operators
2. Operators can group their voting and claim all of `SmoothlyPool`'s balance as a `fee`
3. Operators can allow an unregistered account to claim rewards from `SmoothlyPool` by adding it to one of the `withdrawals` Merkle tree leafs
4. The `owner` of `PoolGovernance` can transfer ownership of `SmoothlyPool` to an account he controls and directly call `updateEpoch`, withdrawing the whole contract balance as the `fee`

**Recommendations**

Make the `owner` of `PoolGovernance` be a multi-sig wallet behind a Timelock contract so that users can monitor what transactions are about to be executed by this account and take action if necessary. Also add a limit on the max number of operators, for example 50. For the operators you might need to add some extra security mechanism to protect the centralization, as currently it doesn't have an easy fix.
