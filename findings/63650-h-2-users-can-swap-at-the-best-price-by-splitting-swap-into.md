---
tags:
  - lang/rust
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[Dango]]"
auditors:
  - "[[Hurricane]]"
  - "[[MysteryAuditor]]"
  - "[[ami]]"
  - "[[blockace]]"
  - "[[haxagon]]"
  - "[[heavyw8t]]"
report: "https://github.com/sherlock-audit/2025-09-dango-dex-judging"
genome:
  - "[[price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[fot-slippage]]"
---
# H-2: Users can swap at the best price by splitting swap into several small swap.

- id: 63650
- impact: HIGH
- protocol: [[Dango]] DEX
- reporter: MysteryAuditor (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the swap of a geometric pair in a protocol. The problem is that users can take advantage of the system by splitting their swap into smaller ones, allowing them to swap at the best price. The root cause of this issue is in the code that creates passive orders and matches them to the user's swap order. By splitting the swap into smaller ones, users can swap at the best passive order, resulting in receiving more tokens than intended. This bug can have an impact on the fairness of the swapping process for users. To mitigate this issue, it is suggested to add a cooldown period for swapping or to not allow users to execute multiple swaps in one transaction.

## Details


Source: https://github.com/sherlock-audit/2025-09-dango-dex-judging/issues/291 

## Found by 
Hurricane, MysteryAuditor, ami, blockace, haxagon, heavyw8t

### Summary
In the swap of geometric pair, the protocol matches the passive orders to the user's swap order.
However, users can swap at the best price by splitting swap into several small swap.

### Root Cause

In the `geometric.swap_exact_amount_in` function, it creates the passive orders and matches them to the user created swap order from [L61](https://github.com/sherlock-audit/2025-09-dango-dex/blob/main/left-curve/dango/dex/src/core/geometric.rs#L61).
```rs
L61:    if input.denom == *base_denom {
            ask_exact_amount_in(input.amount, passive_bids)
        } else if input.denom == *quote_denom {
            bid_exact_amount_in(input.amount, passive_asks)
        }
```

The `reflect_curve` function creates the `params.limit` numbers of ask and bid orders.
The bid orders' price are decreasing and ask orders' price are increasing.
By splitting the swap into several small swaps, users can swap at the best passive order.

Let's consider the following scenario:
- There is the token1: token2 pair(geometric)
    - reserve of token1: 1000
    - reserve of token2: 10000
    - 1 token1 = 10 usd, 1 token2 = 1 usd
    - swap_fee_rate is 0 for the simplicity
    - params.spacing: 1
    - params.limit: 3
    - params.ratio: 10%
- Alice is going to swap 300 token1 to token2 in one transaction:
    - `reflect_curve` function creates 5 passive bids: (price, size): (10, 100), (9, 111.11), (8, 125)
    - As a result, Alice receives 2712 amount of token2: 100 * 10 + 111.11 * 9 + 89 * 8 = 1000 + 1000 + 712 = 2712
- If Bob swaps 300 token1 using 3 times of swapping of 100 token1 in one transaction:
    - Bob receives 1000 token2 in one swap of 100 token1
    - Totally, Bob receives 3000 token2
As a result, Bob receives more tokens than Alice.

### Internal pre-conditions
None

### External pre-conditions
1. None

### Attack Path
None

### Impact
This causes unfair swapping for users.

### PoC
None

### Mitigation
Add the cooldown period for swapping or don't allow for users to execute several swap in one transaction.
