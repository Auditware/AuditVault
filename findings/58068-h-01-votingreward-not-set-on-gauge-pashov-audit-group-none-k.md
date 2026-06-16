---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/governance
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] `votingReward` not set on `Gauge`

- id: 58068
- impact: HIGH
- protocol: KittenSwap_2025-06-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-06-12.md

## Summary


The report states that there is a bug in the `Gauge` contract, which can have a medium impact and a high likelihood of occurring. The bug is related to the `votingReward` not being set during initialization and not having a setter function. This results in the `notifyRewardAmount()` function reverting when fees are claimed from the pair. This bug will prevent the distribution of fees and may cause unfair distribution of rewards among depositors once a new version of the `Gauge` is deployed. The recommendation is to set the `votingReward` during initialization to fix this bug.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `Gauge` contract does not set the `votingReward` during its initialization and does not have a setter function for it.

As a result, when `notifyRewardAmount()` is called and fees are claimed from the pair, the transaction will revert.

```solidity
        (claimed0, claimed1) = IPair(address(lpToken)).claimFees();
        (address _token0, address _token1) = IPair(address(lpToken)).tokens();
        if (claimed0 > 0) {
            IERC20(_token0).approve(address(votingReward), claimed0);
    @>      votingReward.notifyRewardAmount(_token0, claimed0);
```

Until a new version of the `Gauge` is deployed, the fees will not be distributed and the `notifyRewardAmount()` function will always revert, potentially causing an unfair distribution of rewards once the new `Gauge` implementation is deployed, as the distribution among depositors might have changed.

## Recommendations

Set `votingReward` on `Gauge` initialization.
