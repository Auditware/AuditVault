---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - fix/use-twap
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
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-twap]]"
  - "[[known-pattern]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# Spot price manipulation can lead to unfair liquidations

- id: 64517
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report describes a vulnerability in the Deriverse protocol, which is used for trading perpetual instruments. When the protocol is configured without an oracle feed, the system uses the spot market's last price as the underlying price for liquidation calculations. However, this spot price can be manipulated through order book orders or trades, allowing attackers to trigger unfair liquidations of healthy positions. This can result in significant financial losses for users and can also be exploited by attackers for profit. The recommended mitigation for this issue is to use an external oracle or a time-weighted average price (TWAP). The bug has been fixed in the latest version of the protocol and has been verified by Cyfrin. 

## Details

**Description:** When perpetual instruments are configured without an oracle feed, the system uses the spot market's `last_px` as the `perp_underlying_px` for liquidation calculations. The spot price (`last_px`) can be manipulated through order book orders or AMM trades, allowing attackers to trigger unfair liquidations of healthy perpetual positions. This vulnerability enables malicious actors to force liquidations at manipulated prices, causing significant financial losses to users.

When no oracle is configured, the spot price directly becomes the perpetual underlying price:

Liquidations are triggered based on the manipulated `perp_underlying_px`:

```rust
pub fn check_long_margin_call(&mut self) -> Result<i64, DeriverseError> {
    let margin_call_px = (self.state.header.perp_underlying_px as f64
        * (1.0 - self.state.header.liquidation_threshold)) as i64;

    // If edge_px > margin_call_px, position gets liquidated
    // ...
}

pub fn check_short_margin_call(&mut self) -> Result<i64, DeriverseError> {
    let margin_call_px = (self.state.header.perp_underlying_px as f64
        * (1.0 + self.state.header.liquidation_threshold)) as i64;

    // If edge_px < margin_call_px, position gets liquidated
    // ...
}
```

**Impact:** The impact is high, as healthy positions may be liquidated unfairly. Additionally, an attacker may be able to exploit this behavior for profit.

**Recommended Mitigation:** Consider using an external oracle or TWAP.

**Deriverse:** Fixed in commit [fc0013](https://github.com/deriverse/protocol-v1/commit/fc0013bc5add2c0ad0eac3f31bfc37f32c87c07c).

**Cyfrin:** Verified.



\clearpage
