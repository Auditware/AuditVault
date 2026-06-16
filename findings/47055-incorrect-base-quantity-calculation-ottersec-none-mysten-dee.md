---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/dex
protocol: "[[DeepBook]]"
auditors:
  - "[[Robert Chen]]"
report: "https://mystenlabs.com/"
genome:
  - "[[precision-loss]]"
  - "[[integer-bounds]]"
  - "[[direct-drain]]"
---
# Incorrect Base Quantity Calculation

- id: 47055
- impact: HIGH
- protocol: [[Mysten Deepbook]]
- reporter: Robert Chen (OtterSec)
- source: https://mystenlabs.com/

## Summary


This bug report is about an incorrect calculation of the base quantity in the order generation process. The current implementation uses the minimum of two values, which does not accurately reflect the actual available base quantity from the maker's order, especially when the order has been partially filled before. If the order has expired, the remaining quantity should be treated differently and accurately reflected as the base quantity. The suggested solution is to calculate the base quantity based on the remaining amount of the maker's order instead of using the minimum function. This issue has been resolved in a pull request.

## Details

## Issue with generate_fill Implementation

The issue in `order::generate_fill` concerns the incorrect calculation of the `base_quantity` available from the maker order. The current implementation calculates `base_quantity` as:

```rust
math::min(self.quantity, quantity);
```

`self.quantity` represents the total quantity of the maker’s order, while `quantity` represents the amount the taker wants to fill.

> _order.moverust

```rust
/// Generate a fill for the resting order given the timestamp,
/// quantity and whether the order is a bid.
public(package) fun generate_fill(
    self: &mut Order,
    timestamp: u64,
    quantity: u64,
    is_bid: bool,
    expire_maker: bool,
): Fill {
    let base_quantity = math::min(self.quantity, quantity);
    [...]
}
```

The function currently calculates `base_quantity` by simply taking the minimum of these two values, which does not accurately reflect the actual available base quantity from the maker, especially when the maker’s order was partially filled previously. If the order has expired, the remaining quantity in the maker's order should be treated differently. The expired orders should not allow any new fills but should instead accurately reflect the remaining base quantity as `base_quantity`.

## Remediation

Calculate the `base_quantity` based on the remaining amount of the maker's order, instead of utilizing `math::min(self.quantity, quantity)`. If the order has expired, set the `base_quantity` to the remaining quantity of the maker's order.

## Patch

Resolved in PR #186.

© 2024 Otter Audits LLC. All Rights Reserved. 8/27
