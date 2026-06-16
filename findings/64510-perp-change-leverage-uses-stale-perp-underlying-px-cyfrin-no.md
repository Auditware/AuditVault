---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/oracle
  - sector/perpetuals
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# `perp-change-leverage` uses stale `perp-underlying-px`

- id: 64510
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The function "perp_change_leverage" in the Deriverse protocol is not updating the "perp_underlying_px" field before performing certain checks. This means that the calculations and checks that rely on this field may be using an outdated value, which could cause problems for traders. The recommended solution is to add a price update to sync the "perp_underlying_px" with the current "last_px". This issue has been fixed in the Deriverse protocol.

## Details

**Description:** The [perp_change_leverage](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/program/processor/perp_change_leverage.rs) function fails to call [engine.state.set_underlying_px(accounts_iter)?]() before performing various checks which involve upated/fresh `perp_underlying_px` like [check_long_margin_call](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/program/processor/perp_change_leverage.rs#L99), [check_short_margin_call](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/program/processor/perp_change_leverage.rs#L98) & [check_client_leverage](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/program/processor/perp_change_leverage.rs#L104). This function is responsible for synchronizing the `perp_underlying_px` field with the current [last_px](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/state/instrument.rs#L229) (since oracle support is disabled). Without this call, all subsequent calculations use a stale `perp_underlying_px` value from whenever it was last updated by another function.
```rust
    //@audit  present in perp_withdraw, perp_order_cancel, perp_mass_cancel, etc.
    //engine.state.set_underlying_px(accounts_iter)?;
    engine.check_soc_loss(client_state.temp_client_id)?;
    if engine.check_short_margin_call()? < MAX_MARGIN_CALL_TRADES {
        engine.check_long_margin_call()?;
    }
    engine.check_rebalancing()?;
    engine.change_edge_px(client_state.temp_client_id);

    engine.check_client_leverage(client_state.temp_client_id)?;
```
In contrast other functions which invlove `perp_underlying_px` correctly call [set_underlying_px](https://github.com/deriverse/protocol-v1/blob/30b06d2da69e956c000120cdc15907b5f33088d7/src/state/instrument.rs#L224) to update underlying price to last price (`new_perp_order`, `perp-withdraw`, `perp-order-cancel`, `perp-mass-cancel` etc)
NOTE: similar issue is in `perp-statistics-reset`

**Impact:** All the following calculations and checks involving `perp_underlying_px` would be based on stale value which may be problematic for traders as it may favor them or work against them.

**Recommended Mitigation:** Add the missing price update which syncs `perp_underlying_px` with `last_px`
```rust
engine.state.set_underlying_px(accounts_iter)?;
```
**Deriverse:** Fixed in commit: https://github.com/deriverse/protocol-v1/commit/4f7bc8ac68325aa93b339ff91c0ac794ea17ffd9

**Cyfrin:** Verified.
