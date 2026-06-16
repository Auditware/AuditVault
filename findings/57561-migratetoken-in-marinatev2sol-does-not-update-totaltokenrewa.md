---
tags:
  - lang/solidity
  - sector/staking
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Umami]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# `migrateToken` in MarinateV2.sol does not update `totalTokenRewardsPerStake`.

- id: 57561
- impact: HIGH
- protocol: [[Umami]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md

## Summary


The MarinateV2 contract has a bug where transferring reward tokens to another address does not update the total Token RewardsPerStake value. This can result in some stakers losing funds when trying to collect rewards. The recommendation is to update the value correctly when calling `migrateToken` to prevent this issue. The bug has been resolved by removing the `migrateToken` function.

## Details

**Description**

MarinateV2.sol - migrate Token transfers reward tokens to another address and does not update the value of total Token RewardsPerStake accordingly, which shall in turn cause loss of funds to some stakers trying to collect rewards.

**Recommendation**

Ensure `totalTokenRewardsPerStake` is updated correctly when `migrateToken` is called to prevent loss of funds for stakers.

**Re-audit comment**

Resolved.

fix#1 - Partner removed migrate Token
