---
tags:
  - severity/high
  - has/github
  - sector/staking
  - lang/solidity
protocol: "[[Roots]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/wrong-condition]]"
  - "[[loss-of-funds/reward-theft]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# [H-05] Incorrect `activateBoost` interface is used

- id: 55115
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md

## Summary


The report discusses a bug found in the Staker contract. The severity of the bug is medium, and the likelihood of it occurring is high. The bug is related to the activation of a queued boost BGT, which is done through an incorrect interface. This incorrect interface only requires one parameter, while the correct one needs two parameters. This bug affects the boosting process and can impact several functions in the TroveManager. The recommendation is to fix the interface and use the correct `activateBoost()` function.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In Staker contract, we will activate our queued boost BGT. The interface we use is as below:

```solidity
    function activateBoost(address validator) external;
```

```solidity
    function _tryToBoost() internal {
        if (queued > 0 && blockDelta > 8191) {
            rewardCache.activateBoost(validator);
        }
    }
```

When we check the BGT's implementation, we will find out that the correct interface should be like as below:

```solidity
    function activateBoost(address user, bytes calldata pubkey) external returns (bool) {
        ...
    }
```

We use the incorrect interface, one `address user` parameter is needed. And this will cause that we cannot boost as expected. And this `_tryToBoost()` will be triggered by `_updateRewardIntegral`. And most functions in TroveManger will be impacted.

## Recommendations

Follow the BGT's implementation and trigger the correct `activateBoost()` interface.
