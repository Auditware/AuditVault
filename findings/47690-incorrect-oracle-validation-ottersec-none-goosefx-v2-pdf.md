---
tags:
  - lang/rust
  - platform/ottersec
  - severity/high
  - sector/oracle
protocol: "[[GooseFX V2]]"
auditors:
  - "[[OtterSec]]"
report: "https://www.goosefx.io/"
genome:
  - "[[single-source]]"
  - "[[direct-drain]]"
  - "[[oracle-freshness]]"
---
# Incorrect Oracle Validation

- id: 47690
- impact: HIGH
- protocol: [[GooseFX V2]]
- reporter: OtterSec
- source: https://www.goosefx.io/

## Summary


The bug report discusses an issue with the use of the unwrap_or function in a program called oracle_price_history. This function is used to handle errors when retrieving prices for tokens from an OraclePriceHistory account. However, the program does not properly handle errors and instead uses the incorrect account to retrieve the latest price, potentially causing significant losses for users. The bug has been fixed in the latest version of the program.

## Details

## unwrap_or in oracle_price_history::get_and_update_price

The `unwrap_or` in `oracle_price_history::get_and_update_price` forces the program to utilize the oracle price for a token even if it is incorrect. `unwrap_or` handles the result of the `get_and_update_price` call. If the call to `get_and_update_price` returns an error (i.e., the oracle update fails), the program obtains the latest price directly from the loaded price history account.

## Code Snippet

```rust
pub fn get_and_update_price(&mut self, get_main_token: bool, curr_slot: Slot, mint: Pubkey) -> Result<Decimal> {
    Ok(if get_main_token {
        oracle_price_history::get_and_update_price(
            &self.output_token_price_history,
            &self.output_token_oracle,
            mint,
            curr_slot,
        ).unwrap_or(self.output_token_price_history.load()?.latest_price()?.price.into())
    } else {
        oracle_price_history::get_and_update_price(
            &self.input_token_price_history,
            &self.input_token_oracle,
            mint,
            curr_slot,
        ).unwrap_or(self.input_token_price_history.load()?.latest_price()?.price.into())
    })
}
```

Thus, a user may deliberately provide an incorrect `OraclePriceHistory` account when interacting with the program. Even though this will result in an error in `get_and_update_price`, in the subsequent execution of `unwrap_or`, the same incorrect account will be used to retrieve the latest price of the token. As a result, the program continues its execution with the incorrect price, potentially enabling the swapping of a large number of assets for a significantly smaller amount due to the asset prices being different from the actual market values.

## Remediation

Remove the call to `unwrap_or` or perform the account validation outside `get_and_update_price`.

## Patch

Fixed in 8a4d3f9.
