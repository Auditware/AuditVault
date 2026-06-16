---
tags:
  - lang/move
  - sector/dex
  - sector/stable
  - platform/ottersec
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Pontem (Liquidswap)]]"
auditors:
  - "[[OtterSec]]"
report: "https://pontem.network/"
genome:
  - "[[precision-loss]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Broken Stable Curve Math

- id: 48639
- impact: HIGH
- protocol: Pontem (Liquidswap)
- reporter: OtterSec
- source: https://pontem.network/

## Summary


The bug report discusses an issue with the liquidity_pool::compute_and_verify_lp_value function in the Pontem Liquidswap code. When dealing with a stable curve, the function calculates the lp value incorrectly due to unnecessary mathematical operations using decimals with 8 digits precision. This affects the returning value and can lead to incorrect amounts being returned from swap transactions. The bug has been identified and fixed in recent commits. 

## Details

## Liquidity Pool Value Verification

The `liquidity_pool::compute_and_verify_lp_value` function checks if the LP value is the same before and after a swap. When dealing with a stable curve, the LP value before the swap is calculated incorrectly.

**File:** `sources/swap/liquidity_pool.move`

```move
if (curve_type == STABLE_CURVE) {
    let lp_value_before_swap = stable_curve::lp_value(x_res, x_scale, 
    ,→ y_res, y_scale);
    // 100000000 == FEE_SCALE * FEE_SCALE
    lp_value_before_swap = u256::mul(
        lp_value_before_swap,
        u256::from_u128(100000000),
    );
}
```

The `stable_curve::lp_value` function conducts mathematical operations using decimals with 8 digits precision. Several calculations contain additional divisions by `10^8`, which are not needed. These unnecessary operations affect the returning value, which implicitly affects the returning amount from a swap transaction.

**File:** `sources/libs/stable_curve.move`

```move
let u2561e8 = u256::from_u128(ONE_E_8);
[...]
let _b = u256::add(
    u256::div(
        u256::mul(_x, _x),
        u2561e8,
    ),
    u256::div(
        u256::mul(_y, _y),
        u2561e8,
    )
);
```

## Proof of Concept

Given the stable curve: \(x^3 \cdot y + x \cdot y^3\), consider the following test case:

1. \(x = 500000899318256\)
2. \(y = 25000567572582123\)
3. \(lp\_value = lp\_value(x, 1000000, y, 1000000000000)\)
4. `assert!(u256::as_u128(lp_value) == 312508781701599715772530613362069248234)`

The returned `lp_value` is incorrect; the correct value should be `312508781701599715772756132553838833260`.

Let’s also consider the following scenario, derived from an existing test case:

1. A liquidity pool contains 10 BTC and 10000 USDT coins.
2. An attacker swaps a very small amount of BTC.

## Remediation

The issue can be fixed by removing the multiplication between the `lp_value_before_swap` and `100000000` and the unnecessary divisions from the `stable_curve::lp_value`, `stable_curve::d`, and `stable_curve::f` functions.

## Patch

Resolved in commit `5349aa7` and `637ad72`.

© 2022 OtterSec LLC. All Rights Reserved.
