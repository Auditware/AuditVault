---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/governance
  - sector/lending
protocol: "[[Roots]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Roots-security-review_2025-02-09.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[debt-accrual-update]]"
---
# [H-02] Stale `totalActiveDebt` used in `openTrove` causing incorrect debt update

- id: 55112
- impact: HIGH
- protocol: Roots_2025-02-09
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Roots]]-security-review_2025-02-09.md

## Summary


This bug report discusses a medium severity issue in the `TroveManager::openTrove` function. The function caches the `totalActiveDebt` value before calling the `_accrueActiveInterests` function, which updates the `totalActiveDebt` to reflect accrued interest. However, the function then uses the cached value instead of the updated value, leading to an underestimation of the actual debt in the system. To fix this, the `totalActiveDebt` should be updated with the most recent value after the interest accrual. 

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

In the `TroveManager::openTrove` function, the `totalActiveDebt` is cached into a local variable `supply` before the `_accrueActiveInterests` function is called. The `_accrueActiveInterests` function itself updates the `totalActiveDebt` to reflect accrued interest. However, the `openTrove` function subsequently updates `totalActiveDebt` using the cached `supply` value instead of the potentially updated `totalActiveDebt`.

Specifically, the code caches `totalActiveDebt` in line 754:

```solidity
File: TroveManager.sol
754:    uint256 supply = totalActiveDebt;
```

Then, interest is accrued, potentially updating `totalActiveDebt` in line 761 by calling `_accrueActiveInterests()`:

```solidity
File: TroveManager.sol
761:    uint256 currentInterestIndex = _accrueActiveInterests();
```

Inside `_accrueActiveInterests`, `totalActiveDebt` is updated:

```solidity
File: TroveManager.sol
1183:           totalActiveDebt = currentDebt + activeInterests;
```

Finally, in line 776, `totalActiveDebt` is updated using the _cached_ `supply` value:

```solidity
File: TroveManager.sol
774:@>       uint256 _newTotalDebt = supply + _compositeDebt;
775:         require(_newTotalDebt + defaultedDebt <= maxSystemDebt, "Collateral debt limit reached");
776:@>       totalActiveDebt = _newTotalDebt;
```

Because `supply` is the value of `totalActiveDebt` before interest accrual in `_accrueActiveInterests`, the update in line 776 does not incorporate the interest accrued within the same `openTrove` transaction. This means the `totalActiveDebt` may be incorrectly updated, potentially underestimating the actual debt in the system.

Consider the next scenario:

1.  Initial state:

    - `totalActiveDebt = 1000`
    - Interest rate is such that `_accrueActiveInterests()` will increase `totalActiveDebt` by 100.

2.  `openTrove` call:

    - User calls `openTrove` with `_compositeDebt = 500`.
    - Line 754: `supply = totalActiveDebt;` => `supply = 1000` (cached value).
    - Line 761: `_accrueActiveInterests()` is called. Inside `_accrueActiveInterests()` (line 1183): `totalActiveDebt` is updated to `1000 + 100 = 1100`.
    - Line 776: `totalActiveDebt = _newTotalDebt;` where `_newTotalDebt = supply + _compositeDebt = 1000 + 500 = 1500`.
    - `totalActiveDebt` is set to `1500`.

3.  Expected vs. actual `totalActiveDebt`:
    - Expected `totalActiveDebt`: Initial debt (1000) + accrued interest (100) + new debt (500) = `1600`.
    - Actual `totalActiveDebt` after `openTrove`: `1500`.

The `totalActiveDebt` is underestimated by `100` (the accrued interest within the same transaction).

## Recommendations

To correct this issue, ensure that the `totalActiveDebt` is updated with the most recent value _after_ the interest accrual. Instead of caching `totalActiveDebt` at the beginning of the function.

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/all_findings_full.json
