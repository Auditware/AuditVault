---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/solidity
  - sector/staking
  - platform/openzeppelin
  - has/github
  - severity/high
  - trigger/first-deposit
protocol: "[[zkSync]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/zksync-l1-diff-audit-february-2023"
genome:
  - "[[underflow]]"
  - "[[first-deposit]]"
  - "[[locked-funds]]"
  - "[[reward-accounting]]"
  - "[[merkle-tree-overflow]]"
---
# Deposit cap not updated on withdrawals

- id: 33110
- impact: HIGH
- protocol: [[zkSync]] | Layer 1 Diff Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-l1-diff-audit-february-2023

## Summary


The user deposit limit is causing an issue where users are unable to deposit after making a withdrawal. This is because the limit can only increase and not decrease. This can happen even after just one deposit and withdrawal if the initial amount is more than half of the limit. The team is aware of this problem but has not yet fixed it. They have stated that this limitation is only in place for a temporary alpha version and will be removed in the full launch.

## Details

User deposits are capped by [increasing the `totalDepositedAmountPerUser`](https://github.com/matter-labs/zksync-2-contracts/blob/3f345ce52bc378c4b5d710c80d817db170775049/ethereum/contracts/zksync/facets/Mailbox.sol#L266) counter. However, the counter is not decreased by withdrawals.


As the counter can only be increased, after sufficient usage, all withdrawing users will be locked out of depositing again. This can possibly happen right after the first deposit and withdrawal, if the initial amount is larger than half the cap.


Consider decreasing the per-user cap during withdrawals to allow users to return to the rollup.


***Update:** Acknowledged, not resolved. The Matter Labs team stated:*



> *The deposit limitations are only enabled in Fair Onboarding Alpha, while only approved partners may deposit funds. This will be removed at Full Launch Alpha, so we treat this issue as an accepted risk.*
