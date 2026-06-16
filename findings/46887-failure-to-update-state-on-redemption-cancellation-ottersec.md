---
tags:
  - lang/rust
  - lang/solidity
  - sector/cdp
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
  - "[[reward-accounting]]"
---
# Failure to Update State on Redemption Cancellation

- id: 46887
- impact: HIGH
- protocol: Fluid Protocol (Hydrogen Labs)
- reporter: James Wang (OtterSec)
- source: https://fluidprotocol.xyz/

## Summary


The internal_redeem_collateral_from_trove function in the trove-manager-contract fails to update the stakes and reinsert the trove into the sorted list when a redemption is cancelled due to the new debt falling below a minimum limit. This results in inconsistencies in the contract's state. The issue has been resolved in two patches, which track a compounded value for stake instead of collateral and consider pending rewards in the calculation of the nominal collateralization ratio.

## Details

## Issue with `internal_redeem_collateral_from_trove`

`internal_redeem_collateral_from_trove` fails to update the stakes and reinsert the trove into the sorted list when the redemption is canceled. The cancellation condition occurs when the new debt after redemption falls below a predefined minimum debt limit (`MIN_NET_DEBT`). In such cases, the function sets the `cancelled_partial` flag to `true` and returns early without applying the redemption changes.

> _trove-manager-contract/src/main.sw sway_
>
> #[storage(read, write)]
> fn internal_redeem_collateral_from_trove(
> [...]
> ) -> SingleRedemptionValues {
> [...]
> else {
> // Calculate the new nominal collateralization ratio
> let new_nicr = fm_compute_nominal_cr(new_coll, new_debt);
> // If the new debt is below the minimum allowed, cancel the partial redemption
> if (new_debt < MIN_NET_DEBT) {
> single_redemption_values.cancelled_partial = true;
> return single_redemption_values;
> }
> [...]
> }
> [...]
> }

Since these values would have been altered during `apply_pending_rewards`, failing to update the stakes and reinsert the trove into the sorted list will result in inconsistencies in the state of the contract.

## Remediation

Track a compounded value as stake instead of collateral directly. This eliminates the need to update stake when distributing rewards. Also, consider pending rewards in NICR calculation to remove the need for reordering troves on reward distribution.

## Patch

Resolved in `f8006a0` and `89ba7f0`.
