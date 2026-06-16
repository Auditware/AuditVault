---
tags:
  - lang/solidity
  - sector/governance
  - platform/openzeppelin
  - has/github
  - severity/high
  - trigger/governance-vote
protocol: "[[Celo]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/celo-audit-release-4/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[proposal-state-check]]"
---
# [H01] Incorrect use of require in revokeVotes

- id: 10862
- impact: HIGH
- protocol: [[Celo]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/celo-audit-release-4/

## Summary


The `revokeVotes` function of the `Governance` contract is intended to revoke votes on proposals in the Referendum stage. However, it currently requires all dequeued proposals to be in the Referendum stage, which is not necessary during normal operations. If any element of dequeued is not within the Referendum stage, the `revokeVotes` function will revert. This makes the function unusable.

To fix this issue, the following operations should be performed if the proposal is within the Referendum stage. Otherwise, the iteration of the loop should be treated as a no-op. This issue has now been fixed in commits a10bdf3 and 750341b.

## Details

The [`revokeVotes` function](https://github.com/celo-org/celo-monorepo/blob/f64b4c5b5228ecbf41e3e7cfdbb8c0e9a983eea2/packages/protocol/contracts/governance/Governance.sol#L672) of the `Governance` contract is intended to revoke votes on proposals in the Referendum stage. However, it actually [`requires` all `dequeued` proposals to be in that stage](https://github.com/celo-org/celo-monorepo/blob/f64b4c5b5228ecbf41e3e7cfdbb8c0e9a983eea2/packages/protocol/contracts/governance/Governance.sol#L683), which is not necessary during normal operations. Whenever any element of `dequeued` is not within the `Referendum` stage, the `revokeVotes` function will revert. This effectively makes the `revokeVotes` function unusable.


Instead of reverting, consider performing [the following operations](https://github.com/celo-org/celo-monorepo/blob/f64b4c5b5228ecbf41e3e7cfdbb8c0e9a983eea2/packages/protocol/contracts/governance/Governance.sol#L684-L688) if the proposal is within the `Referendum` stage. Otherwise, that iteration of the loop should be treated as a no-op.


**Update:** *Fixed in commits [a10bdf3](https://github.com/celo-org/celo-monorepo/commit/a10bdf3e42ecb0667cbe98d287bac02c1da85e93) and [750341b](https://github.com/celo-org/celo-monorepo/commit/750341b6c62a0d8f2641fcbe841d03ed3c7d7ff2).*
