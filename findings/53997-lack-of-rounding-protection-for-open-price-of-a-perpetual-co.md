---
tags:
  - lang/rust
  - lang/solidity
  - sector/options
  - sector/perpetuals
  - platform/cantina
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
protocol: "[[Layer N]]"
auditors:
  - "[[zigtur]]"
report: "https://cdn.cantina.xyz/reports/cantina_layern_august2024.pdf"
genome:
  - "[[rounding-direction]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# Lack of rounding protection for open price of a perpetual contract 

- id: 53997
- impact: HIGH
- protocol: [[Layer N]]
- reporter: zigtur (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_layern_august2024.pdf

## Summary


The bug report discusses an issue with the `open_price` field in the `position.rs` file. This field is used to calculate profit-and-loss for a perp position. The problem is that when updating the `open_price` to reflect a filled order, it rounds down, potentially causing a significant drift. This could be exploited by a user to manipulate the `open_price` and gain an advantage. The report suggests several mitigations, including maintaining the total cost of acquisition and setting a maximum position size. The bug has been fixed in PR 944 and PR 1107.

## Details

## Context
**File:** position.rs#L252-L254  

## Description
The assignment to `open_price`, when updating it to reflect a filled order, rounds down. It could potentially drift low through the actions of a user intent on getting a lower-than-fair `open_price` for manipulation purposes. Spamming purposefully crafted transactions could achieve a significant drift.

The `open_price` field is used to calculate profit-and-loss (PnL) for the perp position in the following way:

```
(sign as i128) * fill_size * (fill_price - open_price)
```

By this calculation, the lower the `open_price`, the higher the PnL. Hence the downwards rounding benefits the perp contract holder. With the previous open price = `p0` and new price = `pn`, and previous size = `s` and new fill size being `f`:

```
new open price = (p0 * s + pn * f) / (s + f)
```

As an extreme example, it's possible to leave the `open_price` field unchanged with many small orders rather than one big one. With `f = 1` and `s ≫ pn`:

```
new open price = (p0 * s + pn) / (s + 1) = p0
```

Note that even with a minimum order size, the problem is not entirely mitigated, for a couple of reasons. Firstly, for `s ≫ f`, `pn` the price update can still diminish or disappear, especially when prices are generally small relative to `s`. Secondly, even though there is a minimum order size there does not appear to be a minimum fill size. Hence, depending on market conditions, even a larger order can get split up into many smaller fills.

The current implementation of minimum order size only scales the orders according to some decimal; it doesn't enforce a specific `fill_size`. Hence, this only makes the attack more capital intensive and not less viable/profitable in terms of rate of return.

## Proof of Concept
Put the following test in `positions.rs`:

```rust
mod tests {
    use super::*;
    
    #[tokio::test]
    async fn rounding_error() {
        let open_price = Some(Price::new_checked(10, Decimals::MIN).unwrap());
        let mut pp: PerpPosition = PerpPosition {
            reduce_orders_size: 0,
            updated_funding_rate_index: 0,
            position_size: 1_000_000,
            reduce_orders: Default::default(),
            open_price: open_price,
        };
        
        let pf: PerpFill = PerpFill {
            fill_size: 100,
            price: NonZeroPriceMantissa::new(50).unwrap(),
            size_mul: 1,
        };

        for _i in 1..10000 {
            let pf: PerpFill = PerpFill {
                fill_size: 100,
                price: NonZeroPriceMantissa::new(50).unwrap(),
                size_mul: 1,
            };
            pp.apply_fill(Decimals::MIN, pf);
        }
        
        let res = pp.apply_fill(Decimals::MIN, pf);
        assert_eq!(pp.open_price, open_price);
    }
}
```

## Recommendation
There are a few possible mitigations:

1. One option is to maintain the actual total cost of acquisition for the position along the total number of shares and calculate `open_price` on the fly by dividing these numbers. This prevents rounding drift. However, it still allows single rounding errors, and thus, an attacker can continuously buy and sell while gaining dust at every transaction. To prevent this, ensure the rounding always disfavors the trader, which means the rounding should depend on which side the trader is taking on the perp.

2. Yet another mitigation is to set a maximum position size for any given perp, guaranteeing that `s` cannot be arbitrarily large.

3. A third mitigation is to allow rescaling perp prices, such that in the case of prices becoming small in relation to sizes, the rounding issue remains relatively small.

## LayerN
Fixed in PR 944 and PR 1107  

## Cantina Managed
Fixed. Will always round new `open_price` up.
