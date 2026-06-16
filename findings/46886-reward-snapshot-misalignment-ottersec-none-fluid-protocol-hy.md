---
tags:
  - lang/rust
  - sector/cdp
  - sector/governance
  - sector/lending
  - platform/ottersec
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Fluid Protocol (Hydrogen Labs)]]"
auditors:
  - "[[James Wang]]"
report: "https://fluidprotocol.xyz/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[debt-accrual-update]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
---
# Reward Snapshot Misalignment

- id: 46886
- impact: HIGH
- protocol: Fluid Protocol (Hydrogen Labs)
- reporter: James Wang (OtterSec)
- source: https://fluidprotocol.xyz/

## Summary


This bug report discusses an issue in the trove-manager program where partial liquidation of a trove does not update the borrower's reward snapshot, leading to incorrect reward calculations in the future. The report suggests updating the snapshot immediately after partial liquidation and utilizing a specific variable during liquidation calculations. The issue has been resolved in a recent patch.

## Details

## Partial Liquidation and Reward Snapshot Update in Trove Manager

In `internal_apply_liquidation` within `trove-manager`, when a trove is partially liquidated, it is important to update the borrower’s reward snapshot (the record of pending collateral and debt rewards). This is because the liquidation process calculates and accounts for the rewards that have accrued up to the moment of liquidation.

## Code Snippet

```sway
fn internal_apply_liquidation(
    borrower: Identity,
    liquidation_values: LiquidationValues,
    upper_partial_hint: Identity,
    lower_partial_hint: Identity,
) {
    let asset_contract_cache = storage.asset_contract.read();
    // partial liquidation reinserted into sorted troves
    if (liquidation_values.is_partial_liquidation) {
        let mut trove = storage.troves.get(borrower).read();
        [...]
    }
    [...]
}
```

The snapshot stores values representing the borrower’s position at a particular point in time. After liquidation, the borrower’s new trove position (with updated collateral and debt) should reflect a fresh starting point for accumulating future rewards. Failing to update the snapshot after a partial liquidation may result in double-counting rewards or incorrect reward calculations in the future because the borrower’s old snapshot would still reflect the pre-liquidation state.

Additionally, in `internal_get_totals_from_batch_liquidate`, `usdf_in_stability_pool` is utilized, and as a result, the function will always refer to the initial amount of USDF, ignoring the fact that some USDF has already been utilized.

## Remediation

Update the reward snapshot for the borrower immediately after the partial liquidation in `internal_apply_liquidation`, and utilize `vars.remaining_usdf_in_stability_pool` during liquidation calculations in `internal_get_totals_from_batch_liquidate`.

## Patch

Resolved in a9279b2.
