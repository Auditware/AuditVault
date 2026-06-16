---
tags:
  - lang/move
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Franklin Templeton Aptos Money Market Fund]]"
auditors:
  - "[[Jaime Iglesias]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
---
# The end_of_day function is broken

- id: 65072
- impact: HIGH
- protocol: [[Franklin Templeton Aptos Money Market Fund]]
- reporter: Jaime Iglesias (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf

## Summary


The Franklin Templeton Aptos MMF Security Assessment found a low difficulty bug in the `end_of_day` function. This function is used to distribute dividends to shareholders and settle their pending requests. However, the `process_settlements` function, called internally, takes in the wrong parameter for the date, leading to no transactions being settled. To fix this bug, a date parameter should be included in the `end_of_day` function. In the long term, additional unit tests should be added to catch these types of bugs. 

## Details

## Franklin Templeton Aptos MMF Security Assessment

## Diﬃculty: Low

## Type: Data Validation

### Description
Once a day, the fund administrator calls the `end_of_day` function. This function distributes dividends to all current shareholders of the fund and then settles their pending requests.

```rust
public entry fun end_of_day(
    caller: &signer,
    rate: u64,
    price: u64,
    accounts: vector<address>,
    memo: String,
) acquires ManagedShareHolders, FundManagement {
    only_whitelisted(caller);
    only_when_initialized();
    only_valid_rate(rate);
    only_valid_price(price);
    only_max_size_batch(vector::length(&accounts), MAX_BATCH_SIZE);

    update_last_price(caller, price);

    vector::for_each(accounts, |account| {
        process_dividends(
            account,
            rate,
            price,
            memo,
        );
        process_settlements(
            account,
            rate,
            price,
            memo,
        );
        let params = format2(&b"rate = {} price = {}", rate, price);
        add_activity(account, timestamp::now_seconds(), 0,
            TX_TYPE_END_OF_DAY, utf8(b""), params);
    });
}
```

**Figure 12.1:** `end_of_day` function in `fund_token.move` #L415–L446

To this function, the admin inputs an array of accounts, the new share price, the rate to calculate the new shares to be minted, and a memo.

However, the `process_settlements` function, which is called internally, takes an account for which to settle the pending requests, the new share price, the memo, and a date that is the timestamp that determines whether or not a pending transaction gets settled.

```rust
fun process_settlements(
    account: address,
    date: u64,
    price: u64,
    memo: String,
) acquires ManagedShareHolders, FundManagement {
}
```

**Figure 12.2:** `process_settlement` function in `fund_token.move` #L1127–L1132

However, as shown in the figures above, the `end_of_day` function uses the rate as the value for the date parameter in the `process_settlements` transaction, which is wrong and will lead to no transactions being settled.

### Recommendations
- **Short term:** Include a date parameter in the function.
- **Long term:** Include additional unit tests to validate the expected behavior of the system; a very simple unit test would have caught this bug.
