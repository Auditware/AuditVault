---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/dos/unbounded-loop
  - novelty/known-pattern
protocol: "[[Compound]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/compound-alpha-governance-system-audit/"
genome:
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[proposal-state-check]]"
---
# [H01] Approved proposal may be impossible to queue, cancel or execute

- id: 11542
- impact: HIGH
- protocol: [[Compound]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/compound-alpha-governance-system-audit/

## Summary


This bug report is about the `propose` function of the `GovernorAlpha` contract, which allows proposers to submit proposals with an unbounded amount of actions. This can cause unexpected out-of-gas errors in approved proposals, as the `queue`, `cancel` and `execute` functions iterate over the unbounded `targets` array of a proposal. To avoid these errors, it is recommended to set a hard cap on the number of actions that a proposal can include.

## Details

The [`propose` function](https://github.com/compound-finance/compound-protocol-alpha/blob/6858417c91921208c0b3ff342b11065c09665b1b/contracts/Governance/GovernorAlpha.sol#L150) of the `GovernorAlpha` contract allows proposers to submit proposals with an unbounded amount of actions. Specifically, the function does not impose a hard cap on the number of elements in the arrays passed as parameters (i.e., `targets`, `values`, `signatures` and `calldatas`).


As a consequence, an approved proposal with a large number of actions can fail to be queued, canceled, or executed. This is due to the fact that the [`queue`](https://github.com/compound-finance/compound-protocol-alpha/blob/6858417c91921208c0b3ff342b11065c09665b1b/contracts/Governance/GovernorAlpha.sol#L186), [`cancel`](https://github.com/compound-finance/compound-protocol-alpha/blob/6858417c91921208c0b3ff342b11065c09665b1b/contracts/Governance/GovernorAlpha.sol#L206) and [`execute`](https://github.com/compound-finance/compound-protocol-alpha/blob/6858417c91921208c0b3ff342b11065c09665b1b/contracts/Governance/GovernorAlpha.sol#L196) functions iterate over the unbounded `targets` array of a proposal, which depending on the amount and type of actions, can lead to unexpected out-of-gas errors.


So as to avoid unexpected errors in approved proposals, consider setting a hard cap on the number of actions that they can include.
