---
tags:
  - lang/rust
  - sector/dex
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/rounding-direction
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Dango]]"
auditors:
  - "[[haxagon]]"
  - "[[heavyw8t]]"
report: "https://github.com/sherlock-audit/2025-09-dango-dex-judging"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
---
# H-1: Incorrect rounding direction in geometric pool `ask_exact_amount_out` allows theft of funds

- id: 63649
- impact: HIGH
- protocol: [[Dango]] DEX
- reporter: haxagon (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the geometric pool `ask_exact_amount_out` which can lead to theft of funds. The root cause of this issue is an incorrect rounding direction which favors the trader and results in a lesser input amount for an exact output. The attack path involves an attacker executing a swap with exact amount out 1999 units of USDC which translates to 1.999 sat of BTC, but due to the incorrect rounding, the attacker can obtain 1999 units of USDC while paying only 1 sat of BTC. This can lead to loss of funds in the BTC pool. There is currently no response or mitigation suggested for this issue.

## Details


Source: https://github.com/sherlock-audit/2025-09-dango-dex-judging/issues/68 

## Found by 
haxagon, heavyw8t

### Summary

Incorrect rounding direction in geometric pool `ask_exact_amount_out` allows theft of funds

### Root Cause

There is an incorrect rounding direction in geometric pool `ask_exact_amount_out` which allows theft of funds.

https://github.com/left-curve/left-curve/blob/main/dango/dex/src/core/geometric.rs#L185-L206
```rs
fn ask_exact_amount_out(
    ask_amount_in_quote: Uint128,
    passive_bids: Box<dyn Iterator<Item = (Price, Uint128)>>,
) -> anyhow::Result<Uint128> {
    let mut remaining_ask_in_quote = ask_amount_in_quote.checked_into_dec::<6>()?;
    let mut input_amount = Udec128::ZERO;

    for (price, amount) in passive_bids {
        let remaining_ask = remaining_ask_in_quote.checked_div_dec_floor(price)?;
        let matched_amount = cmp::min(amount.checked_into_dec()?, remaining_ask);
        input_amount.checked_add_assign(matched_amount)?;

        let matched_amount_in_quote = matched_amount.checked_mul_dec_ceil(price)?;
        remaining_ask_in_quote.checked_sub_assign(matched_amount_in_quote)?;

        if remaining_ask_in_quote.is_zero()
            || remaining_ask.is_zero()
            || matched_amount_in_quote.is_zero()
        {
            return Ok(input_amount.into_int());
        }
    }

    bail!("not enough liquidity to fulfill the swap! remaining amount: {remaining_ask_in_quote}")
}
```
`remaining_ask_in_quote.checked_div_dec_floor` favors the trader, as the `matched_amount` will be lower resulting in a lesser input amount for an exact output. `into_int` which is the bigger issue then also truncates again later, also favoring the trader.

Note: the issue also affects the `bid_exact_amount_out` function as it floors the `input_amount` using the same `into_int` function. But the attack path is less strong there but still an issue nevertheless because you can only round down the USDC.

### Internal Pre-conditions

-

### External Pre-conditions

-

### Attack Path

Consider a scenario BTC-USDC pool where 1 sat unit of BTC = 1999 units of USDC. An attacker can execute a swap with exact amount out 1999 units of USDC which translates to 1.999 sat of BTC.

Since `remaining_ask_in_quote.checked_div_dec_floor(price)?` operates on `Udec128`, there isn't a big impact here yet as the floor is only occuring at the decimal point value. However once we reach `input_amount.into_int()` the entire decimal value of `input_amount` which is a `Udec128` will get completely truncated, resulting in an `input_amount` of 1 sats of BTC

Essentially, the attacker can obtain 1999 units of USDC while paying 1 sats of BTC every swap (actual price: 1000 units of USDC per 1 sat of BTC). Eventually this can accumulate with multiple swaps to drain the BTC pool.


### Impact

Loss of funds.

### PoC

_No response_

### Mitigation

_No response_
