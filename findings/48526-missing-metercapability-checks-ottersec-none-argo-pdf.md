---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[Argo]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://argo.fi/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Missing MeterCapability Checks

- id: 48526
- impact: HIGH
- protocol: [[Argo]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://argo.fi/

## Summary


This bug report discusses an issue with the meter_capability functions in a cryptocurrency system. These functions are responsible for checking the security of token minting and burning. However, there is a vulnerability where anyone can create a GlobalMeter and claim a corresponding MeterCap, allowing them to forge tokens. The bug has been resolved by verifying the namespace address in the functions. The team has also redesigned their architecture to remove the source of the vulnerability.

## Details

## Meter Capability Overview

In `meter_capability`, the `add_meter_cap_usage` and `sub_meter_cap_usage` functions are security critical checks on the minting/burning of tokens.

## Function Definition

```rust
lib_capability/sources/meter_capability.move RUST
public fun add_meter_cap_usage<Feature>(
    cap: &MeterCap<Feature>,
    add_amount: u64,
    manage_cap: &ManageMeterCap<Feature>,
) acquires GlobalMeter {
    let global_meter = borrow_global_mut<GlobalMeter<Feature>>(manage_cap.namespace_addr);
    let meter = vector::borrow_mut(&mut global_meter.caps, cap.id);
    let new_global_usage = global_meter.usage + add_amount;
    let new_usage = meter.usage + add_amount;
}
```

These functions take in a `MeterCap` which corresponds to the ability to mint some strictly limited amount of tokens in a given namespace. This namespace is defined and managed by the `ManageMeterCap`, as seen in `laboratory::mint`.

### Mint Function Example

```rust
argo_core/sources/laboratory.move RUST
/// Mints `mint_amount` USDA.
public fun mint(
    mint_amount: u64,
    cap: &MeterCap<USDASupplyFeature>,
): Coin<USDA> acquires Laboratory {
    let laboratory = borrow_global<Laboratory>(@argo_core);
    meter_capability::add_meter_cap_usage(
        cap,
        mint_amount,
        &laboratory.usda_supply_manage_cap,
    );
}
```

Unfortunately, the `MeterCap` type is not unique. Anybody is able to create a `GlobalMeter<USDASupplyFeature>` and claim the corresponding `MeterCap`. Note that `MeterCap`’s id would overlap with an existing id on the namespace, allowing a malicious user to essentially forge a `MeterCap`.

## Vulnerabilities

```rust
lib_capability/sources/meter_capability.move RUST
/// Receive a MeterCap<Feature> that has a limit default of 0.
public fun claim_cap<Feature>(
    namespace_addr: address
): MeterCap<Feature> acquires GlobalMeter {
    // Implementation here
}
```

From here it’s trivial to mint arbitrary amounts of USDA.

## Remediation

- Verify that `cap` and `manage_cap` have the same namespace address.

### Patch

Resolved in `8711245`.

```rust
lib_capability/sources/meter_capability.move RUST
assert!(
    cap.namespace_addr == manage_cap.namespace_addr,
    error::invalid_argument(ENAMESPACE_MISMATCH),
);
```

After discussion with the Argo team, they also redesigned their architecture to remove `lib_capability` and `lib_rate_limit`.
