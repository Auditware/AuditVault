---
tags:
  - lang/rust
  - platform/ottersec
  - severity/high
  - sector/bridge
protocol: "[[Wormhole]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://wormhole.com/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Empty Token Account DoS

- id: 47208
- impact: HIGH
- protocol: [[Wormhole]] Solana
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://wormhole.com/

## Summary

The current implementation of prepare_order_execution and improve_offer functions has a potential vulnerability that could result in denial-of-service issues. This is because the code relies on the data_is_empty() function to determine if the respective token account exists. This vulnerability can be exploited by placing an initial offer or best offer, then closing the respective token accounts and reopening them with a different mint before the auction is supposed to execute. This would pass the data_is_empty checks and allow the protocol to proceed with the token transfer, which would fail due to the incorrect mint, creating a DoS for auction execution. To fix this vulnerability, checks should be implemented to ensure the account is a token account and verify the mint for the token accounts instead of relying on data_is_empty. This issue has been resolved in the #188 and 6ab5d8e patches.

## Details

## Vulnerability in `prepare_order_execution` and `improve_offer` Functions

Within the current implementation of `prepare_order_execution` and `improve_offer` functions, the `data_is_empty` checks have a potential vulnerability that could result in denial-of-service issues. The code relies on the `data_is_empty()` function to determine if the respective token account exists.

```rust
> _processor/action/execute_fast_order/mod.rs
fn prepare_order_execution(accounts: PrepareFastExecution) -> Result<PreparedOrderExecution> {
    [...]
    // If the initial offer token account doesn't exist anymore, we have nowhere to send the
    // init auction fee. The executor will get these funds instead.
    if !initial_offer_token.data_is_empty() {
        if best_offer_token.key() != initial_offer_token.key() {
            // Pay the auction initiator their fee.
            [...]
            init_auction_fee,
        )?;
        // Because the initial offer token was paid this fee, we account for it here.
        remaining_custodied_amount = remaining_custodied_amount.saturating_sub(init_auction_fee);
    }
    [...]
}
```

This vulnerability can be exploited by placing an initial offer or best offer, then closing the respective token accounts and reopening them with a different mint before the auction is supposed to execute. Since there is new token data in those accounts, the `data_is_empty` checks would pass, allowing the protocol to proceed with the token transfer, which will fail due to the incorrect mint, creating a DoS for auction execution.

## Remediation
Implement checks to ensure the account is a token account and verify the mint for the token accounts instead of relying on `data_is_empty`.

## Patch
Resolved in #188 and 6ab5d8e.

© 2024 Otter Audits LLC. All Rights Reserved. 8/20
