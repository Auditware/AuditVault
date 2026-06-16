---
tags:
  - lang/rust
  - platform/quantstamp
  - severity/high
  - sector/perpetuals
protocol: "[[Neutral Trade]]"
auditors:
  - "[[Yamen Merhi]]"
report: "https://certificate.quantstamp.com/full/neutral-trade/52a6403b-648c-4ea6-be5e-c8b525acc9b7/index.html"
genome:
  - "[[stale-price]]"
  - "[[indirect-loss]]"
  - "[[reward-accounting]]"
  - "[[debt-accrual-update]]"
---
# Refund Calculation Uses Stale Share-Mint Total

- id: 61618
- impact: HIGH
- protocol: [[Neutral Trade]]
- reporter: Yamen Merhi (Quantstamp)
- source: https://certificate.quantstamp.com/full/neutral-trade/52a6403b-648c-4ea6-be5e-c8b525acc9b7/index.html

## Summary


Bug report update: The issue reported earlier has been fixed by the client. The problem was in the `refund_deposit()` function, which calculates `shares_to_revert` using an incorrect value. This results in an incorrect share price and accounting when multiple deposits are refunded in succession. The same incorrect value is also used in another function, causing further problems. The recommendation is to decrease the value each time a refund is processed to fix the issue. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `9ac820a185586306aba2c49c67fe2ce7b243aa27`.

**File(s) affected:**`programs/ntbundle/src/instructions/refund_deposit.rs`

**Description:** The `refund_deposit()` function calculates `shares_to_revert` as

`user_share_of_pending_deposits * last_total_shares_minted / PRECISION`, yet `bundle_temp_data.last_total_shares_minted` is **never reduced** after each refund.

When multiple deposits are refunded in succession, earlier refunds shrink `cumulative_pending_deposits` but leave `last_total_shares_minted` unchanged; later iterations therefore cancel too many shares.

The bundle ends with the correct underlying balance but an under‑reported `total_shares`, distorting share price and subsequent accounting.

 The same stale value is reused in `process_deposits.rs`, compounding the mismatch whenever refunds and new deposits occur in the same cycle.

**Recommendation:** Decrease `bundle_temp_data.last_total_shares_minted` by `shares_to_revert` each time a refund is processed.
