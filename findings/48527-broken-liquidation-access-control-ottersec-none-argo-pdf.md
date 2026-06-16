---
tags:
  - lang/move
  - sector/lending
  - platform/ottersec
  - has/poc
  - severity/high
  - trigger/flash-loan
  - precondition/flash-loan-available
  - fix/add-access-control
protocol: "[[Argo]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://argo.fi/"
genome:
  - "[[missing-modifier]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[add-access-control]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[move-hot-potato-abilities]]"
---
# Broken Liquidation Access Control

- id: 48527
- impact: HIGH
- protocol: [[Argo]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://argo.fi/

## Summary


The bug report discusses an issue with Argo's implementation of liquidations using a flashloan system. The intended behavior is to interact with a wrapper over the underlying Argo Engine functions, but this is not happening. Critical security checks, such as ensuring the correct amount is repaid, are also not being enforced. Additionally, access control between two components of Argo is not properly enforced, allowing a liquidator to repay only 1 token instead of the required amount. A proof of concept is provided, and the recommended patch is to remove one component and restructure the system.

## Details

## Argo Liquidation System

Argo implements liquidations via a flashloan system using the hot potato method, returning a `LiquidateIOU` object with no abilities.

## Code Implementation

### argo_engine/sources/engine_v1.move

```rust
public fun liquidate_withdraw<NamespaceType, CoinType>(
    owner_addr: address,
    liquidate_amount: u64,
    cap: &Cap<LiquidateFeature<NamespaceType, CoinType>>,
): (Coin<CoinType>, LiquidateIOU<NamespaceType, CoinType>) acquires
    Engine, Vault {
```

The intended behavior is to interact directly with `argo_liquidate` as a wrapper over the underlying Argo Engine functions.

### argo_liquidate/sources/liquidate_v1.move

```rust
public fun liquidate_withdraw<NamespaceType, CoinType>(
    params_addr: address,
    owner_addr: address,
    liquidate_amount: u64,
): (Coin<CoinType>, LiquidateIOU<NamespaceType, CoinType>) acquires
    LiquidateParams {
    let params = borrow_global<LiquidateParams<NamespaceType, CoinType>>(params_addr);
    return engine_v1::liquidate_withdraw<NamespaceType, CoinType>(
        owner_addr,
        liquidate_amount,
        &params.liquidate_cap,
    )
}
```

Critical security checks are also performed in the `argo_liquidate` handler, such as asserting that the correct amount is repaid by the liquidator.

### argo_liquidate/sources/liquidate_v1.move

```rust
assert!(
    max_repay_amount >= required_repay_amount,
    error::invalid_argument(EREPAY_NOT_ENOUGH),
);
```

Access control between `argo_liquidate` and `argo_engine` is enforced through the use of a `LiquidateFeature` capability. Unfortunately, this capability access control requirement is not enforced on `liquidate_repay`.

### argo_engine/sources/engine_v1.move

```rust
public fun liquidate_repay<NamespaceType, CoinType>(
    to_repay: Coin<USDA>,
    liquidation_tax: Coin<USDA>,
    iou: LiquidateIOU<NamespaceType, CoinType>,
) acquires Engine, Vault {
```

This means a liquidator can simply pay back 1 token.

## Proof of Concept

1. Call `argo_liquidate::liquidate_withdraw` and withdraw all of an underwater position’s collateral.
2. Call `argo_engine::liquidate_repay` and repay 1 USDA.

## Patch

Similar to OS-ARG-ADV-00, Argo removed `argo_liquidate` and flattened their architecture.
