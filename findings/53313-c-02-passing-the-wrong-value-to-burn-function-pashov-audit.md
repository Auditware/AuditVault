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
  - "[[fee-accounting]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [C-02] Passing the wrong value to `_burn()` function

- id: 53313
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


The report is about a bug in the `OmoVault.sol` contract that affects the `topOff()` function. This function is used to transfer assets to users who have requested to redeem them. The bug causes the wrong amount of shares to be burned. The severity and likelihood of this bug are high, meaning it can have a significant impact and is likely to occur. The recommended solution is to replace the `agentBalance` variable with `record.shares` to ensure the correct amount of shares is burned.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

The agent will call `topOff()` function in `OmoVault.sol` contract to transfer the asset to users who have filled the requests to redeem.
The user shares are still not burned yet. `topOff()` will burn them here

```solidity
File: OmoVault.sol

453:         _totalAssets -= agentBalance;
454:         _burn(address(this), agentBalance);

```

But it burns the wrong amount of share. because `agentBalance` is the amount of asset that gets transferred to the user.

## Recommendations

```diff
File: OmoVault.sol

453:         _totalAssets -= agentBalance;
-454:         _burn(address(this), agentBalance);
+454:         _burn(address(this), record.shares);

```
