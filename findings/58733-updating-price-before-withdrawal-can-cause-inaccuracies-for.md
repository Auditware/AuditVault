---
tags:
  - lang/rust
  - sector/restaking
  - sector/staking-pool
  - platform/quantstamp
  - severity/high
protocol: "[[Fragmetric Restaking Program]]"
auditors:
  - Michael Boyle
report: "https://certificate.quantstamp.com/full/fragmetric-restaking-program/79bdc5ab-27d1-480e-bc8a-cf883ed0bb83/index.html"
genome:
  - "[[oracle-freshness]]"
  - "[[underflow]]"
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[oracle-is-reliable]]"
  - "[[price-cannot-be-manipulated]]"
  - "[[fix-arithmetic]]"
  - "[[use-twap]]"
  - "[[trigger/price-manipulation]]"
---
# Updating Price Before Withdrawal Can Cause Inaccuracies for the Withdrawal Amount

- id: 58733
- impact: HIGH
- protocol: Fragmetric Restaking Program
- reporter: Michael Boyle (Quantstamp)
- source: https://certificate.quantstamp.com/full/fragmetric-restaking-program/79bdc5ab-27d1-480e-bc8a-cf883ed0bb83/index.html

## Summary


Bug report: The protocol for updating the price of a token in relation to SOL may cause issues when users try to withdraw their funds. This is because the token price can be updated while a user is trying to withdraw, resulting in inaccurate calculations and a potential loss of funds. A solution could be to keep track of the amount owed to the user during batch processing and send that amount during the withdrawal process instead of recalculating it.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `65f4a86e6ec470bab893340784b6f1df3cdaa1e2`.

**File(s) affected:**`user_fund_context.rs`

**Description:** The protocol updates `fragSol` price with respect to `SOL` in order to maintain an up-to-date price. The price update is triggered through the following statement:

`fund.update_token_prices(ctx.remaining_accounts)?;`

The `update_token_prices()` first verifies that the `ctx.remaining_accounts` contain the address of a pricing source that is specified by the admin when they add a `supportedToken`. Then, it proceeds to get the current price of the asset by getting the spot price from either `Marinade pool` or `SPL Stake pool`.

When a user requests withdrawal, by calling the `request_withdrawal()` function, a withdrawal request is created and added to a batch. Then an operator needs to call the `process()` method to start processing the batch. During processing, the `fragSol` amount is converted into `SOL` and the total `SOL` amount to be withdrawn is reserved in the `fundAccount.withdrawalStatus.reserved_fund`.

Then, the user can call the `withdraw()` function to finally receive their `SOL` amount.

The issue is, the token price can still be updated between the user calling `request_withdrawl()`. This can happen if another user calls the `deposit_sol()` because it will trigger a price update. Or if an operator calls the `update_prices()` function. Currently, even the `withdraw()` function performs a price update. and `withdraw()`.

*   Some users may not be able to withdraw because the subtraction from `sol_remaining` in `reserved_fund` could fail due to underflow.

*   The calculation for the value of `SOL` per `fragSol` would be inaccurate since the amount of `SOL` could be greater than the amount of SOL subtracted from `sol_operation_reserved_amount` which is used in `assets_total_sol_value()`. This would result in an artificially inflated token value. The inflated token price would allow more `SOL` to be withdrawn per token than expected. If `SOL` is withdrawn more than what is subtracted from `sol_operation_reserved_amount`, then the SOL stored for the rent-exemption could be transferred out.

**Recommendation:** A possible solution is to keep track of the amount owed to the user when batch processing is done. And then during the `withdraw()` function, send that amount to the user instead of recalculating the `sol_amount`.
