---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/dex
protocol: "[[Pontem (Liquidswap)]]"
auditors:
  - "[[OtterSec]]"
report: "https://pontem.network/"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Unstrict Swap Invariant

- id: 48640
- impact: HIGH
- protocol: Pontem (Liquidswap)
- reporter: OtterSec
- source: https://pontem.network/

## Summary


The program has a bug where it reports an incorrect swap when dealing with an uncorrelated curve. This happens when the lp_value after the swap is smaller than the lp_value before the swap. The swap should only be valid if the value after is greater than the value before. This bug could potentially exploit rounding errors and cause imprecision. The fix for this bug involves changing the assert condition to strictly greater. This bug has been resolved in a recent commit.

## Details

## Handling Errors in Uncorrelated Curves

When dealing with an uncorrelated curve, the program introduced an error by reporting an incorrect swap if the `lp_value` after the swap is strictly smaller than the `lp_value` before the swap. The swap should be valid only when the value after is greater than the value before. Otherwise, swapping would be able to exploit potential rounding errors, depending on the precision of the relevant curves.

Some napkin math implies that the imprecision is non-trivial. For a token with 8 decimals, the stable swap math would give up to 1,000,000 atomic units of imprecision. This would represent up to 1% of the original token’s value.

```plaintext
sources/swap/liquidity_pool.move
assert!(
    lp_value_after_swap_and_fee >= lp_value_before_swap,
    ERR_INCORRECT_SWAP,
);
```

## Remediation

The incorrect assert can be fixed by making the condition strictly greater.

```plaintext
sources/libs/stable_curve.move
+ let cmp = u256::compare(&lp_value_after_swap_and_fee, &lp_value_before_swap_u256);
+ assert!(cmp == GREATER_THAN, ERR_INCORRECT_SWAP);
```

## Patch

Resolved in commit 637ad72.

© 2022 OtterSec LLC. All Rights Reserved. 8 / 17
