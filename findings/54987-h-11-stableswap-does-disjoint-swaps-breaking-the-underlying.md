---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - lang/rust
  - sector/dex
  - platform/code4rena
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[logic/price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-pool]]"
---
# [H-11] Stableswap does disjoint swaps, breaking the underlying invariant

- id: 54987
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


The bug report discusses an issue with the stableswap pools in the code for the MANTRA DEX. The problem is that the invariant, which is used to maintain balance in the pools, is not calculated correctly for pools with more than 2 tokens. This means that the pool is not keeping all tokens in parity with each other, leading to lower slippage and potential arbitrage opportunities. The report suggests implementing the correct invariant calculation for these pools to mitigate the issue.

## Details



[/contracts/pool-manager/src/helpers.rs# L117-L124](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/helpers.rs# L117-L124)

[/contracts/pool-manager/src/helpers.rs# L39-L88](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/helpers.rs# L39-L88)

### Finding description and impact

In stableswap pools, the invariant that is preserved is a combination of a CPMM and a constant price model. For pools with more than 2 tokens, every token balance is used to compute the invariant.

This is shown in the curve protocol, where the invariant is calculated correctly.

The invariant is made up of two parts, the stable part and the constant product part:

*Note: please see scenario in warden’s [original submission](https://code4rena.com/audits/2024-11-mantra-dex/submissions/F-43).*

This lets every token in the pool stay in parity with the others, and reduces the slippage. The issue is that in the current implementation, instead of summing or taking the product of all the tokens of the pools, the protocol only takes the sum/product of the ask and offer tokens.

For example, in the `compute_swap` function,
```

let new_pool = calculate_stableswap_y(
    n_coins,
    offer_pool,
    ask_pool,
    offer_amount,
    amp,
    ask_precision,
    StableSwapDirection::Simulate,
)?;
```

Only the ask and offer amounts token amounts are sent in. In the internal `calculate_stableswap_y` function, the invariant is calculated using these two only.
```

let pool_sum = match direction {
    StableSwapDirection::Simulate => offer_pool.checked_add(offer_amount)?,
    StableSwapDirection::ReverseSimulate => ask_pool.checked_sub(offer_amount)?,
```

Here’s the curve stableswap code for comparison,
```

for _i in range(N_COINS):
    if _i == i:
        _x = x
    elif _i != j:
        _x = xp_[_i]
    else:
        continue
    S_ += _x
```

The `sum_invariant` D is calculated only with the two tokens in question, ignoring the third or fourth tokens in the pool; while the actual invariant requires a sum of ALL the tokens in the pool. Similarly, calculating in `calculate_stableswap_d` also calculates the sum using only 2 token balances.
```

let sum_pools = offer_pool.checked_add(ask_pool)?;
```

The `n_coins` used in the calculations, however, is correct and equal to the number of tokens in the pool. This is enforced since the reserves length is used, which is set up correctly during pool creation.
```

n_coins: Uint256::from(pool_info.assets.len() as u128),
```

Thus, the `S` and `D` calculated are incorrect. This also influences the outcome of the newton-raphson iterations, since both these quantities are used there.

The result of this is that if a pool has three tokens A, B, C then A-B swaps ignore the liquidity of C. This is because the `S` and `D` calculations will never touch the liquidity of C, since they only deal with the ask and offer tokens.

So for tricrypto pools, the invariant preserved in A-B swaps is different from the invariant preserved in B-C swaps.

The result are swaps with worse slippage profiles. In normal stableswap pools, the pool tries to maintain all the tokens in parity with each other, giving higher slippage if the pool as a whole is imbalanced. So A-B swaps will have lots of slippage if token C is available in a drastically different amount. However, in this case, the pool only cares about the ask and offer tokens, so the slippage will be lower than expected, leading to arbitrage opportunities. This allows the pools to be more manipulatable.

### Proof of Concept

It is evident from the code snippets above that only the `ask` and `offer` token amounts are used for invariant calculations. Other token amounts are not used. The protocol does support pools with 2+ tokens and for those cases, the invariant is incorrect.

### Recommended mitigation steps

Implement the correct invariant for stableswap, by also including the third/other token amounts in the sum and `D` calculations.

**jvr0x (MANTRA) confirmed**

---


