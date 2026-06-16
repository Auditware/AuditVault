---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - sector/perpetuals
  - platform/cyfrin
  - has/github
  - severity/high
  - novelty/known-pattern
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[wrong-condition]]"
  - "[[indirect-loss]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
---
# Stale Funds Data in Leverage Validation Due to Missing Funding Rate Settlement

- id: 64502
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The code in `perp_change_leverage` is missing a call to `check_funding_rate` before validating leverage constraints. This means that the code uses old data when checking leverage limits, which can lead to incorrect leverage changes. The recommended solution is to add the `check_funding_rate` call to ensure that the code uses the latest funding rate settlements before validating leverage. This issue has been fixed in the latest version of the code.

## Details

**Description:** In `perp_change_leverage`, the code calls `check_soc_loss` but omits `check_funding_rate` before validating leverage constraints. As a result, `check_client_leverage` uses stale funds data when computing evaluation and checking leverage limits. This can allow invalid leverage changes.

In `perp_change_leverage.rs`:

```rust
    engine.check_soc_loss(client_state.temp_client_id)?;
    if engine.check_short_margin_call()? < MAX_MARGIN_CALL_TRADES {
        engine.check_long_margin_call()?;
    }
    engine.check_rebalancing()?;
    engine.change_edge_px(client_state.temp_client_id);

    engine.check_client_leverage(client_state.temp_client_id)?;

```

However, there should be `check_funding_rate` call before leverage validation to ensure the `fund` is up-to-date.
```rust
    pub fn check_funding_rate(&mut self, temp_client_id: ClientId) -> Result<bool, DeriverseError> {
        let info = unsafe { &mut *(self.client_infos.offset(*temp_client_id as isize)) };
        let info5 = unsafe { &mut *(self.client_infos5.offset(*temp_client_id as isize)) };
        let perps = info.total_perps();
        let mut change = false;
        if perps != 0 {
            if self.state.header.perp_funding_rate != info5.last_funding_rate {
                let funding_funds = -(perps as f64
                    * (self.state.header.perp_funding_rate - info5.last_funding_rate))
                    .round() as i64;
                if funding_funds != 0 {
                    info.add_funds(funding_funds).map_err(|err| drv_err!(err))?;
                    info5.funding_funds = info5
                        .funding_funds
                        .checked_add(funding_funds)
                        .ok_or(drv_err!(DeriverseErrorKind::ArithmeticOverflow))?;
                    self.state.header.perp_funding_funds -= funding_funds;
                    change = true;
```

If funding rate has changed since last settlement, info.funds is stale, leading to incorrect evaluation and leverage constraint checks.

```rust
    engine.check_client_leverage(client_state.temp_client_id)?;

    pub fn check_client_leverage(&self, temp_client_id: ClientId) -> DeriverseResult {
        let info = unsafe { &*(self.client_infos.offset(*temp_client_id as isize)) };
        let info2 = unsafe { &*(self.client_infos2.offset(*temp_client_id as isize)) };
        let evaluation = self.calculate_evaluation(info)?;
        let perp_value = self.calculate_perp_value(info);

        self.check_client_leverage_from(info, info2, evaluation, perp_value)
    }
```

In contrast, the `new_perp_order` correctly calls `check_funding_rate`:

```rust

    engine.check_funding_rate(client_state.temp_client_id)?;
    engine.check_rebalancing()?;
    engine.change_edge_px(client_state.temp_client_id);

    engine.check_client_leverage_shift(
        perp_client_info,
        perp_client_info2,
        old_leverage,
        old_perps,
    )?;
```

Also, `perp_order_cancel` also lacks this update.

**Impact:** Leverage validation may be based on outdated funding payments.

**Recommended Mitigation:** Add `engine.check_funding_rate(client_state.temp_client_id)?;` to ensure ensures `info.funds` reflects the latest funding rate settlements before leverage validation.

**Deriverse:** Fixed in commit [74f9650](https://github.com/deriverse/protocol-v1/commit/74f9650ef966b422d95a384bb1e39f4f7bd9cf22).

**Cyfrin:** Verified.
