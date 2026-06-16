---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Ostium]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Ostium-security-review_2025-01-21.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# [H-01] Undervalued funding fee when accFundingRate is negative

- id: 61508
- impact: HIGH
- protocol: Ostium_2025-01-21
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Ostium]]-security-review_2025-01-21.md

## Summary


This bug report discusses an issue with the funding fee accounting in a financial system. The severity of the bug is medium and the likelihood of it occurring is high. The problem arises when the funding fee is paid from one side to the other and the scaling is always applied to one side, resulting in the other side receiving less than they should. This issue occurs when the oiDelta value is negative. The recommendation is to fix this discrepancy by properly accounting for the funding fee when oiDelta is negative.

## Details


## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The funding fee accounting differs between when Longs pay to Shorts and when Shorts pay to Longs, and Shorts always pay less funding fee than they should when oiDelta is negative.

This issue arises from the fact that, regardless of which side pays, the scaling is always applied to the `valueShort` accounting. As such, Shorts always receive the full funding fee from Longs but only pay a partial funding fee to Longs.

Consider this:

* oiDelta is positive:

Longs pay Shorts the full `accFundingRate`. The full `accFundingRate` is correctly added to `accPerOiLong`, and `accFundingRate` scaled by `* openInterestLong / openInterestShort` is added to `accPerOiShort`. This scaling is necessary to correctly reflect the per-token amount paid to Shorts.

* oiDelta is negative:

Shorts should pay Longs the full `accFundingRate`, but the full `accFundingRate` is incorrectly added to `accPerOiLong` which in fact is undervalued, where it should be scaled by `* openInterestShort / openInterestLong`. Similarly, `accFundingRate` scaled by `* openInterestLong / openInterestShort` is added to `accPerOiShort` which result in less fees being paid by Shorts, where it should not be reduced like this, and the full `accFundingRate` should be added to `accPerOiShort`.

As can be seen, when oiDelta is negative, the funding fee paid to Longs is undervalued by the size of oiDelta.

## Recommendations

Correct this discrepancy by properly accounting for the funding fee when oiDelta is negative.
