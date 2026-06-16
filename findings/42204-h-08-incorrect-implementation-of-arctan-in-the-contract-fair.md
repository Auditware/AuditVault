---
tags:
  - platform/code4rena
  - lang/solidity
  - has/github
  - severity/high
  - sector/insurance
protocol: "[[FairSide]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-05-fairside"
genome:
  - "[[precision-loss]]"
  - "[[integer-bounds]]"
  - "[[direct-drain]]"
---
# [H-08] Incorrect implementation of arctan in the contract `FairSideFormula`

- id: 42204
- impact: HIGH
- protocol: [[FairSide]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-05-fairside

## Summary


The current implementation of the arctan formula in the contract `FairSideFormula` is incorrect and may result in incorrect calculations when the input parameter is negative. This affects the `calculateDeltaOfFSD` function and the number of FSD tokens minted or burned. The function `_arctan` is missing two `abs` on the variable `a`, which leads to errors. The correct implementation has been suggested and the issue has been confirmed and fixed by the project team.

## Details


The current implementation of the arctan formula in the contract `FairSideFormula` is inconsistent with the referenced paper and could cause incorrect results when the input parameter is negative. The erroneous formula affects the function `calculateDeltaOfFSD` and the number of FSD tokens minted or burned.

The function `_arctan` misses two `abs` on the variable `a'. The correct implementation should be:

```solidity
function _arctan(bytes16 a) private pure returns (bytes16) {
    return
        a.mul(PI_4).sub(
            a.mul(a.abs().sub(ONE)).mul(APPROX_A.add(APPROX_B.mul(a.abs())))
        );
}
```

Notice that `_arctan` is called by `arctan`, and `arctan` is called by `arcs` with `ONE.sub(arcInner)` provided as the input parameter. Since `arcInner = MULTIPLIER_INNER_ARCTAN.mul(x).div(fS3_4)` can be a large number (recall that `x` is the capital pool), it is possible that the parameter `a` is negative.

Recommend modifying the `_arctan` function as above.

**[fairside-core (FairSide) confirmed](https://github.com/code-423n4/2021-05-fairside-findings/issues/73#issuecomment-851048764):**
> Fixed in [PR#4](https://github.com/fairside-core/2021-05-fairside/pull/4).
