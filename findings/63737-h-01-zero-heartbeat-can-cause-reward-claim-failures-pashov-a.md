---
tags:
  - lang/solidity
  - sector/oracle
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - fix/add-check
protocol: "[[Level]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Level-security-review_2025-04-09.md"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Zero `heartBeat` can cause reward claim failures

- id: 63737
- impact: HIGH
- protocol: Level_2025-04-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Level]]-security-review_2025-04-09.md

## Summary


This bug report is about a problem in the `OracleLib` and `RewardsManager` contracts, which work together to enable reward claiming based on asset prices. The issue is with the `getAssets()` function in the `StrategyLib` contract, which calculates the total assets held by a vault. This function depends on price data fetched via `OracleLib.getPriceAndDecimals()`, but the current implementation passes a `heartBeat` value of 0, which means that the function will only work if the price data is very recent. This can cause the reward claim to fail if the price data is not updated frequently. The report recommends updating the `getPriceAndDecimals()` call in `getAssets()` to use a non-zero `heartbeat` value of at least 3600 seconds (1 hour).

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `OracleLib` and `RewardsManager` contracts work together to enable reward claiming based on asset prices. A key part of this process involves the `getAssets()` function in `StrategyLib`, which calculates the total assets held by a vault. This function depends on price data fetched via `OracleLib.getPriceAndDecimals()`.

However, the current implementation passes a `heartBeat` value of 0 when calling `getPriceAndDecimals()`:

```solidity
        (int256 assetsForOneShare, uint256 decimals) = OracleLib.getPriceAndDecimals(address(config.oracle), 0);

```

The `heartBeat` parameter is used to determine whether price data is still fresh. Passing 0 effectively means "no tolerance" for stale data. As a result, if the current `block.timestamp` is even slightly greater than the `updatedAt` timestamp of the price, the function will revert - causing the reward claim to fail.

### Proof of Concept

- A user calls the `reward()` function on the `RewardsManager` contract.
- `reward()` triggers `getAccruedYield()`, which internally calls `getAssets()` from `StrategyLib`.
- `getAssets()` invokes `OracleLib.getPriceAndDecimals()` with a `heartbeat` of 0.
- If `block.timestamp > updatedAt + 0`, the call reverts, preventing the user from claiming rewards.
- This clearly shows how the current setup can block users from receiving rewards, especially when price feeds are not updated frequently.

## Recommendations

Update the `getPriceAndDecimals()` call in `getAssets()` to use a non-zero `heartbeat`. A value of at least 3600 seconds (1 hour) is recommended. 
