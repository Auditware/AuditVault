---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Inaccurate accounting in `removeLiquidity()` overstating liquidity

- id: 57740
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


The report discusses a medium severity bug in the `LiquidityFacet.removeLiquidity()` function. This function incorrectly updates the pool's token balance by only deducting the net amount while separately tracking the fee amount. This leads to a discrepancy because the full withdrawal amount is taken from the pool's token balance, but only the net amount is deducted from the accounting balance. The report recommends that the `poolAmount` should be deducted by the full withdrawal amount instead of just the net amount.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

`LiquidityFacet.removeLiquidity()` incorrectly updates the pool's token balance by only deducting the net amount (`netOutAmount`) while separately tracking the fee amount (`pFee`).

This creates a discrepancy because the full withdrawal amount (`outAmount = netOutAmount + pFee`) is taken from the pool's token balance, but only `netOutAmount` is deducted from the accounting balance in `poolAmount`.

Consider the following example:

1. User calls `LiquidityFacet.removeLiquidity()` with `_lpAmount` LP tokens.
2. Protocol calculates:
   - `outAmount` = total tokens to withdraw
   - `pFee` = protocol fee
   - `netOutAmount = outAmount - pFee` (total tokens to withdraw after fee)
3. Protocol updates state:

```solidity
function _removeLiquidityFromPool(
    ...
) internal {
    --- SNIPPED 
---
@>  strg.ledger.protocolFee[_tokenOut] += pFee;
@>  strg.ledger.state.poolAmount[_tokenOut] -= netOutAmount;
    _refreshVirtualPoolValue();
}
```

4. The actual token extracted from the pool is `netOutAmount + pFee: outAmount` but only `netOutAmount` is deducted from `poolAmount`. This leads to `poolAmount` being inflated by `pFee`.

## Recommendation

As the `removeLiquidity` function is to deduct the full amount from `poolAmount` and keep some fees in `protocolFee`, the `poolAmount` should be deducted by `outAmount: netOutAmount + pFee`.
