---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/options
protocol: "[[Aries Markets]]"
auditors:
  - "[[Robert Chen]]"
report: "https://ariesmarkets.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[cross-contract-state-consistency]]"
  - "[[data-corruption/price-manipulation]]"
---
# Failure In Updating State Post Withdrawal

- id: 47304
- impact: HIGH
- protocol: [[Aries Markets]]
- reporter: Robert Chen (OtterSec)
- source: https://ariesmarkets.xyz/

## Summary


This bug report discusses an issue with the withdraw_reserve_amount function in the reserve_details file. This function is responsible for handling the withdrawal of a specified amount of reserve currency from the reserve. However, after completing the withdrawal, it fails to update the total_cash_available value stored in the ReserveDetails structure. This results in a mismatch between the actual and recorded cash amounts. This discrepancy prevents the reserve from accurately performing minting and redeeming operations. The report recommends updating the total_cash_available value after a withdrawal in the function and provides a patch to fix the issue. 

## Details

## Overview

The `withdraw_reserve_amount` function in `reserve_details` is responsible for handling the withdrawal of a specified amount of reserve currency from the reserve. However, after completing the withdrawal, it fails to update the `total_cash_available` value stored in the `ReserveDetails` structure. As a result, even though the currency is physically withdrawn from the reserve, the recorded total cash available in `ReserveDetails` remains unchanged, leading to a mismatch between the actual and recorded cash amounts.

## Function Implementation

```rust
// reserve_details.moverust
public fun withdraw_reserve_amount(reserve_details: &mut ReserveDetails): u64 {
    let reserve_amount = reserve_amount(reserve_details);
    let withdraw_amount = decimal::floor_u64(reserve_amount);
    reserve_details.reserve_amount = decimal::sub(reserve_amount, decimal::from_u64(withdraw_amount));
    withdraw_amount
}
```

This improper update of the `total_cash_available` value creates a discrepancy that prevents it from aligning with the expected values stored in `ReserveDetails`. Consequently, the `reserve::check_stats_integrity` assertion will fail, triggering an error (`ERESERVE_DETAILS_CORRUPTED`). Due to this assertion failure, the reserve’s integrity check fails, rendering the system incapable of reliably performing minting and redeeming operations. This effectively breaks the reserve’s functionality as it can no longer ensure accurate accounting.

## Integrity Check Function

```rust
// reserve.moverust
fun check_stats_integrity<Coin0>(
    reserve_coins: &ReserveCoinContainer<Coin0>,
    details: &ReserveDetails
) {
    let total_cash_available = coin::value(&reserve_coins.underlying_coin);
    let total_lp_supply = option::destroy_some(coin::supply<LP<Coin0>>());
    assert!(
        (total_cash_available as u128) == reserve_details::total_cash_available(details),
        ERESERVE_DETAILS_CORRUPTED
    );
    [...]
}
```

© 2024 Otter Audits LLC. All Rights Reserved. 6/16  

## Aries Market Audit 04 - Vulnerabilities

### Remediation

Ensure that the `total_cash_available` value stored in the `ReserveDetails` structure is updated after a withdrawal in the `withdraw_reserve_amount` function.

### Patch

Fixed in `4731f2d`.

© 2024 Otter Audits LLC. All Rights Reserved. 7/16
