---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Econia]]"
auditors:
  - "[[Robert Chen]]"
report: "https://econia.dev/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Missing Type Check While Placing Order

- id: 48468
- impact: HIGH
- protocol: [[Econia]]
- reporter: Robert Chen (OtterSec)
- source: https://econia.dev/

## Summary


The report describes a bug in the functions market::place_market_order and market::place_limit_order where there is no verification of the type of order being placed against the original market types. This means that attackers can use incorrect coin types to transfer coins, which could lead to potential security issues. A proof of concept has been provided to demonstrate this bug. To fix this issue, checks need to be added to verify if the passed types are the same as the market types. A patch has been added to address this bug in both functions.

## Details

## Order Type Verification Issue

In the functions `market::place_market_order` and `market::place_limit_order()`, when placing an order, there is no type verification against the original market types. Usually, the market should only allow orders of the same type, but this check was not enforced while placing an order. This would allow attackers to use incorrect coin types against the market, transferring coins of an incorrect type.

## Proof of Concept

See **Missing Type Check Bug POC**.

## Remediation

To mitigate this issue, add checks to verify if the passed types are the same as market types. This way, the operation aborts if someone tries to place orders with different types.

## Patch

Patch added for both the functions in commit `fcbfbcf8`.

```diff
src/move/econia/sources/market.move
@@ -2327,6 +2345,10 @@ module econia::market {
}
+ assert!(type_info::type_of<BaseType>() // Assert base type.
+ == order_book_ref_mut.base_type, E_INVALID_BASE);
+ assert!(type_info::type_of<QuoteType>() // Assert quote type.
+ == order_book_ref_mut.quote_type, E_INVALID_QUOTE);
```
