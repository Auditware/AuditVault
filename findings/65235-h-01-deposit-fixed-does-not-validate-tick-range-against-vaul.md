---
tags:
  - lang/rust
  - sdk/anchor
  - platform/pashov
  - has/github
  - severity/high
  - novelty/variant
  - lang/anchor
  - sector/dex
protocol: "[[Saffron]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Saffron-security-review_2026-03-06.md"
genome:
  - "[[missing]]"
  - "[[indirect-loss]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
---
# [H-01] `deposit_fixed` does not validate tick range against vault's `tick_lower` and `tick_upper`

- id: 65235
- impact: HIGH
- protocol: Saffron_2026-03-06
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Saffron]]-security-review_2026-03-06.md

## Summary


The report discusses a bug where the tick range for a vault is not checked when a fixed depositor deposits a position. This can result in the variable side paying a premium for a position that generates less fee income than expected. The report recommends validating the tick range of the position against the vault before accepting the deposit to prevent this issue.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium


## Description

The vault is created with `tick_lower` and `tick_upper` at `create_vault`; these are validated (alignment, range) and stored on the vault and emitted in `VaultCreated`. They define the concentration range for which the variable side pays a premium and expects a corresponding level of fee generation.

In concentrated liquidity, for a given liquidity amount L, a **narrower** tick range yields **higher** fee generation when the price is in range; a **wider** range spreads L over more price levels and yields **lower** fees per unit volume. So a vault created for ticks T1 and T2 with liquidity L implies an expected fee level X; if the actual position has the same L but a much wider range [T1′, T2′], fee generation will be **less** than X.

In `deposit_fixed`, the position's `tick_lower_index` and `tick_upper_index` are parsed from the Orca position account. The only tick-related logic is to **overwrite** the vault's stored ticks with the position's values. There is **no check** that the position's tick range matches the vault's `tick_lower` and `tick_upper`.

```rust
// Update vault state with position data
{
    let mut vault = ctx.accounts.vault.load_mut()?;
    vault.tick_lower = position_data.tick_lower_index;
    vault.tick_upper = position_data.tick_upper_index;
    vault.set_position_mint(Some(ctx.accounts.position_mint.key()));
    ...
    vault.fixed_side_capacity = position_data.liquidity;
    ...
}
```

A fixed depositor can therefore deposit a position with a **different** (e.g., much wider) tick range than the vault was created for.

The variable side, having paid a premium based on the created range and capacity, receives fee rights over a position that generates **less** fee income than expected.

Attack scenario: (1) Vault creator advertises a tight, in-range tick spread implying high expected fee yield. (2) Variable depositor pays full premium based on the advertised range. (3) Fixed depositor deposits a position with a completely different tick range - for example, far out of the current price - that generates zero fees. (4) Vault starts; variable depositor is locked in for the full duration with no recourse. This constitutes direct theft of the variable depositor's premium via misrepresented vault configuration.

## Recommendations

Consider validating the position's tick range against the vault's before accepting the deposit. Require that `position_data.tick_lower_index == vault.tick_lower` and `position_data.tick_upper_index == vault.tick_upper`, so that the deposited position matches the range for which the vault was created, and the variable side receives the fee level implied by the creation parameters.
