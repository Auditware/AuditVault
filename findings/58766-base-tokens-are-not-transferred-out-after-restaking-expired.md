---
tags:
  - severity/high
  - lang/rust
  - sector/restaking
  - sector/staking
  - sector/liquid-staking
  - platform/quantstamp
protocol: "[[Exceed Finance Liquid Staking & Early Purchase]]"
auditors:
  - István Böhm
report: "https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# Base Tokens Are Not Transferred Out After Restaking Expired Withdrawals

- id: 58766
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation that they have updated the instruction for transferring base tokens, updated the client, and added a unit test. The affected file is `programs/liquid-staking/src/instructions/restake_expired_withdrawal.rs` and the issue is that the `liquid_staking::restake_expired_withdrawal::handler()` function does not transfer base tokens from the `window_base_token_account` to the `pair_base_token_account`. This prevents the closing of the `withdrawal_window` in the `liquid_staking::close_withdrawal_window::handler()` function. The recommendation is to transfer the relevant base tokens from the `window_base_token_account` after restaking an expired withdrawal request.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `fd4b6f4ce524a4df24b1a7b9ed0c134cfd4f8f2a`. The client provided the following explanation:

> I updated the instruction to transfer the base tokens to the pair token account, updated the client and added a unit test.

**File(s) affected:**`programs/liquid-staking/src/instructions/restake_expired_withdrawal.rs`

**Description:** The `liquid_staking::restake_expired_withdrawal::handler()` function restakes the expired withdrawals by minting LST tokens back to the stakers. However, it does not transfer the relevant user's base tokens (funded by the depositor) from the `window_base_token_account` to the `pair_base_token_account`. Therefore, these base tokens will remain locked in the `window_base_token_account`, preventing the closing of the `withdrawal_window` in the `liquid_staking::close_withdrawal_window::handler()` function.

**Recommendation:** Consider transferring out the relevant base tokens from the `window_base_token_account` after restaking an expired withdrawal request.
