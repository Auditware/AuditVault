---
tags:
  - lang/solidity
  - lang/vyper
  - sector/governance
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Vetenet]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# [C-02] Codebase is using a vulnerable Vyper compiler version

- id: 34031
- impact: HIGH
- protocol: [[Vetenet]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2023-12-01-veTenet.md

## Summary


The Vyper compiler has a bug that allows for reentrancy even when the code is marked as not reentrant. This vulnerability was exploited in the Ethereum ecosystem, causing a major issue. The bug was introduced in version 0.2.15 and affects all contracts compiled with versions 0.2.15, 0.2.16, and 0.3.0. To fix this issue, it is recommended to upgrade all contracts' compiler version to at least 0.3.1, where the bug has been fixed. 

## Details

**Severity**

**Impact:**
High, as reentrancy in methods that forbid it is possible

**Likelihood:**
High, as the bytecode will always be vulnerable when compiled with that compiler version

**Description**

A month ago we saw a major exploit in the Ethereum ecosystem due to a bug in the Vyper compiler, as explained [here](https://www.halborn.com/blog/post/explained-the-vyper-bug-hack-july-2023). The Vyper team had the `@nonreentrant` annotation (or a function decorator) built natively into the language itself, but in version 0.2.15 a bug was introduced, essentially resulting in no reentrancy protection even if the annotation is used on a method. As stated [here](https://hackmd.io/@vyperlang/HJUgNMhs2#:~:text=All%20Vyper%20contracts%20that%20have,the%20malfunctioning%20re%2Dentrancy%20guard.), "All Vyper contracts that have been compiled with versions v0.2.15, v0.2.16, and v0.3.0 are vulnerable to the malfunctioning re-entrancy guard.".

The Vyper files in the repository (apart from `BoostDelegationV2`) all have compiler version 0.2.16, which is also configured in `hardhat.config.ts`. There are multiple methods marked with `@nonreentrant` in `GaugeController`, `LiquidityGaugeV4` and `VotingEscrow`. All of those method are not reentrancy protected.

**Recommendations**

Upgrade all Vyper contracts' compiler version to at least v0.3.1, where the bug was fixed.
