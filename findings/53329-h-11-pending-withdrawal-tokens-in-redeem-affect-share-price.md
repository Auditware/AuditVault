---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[defi/price-manipulation]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-11] Pending withdrawal tokens in `redeem()` affect share price

- id: 53329
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The report describes a bug in the `redeem()` function that affects the share price calculation in a vault. This bug can lead to incorrect valuations and distribution of funds among users. The severity is high and the likelihood is medium. The recommendation is to update the share price calculation to exclude pending withdrawal tokens until they are finalized.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Pending withdrawal tokens in the `redeem()` function are still considered in the share price calculations.
Since `totalSupply` and `_totalAssets` are not updated to reflect the pending withdrawals:

```solidity
        // Transfer shares from owner to vault
        balanceOf[owner] -= shares;
        balanceOf[address(this)] += shares;
```

The share price would be incorrect for profit/loss that happens later. When the pending withdrawals are finalized (by calling `topOff`), the share price will adjust to account for the withdrawals that were not previously considered. This could lead to inconsistencies in share valuation, causing wrong fund distributions among users over time.

## Recommendations

Update the share price calculation to exclude pending withdrawal tokens until they are finalized. This will ensure that `totalSupply` and `totalAssets` accurately reflect the current state of the vault and provide an accurate share price.
