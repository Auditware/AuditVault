---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/oracle
  - sector/stable
protocol: "[[Dango]]"
auditors:
  - "[[axelot]]"
  - "[[blockace]]"
  - "[[haxagon]]"
report: "https://github.com/sherlock-audit/2025-09-dango-dex-judging"
genome:
  - "[[oracle/price-manipulation]]"
  - "[[defi/price-manipulation]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-freshness]]"
---
# H-3: Asymmetric liquidity provision to geometric pool can allow attacker to purchase at flat oracle price, irrespective of trade size.

- id: 63651
- impact: HIGH
- protocol: [[Dango]] DEX
- reporter: haxagon (Sherlock)
- source: N/A

## Summary


The report discusses a bug found in a decentralized exchange called Dango Dex. The bug allows an attacker to purchase assets at a flat oracle price, regardless of the trade size. This is caused by the way the exchange's geometric pool is designed, which reflects passive orders centered at the oracle price. This means that even if the pool has a certain amount of assets, the price will not adjust to reflect the demand for those assets. This can lead to losses for liquidity providers and can be exploited by arbitrageurs during periods of high volatility. No solution or response has been provided yet.

## Details


Source: https://github.com/sherlock-audit/2025-09-dango-dex-judging/issues/299 

## Found by 
axelot, blockace, haxagon

### Summary

Asymmetric liquidity provision to geometric pool can allow attacker to purchase at flat oracle price, irrespective of trade size.

### Root Cause

The geometric pool reflects passive orders centered at the oracle price, independent of pool balances.
Prices across levels are spaced by a fixed tick spacing and order sizes follow a geometric ratio of remaining inventory. 

https://github.com/left-curve/left-curve/blob/main/dango/dex/src/core/geometric.rs#L211-L294
```rs
pub fn reflect_curve(
    oracle_querier: &mut OracleQuerier,
    base_denom: &Denom,
    quote_denom: &Denom,
    base_reserve: Uint128,
    quote_reserve: Uint128,
    params: Geometric,
    swap_fee_rate: Bounded<Udec128, ZeroExclusiveOneExclusive>,
) -> anyhow::Result<(
    Box<dyn Iterator<Item = (Price, Uint128)>>,
    Box<dyn Iterator<Item = (Price, Uint128)>>,
)> {
    // Compute the price of the base asset denominated in the quote asset.
    // We will place orders above and below this price.
    //
    // Note that we aren't computing the price in the human units, but in their
    // base units. In other words, we don't want to know how many BTC is per USDC;
    // we want to know how many sat (1e-8 BTC) is per 1e-6 USDC.
    let marginal_price = {
        const PRECISION: Uint128 = Uint128::new(1_000_000);

        let base_price: Price = oracle_querier
            .query_price(base_denom, None)?
            .value_of_unit_amount(PRECISION)?;
        let quote_price: Price = oracle_querier
            .query_price(quote_denom, None)?
            .value_of_unit_amount(PRECISION)?;

        base_price.checked_div(quote_price)?
    };

    // Construct bid price iterator with decreasing prices.
    let bids = {
        let one_sub_fee_rate = Udec128::ONE.checked_sub(*swap_fee_rate)?;
        let bid_starting_price = marginal_price.checked_mul(one_sub_fee_rate)?;
        let mut maybe_price = Some(bid_starting_price);
        let mut remaining_quote = quote_reserve;

        iter::from_fn(move || {
            let price = maybe_price?;
            if price.is_zero() {
                return None;
            }

            let size_in_quote = remaining_quote.checked_mul_dec(*params.ratio).ok()?;
            let size = size_in_quote.checked_div_dec_floor(price).ok()?;
            if size.is_zero() {
                return None;
            }

            maybe_price = price.checked_sub(params.spacing).ok();
            remaining_quote.checked_sub_assign(size_in_quote).ok()?;

            Some((price, size))
        })
        .take(params.limit)
    };

    // Construct ask price iterator with increasing prices.
    let asks = {
        let one_plus_fee_rate = Udec128::ONE.checked_add(*swap_fee_rate)?;
        let ask_starting_price = marginal_price.checked_mul(one_plus_fee_rate)?;
        let mut maybe_price = Some(ask_starting_price);
        let mut remaining_base = base_reserve;

        iter::from_fn(move || {
            let price = maybe_price?;

            let size = remaining_base.checked_mul_dec(*params.ratio).ok()?;
            if size.is_zero() {
                return None;
            }

            maybe_price = price.checked_add(params.spacing).ok();
            remaining_base.checked_sub_assign(size).ok()?;

            Some((price, size))
        })
        .take(params.limit)
    };

    Ok((Box::new(bids), Box::new(asks)))
}
```

The problem here is that asymmetric liquidity provision allows performing a virtual swap, that is effectively at oracle price, that ignores the spacing and geometric ratio parameters, this allows effectively purchasing 
the up to the entire liquidity in the pool, bypassing the price increase applied by the geometric pool for increasing liquidity

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

Suppose we have a geometric pool consisting of 10 ETH and 20000 USDC and 1 ETH = 2000 USDC and a swap fee of 0.1%.

An attacker wants to swap 1 ETH for USDC in this pool. They can call `add_liquidity` with 2.222 ETH. They then immediately burn the LP tokens via `withdraw_liquidity` to withdraw some ETH and USDC, realizing their virtual swap performed during the asymmetric deposit.

USD value of virtual swap:

$$
x = \frac{4444 \cdot 20000}{20000 + 20000 + 4444} = 2000
$$

Fee rate:

$$
f = \frac{2000 \cdot 0.001}{4444} = 0.00045
$$

Total ETH withdrawn after LP token burn:

$$
ETH = (1-0.00045)(\frac{44444}{40000} - 1)(\frac{44444}{40000})^{-1}(12.2222) = 1.2215 
$$

Total USDC withdrawn after LP token burn:

$$
USDC = (1-0.00045)(\frac{44444}{40000} - 1)(\frac{44444}{40000})^{-1}(20000) = 1999 
$$

Noticeably, we can always obtain a 1 ETH to 2000 USDC trade from the geometric pool _irregardless_ of the `params.spacing` and `params.ratio`. 

In comparison, suppose our `params.ratio` is 0.05 and the `params.spacing` is 100 USD.

We obtain the following relevant price bands

> 0.5 ETH @ 1998 USDC
> 0.475 ETH @ 1898 USDC
> 0.45125 ETH @ 1798 USDC

To fill our 1 ETH ask, we execute the orders 0.5 ETH @ 1998 USDC, 0.475 ETH @ 1898 USDC and 0.025 ETH @ 1798 USDC, this yields ~1946 USDC. As seen, performing the asymmetric liquidity provision exploit can allow bypassing the price bands of the geometric pool and allow obtaining a better swap for at the flat oracle price.


### Impact

This allows an attacker to execute the virtual swap at the flat oracle price bypassing the price bands of the geometric pool. As a result, the pool earns lesser than intended as it effectively executes large orders without adjusting it's price to measure demand.

During periods of high volatility (even if the oracle is accurate), arbitrageurs can exploit this by purchasing large orders at the flat oracle price without the pool price being able to adjust price impact to meet the demand in the intended manner. This result in losses for LP providers.

### PoC

_No response_

### Mitigation

_No response_
