---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/bridge
  - sector/lending
  - platform/sherlock
protocol: "[[LEND]]"
auditors:
  - xiaoming90
report: "https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging"
genome:
  - "[[liquidation-incentives]]"
  - "[[logic/liquidation-logic]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# H-17: If CoreRouter is liquidated, some user may suffer more loss than expected

- id: 58386
- impact: HIGH
- protocol: LEND
- reporter: xiaoming90 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found by multiple individuals in the CoreRouter code. The problem is that when a user redeems tokens, the amount they receive is calculated based on the exchange rate, but this does not take into account the possibility of CoreRouter being liquidated in LToken. This means that if CoreRouter is liquidated, the users who redeem earlier will receive their full amount, while the last users will suffer more loss than expected. The report suggests that when a user redeems, the received amount should be calculated based on CoreRouter's collateral in LToken to mitigate this issue.

## Details

Source: https://github.com/sherlock-audit/2025-05-lend-audit-contest-judging/issues/824 

## Found by 
0xgh0st, h2134, jokr, t.aksoy, xiaoming90, zxriptor

### Summary

If CoreRouter is liquidated, some users may suffer more loss than expected.

### Root Cause

When a user redeem tokens from `CoreRouter`,  the underlying token amount to be received is calculated as `user amount * exchange rate`.

[CoreRouter.sol#L117-L118)](https://github.com/sherlock-audit/2025-05-lend-audit-contest/blob/main/Lend-V2/src/LayerZero/CoreRouter.sol#L117-L118):
```solidity
        // Calculate expected underlying tokens
        uint256 expectedUnderlying = (_amount * exchangeRateBefore) / 1e18;
```

The problem is that `CoreRouter` acts as both a supplier and borrower to `LToken`, therefore it's possible that `CoreRouter` is liquidated in `LToken` if its collateral is less than borrowed amount.

If `CoreRouter` is liquidated, it will have less collateral in `LToken` than before, however, such situation is not took into consideration when user s redeem, as a result, the users who redeem earlier can fully redeem, leaving the last users suffer the loss.

### Internal Pre-conditions

NA

### External Pre-conditions

`CoreRouter` is liquidated in `LToken`.

### Attack Path

NA

### Impact

User suffer more loss than expected.

### PoC

_No response_

### Mitigation

When user redeems, the received amount should be calculated based on `CoreRouter`'s collateral in `LToken`.
