---
tags:
  - lang/rust
  - has/poc
  - platform/ottersec
  - severity/high
  - sector/lending
protocol: "[[Aftermath]]"
auditors:
  - "[[OtterSec]]"
report: "https://aftermath.finance/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Missing Invariant Checks

- id: 48142
- impact: HIGH
- protocol: [[Aftermath]]
- reporter: OtterSec
- source: https://aftermath.finance/

## Summary


This bug report discusses an issue with the multi-swap functions in the Aftermath Finance project. These functions use the Newton method to approximate the value of t and ensure that the new invariant is closer to the old invariant in geometric_mean_calculations.move. However, there is a possibility that the new invariant may be smaller than the old invariant under certain conditions, which could lead to the required number of approximate turns being greater than the maximum allowed. This issue is not being checked for with an assert statement, which could result in incorrect calculations. The report includes a proof of concept test that fails, and suggests a potential fix by checking whether the invariant is decreased after the swap. This issue has been fixed in a recent patch.

## Details

## Multi-Swap Functions and Invariants

The multi-swap functions use the Newton method to approximate the value of `t` and ensure that the new invariant is closer to the old invariant in `geometric_mean_calculations.move`. The new invariant would be smaller than the old invariant under certain conditions where the required number of approximate turns would be greater than `MAX_NEWTONS_METHOD_ITERATIONS`. However, they do not include an assert statement to verify whether `new_invariant >= old_invariant`.

## Functions Included

- `calc_swap_fixed_in`
- `calc_swap_fixed_out`
- `calc_withdraw_fixed_amounts`
- `calc_deposit_fixed_amounts`

## Proof of Concept

**geometric_mean_calculations.move (RUST)**

```rust
#[test_only]
use std::debug;

#[test]
fun test_multi_swap() {
    let balances = vector[100_000, 100_000, 100_000, 100_000];
    let weights = vector[
        0__250_000_000_000_000_000,
        0__250_000_000_000_000_000,
        0__250_000_000_000_000_000,
        0__250_000_000_000_000_000
    ];
    let swap_fee_in = vector[
        0__010_000_000_000_000_000,
        0__010_000_000_000_000_000,
        0__010_000_000_000_000_000,
        0__010_000_000_000_000_000
    ];
    
    let swap_fee_out = vector[0, 0, 0, 0];
    let amounts_in = vector[0, 9, 0, 0 ];
    let amounts_out = vector[180, 0, 0, 0];
    let t = calc_swap_fixed_in(&balances, &weights, &swap_fee_in,
        &swap_fee_out, &amounts_in, &amounts_out);
    debug::print(&(t / 1_000_000_000_000_000));
    
    let new_balances = calc_new_balances(t, &balances, &amounts_in,
        &amounts_out);
    debug::print(vector::borrow(&new_balances, 0));
    debug::print(vector::borrow(&new_balances, 1));
    debug::print(vector::borrow(&new_balances, 2));
    debug::print(vector::borrow(&new_balances, 3));
    
    let old_inv = calc_invariant_fixed(&balances, &weights);
    let new_inv = calc_invariant_fixed(&new_balances, &weights);
    debug::print(&old_inv);
    debug::print(&new_inv);
    assert!(old_inv < new_inv, 50); // Fails
}
```

```rust
#[test_only]
fun calc_new_balances(t: u64, balances: &vector<u64>, amt_in:
        &vector<u64>, amt_out: &vector<u64>): vector<u64> {
    let new_amt_out = vector<u64>[];
    let i: u64 = 0;
    let len: u64 = vector::length(balances);
    while (i < len) {
        let new_amt = *vector::borrow(amt_out, i) * t /
            1_000_000_000_000_000_000;
        vector::push_back(&mut new_amt_out, new_amt);
        i = i + 1;
    };

    let new_balaces = vector<u64>[];
    i = 0;
    while (i < len) {
        let new_bal = *vector::borrow(balances, i) +
            *vector::borrow(amt_in, i) - *vector::borrow(&new_amt_out, i);
        vector::push_back(&mut new_balaces, new_bal);
        i = i + 1;
    };
    return new_balaces;
}
```

## Running Move Unit Tests

```rust
[debug] 71
[debug] 99988
[debug] 100009
[debug] 100000
[debug] 100000
[debug] 99999999999995999947870
[debug] 99999249721552275964062
[ FAIL ] 0x11::geometric_mean_calculations::test_multi_swap
```

## Remediation

Check whether the invariant is decreased after the swap.

**geometric_mean_calculations.move (RUST)**

```rust
// Calculate invariant after swap and assert has not decreased.
let end_balances: vector<u64> = vector::empty();
i = 0;
while (i < len) {
    ai = fixed::convert_int_to_fixed(*vector::borrow(amounts_in, i));
    ao = fixed::convert_int_to_fixed(*vector::borrow(expected_amounts_out, i));
    b = convert_int_to_fixed(*vector::borrow(balances, i));
    vector::push_back(&mut end_balances, fixed::convert_fixed_to_int(b +
        ai - fixed::mul_down(t, ao)));
    i = i + 1;
};

let invariant_after = calc_invariant_fixed(
    &end_balances,
    weights,
);
assert!(invariant_after >= invariant, EInvariantDecreased);
```

## Patch

Fixed in `8676084`.
