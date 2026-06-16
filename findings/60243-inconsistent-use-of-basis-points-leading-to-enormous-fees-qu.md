---
tags:
  - lang/solidity
  - sector/lending
  - platform/quantstamp
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Altr]]"
auditors:
  - "[[Roman Rohleder]]"
report: "https://certificate.quantstamp.com/full/altr/b6241933-b256-42d2-bb46-acb54a26e560/index.html"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[liquidation-underwater]]"
---
# Inconsistent Use of Basis Points Leading to Enormous Fees

- id: 60243
- impact: HIGH
- protocol: [[Altr]]
- reporter: Roman Rohleder (Quantstamp)
- source: https://certificate.quantstamp.com/full/altr/b6241933-b256-42d2-bb46-acb54a26e560/index.html

## Summary

The client has marked the issue as "Fixed" and it has been addressed in the commit `34a671ebe036ab208f49628c2f41fbe967d882ea`. The bug affects the `Lending.sol` file and is related to incorrect computation of fees and rates. The code documentation states that these fees and rates should be in basis points, but the `PRECISION` value is defined as 10000 and the fees are computed as multiples of this value, resulting in incorrect fees being charged. The recommendation is to define and use `PRECISION` as 100% and adjust all fees accordingly, as well as verifying the correct behavior with additional tests.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `34a671ebe036ab208f49628c2f41fbe967d882ea`.

**File(s) affected:**`Lending.sol`

**Description:** In `Lending.sol#L61`, `L124`, `L204` and `L249` the code documentation states certain fees and rates to be in `basis points`. Basis points are usually defined as `10000 = 100%`, `1000 = 10%`, `100 = 1%`, `10 = 0.1%` and `1 = 0.01%`.

However, in `Lending.sol#L22` the `PRECISION` is defined as:

```
uint256 public constant PRECISION = 10000;
```

and different protocol fee maxima are defined as multiple of that value:

```
uint256 public constant MAX_PROTOCOL_FEE = 4 * PRECISION;
    uint256 public constant MAX_REPAY_GRACE_FEE = 4 * PRECISION;
    uint256 public constant MAX_BASE_ORIGINATION_FEE = 3 * PRECISION;
    uint256 public constant MAX_LIQUIDATION_FEE = 15 * PRECISION;
    uint256 public constant MAX_INTEREST_RATE = 20 * PRECISION;
```

In the following lines values are wrongly computed:

1.   `Lending.sol#L411`: `platformFee += (totalPayable * repayGraceFee) / PRECISION;`
2.   `Lending.sol#L675`: `(_borrowedAmount * liquidationFee) / PRECISION`

So the fees are not interpreted as percentage shares, but multiplying factors of the borrowed amount, resulting in the borrower being required to be pay a multiple of the borrowed amount as a penalty when paying during the grace period or liquidators being required to pay back a multiple of the borrowed amount as liquidation fees.

**Recommendation:** We recommend defining and using `PRECISION` as being 100% and all fees accordingly lower than that (i.e. `MAX_PROTOCOL_FEE = 400` for 4%), harmonize all computations accordingly and verify the correct behavior with additional tests.
