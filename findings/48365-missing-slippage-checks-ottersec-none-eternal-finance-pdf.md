---
tags:
  - lang/move
  - sector/lending
  - sector/oracle
  - sector/streaming
  - sector/token
  - platform/ottersec
  - severity/high
  - impact/mev/frontrun
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[Eternal Finance]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://eternalfinance.io/"
genome:
  - "[[missing-modifier]]"
  - "[[frontrun]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-manipulation-resistance]]"
---
# Missing Slippage Checks

- id: 48365
- impact: HIGH
- protocol: [[Eternal Finance]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://eternalfinance.io/

## Summary


The bug report is about a problem with the get_lp_by_cake function, which is used for reinvesting earned cake into LP tokens on the PancakeDEX exchange. The function does not properly check for slippage when swapping assets, which can be exploited by attackers using flash loans to manipulate the pool and steal accrued cake. The report suggests two potential solutions: making reinvesting permissioned or enforcing slippage requirements on swaps. The issue has been fixed in a recent update.

## Details

## Summary of Vulnerability in `get_lp_by_cake`

The function `get_lp_by_cake` does not properly perform slippage checks against an oracle price when swapping assets around. This mainly occurs in the functions `swap_exact_x_to_y_direct_external` and `add_liquidity_from_1_token`.

## Code Snippet

```rust
pancake_dex_worker.move RUST
if (path == 0) {
    let coin_x_swap = router::swap_exact_x_to_y_direct_external<Cake, X>(cake);
    coin::merge(&mut coin_x, coin_x_swap);
    coin::merge(&mut coin_x, coin::withdraw<X>(resource_signer, get_my_balance<X>()));
} else if (path == 1) {
    // ...
    // 5. add liquidity from only coin x or coin y
    add_liquidity_from_1_token<X, Y>(coin_x, coin_y);
}
```

The `get_lp_by_cake` function is used when reinvesting to exchange earned cake for LP tokens.

```rust
pancake_dex_worker.move RUST
fun reinvest_sorted<X, Y>(cake: Coin<Cake>) {
    // 1.0.1 send cake to treasury?
    // 1.1 trade cake via reinvest path
    // ...
} else {
    wmc::stake<LPToken<X, Y>>(dex_helper::get_lp_by_cake<X, Y>(cake));
}
```

## Attack Vector

It is possible for an attacker to use flash loans to manipulate the underlying pool, causing the swap to execute at a poor price. The attacker could then swap back through the pool, frontrunning the reinvestment swap. Because reinvesting is done in a permissionless manner, this could allow for the theft of any accrued cake.

---

## Eternal Finance Audit 04 | Vulnerabilities

### Remediation

One potential solution would be to make reinvesting permissioned, similar to the design for liquidations. It is noted that unpermissioned liquidations are also similarly vulnerable to manipulation of protocol health.

Another possible solution would be to enforce slippage requirements on swaps, comparing the output with the expected output provided by an oracle. This model would be more decentralized and could be more sustainable in the long run.

### Patch

Fixed in commit `aebdeb3`.
