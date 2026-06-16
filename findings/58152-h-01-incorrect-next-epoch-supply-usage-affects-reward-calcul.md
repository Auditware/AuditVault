---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[epoch-boundary]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-01] Incorrect next epoch supply usage affects reward calculation

- id: 58152
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


A bug has been identified in the forked repository where the reward is being calculated incorrectly on each epoch boundary. This is caused by a line of code in the `ExternalBribe` contract that is retrieving the supply from the next epoch instead of the previous one. To fix this, the recommendation is to use `_nextEpochStart + DURATION-1` instead. This issue has a high impact and medium likelihood of occurring.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Context: This is an issue of the forked repo that is not being fixed. (https://github.com/spearbit/portfolio/blob/master/pdfs/Velodrome-Spearbit-Security-Review.pdf 5.1.1 Reward calculates earned incorrectly on each epoch boundary).

In the `ExternalBribe` contract, the following line is used to retrieve the previous epoch's supply:

```solidity
_prev._prevSupply = supplyCheckpoints[getPriorSupplyIndex(_nextEpochStart + DURATION)].supply;
```

Here, `_nextEpochStart + DURATION` is used to determine the index for retrieving the supply. This means that the contract is actually accessing the supply from the next epoch rather than the previous one.

## Recommendations

Use `_nextEpochStart + DURATION-1`.
