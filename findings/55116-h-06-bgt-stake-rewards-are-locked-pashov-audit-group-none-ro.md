---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
  - sector/staking
protocol: "[[Roots]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[reward-accounting]]"
  - "[[dos/frozen-funds]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-06] BGT stake rewards are locked

- id: 55116
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md

## Summary


This bug report is about a medium severity issue in the Staker contract. When staking our collateral token to get BGT reward tokens, the BGT contract helps us stake the BGT token into the BGTStaker contract. However, there is a missing interface in the Staker contract to claim the HONEY rewards from staking BGT tokens in the BGTStaker contract. The report recommends adding this interface to the Staker contract to fix the issue.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In Staker contract, we will stake our collateral token to get some BGT reward tokens. BGT reward tokens can be boosted. When we boost our BGT token in the staker contract, BGT contract will help us stake our BGT token into BGTStaker contract(https://berascan.com/address/0x44F07Ce5AfeCbCC406e6beFD40cc2998eEb8c7C6).

```solidity
    function _tryToBoost() internal {
            if (queued > 0 && blockDelta > 8191) {
            rewardCache.activateBoost(validator);
        }
```

```solidity
    function activateBoost(address user, bytes calldata pubkey) external returns (bool) {
        IBGTStaker(staker).stake(user, amount);
        return true;
    }
```

When we check BGTStaker's implementation, we stake BGT token into BGT Staker, we can get some HONEY rewards. We can get these rewards via interface `getReward`. But we miss one interface in Staker contract to get this part of rewards.

```solidity
    function getReward() external returns (uint256) {
        return _getReward(msg.sender, msg.sender);
    }
```

## Recommendations

Add one interface in Staker contract to claim this boost rewards.
