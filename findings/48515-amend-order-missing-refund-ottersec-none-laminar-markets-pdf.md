---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Laminar Markets]]"
auditors:
  - "[[Robert Chen]]"
report: "https://laminar.markets/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Amend Order Missing Refund

- id: 48515
- impact: HIGH
- protocol: [[Laminar Markets]]
- reporter: Robert Chen (OtterSec)
- source: https://laminar.markets/

## Summary


The report identifies a bug in the book::amend_bid_order function where the size of an order can be decreased without the user receiving a refund. This occurs when a user tries to decrease the size of an order with the same price. The bug is located in the dex/sources/book.move RUST file and can be reproduced using the provided Proof of Concept. The suggested solution is to calculate and issue a refund for the decreased size. The bug has been fixed in the f685c65fa commit.

## Details

## amend_bid_order Function Issue

In the `amend_bid_order` function, when a user tries to decrease the size of an order having the same price, the size of the order gets reduced silently without a refund. Users should be refunded when the size is reduced.

## Code Snippet

```rust
fun amend_bid_order<Base, Quote>(
    account: &signer, 
    book_owner: address, 
    id: ID,
    price: u64, 
    size: u64
) {
    if (price == prev_price && size == prev_size) {
        return
    } else if (price == prev_price && size < prev_size) {
        if (size <= (prev_size - remaining_size)) { 
            // Handle case when size is less or equal
        } else {
            let o = find_bid_order_mut(bids_book, id);
            order::set_size(o, size);
            order::set_remaining_size(o, remaining_size - (prev_size - size));
        }
    } else {
        // Handle other cases
    }
}
```

## Proof of Concept

See **Amend Order Bug POC**.

## Remediation

Calculate and initiate a corresponding refund for the decremented size to the user.

## Patch

This issue is patched in commit `f685c65fa`.

© 2022 OtterSec LLC. All Rights Reserved.
