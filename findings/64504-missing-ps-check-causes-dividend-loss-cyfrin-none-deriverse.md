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
  - "[[wrong-state]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
---
# Missing ps check causes Dividend Loss

- id: 64504
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The report describes a bug in the perp engine's fee distribution logic. The code does not check for a liquidity provider in the spot pool before allocating fees, resulting in a loss of dividends for DRVS token holders. The recommended solution is to add a check for no liquidity provider in both `match_ask_orders()` and `match_bid_orders()` functions. This fix has been applied and verified by Cyfrin.

## Details

**Description:** In the perp engine's fee distribution logic, both `match_ask_orders` and `match_bid_orders` functions allocate pool fees without checking if there is any liquidity provider in the spot pool. This causes a loss of dividends for DRVS token holders when there is no liquidity provider.

The code always allocates a portion of fees to `pool_fees` regardless of whether the `ps` is zero or not:

```rust
let delta = self.state.header.protocol_fees - prev_fees;
let pool_fees = ((1.0 - self.spot_pool_ratio) * delta as f64) as i64;
self.state.header.protocol_fees -= pool_fees;
self.state.header.pool_fees = self
    .state
    .header
    .pool_fees
    .checked_add(pool_fees)
    .ok_or(drv_err!(DeriverseErrorKind::ArithmeticOverflow))?;
```


**Impact:** When `ps == 0`, fees that should be 100% allocated to `protocol_fees` (for dividends) are incorrectly split, with `(1.0 - spot_pool_ratio) * delta` going to `pool_fees` instead.

DRVS token holders receive less in dividends than they should when there is no liquidity provider, as a portion of fees is incorrectly allocated to the pool.

**Recommended Mitigation:** Add a check for `ps == 0` before allocating pool fees in **both** `match_ask_orders()` and `match_bid_orders()` functions:

```rust
let delta = self.state.header.protocol_fees - prev_fees;
let pool_fees = if self.state.header.ps == 0 {
    0  // No pool allocation when there is no liquidity provider
} else {
    ((1.0 - self.spot_pool_ratio) * delta as f64) as i64
};
self.state.header.protocol_fees -= pool_fees;
self.state.header.pool_fees = self
    .state
    .header
    .pool_fees
    .checked_add(pool_fees)
    .ok_or(drv_err!(DeriverseErrorKind::ArithmeticOverflow))?;
```

This ensures that when there is no liquidity provider in the spot pool (`ps == 0`), all fees remain in `protocol_fees` and are properly distributed as dividends to DRVS token holders via the `dividends_allocation` function.

**Note**: This fix must be applied to **both** `match_ask_orders()` and `match_bid_orders()` functions, as they both contain the same buggy logic.

**Deriverse:** Fixed in commit [5dd59a](https://github.com/deriverse/protocol-v1/commit/5dd59a3c105207206c196c4abe06d53dc837426d).

**Cyfrin:** Verified.
