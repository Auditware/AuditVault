---
tags:
  - lang/move
  - sector/lending
  - sector/oracle
  - sector/uncollat-lending
  - platform/ottersec
  - severity/high
  - novelty/variant
protocol: "[[Argo]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://argo.fi/"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
---
# Liquidation Remarking

- id: 48528
- impact: HIGH
- protocol: [[Argo]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://argo.fi/

## Summary


The bug report discusses an issue with the Argo system's descending auction process for liquidations. When a vault is undercollateralized, it becomes "marked" and the auction begins. However, the function responsible for marking the vault does not check if the vault was previously marked. This allows users to repeatedly mark their own vault, preventing its liquidation. The report also mentions that there are certain conditions that must be met for this exploit to work, such as the initial auction price being higher than the actual collateral value. The report recommends fixing this issue by ensuring that the vault is not already marked before marking it. The bug has been resolved in a recent patch.

## Details

## Argo Liquidation System

Argo uses a descending auction system to process liquidations. When a vault is undercollateralized and eligible for liquidation, it becomes "marked" and the descending auction begins.

## Marking a Vault for Liquidation

```rust
argo_engine/sources/engine_v1.move RUST
/// Mark a Vault for liquidation. A Vault can only be marked if it is
// below the maintenance_collateral_ratio and the Safe is fresh.
public fun mark_vault<NamespaceType, CoinType>(
    marker: &signer,
    owner_addr: address,
) acquires Engine, Vault {
```

Unfortunately, this function does not ensure that the vault was not previously marked. As a result, a user attempting to prevent the liquidation of their vault can repeatedly mark their own vault to reset the descending auction.

## Gas-efficient Calculation of Auction Price

```rust
argo_engine/sources/engine_v1.move RUST
/// Gas-efficient calculation of auction_price
fun auction_price_internal<NamespaceType, CoinType>(
    engine: &Engine<NamespaceType, CoinType>,
    liquidator_addr: address,
    owner_addr: address,
): u64 acquires Vault {
```

Note that there are some preconditions for exploitation. The descending auction price starts at `oracle_free_price_internal`, which represents the expected collateral price derived from the maintenance ratio and debt value. There is also a liquidation delay which could make this issue more impactful.

A liquidator could potentially atomically mark and liquidate the vault if the initial price for the auction is higher than the actual collateral value, depending on how `liquidate_delay` and `marker_advantage` are set.

## Remediation

Ensure that the vault is not already marked in `mark_vault`.

## Patch

Resolved in commit `2c31c5c`:

```rust
argo_engine/sources/engine_v1.move RUST
assert!(vault.mark_info.marker_addr == @0,
    error::invalid_state(EALREADY_MARKED));
```
