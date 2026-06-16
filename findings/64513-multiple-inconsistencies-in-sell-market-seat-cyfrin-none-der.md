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
  - vuln/oracle/spot-price
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[spot-price]]"
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Multiple inconsistencies in `sell-market-seat`

- id: 64513
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The sell_market_seat function in the codebase has two inconsistencies compared to other functions. The first issue is that the function does not update the underlying price before calculating the funding rate, resulting in the use of stale price data. The second issue is that the function does not update the client's funding rate before withdrawing their seat, potentially resulting in incorrect funds being received by the user during position closure. This can have a significant impact on users, as they may receive more or less money than they should. The recommended solution is to call both functions before withdrawing the seat to ensure accurate data. The bug has been fixed in a recent commit and verified by another source.

## Details

**Description:** The [sell_market_seat](https://github.com/deriverse/protocol-v1/blob/4f7bc8ac68325aa93b339ff91c0ac794ea17ffd9/src/program/processor/sell_market_seat.rs#L89) contains two inconsistencies when compared to other perp functions in the codebase:

Issue 1: stale underlying price used for funding rate calculation:
- The function calls `change_funding_rate()` without first updating the underlying price via `set_underlying_px()`:
```rust
// sell_market_seat.rs
let mut engine = PerpEngine::new(
    &ctx,
    signer,
    system_program,
    community_state.perp_fee_rate(),
    community_state.margin_call_penalty_rate(),
    community_state.spot_pool_ratio(),
)?;

let instrument: &mut InstrAccountHeader = InstrAccountHeader::from_account_info(
    ctx.instr_acc,
    program_id,
    Some(data.instr_id),
    root_state.version,
)?;

// @audit change_funding_rate() called WITHOUT set_underlying_px() first, stale price is being used
engine.change_funding_rate();
```
The funding rate calculation depends on `perp_underlying_px` to determine the deviation between perpetual and spot prices. Without updating this value, the global funding rate is calculated using stale price data.

Issue 2: Missing client's funding rate update:
After calling `change_funding_rate()`, the function never calls `check_funding_rate(client_state.temp_client_id)` to apply pending funding payments to the exiting client:
```rust
engine.change_funding_rate();  // Updates global funding rate

let info = client_state.perp_info()?;

//@audit check_funding_rate(client_state.temp_client_id) is NOT called
// Pending funding is NOT applied to client's funds

if info.perps != 0 || info.in_orders_funds != 0 || info.in_orders_perps != 0 {
    bail!(ImpossibleToClosePerpPosition);
}

// Using stale funds value that doesn't include pending funding
let collactable_losses = info.funds().min(client_state.perp_info4()?.soc_loss_funds);
engine.state.header.perp_insurance_fund += collactable_losses;

// Client receives funds without pending funding being applied
client_state.add_crncy_tokens((info.funds() - collactable_losses).max(0))?;
```
The`check_funding_rate()` function applies any pending funding payments based on the client's position:

- When funding_rate > 0: longs pay shorts
- When funding_rate < 0: shorts pay longs
Even though the function requires `info.perps == 0` (no open position), the client may still have uncollected funding payments from when they previously held a position that have not yet been settled to their `info.funds` balance.

**Impact:** The stale underlying price causes the protocol to apply an incorrect global funding rate & by not updating client's funding payments before seat withdrawal we use stale `info.funds` which results in users either receiving less or more money than they should during position closure,

**Recommended Mitigation:** Call both functions prior, such that global rate and user's funds are fresh.

**Deriverse:** Fixed in commit [319890](https://github.com/deriverse/protocol-v1/commit/3198908f063537fc8b9ff6c9e1b6bcd8933e0847).

**Cyfrin:** Verified.
