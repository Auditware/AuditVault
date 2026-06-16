---
tags:
  - lang/solidity
  - lang/vyper
  - sector/lending
  - sector/nft
  - sector/staking
  - sector/token
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[StakeDAO]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/StakeDAO-security-review_2025-07-21.md"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# [C-02] Checkpoints are almost always outdated due to missing `_update` override

- id: 63599
- impact: HIGH
- protocol: StakeDAO_2025-07-21
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[StakeDAO]]-security-review_2025-07-21.md

## Summary


The report discusses a bug in the Morpho Blue markets where the `_update` function is not properly overridden in the strategy wrapper. This results in outdated checkpoints and has several impacts, including the inability for liquidators to redeem LP tokens and the breaking of fungibility for ERC20 tokens. The report recommends overriding the `_update` function to update checkpoints and fix the bug.

## Details


_Acknowledged_

## Severity

**Impact:** High

**Likelihood:** High

## Description

Strategy tokens are used as collateral token in Morpho Blue markets. It's crucial to update checkpoints in case of transfers because checkpoints are always handled with `msg.sender`. Currently, `_update` function is not overridden in strategy wrapper, which means checkpoints will be outdated almost always. 

There are many impacts of this situation:

1. Liquidator can't redeem LP tokens because he doesn't have any checkpoints for those tokens. It means it has no value for liquidators.

```solidity
        UserCheckpoint storage checkpoint = userCheckpoints[msg.sender];
        checkpoint.balance -= amount; // revert here due to underflow
```

2. Even if the borrower is liquidated in the market, he can claim rewards because his checkpoint still exists. Checkpoints are updated only while `deposit` and `withdraw` calls are made.

3. It breaks the fungibility feature of ERC20. It behaves like non-fungible tokens.

## Recommendations

Override `_update` function and update checkpoints in there.
