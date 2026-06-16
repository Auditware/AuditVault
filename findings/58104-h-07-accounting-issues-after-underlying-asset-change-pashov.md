---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/bridge
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[reward-accounting]]"
  - "[[debt-accrual-update]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[privileged-tx]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-07] Accounting issues after underlying asset change

- id: 58104
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report highlights a high severity issue with the accounting in a pool, which could have a major impact on multiple scenarios. The likelihood of this bug occurring is medium, as it would happen when the admin calls `changeAsset()`. The problem is that updating the underlying asset in a pool is a risky move and can cause all cached prices to become incorrect. This is because the code currently has two cached prices, one for requests and one for calculating fees. Additionally, there may be other places where the pool price is cached. Another issue is that the `claimableAssetFees` is also cached, and even though the code attempts to reset it to zero, it may remain non-zero after an asset update. The recommendation is to reset all cached prices after an asset change to avoid these issues.

## Details

## Severity

**Impact:** High, because the accounting would go wrong for multiple scenarios

**Likelihood:** Medium, because it would happen when admin calls `changeAsset()`

## Description

In general updating underlying asset is very risky move in a pool.
All the cached prices will be wrong.

In the current code we have two cached prices(that I know of):
In requestRedeem() code caches pool prices for requests. Code use it later in the withdraw and cancel request. (the price impact withdraw price and also burning tokens in cancel requests)

In calculating fee, code caches pool price and use it to calculate fee later.

(there may be other places the pool price is cached)

---
Another place that is asset amount is cached is `claimableAssetFees`. `updateAsset()` calls the `_collectFees()` to handle the `claimableAssetFees` and set it to zero but because of this line in the `_collectFees()`
`If (profit == 0) return;`
`claimableAssetFees` (which shows amount in old asset) could remain non-zero after asset update.

## Recommendations

Reset the cached prices after the asset change.
