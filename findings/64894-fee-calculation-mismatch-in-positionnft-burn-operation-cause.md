---
tags:
  - lang/func
  - lang/solidity
  - sector/dex
  - platform/trailofbits
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[TONCO]]"
auditors:
  - "[[Nicolas Donboly Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fee-accounting]]"
---
# Fee calculation mismatch in PositionNFT burn operation causes incorrect fee growth tracking for token1

- id: 64894
- impact: HIGH
- protocol: [[TONCO]] CLAMM DEX v1.6
- reporter: Nicolas Donboly Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf

## Summary


The report discusses a bug in the `burnNFT` function of the `PositionNFT` contract. This bug affects the tracking of fee growth for `token1` and can lead to incorrect fee claims and distributions. The bug occurs because the function assigns `token1` fee growth using the `token0` accumulator, which sets an incorrect baseline for `token1`. This can result in underpaid or overpaid users. The report recommends a short-term solution to replace a line of code in the function and a long-term solution to add unit tests to validate the fee accumulator fields.

## Details

## Vulnerability Report

## Difficulty: Low

### Type: Access Controls

#### Description
The `burnNFT` function in the `PositionNFT` contract assigns `token1` fee growth using the `token0` accumulator. This causes incorrect tracking of fee growth for `token1` and will lead to miscalculated fee claims and distributions for `token1`.

The `growthInside0LastX128` and `growthInside1LastX128` state variables are per-position snapshots of the fee growth accumulators for `token0` and `token1` inside the position’s tick range, scaled by 2^128. On each position update (mint, burn, collect), the system refreshes these snapshots to the latest “inside” accumulators, so future owed fees are computed from the difference between the current accumulators and the stored snapshots. 

Assigning `growthInside1LastX128` from the `token0` accumulator sets an incorrect baseline for `token1`, so subsequent calculations take deltas against `token0`’s history instead of `token1`’s and may underpay or overpay users depending on pool state evolution.

```javascript
/* Now lets update the pos */
position0.liquidity -= liquidity2Burn;
position0.growthInside0LastX128 = newFees.growthInside0LastX128;
position0.growthInside1LastX128 = newFees.growthInside0LastX128;
```

#### Figure 1.1: Incorrect token1 fee growth assignment
(contracts/positionnft_tolk/operations/positionnft_burn.tolk#L77–L80)

### Exploit Scenario
Alice monitors a pool where `token0` and `token1` fee growth diverge, and `token1` fee growth (`growthInside1LastX128`) significantly exceeds that of `token0`. She opens a position and triggers a burn when `growthInside0LastX128` and `growthInside1LastX128` differ substantially. Because the burn path records `token1` growth using the `token0` accumulator, the contract later calculates `token1` fee deltas from an incorrect baseline, allowing Alice to harvest `token1` fees that were not actually accrued to the position.

### Recommendations
- **Short term:** Replace the second line of the `token1` fee growth assignment (highlighted in figure 1.1) with `position0.growthInside1LastX128 = newFees.growthInside1LastX128` so that `token1` fee growth is sourced from the `token1` accumulator.
  
- **Long term:** Add unit tests to validate that the fee accumulator fields are assigned consistently in all position lifecycle operations.
