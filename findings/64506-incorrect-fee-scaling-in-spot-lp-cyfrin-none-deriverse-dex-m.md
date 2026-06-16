---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[decimal-mismatch]]"
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[token-decimal-normalization]]"
---
# Incorrect Fee Scaling in `spot_lp`

- id: 64506
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report describes a problem with the fee calculation in the `spot_lp` instruction. The code is using an incorrect decimal factor when converting `last_px` to a human-readable price, which leads to incorrect fee calculations. This happens when the number of decimals for the currency token is not equal to 9. The impact of this bug is that users may be charged incorrect fees, resulting in overpayment. The recommended solution is to update the fee calculation to use the correct decimal factor. This bug has been fixed in the Deriverse protocol version 1. The report has been verified by the Cyfrin team.

## Details

**Description:** The fee calculation in the `spot_lp` instruction uses an incorrect decimal factor when converting `last_px` to a human-readable price when trying to determine how much money is needed to purchase the minimum quantity of an asset. The code divides `last_px` by `get_dec_factor(asset_token_decs_count)` instead of the correct decimals(should be `9 + instr_state.asset_token_decs_count - instr_state.
crncy_token_decs_count`), leading to incorrect fee calculations when `9 != crncy_token_decs_count`.

In `src/program/processor/spot_lp.rs`, the fee calculation incorrectly converts last_px:
```rust
fees = 1
    + ((instr_state.header.last_px as f64
        / get_dec_factor(instr_state.header.asset_token_decs_count) as f64)
        as i64)
        .max(1);
```

`last_px` precision: According to `src/program/spot/engine.rs` and `src/state/instrument.rs`, `last_px` is calculated with precision `dec_factor = 10^(9 + asset_token_decs_count - crncy_token_decs_count)`. ** So the final precision for `px` would be `9`.**
```rust
        let mut px = (self.state.header.crncy_tokens as f64 * self.df
            / self.state.header.asset_tokens as f64) as i64; // <= crncy_token_decs_count + 9 + asset_token_decs_count - crncy_token_decs_count - asset_token_decs_count = 9
```

In fact the `px` should be divided by `dec_factor` which is: `get_dec_factor ( 9 + instr_state.asset_token_decs_count - instr_state.
crncy_token_decs_count)` but currently it's only `get_dec_factor (asset_token_decs_count)`

When `crncy_token_decs_count != 9` (e.g., `crncy_token_decs_count = 6`), the fee will be calculated incorrectly.

**Example**:
Suppose `asset_token_decs_count = 8` and `crncy_token_decs_count = 7`, and `asset_token = 2 crncy (ignoring decimals)`. Using the current calculation:

```
px = 2 * 1e9
(instr_state.header.last_px as f64
        / get_dec_factor(instr_state.header.asset_token_decs_count) as f64) = 2*1e9 / 1e8 = 20.
```

The code suggests that `~20` minimum units of `crncy` are required to purchase 1 minimum unit of `asset`. In reality, the correct value should be `0.2` minimum units of `crncy`, reflecting the difference in decimal precision.


**Impact:** When `crncy_token_decs_count != 9`, users are charged incorrect fees, which may lead to overpayment.

**Recommended Mitigation:** Update the fee calculation to use the correct decimal factor.

**Deriverse:** Fixed in commit [65dfb8](https://github.com/deriverse/protocol-v1/commit/65dfb890559a4b20202d3fb43942d8759c2d6476).

**Cyfrin:** Verified.
