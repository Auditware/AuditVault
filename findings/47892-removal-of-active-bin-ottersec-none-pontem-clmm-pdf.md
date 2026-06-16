---
tags:
  - lang/move
  - platform/ottersec
  - has/poc
  - severity/high
  - sector/dex
  - sector/lending
protocol: "[[Pontem (Liquidswap)]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://pontem.network/"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Removal Of Active Bin

- id: 47892
- impact: HIGH
- protocol: [[Pontem Clmm]]
- reporter: Michał Bochnak (OtterSec)
- source: https://pontem.network/

## Summary


The bug report discusses a vulnerability in the CLMM (Cryptocurrency Liquidity Management Module) which can disrupt the swapping logic of the pool. This happens when a liquidity provider becomes the sole provider for a particular price range, known as the active bin. If the liquidity provider decides to remove their liquidity from this bin, it triggers the burn logic which removes the bin from the pool. This results in the active bin being erased from the pool and the swapping logic breaking, causing unexpected behavior or errors and halting trading operations for that pair. To fix this issue, the code needs to be updated to check if the active bin exists before attempting to access it and handle the situation accordingly. This bug has been fixed in the latest version of the code.

## Details

## Vulnerability Report: Liquidity Provider and Active Bin Issue

The vulnerability arises when a liquidity provider becomes the sole provider for a particular price range, i.e., the active bin. This situation may temporarily disrupt the swapping logic of the CLMM. 

In `pool`, `swap_inner` handles the swapping of assets between users, and when it attempts to access the data associated with the active bin utilizing its ID.

```move
sources/pool.move MOVE
fun swap_inner<X, Y, BinStep>(
    pool: &mut Pool<X, Y, BinStep>,
    coin_in_x: Coin<X>,
    coin_in_y: Coin<Y>,
    swap_y_for_x: bool,
): (Coin<X>, Coin<Y>) {
    [...]
    let bin = table::borrow_mut(&mut pool.bins, active_bin_id);
    [...]
}
```

The above line assumes that `active_bin_id` exists in the `pool.bins` table. However, if a liquidity provider is the only one providing liquidity for this particular active bin, it is possible that they decide to remove their liquidity from that bin. When a liquidity provider removes their liquidity from a bin, it triggers the burn logic, which removes the liquidity providers.

```move
sources/pool.move MOVE
public fun burn<X, Y, BinStep>(
    liq_nfts: vector<Token>,
): (Coin<X>, Coin<Y>) acquires Pool, InitConfiguration {
    [...]
    if (destroy_bin) {
        tree_math::remove_from_tree(&mut pool.tree, bin_id);
        let bin = table::remove(&mut pool.bins, bin_id);
        let Bin { reserves_x: _, reserves_y: _, token_data_id: _ } = bin;
    }
    [...]
}
```

This results in the bin being entirely removed from the `pool.bins` table, effectively erasing the active bin. Consequently, `swap_inner` will be unable to access the bin id and will fail because `active_bin_id` no longer exists in the `pool.bins` table. This will break the swapping logic, resulting in unexpected behavior or errors and halting trading operations for that pair.

## Proof of Concept

A single liquidity provider provides liquidity for a certain price range (the active bin) of an asset pair. If they decide to withdraw their liquidity, the active bin is removed. If someone tries to trade in that price range, it would result in errors or unexpected behavior because the code is unable to discover the active bin. 

Please find the proof-of-concept code in this section.

## Remediation

Check if `active_bin_id` exists before attempting to access it. If it does not exist, handle the situation by selecting a new bin.

```move
sources/pool.move MOVE
if (!table::contains(&pool.bins, active_bin_id)) {
    // skip to the next bin
}
```

## Patch

Fixed in `e505a58`.
