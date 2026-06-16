---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/infra
protocol: "[[SphereX]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/spherex-audit"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Call Depth Is Never Explicitly Reset

- id: 33034
- impact: HIGH
- protocol: [[SphereX]] Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/spherex-audit

## Summary


The engine has a bug where it does not reset the call depth in certain situations, which can lead to an error. This bug can occur if an unprotected method makes a call to the pre-hook from an approved sender, if a malicious or incorrect call is made to the pre-hook, or if an assembly return occurs. This can result in the rejection of all subsequent transactions, potentially causing a denial-of-service. To fix this, it is recommended to introduce explicit recording and invalidation of `currentBlockOriginHash` and reset the call depth when it is invalidated. This will prevent the bug from causing issues in multiple transactions. The bug has been resolved in a recent update.

## Details

The Engine does not explicitly reset the call depth, which can lead to an off-by-one error in certain situations:


* If an arbitrary call to the Pre-hook is allowed from an unprotected method in an approved sender (a known client-reported edge case)
* In the event of a malicious or incorrectly implemented call to the Pre-hook from a contract mistakenly or maliciously added to approved senders
* If an assembly return occurs (another known client-reported edge case)


In scenarios where checks are bypassed due to `forceCheck` being set to false, the pattern could drift into an unpredictable state because it will not be reset. This could result in the rejection of all ensuing transactions once a check is eventually enforced during a Post-hook invocation (triggered from an external method).


Given its potential to cause a Denial-of-Service (DoS), it will require deactivating the protection mechanism.


Consider introducing explicit recording and invalidation of `currentBlockOriginHash` for both call flow and transaction flow cases, along with a reset of the call depth when `currentBlockOriginHash` is invalidated. This approach is valid because a call or a transaction cannot extend over multiple transactions, allowing each new transaction to always start from a depth of 1. In this manner, any drift scenario would only persist for the duration of that transaction instead of indefinitely. Furthermore, it is recommended to include all three scenarios in the testing suite to ensure any state corruption is confined to a single transaction.


***Update**: Resolved in [pull request #6](https://github.com/spherex-collab/spherex-protect/pull/6) at commit [c95fce7](https://github.com/spherex-collab/spherex-protect/pull/6/commits/c95fce746e65e74261f783aadb89e19e46a23ffe).*
