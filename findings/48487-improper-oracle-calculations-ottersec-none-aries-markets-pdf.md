---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/options
  - sector/oracle
protocol: "[[Aries Markets]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://ariesmarkets.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[pyth-oracle-completeness]]"
---
# Improper Oracle Calculations

- id: 48487
- impact: HIGH
- protocol: [[Aries Markets]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://ariesmarkets.xyz/

## Summary


The bug report states that there is an error in the Pyth price calculations in the oracle.move file. This file is written in the programming language RUST. The code is supposed to divide the price by the magnitude, but it is currently doing the opposite. Additionally, the code will also produce an error if the magnitude is negative. The solution to this bug is to multiply the price by the magnitude instead of dividing it. This issue has been resolved in the patch 2a62fc8.

## Details

## Pyth Price Calculations Issue

Pyth price calculations in `oracle.move` are performed incorrectly.

## Location
- File: `oracle/sources/oracle.move` 
- Language: RUST

## Code Snippet
```rust
pyth_price = option::some(decimal::div(
    decimal::from_u64(pyth::i64::get_magnitude_if_positive(&pyth::price::get_price(&
    decimal::from_u128(math128::pow(10,
    (pyth::i64::get_magnitude_if_positive(&pyth::price::get_expo(&price))
    as u128)))
))
```

## Problem
The price should be multiplied by, not divided by, the magnitude. This code also errors if the magnitude is negative.

## Remediation
Multiply by the magnitude.

## Patch
Resolved in commit `2a62fc8`.

---

© 2022 OtterSec LLC. All Rights Reserved.
