---
tags:
  - lang/rust
  - sdk/stylus
  - sector/multisig
  - sector/staking
  - platform/trailofbits
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Arbitrum Stylus]]"
auditors:
  - "[[Gustavo Grieco]]"
  - "[[Jaime Iglesias]]"
  - "[[Troy Sargent]]"
  - "[[Dominik Czarnota]]"
  - "[[Benjamin Samuels]]"
  - "[[Kurt Willis]]"
  - "[[Nat Chin]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-05-offchain-arbitrumstylus-securityreview.pdf"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---

# Storage cache can become out of sync for reentrant and delegated calls

- id: 33449
- impact: HIGH
- protocol: Arbitrum Stylus
- reporter: Gustavo Grieco, Jaime Iglesias, Troy Sargent, Dominik Czarnota, Benjamin Samuels, Kurt Willis, Nat Chin (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-05-offchain-arbitrumstylus-securityreview.pdf

## Summary

## Difficulty: High

## Type: Data Validation

Path: `stylus/arbitrator/arbutil/src/evm/req.rs`

### Description

A storage cache's known values can become out of sync, causing storage reads to be outdated and storage write operations to be omitted. Storage caches take into account only their current call context. Every Stylus program call creates a new EVM API requestor (`EvmApiRequestor`).

When a new EVM API requestor is created, a new `StorageCache` struct is created as well. When there is no need to share storage state between two calls, storage caches work correctly. However, when a Stylus program performs a reentrant call or a delegated call, a new `EvmApiRequestor` is created, which also creates a new storage cache. When storage state is shared between calls, this can cause the first storage cache to become out of sync with the second cache, resulting in incorrect reads and omitted writes. This can be exploited in a multisignature Stylus program, allowing the ownership of the program to be changed after execution.

### Recommendations

- **Short term:** Commit storage cache values before creating a new `EvmApiRequestor`, or share storage caches between call frames.
- **Long term:** Thoroughly document the intended behavior of the cache to prevent similar issues.
