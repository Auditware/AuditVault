---
tags:
  - severity/high
  - lang/rust
  - platform/quantstamp
  - sector/insurance
protocol: "[[OnRe Solana]]"
auditors:
  - Paul Clemson
report: "https://certificate.quantstamp.com/full/on-re-solana/c31251fd-f107-478d-ac17-6d9ad6bd3faa/index.html"
genome:
  - "[[fee-accounting]]"
  - "[[logic/price-calculation]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/single-user]]"
---
# Improper Price Calculation Leads to Overpayment

- id: 58718
- impact: HIGH
- protocol: OnRe Solana
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/on-re-solana/c31251fd-f107-478d-ac17-6d9ad6bd3faa/index.html

## Summary


The client has marked a bug as "Fixed" in the file `take_offer.rs`. The bug occurs when an offer's duration is not evenly divisible by `price_fix_duration`, causing users to pay more than the intended maximum price. This can also occur if a user calls one of the take offer functions in the final second of the offer. The bug can be fixed by updating the price calculation to include fractional intervals or preventing fractional intervals from existing.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `8a41021c9694d5735ef2cd692f6d1f26bcae2c3a`.

Additional fix in: `3782a7aff178e86adc427b3d8e151efc4076db3e`.

**File(s) affected:**`take_offer.rs`

**Description:** When an offer's total duration is not evenly divisible `price_fix_duration`, a partial interval will occur at the end of the offer period that is not accounted for in the protocol's pricing calculation. The price calculation logic fails to properly handle this edge case, causing users who transact during this period to pay one interval more than the intended maximum price (`sell_token_end_amount`).

An additional note here is that in the current implementation this behaviour will also occur if a user calls one of the take offer functions in the final second of the offer, because of the inclusive upper bounds check on `offer.offer_end_time`.

Consider this simplified example:

1.   The team creates an offer where the duration from start to end is 2.5 days.
2.   The `price_fix_duration` is set to one day.
3.   Assuming the start price is 10e9 and the end price is 20e9.
4.   The `number_of_intervals` used in `calculate_current_sell_amount()` will round down to two one day long intervals due to integer division (`216_000 // 86_400`).
5.   Users transacting on day one will pay the start price plus one interval price (15e9).
6.   Users transacting on day two will pay the start price plus two interval prices, this will be the intended `sell_token_end_amount` ratio (20e9).
7.   However users transacting in the additional half day will be charged the start price plus 3 interval bumps, causing them to pay a greater amount (25e9) than the intended `sell_token_end_amount` ratio.

**Recommendation:** Consider either updating the price calculate to include fractional intervals, or ensure that fractional intervals cannot exist.
