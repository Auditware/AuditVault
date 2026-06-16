---
tags:
  - lang/move
  - sector/lending
  - sector/options
  - platform/ottersec
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Eternal Finance]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://eternalfinance.io/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Improper Implementation Of Positions

- id: 48363
- impact: HIGH
- protocol: [[Eternal Finance]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://eternalfinance.io/

## Summary


The bug report discusses an inconsistency in the implementation of positions in the bank.move and pancake_dex_worker.move modules. The bank.move module assumes that a position can manage multiple coins, while the pancake_dex_worker.move module assumes it can only handle one coin pair. This can lead to loss of funds and improper health checks. The report recommends adding type validation and updating the Position struct to handle multiple coins if necessary. The bug has been fixed in a recent patch.

## Details

## Inconsistency in Position Implementation in bank.move Module

In the `bank.move` module, the `Position` struct is utilized to store collateral share amounts and debts on a position. However, there exists an inconsistency in the implementation of positions between the `bank.move` and `pancake_dex_worker.move` modules. The bank module assumes that a position can manage the collateral and debts of multiple coins, whereas the worker module assumes that a position can only hold the collateral and debts for one coin pair.

## `bank.move` RUST

```rust
struct Position<CollToken> has store {
    coll_token: Option<CollToken>, // Stores only one type of collateral
    debt_bitmap: u128,             // Handles multiple collaterals
    debt_share_of: SimpleMap<String, u64>, // Handles multiple collaterals
    user: address,
    pos_id: u64,
}
```

This is inconsistent because if a position is expected to manage the collateral of multiple coin pairs, the position struct in the bank should have a map of `CollToken` structs with the coin name as the key instead of storing just one `CollToken` field. Alternatively, if it is expected to handle only one coin pair, then the `create_position`, `reduce_position`, and `liquidate` functions should have checks to validate whether the coins that have passed in the generics are actually associated with the position.

## Potential Risks

This inconsistency could result in the loss of funds. For example, adding to an existing position with a different coin pair would increase the position share, regardless of the initial coin pair. Additionally, the health checks assume that the debts vector returned from the `bank::get_position_debts` function has a length of two, which can result in improper health checks and under-collateralized loans.

## Remediation

If a position is expected to handle multiple coin pairs, it is recommended to add a map of `CollTokens` to the `Position` struct and update the `CollTokens` accordingly. If the intended behavior of a position is to handle only one coin pair, it is recommended to validate that the coin pairs passed in the generics align with the coin type of the `LP` shares stored in the `position.coll_token`.

## Patch

Fixed by adding type validation in `6afe287`.
